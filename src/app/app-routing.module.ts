
import { map, switchMap } from 'rxjs/operators';
import { VerifyemailPage } from './auth/verifyemail/verifyemail.page';
import { NgModule } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  PreloadAllModules,
  RouterModule,
  RouterStateSnapshot,
  Routes,
} from '@angular/router';
import { LoginPage } from './auth/login/login.page';
import { RegistrationPage } from './auth/registration/registration.page';
import {
  redirectUnauthorizedTo,
  redirectLoggedInTo,
  canActivate,
  AuthPipeGenerator,
  //emailVerified,
} from '@angular/fire/auth-guard';
import { of, pipe } from 'rxjs';


const redirectLoggedInToHome = () => redirectLoggedInTo(['tabs/home']);
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const redirectUnverifiedTo = (redirect: any[]) =>
  pipe(
    map((emailVerified) => emailVerified || redirect)
  );
const redirectUnauthorizedToLogin2 = () => redirectUnverifiedTo(['login']);

const redirectUnverToEmailConfirm: AuthPipeGenerator = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) =>
  switchMap((user) => of(user).pipe(
      redirectUnauthorizedTo(`/login?redirectTo=${state.url}`),
      map((result) => {
        if (result === true) {
          // User is authorized
          if (user.emailVerified) {
            return true;
          } else {
            return ['/verifyemail'];
          }
        } else {
          return result;
        }
      })
    ));



const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
      ...canActivate(redirectUnverToEmailConfirm),
  },

  {
    path: 'login',
    component: LoginPage,
    ...canActivate(redirectLoggedInToHome),
  },
  {
    path: 'registration',
    component: RegistrationPage,
    ...canActivate(redirectLoggedInToHome),
  },
  {
    path: 'verifyemail',
    loadChildren: () => import('./auth/verifyemail/verifyemail.module').then( m => m.VerifyemailPageModule)
  },
  {
    path: 'initresetpassword',
    loadChildren: () => import('./auth/init-reset-password/init-reset-password.module').then( m => m.InitResetPasswordPageModule)
  },
  {
    path: 'resetpassword',
    loadChildren: () => import('./auth/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'wiki',
    loadChildren: () =>
      import('./wiki/wiki.module').then((m) => m.WikiPageModule),
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login', // Wildcard: alle falschen Adressen werden umgeleitet. Muss die letzte Route sein!!!
    pathMatch: 'full',
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

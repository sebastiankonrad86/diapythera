import { Type } from '@angular/core';

export interface Task {
  component: Type<any>;
  data: any;
  id: string;
  sheetId: string;
  orderId: string;
}

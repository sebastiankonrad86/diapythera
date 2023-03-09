import { Type } from '@angular/core';
import { Task } from '../taskcomponents/task/task';
export class Article implements Task {
  constructor(
    public component: Type<any>,
    public id: string,
    public sheetId: string,
    public orderId: string,
    public data: any
  ) {}
}

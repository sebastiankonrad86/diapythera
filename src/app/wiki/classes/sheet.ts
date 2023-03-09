import { Task } from './../taskcomponents/task/task';

export class Sheet {
  constructor(
    public id: string,
    public chapterId: string,
    public orderId: string,
    public title: string
  ) {}
}

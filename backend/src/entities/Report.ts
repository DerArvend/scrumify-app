import { Task } from './Task';

export interface Report {
    userName: string;
    taskId: string;
    reportDate: Date;
    comment: string;
    tasks?: Task[];
}

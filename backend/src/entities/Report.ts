import { Task } from './Task';

export interface Report {
    userName: string;
    taskId: string;
    reportIsoDate: string;
    comment: string;
    tasks?: Task[];
}

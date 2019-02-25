import { TaskData } from "./TaskData";
export interface ReportData {
    userName: string;
    taskId: string;
    reportDate: Date;
    comment: string;
    tasks: TaskData[];
}

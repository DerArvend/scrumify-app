import { TaskData } from "./TaskData";
export interface ReportData {
    userName: string;
    taskId: string;
    reportIsoDate: string;
    comment: string;
    tasks: TaskData[];
}

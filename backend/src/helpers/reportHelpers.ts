import { SqlTask } from '../entities/RawTask';
import { Report } from '../entities/Report';
import { parseTask, isEmptyTask } from './taskHelpers';

export function parseReports(tasks: SqlTask[]): Report[] {
    const reportsById: { [id: string]: Report } = {};
    for (const task of tasks) {
        if (!(task.Id in reportsById)) {
            reportsById[task.Id] = {
                userName: task.Name,
                reportDate: new Date(task.ReportDate),
                comment: task.Comment,
                taskId: task.Id,
                tasks: [],
            };
        }
        const parsedTask = parseTask(task);

        if (!isEmptyTask(parsedTask))
            reportsById[task.Id].tasks.push(parsedTask);
    }

    return Object.values(reportsById);
}

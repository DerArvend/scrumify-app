import { Task } from './entities/Task';
import { Report } from './entities/Report';
import { SqlTask } from './entities/RawTask';

export const uuidRegex = /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/g;

export function parseTask(sqlTask: SqlTask): Task {
    return {
        theme: sqlTask.Theme,
        url: sqlTask.Url,
        currentState: sqlTask.CurrentState,
        problems: sqlTask.Problems,
    };
}

export function isEmptyTask(task: Task) {
    return (!task.currentState && !task.problems && !task.theme && !task.url);
}

export function parseReports(tasks: SqlTask[]): Report[] {
    const reportsById: { [id: string]: Report } = {};
    for (const task of tasks) {
        if (!(task.Id in reportsById)) {
            reportsById[task.Id] = {
                userName: task.Name,
                reportIsoDate: task.ReportDate,
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

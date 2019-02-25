import { RawTask } from './entities/RawTask';
import { Task } from './entities/Task';
import { Report } from './entities/Report';

export const uuidRegex = /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/g;

export function parseTask(rawTask: RawTask): Task {
    return {
        theme: rawTask.Theme,
        url: rawTask.Url,
        currentState: rawTask.CurrentState,
        problems: rawTask.Problems,
    };
}

export function isEmptyTask(task: Task) {
    return (!task.currentState && !task.problems && !task.theme && !task.url);
}


export function parseReports(tasks: RawTask[]): Report[] {
    const reportsById: {[id: string]: Report} = {};
    for (let task of tasks) {
        if (!(task.Id in reportsById)){
            reportsById[task.Id] = {
                userName: task.Name,
                reportDate: new Date(task.ReportDate),
                comment: task.Comment,
                taskId: task.Id,
                tasks: []
            };
        }
        var parsedTask = parseTask(task);
        if (!isEmptyTask(parsedTask))
            reportsById[task.Id].tasks.push(parsedTask);
    }

    return Object.values(reportsById);
}

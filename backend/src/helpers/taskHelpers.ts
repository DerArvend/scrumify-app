import { SqlTask } from '../entities/RawTask';
import { Task } from '../entities/Task';

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

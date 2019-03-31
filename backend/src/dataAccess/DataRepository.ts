import { Result } from '../Result';
import { Report } from '../entities/Report';
import { TaskSearchQuery } from '../entities/TaskSearchQuery';
import { TeamIdGetError, ReportsFetchError, WriteReportError, GetUserNameError, AllUsersGetError } from './errorTypes';

export interface DataRepository {
    getTeamId: (userId: string) => Promise<Result<string, TeamIdGetError>>;
    getReports: (query: TaskSearchQuery) => Promise<Result<Report[], ReportsFetchError>>;
    writeReport: (userId: string, report: Report) => Promise<Result<void, WriteReportError>>;
    getUserName: (userId: string) => Promise<Result<string, GetUserNameError>>;
    getAllUsers: (teamId: string) => Promise<Result<[{Name: string, Id: string}], AllUsersGetError>>;
}

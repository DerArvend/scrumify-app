import { ReportsFetchError, TeamIdGetError, WriteReportError, GetUserNameError } from '../dataAccess/errorTypes';
import { Response } from 'express';

// TODO: This definetly needs good refactoring
export class ApiErrorHandler {
    public static handleReportsFetchError(error: ReportsFetchError, res: Response) {
        const status = this.reportsFetchErrorToStatus[error] || 500;
        res.sendStatus(status).end();
    }

    public static handleTeamIdGetError(error: TeamIdGetError, res: Response) {
        const status = this.teamIdGetErrorToStatus[error] || 500;
        res.sendStatus(status).end();
    }

    public static handleWriteReportError(error: WriteReportError, res: Response) {
        const status = this.writeReportErrorToStatus[error] || 500;
        res.sendStatus(status).end();
    }

    public static handleGetUserNameError(error: GetUserNameError, res: Response) {
        const status = this.getUserNameErrorToStatus[error] || 500;
        res.sendStatus(status).end();
    }

    private static reportsFetchErrorToStatus = {
        [ReportsFetchError.InvalidUserId]: 403,
        [ReportsFetchError.DatabaseError]: 500,
    };

    private static teamIdGetErrorToStatus = {
        [TeamIdGetError.InvalidArgument]: 400,
        [TeamIdGetError.IdNotFound]: 403,
        [TeamIdGetError.DatabaseError]: 500,
    };

    private static writeReportErrorToStatus = {
        [WriteReportError.TodayReportExists]: 400,
        [WriteReportError.InvalidUserId]: 403,
        [WriteReportError.DatabaseError]: 500,
    };

    private static getUserNameErrorToStatus = {
        [GetUserNameError.InvaludUuid]: 400,
        [GetUserNameError.UserIdNotFound]: 403,
        [GetUserNameError.DatabaseError]: 500,
    };
}

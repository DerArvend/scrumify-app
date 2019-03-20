import { DataRepository } from '../DataRepository';
import { SqlConfig } from './SqlConfig';
import { isValidUuid, isValidIsoDate } from '../../helpers/stringValidators';
import { fail, success, Result } from '../../Result';
import { queries } from './queries/simpleQueries';
import { TaskSearchQuery } from '../../entities/TaskSearchQuery';
import { parseReports } from '../../helpers/reportHelpers';
import { Report } from '../../entities/Report';
import uuid from 'uuid/v4';
import { TeamIdGetError, ReportsFetchError, WriteReportError, GetUserNameError } from '../errorTypes';
import { buildGetReportsQuery } from './queries/buildGetReportsQuery';
const sql = require('mssql');

export class MsSqlDataRepository implements DataRepository {
    private poolPromise: any;

    constructor(config: SqlConfig) {
        this.poolPromise = new sql.ConnectionPool(config).connect();
    }

    public async getTeamId(userId: string): Promise<Result<string, TeamIdGetError>> {
        if (!isValidUuid(userId))
            return fail(TeamIdGetError.InvalidArgument);

        const pool = await this.poolPromise;

        let response: any;
        try {
            response = await pool.request()
                .input('userId', userId)
                .query(queries.getTeamId);
        }
        catch (error) {
            return fail(TeamIdGetError.DatabaseError);
        }

        if (response.recordset.length === 0)
            return fail(TeamIdGetError.IdNotFound);

        return success(response.recordset[0].TeamId);
    }

    public async getReports(taskSearchQuery: TaskSearchQuery): Promise<Result<Report[], ReportsFetchError>> {
        const teamIdResult = await this.getTeamId(taskSearchQuery.userId);

        if (!teamIdResult.isSuccess) {
            return fail(ReportsFetchError.InvalidUserId);
        }
        const pool = await this.poolPromise;
        const skip = taskSearchQuery.skip || 0;
        const take = taskSearchQuery.take || 20;
        const sqlQuery = buildGetReportsQuery(
            isValidIsoDate(taskSearchQuery.startIsoDate),
            isValidIsoDate(taskSearchQuery.endIsoDate),
            taskSearchQuery.userNames && taskSearchQuery.userNames.length || 0);

        try {
            const request = pool.request();
            request.input('teamId', teamIdResult.value);
            this.inputParametersToGetReportsRequest(request, taskSearchQuery);
            const result: any = await request.query(sqlQuery);
            return success(parseReports(result.recordset));
        }
        catch (error) {
            console.log(`fetchTasks: sql error: ${error}`);
            return fail(ReportsFetchError.DatabaseError);
        }
    }

    public async writeReport(userId: string, report: Report): Promise<Result<void, WriteReportError>> {
        const date = report.reportIsoDate;
        if (!isValidIsoDate(report.reportIsoDate)) {
            return fail(WriteReportError.InvalidDate);
        }
        const teamId = await this.getTeamId(userId);
        if (!teamId.isSuccess) {
            return fail(WriteReportError.InvalidUserId);
        }
        const pool = await this.poolPromise;
        const reportId = uuid();
        try {
            const todayReportExists = await this.todayReportExists(userId, date);
            if (todayReportExists) return fail(WriteReportError.TodayReportExists);

            const transaction = pool.transaction();
            await transaction.begin();
            const request = new sql.Request(transaction);
            await request
                .input('id', reportId)
                .input('userId', userId)
                .input('reportDate', date)
                .input('comment', report.comment)
                .query(queries.insertReportQuery);

            for (const task of report.tasks) {
                const request = new sql.Request(transaction);
                await request
                    .input('id', uuid())
                    .input('reportId', reportId)
                    .input('theme', task.theme)
                    .input('url', task.url)
                    .input('currentState', task.currentState)
                    .input('problems', task.problems)
                    .query(queries.insertReportTaskQuery);
            }
            await transaction.commit();
        }
        catch (error) {
            console.log(`writeReport: sql transaction error: ${error}`);
            return fail(WriteReportError.DatabaseError);
        }

        return success(undefined);
    }

    public async getUserName(userId: string): Promise<Result<string, GetUserNameError>> {
        if (!isValidUuid(userId))
            return fail(GetUserNameError.InvaludUuid);

        const pool = await this.poolPromise;
        let response: any;
        try {
            response = await pool.request()
                .input('userId', userId)
                .query(queries.getUserNameQuery);
        }
        catch (error) {
            console.log(`auth: sql error: ${error}`);
            return fail(GetUserNameError.DatabaseError);
        }

        if (response.recordset.length === 0) {
            return fail(GetUserNameError.UserIdNotFound);
        }

        return success(response.recordset[0].Name);
    }

    private inputParametersToGetReportsRequest(sqlRequest: any, taskSearchQuery: TaskSearchQuery) {
        const { skip, take, userNames } = taskSearchQuery;
        const startIsoDate = isValidIsoDate(taskSearchQuery.startIsoDate) && taskSearchQuery.startIsoDate;
        const endIsoDate = isValidIsoDate(taskSearchQuery.endIsoDate) && taskSearchQuery.endIsoDate;
        sqlRequest
            .input('skip', sql.Int, skip || 0)
            .input('take', sql.Int, take || 20);

        if (startIsoDate)
            sqlRequest.input('startDate', startIsoDate);
        if (endIsoDate)
            sqlRequest.input('endDate', endIsoDate);
        if (userNames) {
            for (let i = 0; i < userNames.length; i++) {
                sqlRequest.input(`userName${i}`, userNames[i]);
            }
        }
    }

    private async todayReportExists(userId: string, isoDate: string) {
        const pool = await this.poolPromise;
        const reports = await pool.request()
            .input('userId', userId)
            .input('reportDate', isoDate)
            .query(queries.getReportsByDateAndUsernameQuery);
        return reports.recordset.length > 0;
    }

    private toIsoDate(date: Date) {
        return date.toISOString().slice(0, 10);
    }
}

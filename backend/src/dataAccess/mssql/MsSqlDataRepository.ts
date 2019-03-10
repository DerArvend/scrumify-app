import { DataRepository } from '../DataRepository';
import { SqlConfig } from './SqlConfig';
import { isValidUuid } from '../../helpers/common';
import { fail, success, Result } from '../../Result';
import { queries } from './queries';
import { TaskSearchQuery } from '../../entities/TaskSearchQuery';
import { parseReports } from '../../helpers/reportHelpers';
import { Report } from '../../entities/Report';
import uuid from 'uuid/v4';
import { TeamIdGetError, ReportsFetchError, WriteReportError, GetUserNameError } from '../errorTypes';
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

    public async getReports(query: TaskSearchQuery): Promise<Result<Report[], ReportsFetchError>> {
        const teamIdResult = await this.getTeamId(query.userId);

        if (!teamIdResult.isSuccess) {
            return fail(ReportsFetchError.InvalidUserId);
        }
        const pool = await this.poolPromise;
        const skip = query.skip || 0;
        const take = query.take || 20;

        try {
            const result: any = await pool.request()
                .input('skip', sql.Int, skip)
                .input('take', sql.Int, take)
                .input('teamId', teamIdResult.value)
                .query(queries.getReportsQuery);
            return success(parseReports(result.recordset));
        }
        catch (error) {
            console.log(`fetchTasks: sql error: ${error}`);
            return fail(ReportsFetchError.DatabaseError);
        }
    }

    public async writeReport(userId: string, report: Report): Promise<Result<void, WriteReportError>> {
        const teamId = await this.getTeamId(userId);
        if (!teamId.isSuccess) {
            return fail(WriteReportError.InvalidUserId);
        }
        const pool = await this.poolPromise;
        const reportId = uuid();
        try {
            const todayReportExists = this.todayReportExists(userId, new Date());
            if (todayReportExists) return fail(WriteReportError.TodayReportExists);

            const transaction = pool.transaction();
            await transaction.begin();
            const request = new sql.Request(transaction);
            await request
                .input('id', reportId)
                .input('userId', userId)
                .input('reportDate', new Date()) // TODO: Date from frontend
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

    private async todayReportExists(userId: string, date: Date) {
        const pool = await this.poolPromise;
        const reports = await pool.request()
            .input('userId', userId)
            .input('reportDate', date)
            .query(queries.getReportsByDateAndUsernameQuery);
        return reports.recordset.length > 0;
    }
}

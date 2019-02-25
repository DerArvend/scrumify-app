import { Response, Request } from 'express';
import { poolPromise } from '../dataAccess/pool';
import { Report } from '../entities/Report';
import { getTeamId } from './../dataAccess/getTeamId';
import uuid from 'uuid/v4';
const sql = require('mssql');

const reportQuery = `
    INSERT INTO [scrumify].[dbo].[report]
    (Id,UserId,ReportDate,Comment)
    VALUES
    (@id, @userId, @reportDate, @comment);
`;

const reportTaskQuery = `
    INSERT INTO [dbo].[report-task]
    (Id,ReportId,Theme,Url,CurrentState,Problems)
    VALUES
    (@id,@reportId,@theme,@url,@currentState,@problems)
`;

export async function writeReport(req: Request, res: Response) {
    const { userId } = req.cookies;
    try {
        getTeamId(userId);
    }
    catch {
        res.sendStatus(403);
        return;
    }

    const pool = await poolPromise;
    const transaction = pool.transaction();

    const report: Report = req.body;

    await transaction.begin();
    const reportId = uuid();
    try {
        const request = new sql.Request(transaction);
        await request
            .input('id', reportId)
            .input('userId', userId)
            .input('reportDate', report.reportDate)
            .input('comment', report.comment)
            .query(reportQuery);

        for (const task of report.tasks) {
            const request = new sql.Request(transaction);
            await request
                .input('id', uuid())
                .input('reportId', reportId)
                .input('theme', task.theme)
                .input('url', task.url)
                .input('currentState', task.currentState)
                .input('problems', task.problems)
                .query(reportTaskQuery);
        }
        await transaction.commit();
    }
    catch (error) {
        console.log(`sql transaction error: ${error}`);
        res.sendStatus(500);
        return;
    }

    res.sendStatus(200);
}

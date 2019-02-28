import { Response, Request } from 'express';
import { poolPromise } from '../dataAccess/pool';
import { parseReports } from '../helpers';
import { getTeamId } from '../dataAccess/getTeamId';
const sql = require('mssql');

const query = `
SELECT [user].Name,
report.Id,
report.ReportDate,
report.Comment,
reportTask.Theme,
reportTask.Url,
reportTask.CurrentState,
reportTask.Problems
FROM [scrumify].[dbo].[report] report
LEFT JOIN [scrumify].[dbo].[report-task] reportTask ON report.Id = reportTask.ReportId
INNER JOIN [scrumify].[dbo].[user] [user] ON report.UserId = [user].Id
WHERE @teamId IN (SELECT TeamId FROM [scrumify].[dbo].[user] WHERE Id = report.UserId)
ORDER BY [report].[ReportDate] DESC
OFFSET @skip ROWS
FETCH NEXT @take ROWS ONLY;`;

export async function fetchTasks(req: Request, res: Response) {
    const { userId } = req.cookies;
    const teamIdResult = await getTeamId(userId);
    if (!teamIdResult.isSuccess) {
        res.sendStatus(403);
        return;
    }
    const pool = await poolPromise;
    const skip = req.query.skip || 0;
    const take = req.query.take || 20;

    try {
        const result: any = await pool.request()
            .input('skip', sql.Int, skip)
            .input('take', sql.Int, take)
            .input('teamId', teamIdResult.value)
            .query(query);
        res.json(parseReports(result.recordset));
    }
    catch (error) {
        console.log(`fetchTasks: sql error: ${error}`);
        res.sendStatus(500);
        return;
    }
}
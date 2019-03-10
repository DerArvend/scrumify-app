// TODO: move each query to separate .sql file

const getTeamId = `
SELECT [TeamId]
FROM [scrumify].[dbo].[user]
WHERE [user].[Id] = @userId;
`;

const getReportsQuery = `
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

const insertReportQuery = `
INSERT INTO [scrumify].[dbo].[report]
(Id,UserId,ReportDate,Comment)
VALUES
(@id, @userId, @reportDate, @comment);
`;

const insertReportTaskQuery = `
INSERT INTO [dbo].[report-task]
(Id,ReportId,Theme,Url,CurrentState,Problems)
VALUES
(@id,@reportId,@theme,@url,@currentState,@problems)
`;

const getUserNameQuery = 'SELECT Name FROM [scrumify].[dbo].[user] WHERE Id = @userId;';

const getReportsByDateAndUsernameQuery = `
SELECT * FROM [scrumify].[dbo].[report]
WHERE UserId = @userId AND ReportDate = @reportDate;`;

export const queries = {
    getTeamId,
    getReportsQuery,
    getUserNameQuery,
    getReportsByDateAndUsernameQuery,
    insertReportQuery,
    insertReportTaskQuery,
};

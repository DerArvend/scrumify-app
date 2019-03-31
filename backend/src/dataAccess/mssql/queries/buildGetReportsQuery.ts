const queryBase = `
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
`;

const baseWhereCondition = 'WHERE @teamId IN (SELECT TeamId FROM [scrumify].[dbo].[user] WHERE Id = report.UserId)';

const queryEnd = `
ORDER BY [report].[ReportDate] DESC
OFFSET @skip ROWS
FETCH NEXT @take ROWS ONLY;
`;

export function buildGetReportsQuery(includeStartDate: boolean, includeEndDate: boolean, userNamesCount?: number) {
    let resultQuery = queryBase;
    const dateConditions: string[] = [];
    const userNameConditions: string[] = [];
    if (includeStartDate)
        dateConditions.push('report.ReportDate > @startDate');
    if (includeEndDate)
        dateConditions.push('report.ReportDate < @endDate');
    for (let i = 0; i < userNamesCount; i++)
        userNameConditions.push(`[user].Name = @userName${i}`);
    const joindesDateConditions = dateConditions.join(' AND ');
    const joinedUserNameConditions = userNameConditions.join(' OR ');
    const whereQueryFragments = [baseWhereCondition];
    if (joindesDateConditions)
        whereQueryFragments.push(joindesDateConditions);
    if (joinedUserNameConditions)
        whereQueryFragments.push(`(${joinedUserNameConditions})`);
    resultQuery += whereQueryFragments.join(' AND ');
    resultQuery += queryEnd;
    return resultQuery;
}

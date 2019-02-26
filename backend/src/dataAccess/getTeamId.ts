import { poolPromise } from './pool';
import { Result } from '../Result';

const query = `
SELECT [TeamId]
FROM [scrumify].[dbo].[user]
WHERE [user].[Id] = @userId;
`;

type TeamIdFetchError = 'invalidArgument' | 'idNotFound' | 'sqlError';

export async function getTeamId(userId: string): Promise<Result<string, TeamIdFetchError>> {
    const uuidRegex = /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/g;
    if (!uuidRegex.test(userId))
        return { isSuccess: false, error: 'invalidArgument' };

    const pool = await poolPromise;
    let response: any;
    try {
        response = await pool.request()
            .input('userId', userId)
            .query(query);
    }
    catch (error) {
        return { isSuccess: false, error: 'sqlError' }
    }

    if (response.recordset.length === 0)
        return { isSuccess: false, error: 'idNotFound' };

    return { isSuccess: true, value: response.recordset[0].TeamId };
}

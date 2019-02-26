import { Request, Response } from 'express';
import { poolPromise } from '../dataAccess/pool';

const query = 'SELECT Id FROM [scrumify].[dbo].[user] WHERE Id = @userId;';

export async function auth(req: Request, res: Response) {
    const uuidRegex = /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/g;
    const userId = req.cookies && req.cookies.userId || req.body.userId;

    if (!uuidRegex.test(userId)) {
        res.sendStatus(400);
        return;
    }
    const pool = await poolPromise;
    let response: any;
    try {
        response = await pool.request().input('userId', userId).query(query);
    }
    catch (error) {
        console.log(`auth: sql error: ${error}`);
        res.sendStatus(500);
        return;
    }

    if (response.recordset.length === 0) {
        res.sendStatus(403);
        return;
    }

    if (req.cookies && req.cookies.userId)
        res.sendStatus(200);

    else
        res.cookie('userId', userId, { httpOnly: true }).end();
}

import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import settings from './settings.json';
import { fetchTasks } from './api/fetchTasks.js';
import { writeReport } from './api/writeReport.js';
import { getTeamId } from './dataAccess/getTeamId.js';
import { auth } from './api/auth.js';

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.get('/api/fetchTasks', fetchTasks);
app.post('/api/writeReport', writeReport);
app.get('/api/getTeamId', async (req: any, res: any) => {const r = await getTeamId(req.query.userId); res.json(r);})
app.post('/api/auth', auth);

app.listen(settings.port, () => console.log(`Scrumify backend listening on port ${settings.port}`));

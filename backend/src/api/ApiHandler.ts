import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { ApiSettings } from './ApiSettings';
import { DataRepository } from '../dataAccess/DataRepository';
import { ApiErrorHandler } from './ErrorHandler';

export class ApiHandler {
    private repository: DataRepository;
    private settings: ApiSettings;
    private app: Application;

    constructor(settings: ApiSettings, repository: DataRepository) {
        this.repository = repository;
        this.settings = settings;
        this.app = express();
        this.registerMiddlewares(this.app);
        this.registerApiMethods(this.app);
    }

    public auth = async (req: Request, res: Response) => {
        const userId = req.cookies && req.cookies.userId || req.body.userId;
        const userNameResult = await this.repository.getUserName(userId);
        const expiresDate = new Date();
        expiresDate.setMonth(expiresDate.getMonth() + 3);
        if (userNameResult.isSuccess) {
            res.cookie('userId', userId, { httpOnly: true, expires: expiresDate });
            res.cookie('userName', userNameResult.value);
            res.end();
            return;
        }
        ApiErrorHandler.handleGetUserNameError(userNameResult.error, res);
    }

    public fetchReports = async (req: Request, res: Response) => {
        const { userId } = req.cookies;
        const skip = parseInt(req.query.skip);
        const take = parseInt(req.query.take);
        const reportsResult = await this.repository.getReports({ userId, skip, take });
        if (reportsResult.isSuccess) {
            res.json(reportsResult.value);
            return;
        }
        ApiErrorHandler.handleReportsFetchError(reportsResult.error, res);
    }
    public writeReport = async (req: Request, res: Response) => {
        const { userId } = req.cookies;
        const report = req.body;
        const writeReportResult = await this.repository.writeReport(userId, report);
        if (writeReportResult.isSuccess) {
            res.sendStatus(200);
            return;
        }
        ApiErrorHandler.handleWriteReportError(writeReportResult.error, res);
    }

    public startListening() {
        this.app.listen(this.settings.port,
            () => console.log(`Scrumify backend listening on port ${this.settings.port}`));
    }

    private registerMiddlewares(app: Application) {
        app.use(bodyParser.json());
        app.use(cookieParser());
    }

    private registerApiMethods(app: Application) {
        app.get('/api/fetchTasks', this.fetchReports);
        app.post('/api/writeReport', this.writeReport);
        app.post('/api/auth', this.auth);
    }
}

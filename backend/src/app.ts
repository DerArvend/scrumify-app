import settings from './settings.json';
import { MsSqlDataRepository } from './dataAccess/mssql/MsSqlDataRepository.js';
import { ApiHandler } from './api/ApiHandler';

const mssqlConfig = {
    ...settings.mssqlConfig,
    user: process.env.SCRUMIFY_DB_USER,
    password: process.env.SCRUMIFY_DB_PASSWORD,
    server: process.env.SCRUMIFY_DB_URL,
};

const repository = new MsSqlDataRepository(mssqlConfig);
const apiHandler = new ApiHandler(settings, repository);
apiHandler.startListening();

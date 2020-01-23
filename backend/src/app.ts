import settings from './settings.json';
import { MsSqlDataRepository } from './dataAccess/mssql/MsSqlDataRepository';
import { ApiHandler } from './api/ApiHandler';
import { ApiSettings } from './api/ApiSettings.js';

let mssqlConfig = {
    ...settings.mssqlConfig,
};

if (process.env.NODE_ENV === 'production') {
    mssqlConfig = {
        ...mssqlConfig,
        user: process.env.SCRUMIFY_DB_USER,
        password: process.env.SCRUMIFY_DB_PASSWORD,
        server: process.env.SCRUMIFY_DB_URL,
    };
}

const apiSettings: ApiSettings = {
    port: settings.port,
    selfHosted: process.env.SCRRUMIFY_IS_SELFHOSTED === 'true'
}

const repository = new MsSqlDataRepository(mssqlConfig);
const apiHandler = new ApiHandler(apiSettings, repository);
apiHandler.startListening();

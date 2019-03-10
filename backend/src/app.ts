import settings from './settings.json';
import { MsSqlDataRepository } from './dataAccess/mssql/MsSqlDataRepository.js';
import { ApiHandler } from './api/ApiHandler';

const repository = new MsSqlDataRepository(settings.mssqlConfig);
const apiHandler = new ApiHandler(settings, repository);
apiHandler.startListening();

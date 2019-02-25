import settings from '../settings.json';
const sql = require('mssql'); // @types/mssql are not updated to latest mssql version, so mssql is used now without typings

export const poolPromise = new sql.ConnectionPool(settings.mssqlConfig).connect();

#!/bin/bash

for i in {0..30}; do
  if /opt/mssql-tools/bin/sqlcmd -U SA -P $SA_PASSWORD -Q 'SELECT 1;' &> /dev/null; then
    echo "$0: SQL Server started"
    break
  fi
  echo "Wait for database to start... ($i / 30)"
  sleep 1
  if ($i -ge 30); then
    echo "DB has not started in 30 seconds"
    exit 1
  fi
done

/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P $SA_PASSWORD -i scripts/scrumify.Database.sql \
-i scripts/dbo.user.Table.sql \
-i scripts/dbo.team.Table.sql \
-i scripts/dbo.report.Table.sql \
-i scripts/dbo.report-task.Table.sql
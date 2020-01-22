FROM mcr.microsoft.com/mssql/server:2017-latest

COPY scripts scripts

COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

COPY init-db.sh .
RUN chmod +x init-db.sh

EXPOSE 1433

ENTRYPOINT ./entrypoint.sh

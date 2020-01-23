FROM node:latest

ARG APP_DIR=app

RUN mkdir -p ${APP_DIR}
WORKDIR /${APP_DIR}

ENV SCRRUMIFY_IS_SELFHOSTED=true

COPY backend/package*.json backend/
COPY frontend/package*.json frontend/

RUN cd frontend && npm ci
RUN cd backend && npm ci

COPY backend backend
COPY frontend frontend

RUN cd frontend && npm run build
RUN cd backend && npm run build

WORKDIR /${APP_DIR}/backend

CMD ["npm", "run", "serve"]
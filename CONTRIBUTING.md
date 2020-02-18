## Local build
1. Setup local database:  
In `dev-mssql/` folder run
```bash
docker-compose build
docker-compose up -d
```
2. Start backend:  
In `backend/` folder run
```bash
npm install
npm run dev
```
3. Start frontend:  
In `frontend/` folder run
```bash
npm install
npm start
```

## Production build
1. Build docker image  
In repository root run `docker build -t scrumify-app-image .`

2. Run container  
To start container you have to specify following environment variables: `SCRUMIFY_DB_URL`, `SCRUMIFY_DB_USER`, `SCRUMIFY_DB_PASSWORD`. Inside conainer application listens for port 4000.

Example: 
```bash
docker run -d --name scrumify-app \
-e "SCRUMIFY_DB_URL=YOUR_URL" \
-e "SCRUMIFY_DB_USER=USERNAME" \
-e "SCRUMIFY_DB_PASSWORD=YOUR_PASSWORD" \
-p 80:4000 \
scrumify-app-image
```

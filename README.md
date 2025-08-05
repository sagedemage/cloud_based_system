# cloud_based_system

A system containing an Express server, SQL Server, and DynamoDB.

## Setup

Install dependencies
```
npm install
```

Copy the sample-env file to .env
```
cp sample-env .env
```

Start back-end server
```
npm start
```

Run SQL Server container
```
docker compose up
```

Run in the background
```
docker compose up -d
```
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

## Docker CLI

Remove docker container
```
docker container rm -f -v 6c0d86736da5
```

## Resources
- [Installation - Sequelize](https://sequelize.org/docs/v6/getting-started/)
- [Data Types - Sequelize](https://sequelize.org/docs/v7/models/data-types/)

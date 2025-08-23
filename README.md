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

## SQL Server Setup

Use a database management program to manage and administer SQL Server.
My recommendation is [DBeaver](https://dbeaver.io/) because it works on Linux.

Create a database called `radio_waves` in SQL Server.

## Docker CLI

Remove docker container
```
docker container rm -f -v 6c0d86736da5
```

Check that the Cassandra container is running
```
docker exec 86dcd74e5666 nodetool status
```

### CQL Queries

Go to the Cassandra container with the cqlsh command to get into the Cassandra shell
```
docker exec -it 86dcd74e5666 cqlsh
```

Show a list of tables
```
describe tables;
```

Get the logs and its information
```
select * from logger."Log";
```

Delete a keyspace
```
drop keyspace logger;
```

## Docker Desktop
Set the Memory Limit to 6 GB in Settings &#8594; Resources. This is necessary to avoid
the insufficient system memory issue.

## Setup AWS CLI
Go to [Installing or updating to the latest version of the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) to install the AWS CLI.

Check the version of the AWS CLI to verify it is installed
```
aws --version
```

## Setup DynamoDB on AWS
Create a table called "LoginLogs". It has a Partition key called "logid" with `Number` as its type.

Table name: LoginLogs

Partition key:
- logid: String

Attributes:
- msg: String
- created: String

## Resources
- [Installation - Sequelize](https://sequelize.org/docs/v6/getting-started/)
- [Data Types - Sequelize](https://sequelize.org/docs/v7/models/data-types/)
- [Installing or updating to the latest version of the AWS CLI - AWS](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- [Choosing the Right DynamoDB Partition Key - AWS](https://aws.amazon.com/blogs/database/choosing-the-right-dynamodb-partition-key/)
- [RESTful API with Node.js, Express, and DynamoDB - Medium](https://faerulsalamun.medium.com/restful-api-with-node-js-express-and-dynamodb-5059beb3ba7f)
- [AWS SDK v3: Putting an Item - Intenics](https://blog.intenics.io/aws-sdk-v3-putting-an-item/)
- [GetItemCommand - AWS SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/command/GetItemCommand/)
- [PutItemCommand - AWS SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/command/PutItemCommand/)

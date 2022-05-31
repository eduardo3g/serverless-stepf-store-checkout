const AWS = require("aws-sdk");
const ulid = require("ulid");
require("dotenv").config();

AWS.config.region = "eu-west-1";
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const users = [
  {
    userId: ulid.ulid(),
    name: "Eduardo Santana",
    points: 300,
  },
  {
    userId: ulid.ulid(),
    name: "John Doe",
    points: 100,
  },
];

const putRequests = users.map((user) => ({
  PutRequest: {
    Item: user,
  },
}));

const request = {
  RequestItems: {
    [process.env.USER_TABLE_NAME]: putRequests,
  },
};

dynamoDb
  .batchWrite(request)
  .promise()
  .then(() => console.log("Users seed script has been completed"))
  .catch((error) =>
    console.error("Failed to execute users seed script", error)
  );

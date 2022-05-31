const AWS = require("aws-sdk");
const ulid = require("ulid");
require("dotenv").config();

AWS.config.region = "eu-west-1";
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const books = [
  {
    bookId: ulid.ulid(),
    title: "The 10X Rule",
    quantity: 500,
    price: 20,
  },
  {
    bookId: ulid.ulid(),
    title: "The Boy in the Striped Pajamas",
    quantity: 400,
    price: 75,
  },
];

const putRequests = books.map((book) => ({
  PutRequest: {
    Item: book,
  },
}));

const request = {
  RequestItems: {
    [process.env.BOOK_TABLE_NAME]: putRequests,
  },
};

dynamoDb
  .batchWrite(request)
  .promise()
  .then(() => console.log("Books seed script has been completed"))
  .catch((error) =>
    console.error("Failed to execute books seed script", error)
  );

const DynamoDB = require("aws-sdk/clients/dynamodb");
const DocumentClient = new DynamoDB.DocumentClient();

const { BOOK_TABLE } = process.env;

const isBookAvailable = (book, quantity) => {
  return book.quantity - quantity > 0;
};

module.exports.handler = async ({ bookId, quantity }) => {
  try {
    const params = {
      TableName: BOOK_TABLE,
      KeyConditionExpression: "bookId = :bookId",
      ExpressionAttributeValues: {
        ":bookId": bookId,
      },
    };

    const result = await DocumentClient.query(params).promise();
    const book = result.Items[0];

    if (isBookAvailable(book, quantity)) {
      return book;
    } else {
      let bookOutOfStockError = new Error("The book is out of stock");
      bookOutOfStockError.name = "BookOutOfStock";
      throw bookOutOfStockError;
    }
  } catch (e) {
    if (e.name === "BookOutOfStock") {
      throw e;
    } else {
      let bookNotFoundError = new Error(e);
      throw bookNotFoundError;
    }
  }
};

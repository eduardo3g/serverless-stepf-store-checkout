const DynamoDB = require("aws-sdk/clients/dynamodb");
const DocumentClient = new DynamoDB.DocumentClient();

const { BOOK_TABLE } = process.env;

module.exports.handler = async ({ bookId, quantity }) => {
  const params = {
    TableName: BOOK_TABLE,
    Key: { bookId },
    UpdateExpression: "set quantity = quantity + :orderQuantity",
    ExpressionAttributeValues: {
      ":orderQuantity": quantity,
    },
  };

  await DocumentClient.update(params).promise();

  return "Quantity restored";
};

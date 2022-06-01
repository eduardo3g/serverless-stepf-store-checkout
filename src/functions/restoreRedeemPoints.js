const DynamoDB = require("aws-sdk/clients/dynamodb");
const DocumentClient = new DynamoDB.DocumentClient();

const { USER_TABLE } = process.env;

module.exports.handler = async ({ userId, total }) => {
  try {
    if (total.points) {
      const params = {
        TableName: USER_TABLE,
        Key: { userId },
        UpdateExpression: "set points = :points",
        ExpressionAttributeValues: {
          ":points": total.points,
        },
      };

      await DocumentClient.update(params).promise();
    }
  } catch (e) {
    throw new Error(e);
  }
};

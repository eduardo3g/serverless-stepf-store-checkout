const DynamoDB = require("aws-sdk/clients/dynamodb");
const DocumentClient = new DynamoDB.DocumentClient();

const { USER_TABLE } = process.env;

const deductPoints = async (userId) => {
  const params = {
    TableName: USER_TABLE,
    Key: { userId: userId },
    UpdateExpression: "SET points = :zero",
    ExpressionAttributeValues: {
      ":zero": 0,
    },
  };

  await DocumentClient.update(params).promise();
};

module.exports.handler = async ({ userId, total }) => {
  try {
    const orderTotal = total.total;

    const params = {
      TableName: USER_TABLE,
      Key: {
        userId: userId,
      },
    };

    const result = await DocumentClient.get(params).promise();
    const user = result.Item;

    const points = user.points;

    if (orderTotal > points) {
      await deductPoints(userId);

      orderTotal = orderTotal - points;

      return { total: orderTotal, points };
    } else {
      throw new Error("Order total is less than redeem points");
    }
  } catch (e) {
    throw new Error(e);
  }
};

const StepFunctions = require("aws-sdk/clients/stepfunctions");
const StepFunctionClient = new StepFunctions();
const DynamoDB = require("aws-sdk/clients/dynamodb");
const DocumentClient = new DynamoDB.DocumentClient();

const { BOOK_TABLE } = process.env;

const updateBookQuantity = async (bookId, orderQuantity) => {
  console.log("bookId: ", bookId);

  const params = {
    TableName: BOOK_TABLE,
    Key: { bookId: bookId },
    UpdateExpression: "SET quantity = quantity - :orderQuantity",
    ExpressionAttributeValues: {
      ":orderQuantity": orderQuantity,
    },
  };

  await DocumentClient.update(params).promise();
};

module.exports.handler = async (event) => {
  const record = event.Records[0];
  const body = JSON.parse(record.body);

  try {
    console.log(JSON.stringify(event));
    const { bookId, quantity } = body.Input;

    const courier = "eduardosbrasil10@gmail.com";

    await updateBookQuantity(bookId, quantity);

    await StepFunctionClient.sendTaskSuccess({
      output: JSON.stringify({ courier }),
      taskToken: body.Token,
    }).promise();
  } catch (e) {
    console.log("Something went wrong to process the order", e);

    await StepFunctionClient.sendTaskFailure({
      error: "NoCourierAvailable",
      cause: "No couriers available",
      taskToken: body.Token,
    }).promise();
  }
};

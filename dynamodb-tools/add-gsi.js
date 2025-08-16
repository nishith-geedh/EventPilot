const { DynamoDBClient, UpdateTableCommand } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({ region: "ap-south-1" }); 

const command = new UpdateTableCommand({
  TableName: "eventpilot-stack-RegistrationsTable-13LMLTL8AYZR7",
  AttributeDefinitions: [
    {
      AttributeName: "eventId",
      AttributeType: "S",
    },
  ],
  GlobalSecondaryIndexUpdates: [
    {
      Create: {
        IndexName: "eventId-index",
        KeySchema: [
          {
            AttributeName: "eventId",
            KeyType: "HASH",
          },
        ],
        Projection: {
          ProjectionType: "ALL",
        },
        // ❌ REMOVE provisioned throughput section for PAY_PER_REQUEST tables
      },
    },
  ],
});

client.send(command)
  .then(() => console.log("✅ GSI creation started. It may take a few minutes to complete."))
  .catch(console.error);

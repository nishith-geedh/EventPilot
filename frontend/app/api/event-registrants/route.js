import AWS from "aws-sdk";
const ddb = new AWS.DynamoDB.DocumentClient({ region: "ap-south-1" });

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get("eventId");

  if (!eventId) {
    return new Response(
      JSON.stringify({ error: "Missing eventId parameter" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const params = {
    TableName: "eventpilot-stack-RegistrationsTable-13LMLTL8AYZR7",
    IndexName: "eventId-index",
    KeyConditionExpression: "eventId = :eid",
    ExpressionAttributeValues: { ":eid": eventId },
  };

  try {
    const data = await ddb.query(params).promise();
    return new Response(
      JSON.stringify({ registrants: data.Items || [] }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch registrants" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

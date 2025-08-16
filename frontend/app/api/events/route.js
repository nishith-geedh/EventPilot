import AWS from "aws-sdk";
const ddb = new AWS.DynamoDB.DocumentClient({ region: "ap-south-1" });

export async function GET() {
  const params = {
    TableName: "eventpilot-stack-EventsTable-1P9AKBKURDWK5"
  };

  try {
    const data = await ddb.scan(params).promise();
    // Always return array (even empty)
    return new Response(
      JSON.stringify(data.Items || []),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Error fetching events", error);
    return new Response(JSON.stringify([]), { // Always return array, not null or undefined!
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

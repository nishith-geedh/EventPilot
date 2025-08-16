import AWS from "aws-sdk";

const ddb = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();
const TICKETS_TABLE = process.env.TICKETS_TABLE;
const TICKETS_BUCKET = process.env.TICKETS_BUCKET;

export const handler = async (event) => {
  const method = event.httpMethod;
  const path = event.resource;
  const params = event.pathParameters || {};

  try {
    if (method === "GET" && path === "/tickets/{ticketId}") {
      const ticketId = params.ticketId;
      const data = await ddb.get({ TableName: TICKETS_TABLE, Key: { ticketId } }).promise();
      if (!data.Item) return err(404, "ticket not found");
      const key = `tickets/${ticketId}.pdf`;
      const url = s3.getSignedUrl("getObject", { Bucket: TICKETS_BUCKET, Key: key, Expires: 3600 });
      return ok({ ...data.Item, downloadUrl: url });
    }
    if (method === "POST" && path === "/tickets/{ticketId}/scan") {
      const ticketId = params.ticketId;
      const ts = new Date().toISOString();
      await ddb.update({
        TableName: TICKETS_TABLE,
        Key: { ticketId },
        UpdateExpression: "SET #s = :used, scanTs = :ts",
        ExpressionAttributeNames: { "#s": "status" },
        ExpressionAttributeValues: { ":used": "used", ":ts": ts }
      }).promise();
      return ok({ ticketId, scannedAt: ts });
    }
    return err(404, "Not found");
  } catch (e) {
    console.error(e);
    return err(500, e.message);
  }
};

const ok = (data, statusCode = 200) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});

const err = (statusCode, message) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ error: message }),
});

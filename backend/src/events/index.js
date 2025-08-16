import AWS from "aws-sdk";
import { v4 as uuid } from "uuid";

const ddb = new AWS.DynamoDB.DocumentClient();
const EVENTS_TABLE = process.env.EVENTS_TABLE;

export const handler = async (event) => {
  const method = event.httpMethod;
  const path = event.resource;
  const body = event.body ? JSON.parse(event.body) : null;

  try {
    if (method === "GET" && path === "/events") {
      const data = await ddb.scan({ TableName: EVENTS_TABLE }).promise();
      return ok(data.Items || []);
    }
    if (method === "POST" && path === "/events") {
      const item = {
        eventId: uuid(),
        title: body.title,
        description: body.description || "",
        date: body.date,
        category: body.category || "general",
        organizerId: body.organizerId,
        bannerUrl: body.bannerUrl || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await ddb.put({ TableName: EVENTS_TABLE, Item: item }).promise();
      return ok(item, 201);
    }
    if (path.startsWith("/events/")) {
      const eventId = event.pathParameters.id;
      if (method === "GET") {
        const data = await ddb.get({ TableName: EVENTS_TABLE, Key: { eventId } }).promise();
        return ok(data.Item || {});
      }
      if (method === "PUT") {
        const updates = body;
        updates.updatedAt = new Date().toISOString();
        await ddb.put({ TableName: EVENTS_TABLE, Item: { ...updates, eventId } }).promise();
        return ok({ message: "updated", eventId });
      }
      if (method === "DELETE") {
        await ddb.delete({ TableName: EVENTS_TABLE, Key: { eventId } }).promise();
        return ok({ message: "deleted", eventId });
      }
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

import AWS from "aws-sdk";
import { v4 as uuid } from "uuid";
import QRCode from "qrcode";
import PDFDocument from "pdfkit";

const ddb = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

const REG_TABLE = process.env.REG_TABLE;
const TICKETS_TABLE = process.env.TICKETS_TABLE;
const TICKETS_BUCKET = process.env.TICKETS_BUCKET;

export const handler = async (event) => {
  const method = event.httpMethod;
  const body = event.body ? JSON.parse(event.body) : null;

  try {
    if (method === "POST") {
      const { eventId, userId, name, email } = body;

      const registrationId = uuid();
      const createdAt = new Date().toISOString();
      const regItem = { registrationId, eventId, userId, name, email, createdAt };
      await ddb.put({ TableName: REG_TABLE, Item: regItem }).promise();

      // Create ticket & PDF
      const ticketId = uuid();
      const ticketItem = {
        ticketId, eventId, userId, status: "issued", createdAt,
      };
      await ddb.put({ TableName: TICKETS_TABLE, Item: ticketItem }).promise();

      // Generate QR and PDF in-memory
      const qrPayload = JSON.stringify({ ticketId, eventId, userId });
      const qrDataUrl = await QRCode.toDataURL(qrPayload);

      const pdfBuffer = await renderTicketPDF({
        name, email, eventId, ticketId, qrDataUrl
      });

      const key = `tickets/${ticketId}.pdf`;
      await s3.putObject({
        Bucket: TICKETS_BUCKET,
        Key: key,
        Body: pdfBuffer,
        ContentType: "application/pdf"
      }).promise();

      const signedUrl = s3.getSignedUrl("getObject", { Bucket: TICKETS_BUCKET, Key: key, Expires: 60 * 60 });

      return ok({ registration: regItem, ticket: { ...ticketItem, downloadUrl: signedUrl } }, 201);
    }

    if (method === "GET") {
      // optional filters: eventId, userId
      const params = event.queryStringParameters || {};
      if (params.eventId) {
        const result = await ddb.query({
          TableName: REG_TABLE,
          IndexName: "EventIndex",
          KeyConditionExpression: "eventId = :e",
          ExpressionAttributeValues: { ":e": params.eventId }
        }).promise();
        return ok(result.Items || []);
      }
      return ok((await ddb.scan({ TableName: REG_TABLE }).promise()).Items || []);
    }

    return err(404, "Not found");
  } catch (e) {
    console.error(e);
    return err(500, e.message);
  }
};

async function renderTicketPDF({ name, email, eventId, ticketId, qrDataUrl }) {
  const qrBase64 = qrDataUrl.split(",")[1];
  const qrBuffer = Buffer.from(qrBase64, "base64");

  return await new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks = [];
    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(24).text("EventPilot Ticket", { align: "center" });
    doc.moveDown();
    doc.fontSize(16).text(`Name: ${name}`);
    doc.text(`Email: ${email}`);
    doc.text(`Event: ${eventId}`);
    doc.text(`Ticket ID: ${ticketId}`);
    doc.moveDown();
    try {
      doc.image(qrBuffer, { fit: [200, 200], align: "center" });
    } catch (e) {
      doc.fontSize(12).text("QR code rendering failed.");
    }
    doc.end();
  });
}

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

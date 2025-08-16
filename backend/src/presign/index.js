import AWS from "aws-sdk";
import { v4 as uuid } from "uuid";

const s3 = new AWS.S3();
const BANNERS_BUCKET = process.env.BANNERS_BUCKET;

export const handler = async (event) => {
  const method = event.httpMethod;
  if (method !== "POST") return err(405, "Method not allowed");

  const { contentType } = JSON.parse(event.body || "{}");
  const key = `banners/${uuid()}`;

  const url = s3.getSignedUrl("putObject", {
    Bucket: BANNERS_BUCKET,
    Key: key,
    Expires: 60 * 5,
    ContentType: contentType || "image/jpeg"
  });
  return ok({ uploadUrl: url, objectKey: key, publicUrl: `https://${BANNERS_BUCKET}.s3.amazonaws.com/${key}` });
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

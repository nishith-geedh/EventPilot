import AWS from "aws-sdk";

const ddb = new AWS.DynamoDB.DocumentClient();
const REG_TABLE = process.env.REG_TABLE;
const TICKETS_TABLE = process.env.TICKETS_TABLE;

export const handler = async (event) => {
  const params = event.queryStringParameters || {};
  // date range filters (ISO strings)
  const { from, to } = params;

  // For demo, naive scans; for prod, use GSI + key conditions
  const regs = await ddb.scan({ TableName: REG_TABLE }).promise();
  const tickets = await ddb.scan({ TableName: TICKETS_TABLE }).promise();

  // Group registrants per event
  const perEvent = {};
  for (const r of regs.Items || []) {
    perEvent[r.eventId] = (perEvent[r.eventId] || 0) + 1;
  }

  // Ticket scans over time (YYYY-MM-DD buckets)
  const scans = {};
  for (const t of tickets.Items || []) {
    if (!t.scanTs) continue;
    const day = (t.scanTs || "").slice(0, 10);
    scans[day] = (scans[day] || 0) + 1;
  }

  // Registrations by category – requires event category join (omitted). Mock pie from regs (random cat)
  const categories = {};
  for (const r of regs.Items || []) {
    const c = ["music","tech","workshop","general"][(r.eventId.charCodeAt(0)%4)];
    categories[c] = (categories[c] || 0) + 1;
  }

  // Conversion rate (mock: visits = regs * 1.6)
  const totalRegs = (regs.Items || []).length;
  const visits = Math.round(totalRegs * 1.6);
  const conversion = totalRegs && visits ? totalRegs / visits : 0;

  // Real-time active attendees – stub
  const activeAttendees = Math.round((tickets.Items || []).length * 0.15);

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      perEvent,
      scans,
      categories,
      conversion,
      visits,
      totalRegs,
      activeAttendees
    })
  };
};

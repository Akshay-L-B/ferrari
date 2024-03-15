import mysql from "mysql2";
import dbConfig from "../../middleware/dbConfig";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { EventHost } = req.query;

  // Validate input
  if (!EventHost) {
    return res.status(400).json({ error: "EventHost is required" });
  }

  const connection = mysql.createConnection(dbConfig);

  try {
    connection.connect();

    // Fetch events where EventHost matches and additionstatus is false
    const [eventsResult] = await connection
      .promise()
      .query(
        "SELECT * FROM events WHERE EventHost = ? AND additionstatus = false",
        [EventHost]
      );

    const events = eventsResult;

    if (!events || events.length === 0) {
      return res
        .status(404)
        .json({ error: "No events found for the given EventHost" });
    }

    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.end();
  }
};

export default handler;

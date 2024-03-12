import sql from 'mssql';
import dbConfig from '../../path-to-your-dbConfig/dbConfig';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const { EventID } = req.query;

      // Check if 'EventID' is provided
      if (!EventID) {
        return res.status(400).json({ error: "Missing 'EventID' parameter" });
      }

      await sql.connect(dbConfig);

      // Fetch the event from the 'events' table using EventID
      const eventResult = await sql.query`SELECT * FROM events WHERE EventID = ${EventID}`;
      const event = eventResult.recordset[0];

      // Check if the event with the given EventID exists
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      res.status(200).json(event);
    } catch (error) {
      console.error('Error fetching event:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      sql.close();
    }
  } else {
    res.status(400).json({ error: 'Bad Request' });
  }
};

export default handler;

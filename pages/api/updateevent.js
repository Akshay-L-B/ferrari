import mysql from 'mysql2';
import dbConfig from '../../middleware/dbConfig';

const handler = async (req, res) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { EventID } = req.query;

  // Validate input
  if (!EventID) {
    return res.status(400).json({ error: "Missing 'EventID' parameter" });
  }

  const {
    EventName,
    EventHost,
    Description,
    EventDate,
    EventType,
    MaximumAttendance,
    CurrentRevenue,
    Location,
  } = req.body;

  if (!EventName || !EventHost || !Description || !EventDate || !Location) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const connection = mysql.createConnection(dbConfig);

  try {
    connection.connect();

    // Update the event in the database
    await connection
      .promise()
      .query(
        'UPDATE events SET EventName = ?, EventHost = ?, Description = ?, EventDate = ?, EventType = ?, MaximumAttendance = ?, CurrentRevenue = ?, Location = ? WHERE EventID = ?',
        [
          EventName,
          EventHost,
          Description,
          EventDate,
          EventType,
          MaximumAttendance,
          CurrentRevenue,
          Location,
          EventID,
        ]
      );
      const [updatedEventData] = await connection
      .promise()
      .query('SELECT * FROM events WHERE EventID = ?', [EventID]);

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      event: updatedEventData[0],
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    connection.end();
  }
};

export default handler;

import sql from 'mssql';
import bcrypt from 'bcrypt';
import dbConfig from '../../middleware/dbConfig';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, email, password } = req.body;

  // Validate input
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    await sql.connect(dbConfig);

    // Check if the email is already registered
    const checkEmailResult = await sql.query`SELECT * FROM admins WHERE email = ${email}`;
    if (checkEmailResult.recordset.length > 0) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new admin into the database
    await sql.query`INSERT INTO admins (name, email, password) VALUES (${name},${email}, ${hashedPassword})`;

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error('Error registering admin:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    sql.close();
  }
}

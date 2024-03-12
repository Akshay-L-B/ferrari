import sql from 'mssql';
import bcrypt from 'bcrypt';
import dbConfig from '../../middleware/dbConfig';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    await sql.connect(dbConfig);

    // Check if the admin with the given email exists
    const adminResult = await sql.query`SELECT * FROM admins WHERE email = ${email}`;
    const admin = adminResult.recordset[0];

    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if the provided password matches the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Admin login successful', admin: { email: admin.email } });
  } catch (error) {
    console.error('Error logging in admin:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    sql.close();
  }
}

import sql from 'mssql';
import bcrypt from 'bcrypt';
import dbConfig from '../../path-to-your-dbConfig/dbConfig';

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

    // Check if the user with the given email exists
    const userResult = await sql.query`SELECT * FROM users WHERE email = ${email}`;
    const user = userResult.recordset[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if the provided password matches the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'User login successful', user: { email: user.email, name: user.name } });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    sql.close();
  }
}

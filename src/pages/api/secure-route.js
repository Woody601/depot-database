import { auth } from '@./lib/firebaseConfig';
import { getAuth } from 'firebase-admin/auth';

export default async function handler(req, res) {
  const token = req.headers.authorization.split(' ')[1];

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    const userId = decodedToken.uid;

    // Secure logic here
    res.status(200).json({ message: 'Secure data' });
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized access' });
  }
}
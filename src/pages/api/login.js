// pages/api/login.js

export default function handler(req, res) {
    // Assuming you have validated the user credentials here
    const { email, password } = req.body;
  
    // For simplicity, let's assume the user is authenticated successfully
    // You should implement proper authentication logic here (e.g., using Firebase Auth)
    const isAuthenticated = true;
  
    if (isAuthenticated) {
      // Set cookie options
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        maxAge: 60 * 60 * 24 * 7, // 1 week expiry period
        path: '/', // Cookie is valid for all routes
      };
  
      // Set cookie
      res.setHeader('Set-Cookie', `yourCookieName=${encodeURIComponent('cookieValue')}; ${serialize(cookieOptions)}`);
  
      // Log successful login and cookie setting
      console.log('User logged in successfully');
      console.log('Cookie set:', `yourCookieName=${encodeURIComponent('cookieValue')}`);
  
      // Respond with success
      res.status(200).json({ message: 'Logged in successfully' });
    } else {
      res.status(401).json({ error: 'Authentication failed' });
    }
  }
  
  // Helper function to serialize cookie options
  function serialize(cookieOptions) {
    const cookieStr = Object.entries(cookieOptions).map(([key, value]) => `${key}=${value}`).join('; ');
    return cookieStr;
  }
  
// middleware/authMiddleware.js
const supabase = require('../config/supabase');

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No security token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // This tells Supabase: "Verify this token and tell me who this is"
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.error("Supabase Auth Error:", error?.message || "User not found");
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Attach the user ID to the request object so our controllers can use it
    req.user = user;
    next();
  } catch (error) {
    console.error("Critical Auth Middleware Error:", error);
    return res.status(500).json({ error: 'Authentication server error' });
  }
};

module.exports = authenticateUser;

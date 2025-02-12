//JWT
const jwt = require("jsonwebtoken");
const secret = "Smit$797999$";

// JWT
// create a token
function setUser(user) {
  const token = jwt.sign(
    { _id: user._id, email: user.email, role: user.role },
    secret
  );
  return token;
}

// JWT
function getUser(token) {
  console.log("TOKEN: ", token); // Debugging
  if (!token) return null;

  try {
    return jwt.verify(token, secret);
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return null; // Handle invalid token gracefully
  }
}

module.exports = {
  setUser,
  getUser,
};

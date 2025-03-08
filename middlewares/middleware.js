const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  /**
   * We don't need to query db for jwt verification. This is one of the main advantage of JWT.
   */

  const authHeader = req.get("authorization");
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    console.log(user);
    next();
  });
};

const authenticateTokenV2 = (req, res, next) => {
  // Cookie based auth
  const token = req.cookies.accessToken;
  if (!token) {
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    console.log(user);
    next();
  });
};

module.exports = {
  authenticateToken,
  authenticateTokenV2,
};

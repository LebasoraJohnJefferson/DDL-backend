jwt = require("jsonwebtoken");

exports.generateAuthToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: `${process.env.EXPIRE_TOKEN}`,
  });
};

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.credentials = user;
    next();
  });
};

exports.forgetpasswordToken = (user) => {
  return jwt.sign(user, process.env.RESETPASSWORD_TOKEN_SECRET, {
    expiresIn: `${process.env.EXPIRE_TOKEN}`,
  });
};

exports.resetToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.RESETPASSWORD_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.credentials = user;
    next();
  });
};
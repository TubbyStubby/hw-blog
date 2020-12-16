const jwt = require('jsonwebtoken');

authenticate = (req, res, next) => {
  req.userData = null;

  function clearTokenAndNext() {
    res.clearCookie('authToken');
    next();
  }

  const token = req.cookies.authToken;

  if(!token) return clearTokenAndNext();

  jwt.verify(token, process.env.HWBLOG_JWT_KEY || "1234", (err, decodedToken) => {
    if(err) return clearTokenAndNext();
    
    req.userData = decodedToken;
    next();
  });
};

module.exports = authenticate;
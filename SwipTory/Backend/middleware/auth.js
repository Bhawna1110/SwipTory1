
const jwt = require('jsonwebtoken');

exports.authentication = async (request, res, next) => {

  res.setHeader("Cache-Control", "no-cache");

  if (request.headers?.authorization?.replace('Bearer ', '')) {
    try {
      let jwtGetDetail = await jwt.verify(
        request.headers.authorization.replace('Bearer ', ''),
        process.env.JWT_TOKEN_SECRET,
        { algorithm: process.env.JWT_TOKEN_ALGO }
      );

      if (jwtGetDetail) {
        request.userId = jwtGetDetail.userId;
        next();
      } else {
        return res.status(401).json({ status: 401, message: "Invalided Token" });
      }
    } catch (error) {
      console.log("TCL: exports.authenticationApi -> error", error);
      return res.status(401).json({ status: 401, message: error });
    }
  } else {
    return res.status(401).json({ status: 401, message: "Authentication token required" });
  }

};

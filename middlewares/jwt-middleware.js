import jwt from "jsonwebtoken";

async function verifyToken(req, res, next) {
  const { id } = req.params;

  if (!id) {
    res.status(401).send("You are not authenticated! (ID)");
    throw Error("No user ID was provided.");
  }

  const { accessToken: sentJwtToken } = req.cookies;

  if (!sentJwtToken) {
    return res.status(401).send("You are not authenticated! (JwtToken)");
  }

  jwt.verify(sentJwtToken, process.env.JWT_KEY, async (error, payload) => {
    if (error) {
      res.status(403).send("Token is not valid!");
      throw Error(error.message);
    }

    req.userAuth = {
      id: payload.id,
      isSeller: payload.isSeller
    };
  });

  next();
}

export { verifyToken };

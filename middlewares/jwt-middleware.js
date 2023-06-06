import jwt from "jsonwebtoken";

async function verifyToken(req, res, next) {
  try {
    console.log("verifyToken");
    const { id } = req.params;

    if (!id) {
      res.status(401);
      throw Error("No user ID was provided.");
    }

    const { accessToken: sentJwtToken } = req.cookies;

    if (!sentJwtToken) {
      res.status(401);
      throw Error("You are not authenticated! (jsonwebtoken is missing).");
    }

    jwt.verify(sentJwtToken, process.env.JWT_KEY, async (error, payload) => {
      if (error) {
        res.status(403);
        throw Error("Token is not valid!");
      }

      req.userAuth = {
        id: payload.id,
        isSeller: payload.isSeller
      };
    });

    next();
  } catch (error) {
    next(error);
  }
}

export { verifyToken };

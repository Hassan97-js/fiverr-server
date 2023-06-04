import jwt from "jsonwebtoken";

async function verifyToken(req, res, next) {
  try {
    const { id } = req.params;

    if (!id) {
      throw {
        message: "No user ID was provided.",
        statusCode: 401
      };
    }

    const { accessToken: sentJwtToken } = req.cookies;

    if (!sentJwtToken) {
      throw {
        message: "You are not authenticated! (jsonwebtoken is missing)",
        statusCode: 401
      };
    }

    jwt.verify(sentJwtToken, process.env.JWT_KEY, async (error, payload) => {
      if (error) {
        throw {
          message: "Token is not valid!",
          statusCode: 403
        };
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

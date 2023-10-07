export const verifyGigIDValidity = (req, res, next) => {
  try {
    const paramsGigId = req.params?.id;

    if (!paramsGigId) {
      res.status(VALIDATION_ERROR);
      throw Error("No Gig ID was provided.");
    }

    if (paramsGigId.length > 24) {
      res.status(FORBIDDEN);
      throw Error(
        "Gig ID must be 12 bytes or a string of 24 hex characters or an integer"
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};



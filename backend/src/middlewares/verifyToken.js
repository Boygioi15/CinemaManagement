import jwt from "jsonwebtoken";
import Users from "../user/user.schema.js";
import expressAsyncHandler from "express-async-handler";
const validateToken = expressAsyncHandler(async function (req, res, next) {
  let authHeader = req?.headers?.authorization;
  if (!authHeader) {
    throw new Error("There is no token inside request!");
  }
  if (authHeader.startsWith("Bearer")) {
    const token = authHeader.split(" ")[1];
    //console.log(token)
    try {
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      const user = await Users.findById(decoded?.id);
      req.user = user;
      next();
    } catch (error) {
      throw new Error(error);
    }
  } else {
    throw new Error("There is no token inside request!");
  }
});
const checkIsAdmin = expressAsyncHandler(async function (req, res, next) {
  const user = req.user;
  if (user.role === "admin") {
    next();
  } else {
    throw new Error("You are not permitted!");
  }
});
export { validateToken, checkIsAdmin };

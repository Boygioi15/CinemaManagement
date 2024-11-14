//not found
export function notFound(req, res, next) {
  console.log("Not found runned");
  const error = new Error(`Path not found : ${req.orginalUrl}`);
  res.status(404);
  next(error);
}
export function handleError(error, req, res, next) {
  const statusCode = res.statusCode == 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: error?.message,
    stack: error?.stack,
  });
}

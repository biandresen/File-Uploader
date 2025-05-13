import { fileLimitInMb } from "./uploadMiddleware.js";

const devErrors = (res, err) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stackTrace: err.stack,
    error: err,
  });
};

const prodErrors = (res, err) => {
  if (err?.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: ["Something went wrong! Please try again later."],
    });
  }
};

export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  err.message = Array.isArray(err.message) ? err.message : [err.message];

  if (process.env.NODE_ENV === "development") {
    devErrors(res, err);
  } else if (process.env.NODE_ENV === "production") {
    // Different error types
    if (err.message[0] === "File too large") {
      err.isOperational = true;
      err.statusCode = 413;
      err.status = "fail";
      err.message = `File too large. Cannot exceed ${fileLimitInMb.toString()}mb.`;
    }

    prodErrors(res, err);
  }
};

// app.use((err, req, res, next) => {
//   if (err.type === "entity.too.large") {
//     return res.status(413).json({ error: "Payload too large. Max size is 1MB." });
//   }

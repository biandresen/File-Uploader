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
  console.log("ERROR HANDLER");
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  err.message = Array.isArray(err.message) ? err.message : [err.message];

  if (process.env.NODE_ENV === "development") {
    devErrors(res, err);
  } else if (process.env.NODE_ENV === "production") {
    // Different error types
    // if (err.name === "CastError") err = castErrorHandler(err);

    prodErrors(res, err);
  }
};

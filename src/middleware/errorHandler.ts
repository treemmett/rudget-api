import { ErrorRequestHandler } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (): ErrorRequestHandler => (err, req, res, next) => {
  const error = err.error || 'internal_error';
  const message = err.message || 'Something went wrong. Please try again.';

  res.status(err.statusCode || 500);

  if (process.env.NODE_ENV === 'development' && err.stack) {
    // eslint-disable-next-line no-console
    console.log(err.stack);

    res.send({
      error,
      message,
      stack: err.stack
    });

    return;
  }

  res.send({
    error,
    message
  });
};

export default errorHandler;

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.message,
    });
  }

  // Database errors
  if (err.code === '23505') {
    return res.status(409).json({
      error: 'Duplicate entry',
      details: 'This record already exists',
    });
  }

  if (err.code === '23503') {
    return res.status(400).json({
      error: 'Foreign key constraint violation',
      details: 'Referenced record does not exist',
    });
  }

  // Default error
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({ error: 'Route not found' });
};


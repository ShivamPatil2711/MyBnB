exports.error404 = (req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'This endpoint does not exist',
    path: req.originalUrl,
    isLoggedIn: req.isLoggedIn || false
  });
};

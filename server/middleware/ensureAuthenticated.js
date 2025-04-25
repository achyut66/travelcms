export const ensureAuthenticated = (req, res, next) => {
    // console.log('SESSION:', req.session);
    if (req.session && req.session.user) {
      return next();
    } else {
      return res.status(401).json({ message: 'Please log in first' });
    }
  };
  
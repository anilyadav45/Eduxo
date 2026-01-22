export const requireSameCollege = (req, res, next) => {
  if (!req.collegeId) return next(); // SUPER_ADMIN

  const targetCollege =
    req.body.college ||
    req.params.collegeId ||
    req.query.collegeId;

  if (targetCollege && targetCollege !== req.collegeId.toString()) {
    return res.status(403).json({ message: "Cross-college access denied" });
  }

  next();
};

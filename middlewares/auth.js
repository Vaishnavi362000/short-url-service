const { getUser } = require("../service/auth");

function checkForAuthentication(req, res, next) {
  const tokenCookie = req.cookies?.token;
  req.user = null;

  if (!tokenCookie) return next();

  const token = tokenCookie;
  const user = getUser(token);
  
  req.user = user;
  return next();
}

function restrictToLoggedInUserOnly(roles = []) {
  return function (req, res, next) {
    if (!req.user) return res.redirect("/login");
    if (!roles.includes(req.user.role)) return res.end("Unauthorized");
    return next();
  };
}

function redirectAdminToAdminUrls(req, res, next) {
  if (req.user.role === 'ADMIN') {
    return res.redirect("/admin/urls");
  }
  next();
}

module.exports = {
  checkForAuthentication,
  restrictToLoggedInUserOnly,
  redirectAdminToAdminUrls,
};
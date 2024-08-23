const express = require("express");
const { restrictToLoggedInUserOnly, redirectAdminToAdminUrls } = require("../middlewares/auth");

const URL = require("../models/url");
const router = express.Router();

router.get("/admin/urls", restrictToLoggedInUserOnly(['ADMIN']), async(req, res) => {
  const allUrls = await URL.find({});
  return res.render("home", {
    urls: allUrls,
    isAdmin: true
  }); 
}); 

router.get("/", redirectAdminToAdminUrls, restrictToLoggedInUserOnly(['NORMAL', 'ADMIN']), async(req, res) => {
  const allUrls = await URL.find({ createdBy: req.user._id });
  return res.render("home", {
    urls: allUrls,
    isAdmin: false
  }); 
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.get("/login", (req, res) => {
  return res.render("login");
});

module.exports = router; 
const User = require("../models/user");
const { setUser } = require("../service/auth");
const { v4: uuidv4 } = require('uuid');

async function handleUserSignup(req, res) {
  const { name, email, role, password } = req.body;
  await User.create({ name, email, role, password });
  return res.redirect("/");
}

async function handleUserLogin(req, res) {
  const {email, password } = req.body;
  const user = await User.findOne({ email, password });

  if (!user) {
    return res.render("login", {
      error: "Invalid username or password",
    });
  }
 

  const token = setUser(user);
  res.cookie("token", token);
  return res.redirect("/");
  //return res.json({token});
}

module.exports = {
  handleUserSignup,
  handleUserLogin,
};
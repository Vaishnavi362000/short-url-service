const express = require('express');
const { connectMongoDB } = require('./connect');
const { checkForAuthentication, restrictToLoggedInUserOnly } = require('./middlewares/auth');
const path = require('path');
const cookieParser = require('cookie-parser');

//Routes
const urlRoute = require('./routes/url');
const staticRoute = require('./routes/staticRouter');
const userRoute = require('./routes/user');

//Models
const URL = require('./models/url');
const app = express();
const PORT = 8001;

//Coonect to MongoDB
connectMongoDB("mongodb+srv://vaishuk38:2m8Px0AjTEtKADux@cluster0.6cswm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(() => console.log("Connected to MongoDB")).catch((err) => {
  console.error("MongoDB connection error:", err);
  process.exit(1); // Exit the process with an error code
});

//Setting up view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./view"));

//Middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthentication);

//Routes
app.use("/url", restrictToLoggedInUserOnly(['NORMAL','ADMIN']), urlRoute); 
app.use("/", staticRoute);
app.use("/user", userRoute);

//Redirecting to the original URL
app.get('/url/:shortId', async(req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate({
    shortId
  }, {
      $push: {
      visitHistory: {
        timestamp: Date.now(),
    },
  },
});
res.redirect(entry.redirectURL);
})
app.listen(PORT, () => console.log(`Server started on port: ${PORT}`)); 

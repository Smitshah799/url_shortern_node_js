const express = require("express");

const path = require("path");
const cookieParser = require("cookie-parser");
const { connectToMongoDB } = require("./connection");
const { checkForAuthentication, restrictTo } = require("./middlewares/auth");
const URL = require("./models/url");

const urlRouter = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");

const app = express();
const PORT = 8001;

// Config
connectToMongoDB("mongodb://localhost:27017/short-url")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error: " + err));

// Config Server engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthentication);

// Routes
app.use("/url", restrictTo(["NORMAL", "ADMIN"]), urlRouter);
app.use("/user", userRoute);
app.use("/", staticRoute);

// Update -> URL visitHistory TimeStamp,
// Visit RedirectURL
app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    { shortId },
    { $push: { visitHistory: { timestamp: Date.now() } } }
  );
  if (!entry) {
    return res.status(404).send("Short URL not found");
  }
  return res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server Started at Port: ${PORT}`));

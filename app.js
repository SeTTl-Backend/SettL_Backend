const express = require("express");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");

const connectToDb = require("./db/mongodb");
const CONFIG = require("./config/config");
const logger = require("./logging/logger");
const routes = require("./routes");

const app = express();

// Connect to Mongodb Database
connectToDb();

//Add Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Only trust the X-Forwarded-For header from your reverse proxy
app.set("trust proxy", "loopback");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
// Apply the rate limiting middleware to all requests
app.use(limiter);

//security middleware
app.use(helmet());

//allow origins
const allowedOrigins = [
  "http://localhost:5000",
  "https://localhost:5000",
  "http://localhost:3000",
  "https://localhost:3000",
  "http://accessify.netlify.app",
  "https://accessify.netlify.app",
  "*",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(routes);

app.get("/", (req, res) => {
  res.send("Hello SettL");
});

//Error handler middleware
app.use((err, req, res, next) => {
  // logger.error(err.message)
  console.log(err);
  const errorStatus = err.status || 500;
  res.status(errorStatus).send(err.message);
  next();
});

app.listen(CONFIG.PORT, () => {
  logger.info(`Server started on http://localhost:${CONFIG.PORT}`);
});

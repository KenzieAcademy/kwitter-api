require("dotenv-safe").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const auth = require("./auth");
const controllers = require("./controllers");
const swaggerDocsRouter = require("./swaggerDocsRouter");
const errorHandlerMiddleware = require("./errorHandlerMiddleware");

// Setup
const app = express();
app
  .set("port", process.env.PORT || 3000)
  .use(
    cors(),
    morgan("tiny"),
    express.json(),
    auth.middleware,
    controllers.middleware,
    swaggerDocsRouter,
    errorHandlerMiddleware
  );

// Startup
(async () => {
  try {
    await controllers.startup();
    app.listen(app.get("port"), () =>
      console.log(`API server now running on port ${app.get("port")}`)
    );
  } catch (err) {
    console.error(err.stack);
    process.exit(1);
  }
})();

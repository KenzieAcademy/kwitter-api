const express = require("express");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const openapiSpec = YAML.load("./specification.yaml");

const swaggerDocsRouter = express.Router();

swaggerDocsRouter
  .use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec))
  // Redirect to docs
  .get("/", (req, res) => {
    res.redirect("/docs");
  })
  .get("/specification.json", (req, res) => {
    res.send(openapiSpec);
  });
module.exports = swaggerDocsRouter;

// Imports
const express = require("express");
// parse request body as JSON
const bodyParser = require("body-parser");
// request logging
const morgan = require("morgan");

const controllers = require("./controllers");

const app = express();

// Settings
app.set("port", process.env.PORT || 3000);

// Middleware
const formats = {
    "development": "dev",
    "production": "common",
    "test": "tiny"
};
app.use(morgan(formats[process.env.NODE_ENV || "development"]));
app.use(bodyParser.json());
app.use("/users", controllers.users);



if (require.main === module) {
    app.listen(app.get("port"), () => 
        console.log(`API server now running on port ${app.get("port")}`)
    );
}

module.exports = app;

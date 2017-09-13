// Imports
const express = require("express");
const controllers = require("./controllers");

console.log(process.env.NODE_ENV);


const app = express();

// grab port number from environment variable
app.set("port", process.env.PORT || 3000);
// map paths to controllers
app.use("/users", controllers.users);



if (require.main === module) {
    app.listen(app.get("port"), () => 
        console.log(`API server now running on port ${app.get("port")}`)
    );
}

module.exports = app;

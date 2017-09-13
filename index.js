const express = require("express");
const app = express();

if (require.main === "module") {
    app.listen(app.get("port"), () => 
        console.log(`API server now running on port ${port}`);
    });
}

module.exports = app;

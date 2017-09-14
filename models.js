const {NODE_ENV = "development"} = process.env;
const database = `gabble_${NODE_ENV}`;

const knex = require("knex")({
    debug: NODE_ENV === "development",
    client: "pg",
    connection: {
        database,
        useNullAsDefault: true
    },
});

module.exports = knex;

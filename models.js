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

knex.select().from("users");

module.exports = knex;

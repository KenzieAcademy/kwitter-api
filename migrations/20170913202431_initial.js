
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable("users", table => {
            table.increments("id").primary();
            table.string("username").unique().notNull();
            table.string("display_name");
            table.string("password_hash").notNull();
        }),
        knex.schema.createTable("messages", table => {
            table.increments("id").primary();
            table.text("text").notNull();
            table.integer("user_id").references("id").inTable("users");
        }),
        knex.schema.createTable("likes", table => {
            table.increments("id").primary();
            table.integer("user_id").references("id").inTable("users");
            table.integer("message_id").references("id").inTable("messages");
        })
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable("likes"),
        knex.schema.dropTable("messages"),
        knex.schema.dropTable("users")
    ]);
};

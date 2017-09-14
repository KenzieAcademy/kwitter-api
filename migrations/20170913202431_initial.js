
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable("users", table => {
            table.increments("id").primary();
            table.string("username").unique().notNull();
            table.string("displayName");
            table.string("passwordHash").notNull();
        }),
        knex.schema.createTable("messages", table => {
            table.increments("id").primary();
            table.text("text").notNull();
            table.integer("userId").references("id").inTable("users");
        }),
        knex.schema.createTable("likes", table => {
            table.increments("id").primary();
            table.integer("userId").references("id").inTable("users");
            table.integer("messageId").references("id").inTable("messages");
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

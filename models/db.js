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

const bookshelf = require("bookshelf")(knex);

const User = bookshelf.Model.extend({
    tableName: "users",
    messages: function() {
        return this.hasMany(Message);
    }
});

const Message = bookshelf.Model.extend({
    tableName: "messages",
    likes: function() {
        return this.hasMany(Like);
    },
    user: function() {
        return this.belongsTo(User);
    }
});

const Like = bookshelf.Model.extend({
    tableName: "likes",
    user: function() {
        return this.belongsTo(User);
    }
});



module.exports = {
    bookshelf,
    User,
    Message,
    Like
};


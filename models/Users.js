const bcrypt = require("bcrypt");

const {bookshelf} = require("./db");
const {knex} = bookshelf;

const create = ({ username, display_name, password }) => {
    return bcrypt.hash(password, 8)
        .then(password_hash => knex("users").insert({
            username,
            display_name,
            password_hash
        }));
}

const authenticate = credentials => {
    knex("users")
        .where({ username })
        .then(results => {
            const [user] = results;
            console.log(user);
            if (!user) {
                //FIXME: Proper error message
                return { success: false };
            } else {
                const success = bcrypt.compareSync(password, user.password_hash);
                if (success) {
                    const payload = { id: user.id };
                    const token = jwt.sign(payload, jwtOptions.secretOrKey);
                    return { token, success: true };
                } else {
                    //FIXME: Proper error message
                    return { success: false };
                }
            }
        });
};


module.exports = { create, authenticate };

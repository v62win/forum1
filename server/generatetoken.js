const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    const JWT_SECRET = "blyat";

    return jwt.sign({ id },JWT_SECRET,{
        expiresIn : "100d",

    });
};

module.exports = generateToken;
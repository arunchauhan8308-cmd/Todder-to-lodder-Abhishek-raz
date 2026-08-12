const bcrypt = require('bcrypt');
const e = require('express');

exports.generateHashPassword = async (plainPassword) => {
    try {
        const saltRounds = 10; 
        
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
        
        return hashedPassword;
    } catch (error) {
        throw new Error("Password hashing failed: " + error.message);
    }
};


exports.comparePassword = async (plainPassword, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
        return isMatch;
        
    } catch (error) {
        throw new Error("Password comparison failed: " + error.message);
    }
};
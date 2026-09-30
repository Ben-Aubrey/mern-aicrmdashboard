import jwt from "jsonwebtoken";

export const generateToken = (userID) => 
    jwt.sign({ id: userID }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

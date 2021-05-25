"use strict";

const {addUser} = require("./dao/usersDao");

const UserMapper = require('./models/userMapper.js');

exports.lambdaHandler = async (event, context) => {
    const body = JSON.parse(event.body)

    const user = {
        nick: body.nick,
        email: body.email
    };

    try {
        const savedUser = await addUser(user)
        return {
            'statusCode': 200,
            'body': JSON.stringify(savedUser)
        }
    } catch (error) {
        console.log(error);
        return {
            'statusCode': 400,
        }
    }
};
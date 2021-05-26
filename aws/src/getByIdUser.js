"use strict";

const {getUserById} = require("./dao/usersDao");

const UserMapper = require('./models/userMapper.js');
const uuid = require('uuid');

const INVALID_USER_ID_RESPONSE = {"error": "Invalid user id"};
const USER_NOT_FOUND_RESPONSE = {"error": "User not found"}

exports.lambdaHandler = async (event, context) => {
    const id = event.pathParameters.id;

    if (!uuid.validate(id))
        return {
            'statusCode': 400,
            'body': JSON.stringify(INVALID_USER_ID_RESPONSE)
        }

    const user = await getUserById(id)
    if (!user)
        return {
            'statusCode': 404,
            'body': JSON.stringify(USER_NOT_FOUND_RESPONSE)
        }

    return {
        'statusCode': 200,
        'body': JSON.stringify((UserMapper.toResponse(user)))
    }
};

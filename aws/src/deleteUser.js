"use strict";

const uuid = require("uuid");

const usersDao = require("./dao/usersDao");
const booksDao = require("./dao/booksDao");

const INVALID_USER_ID_RESPONSE = {"error": "Invalid user id"};
const USER_CAN_NOT_BE_DELETED_RESPONSE = {"error": "User has associated comments"}

exports.lambdaHandler = async (event, context) => {
    const id = event.pathParameters.id;

    if (!uuid.validate(id))
        return {
            'statusCode': 400,
            'body': JSON.stringify(INVALID_USER_ID_RESPONSE)
        }

    const comments = await booksDao.getUserComments(id);
    if (comments)
        return {
            'statusCode': 400,
            'body': JSON.stringify(USER_CAN_NOT_BE_DELETED_RESPONSE)
        }

    try {
        const deletedUser = await usersDao.deleteUser(id);
        return {
            'statusCode': 200,
            'body': JSON.stringify(deletedUser)
        }
    } catch (error) {
        console.log(error);
        return {
            'statusCode': 400,
        }
    }
};
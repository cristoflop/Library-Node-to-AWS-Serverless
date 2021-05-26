"use strict";

const {updateUser, getUserById} = require("./dao/usersDao");

const INVALID_USER_ID_RESPONSE = {"error": "Invalid user id"};
const USER_NOT_FOUND_RESPONSE = {"error": "User not found"}

exports.lambdaHandler = async (event, context) => {
    const id = event.pathParameters.id;
    const body = JSON.parse(event.body)

    const data = {
        userid: id,
        email: body.email
    };

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

    try {
        const updatedUser = await updateUser(data)
        return {
            'statusCode': 200,
            'body': JSON.stringify(updatedUser)
        }
    } catch (error) {
        console.log(error);
        return {
            'statusCode': 400,
        }
    }
};
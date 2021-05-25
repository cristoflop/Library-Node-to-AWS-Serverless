const {getAllUsers} = require("./dao/usersDao");

const User = require('./models/userMapper.js');

exports.lambdaHandler = async (event, context) => {
    const allUsers = await getAllUsers();
    return {
        'statusCode': 200,
        'body': JSON.stringify(User.toResponse(allUsers))
    }
};

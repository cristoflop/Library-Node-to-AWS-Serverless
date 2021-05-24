const uuid = require('uuid');
const AWS = require('aws-sdk');

AWS.config.update({
    endpoint: `https://dynamodb.${process.env.AWS_REGION}.amazonaws.com`,
    region: process.env.AWS_REGION
});

const docClient = new AWS.DynamoDB.DocumentClient();
const table = 'users';

// This is a DB simulation. Data should be managed with a real database inside functions.

const getUserById = async (id) => {
    const params = {
        Key: {
            "userid": id
        },
        TableName: table
    };

    return await docClient.scan(params).promise();
};

const getUsersById = async (ids) => {
    const params = {
        TableName: table,
        FilterExpression : `userid IN (${ids.join(",")})`,
    };

    return await docClient.scan(params).promise();
};


module.exports = {
    getUserById,
    getUsersById,
};
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
        FilterExpression: "userid = :id",
        ExpressionAttributeValues: {
            ":id": id
        },
        TableName: table,
    };

    const response = await docClient.scan(params).promise();
    return response.Count > 0 ? response.Items[0] : null;
};

const getUserByName = async (name) => {
    const params = {
        FilterExpression: "#na = :n",
        ExpressionAttributeNames: {
            "#na": 'name'
        },
        ExpressionAttributeValues: {
            ":n": name
        },
        TableName: table,
    };

    const response = await docClient.scan(params).promise();
    return response.Count > 0 ? response.Items[0] : null;
}

const getUsersById = async (ids) => {

    if (ids.length === 0) return [];

    const values = ids.map((id, idx) => {
        const ph = "id" + idx
        const result = {}
        result[ph] = id
        return result
    });

    const params = {
        TableName: table,
        FilterExpression: `userid IN (:${Object.keys(values).join(",:")})`,
        ExpressionAttributeValues: values
    };

    const response = await docClient.scan(params).promise();
    return response.Items;
};


module.exports = {
    getUserById,
    getUsersById,
    getUserByName,
};
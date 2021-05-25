const uuid = require('uuid');
const AWS = require('aws-sdk');

AWS.config.update({
    endpoint: `https://dynamodb.${process.env.AWS_REGION}.amazonaws.com`,
    region: process.env.AWS_REGION
});

const docClient = new AWS.DynamoDB.DocumentClient();
const table = 'books';

// This is a DB simulation. Data should be managed with a real database inside functions.

const getAllBooks = async () => {
    const params = {
        TableName: table
    };

    const response = await docClient.scan(params).promise();
    return response.Items
};

const getBookById = async (id) => {
    const params = {
        Key: {
            "bookid": id
        },
        FilterExpression: "bookid = :id",
        ExpressionAttributeValues: {
            ":id": id
        },
        TableName: table,
    };

    const response = await docClient.scan(params).promise();
    return response.Count > 0 ? response.Items[0] : null;
};

const addBook = async (data) => {
    const params = {
        TableName: table,
        Item: {
            "bookid": uuid.v1(),
            "title": data.title,
            "summary": data.summary,
            "author": data.author,
            "publisher": data.publisher,
            "publicationYear": data.publicationYear,
            "comments": []
        }
    };

    return await docClient.put(params).promise();
};

const getBookComments = async (bookid) => {
    const params = {
        Key: {
            "bookid": bookid
        },
        FilterExpression: "bookid = :id",
        ExpressionAttributeValues: {
            ":id": bookid
        },
        TableName: table,
    };

    const response = await docClient.scan(params).promise();
    return response.Count > 0 ? response.Items[0].comments : null;
}

const updateBookComments = async (data) => { // Esta funcion sirve para borrar o añadir comentarios a un libro
    const params = {
        TableName: table,
        Key: {
            "bookid": data.bookid
        },
        UpdateExpression: "set comments = :c",
        ExpressionAttributeValues: {
            ":c": data.comments
        },
        ReturnValues: "UPDATED_NEW" // Returns the item content after it was updated
    };

    return await docClient.update(params).promise();
}

const updateUser = (data) => {
    const params = {
        TableName: table,
        Key: {
            "userid": data.userid
        },
        UpdateExpression: "set #na = :n, email = :e, age = :a",
        ExpressionAttributeNames: { // Used when there are reserved words in DynamoDB, like name
            "#na": 'name'
        },
        ExpressionAttributeValues: {
            ":n": data.name,
            ":e": data.email,
            ":a": data.age
        },
        ReturnValues: "ALL_OLD" // Returns the item content before it was updated
    };

    return docClient.update(params).promise();
};

const deleteUser = (userid) => {
    const params = {
        TableName: table,
        Key: {
            "userid": userid
        },
        ConditionExpression: "userid = :userid",
        ExpressionAttributeValues: {
            ":userid": userid
        },
        ReturnValues: "ALL_OLD" // Returns the item content before it was deleted
    };

    return docClient.delete(params).promise();
};

module.exports = {
    getAllBooks,
    addBook,
    getBookById,
    getBookComments,
    updateBookComments
};
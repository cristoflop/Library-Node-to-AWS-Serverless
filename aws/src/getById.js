const {getBookById} = require("./booksDao");
const {getUsersById} = require("./usersDao");

const {toResponse: toResponseBook} = require('./models/book.js');
const uuid = require('uuid');

const INVALID_BOOK_ID_RESPONSE = {"error": "Invalid book id"};
const BOOK_NOT_FOUND_RESPONSE = {"error": "Book not found"}

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
exports.lambdaHandler = async (event, context) => {
    const id = event.pathParameters.id;

    if (!uuid.validate(id))
        return {
            'statusCode': 400,
            'body': JSON.stringify(INVALID_BOOK_ID_RESPONSE)
        }

    const book = await getBookById(id)
    if (!book)
        return {
            'statusCode': 404,
            'body': JSON.stringify(BOOK_NOT_FOUND_RESPONSE)
        }

    const userIds = book.comments.map(comment => comment.userId)
    const users = await getUsersById(userIds)
    const usersMap = Object.fromEntries(
        users.map(e => [e.userid, e])
    )

    book.comments = book.comments.map(comment => ({
        comment: comment.comment,
        score: comment.score,
        userid: usersMap[comment.userid]
    }))

    return {
        'statusCode': 200,
        'body': JSON.stringify(toResponseBook(book))
    }
};

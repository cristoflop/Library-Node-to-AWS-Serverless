const {Book, toResponse: toResponseBook} = require('./models/book.js');
const mongoose = require('mongoose');
const toResponseComment = require('./models/comment.js').toResponse;

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
exports.getAllBooks = async (event, context) => {
    const id = event.pathParameters.id;

    const commentId = event.queryStringParameters.commentId;

    if (!mongoose.Types.ObjectId.isValid(id)) return {
        'statusCode': 400,
        'body': JSON.stringify(INVALID_BOOK_ID_RESPONSE)
    }
    if (!mongoose.Types.ObjectId.isValid(commentId)) return {
        'statusCode': 400,
        'body': JSON.stringify({"error": "Invalid comment id"})
    }

    const book = await Book.findById(id).populate('comments.user');
    if (!book) return {
        'statusCode': 404,
        'body': JSON.stringify(BOOK_NOT_FOUND_RESPONSE)
    }

    const comment = await book.comments.id(commentId);
    if (!comment) return {
        'statusCode': 404,
        'body': JSON.stringify({"error": "Comment not found"})
    }

    comment.remove();
    await book.save();
    return {
        'statusCode': 404,
        'body': JSON.stringify(toResponseComment(comment))
    }
};
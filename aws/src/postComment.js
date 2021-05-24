const {Book, toResponse: toResponseBook} = require('./models/book.js');
const mongoose = require('mongoose');
const User = require('./models/user.js').User;
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
exports.lambdaHandler = async (event, context) => {
    const id = event.pathParameters.id;
    const body = JSON.parse(event.body)

    if (!mongoose.Types.ObjectId.isValid(id)) return {
        'statusCode': 400,
        'body': JSON.stringify(INVALID_BOOK_ID_RESPONSE)
    }

    if (!body.userNick) return {
        'statusCode': 400,
        'body': JSON.stringify({ "error": "User nick is mandatory" })
    }

    const book = await Book.findById(id);
    if (!book) return {
        'statusCode': 404,
        'body': JSON.stringify(BOOK_NOT_FOUND_RESPONSE)
    }
    const user = await User.findOne({ nick: body.userNick })

    if (!user) return {
        'statusCode': 404,
        'body': JSON.stringify({"error": "User not found"})
    }

    book.comments.push({
        comment: event.comment,
        score: event.score,
        user: user._id
    });

    try {
        const savedBook = await book.save()
        await savedBook.populate(['comments', savedBook.comments.length - 1, 'user'].join('.')).execPopulate();
        const comment = savedBook.comments[savedBook.comments.length - 1];
        return {
            'statusCode': 404,
            'body' : toResponseComment(comment)
        }
    }
    catch (error) {
        console.log(error);
        return {
            'statusCode': 400,
            'body' : error
        }
    }
};
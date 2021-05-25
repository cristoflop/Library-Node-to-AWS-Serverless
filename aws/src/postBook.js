const {addBook} = require("./dao/booksDao");


const { Book, toResponse: toResponseBook } = require('./models/bookMapper.js');

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
    const body = JSON.parse(event.body)

    const book = {
        title: body.title,
        summary: body.summary,
        author: body.author,
        publisher: body.publisher,
        publicationYear: body.publicationYear,
    };

    try {
        const savedBook = await addBook(book)
        return {
            'statusCode': 200,
            'body': JSON.stringify(toResponseBook(savedBook))
        }
    }
    catch(error) {
        console.log(error);
        return {
            'statusCode': 400,
        }
    }
};
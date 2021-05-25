const {getAllBooks} = require("./dao/booksDao");

const Book = require('./models/bookMapper.js');

exports.lambdaHandler = async (event, context) => {
    const allBooks = await getAllBooks();
    return {
        'statusCode': 200,
        'body': JSON.stringify(Book.toResponse(allBooks))
    }
};

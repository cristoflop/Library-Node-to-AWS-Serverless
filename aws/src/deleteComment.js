"use strict";

const uuid = require("uuid");

const booksDao = require("./dao/booksDao");

const INVALID_BOOK_ID_RESPONSE = {"error": "Invalid book id"};
const INVALID_COMMENT_ID_RESPONSE = {"error": "Invalid comment id"};
const BOOK_NOT_FOUND_RESPONSE = {"error": "Book not found"};

exports.lambdaHandler = async (event, context) => {
    const bookid = event.pathParameters.bookid;
    const commentid = event.pathParameters.commentid;

    if (!uuid.validate(bookid))
        return {
            'statusCode': 400,
            'body': JSON.stringify(INVALID_BOOK_ID_RESPONSE)
        }

    if (!uuid.validate(commentid))
        return {
            'statusCode': 400,
            'body': JSON.stringify(INVALID_COMMENT_ID_RESPONSE)
        }

    const bookComments = await booksDao.getBookComments(id);
    if (!bookComments)
        return {
            'statusCode': 404,
            'body': JSON.stringify(BOOK_NOT_FOUND_RESPONSE)
        }

    try {
        const updatedComments = await booksDao.updateBookComments({
            bookid: bookid,
            comments: bookComments.filter(comment => comment.commentid !== commentid)
        })
        return {
            'statusCode': 200,
            'body': JSON.stringify(updatedComments)
        }
    } catch (error) {
        console.log(error);
        return {
            'statusCode': 400,
        }
    }
};
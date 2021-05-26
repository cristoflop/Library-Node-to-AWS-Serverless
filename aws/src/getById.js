"use strict";

const {getBookById} = require("./dao/booksDao");
const {getUsersById} = require("./dao/usersDao");

const BookMapper = require('./models/bookMapper.js');
const uuid = require('uuid');

const INVALID_BOOK_ID_RESPONSE = {"error": "Invalid book id"};
const BOOK_NOT_FOUND_RESPONSE = {"error": "Book not found"}

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

    const userIds = book.comments.map(comment => comment.userid)

    const users = await getUsersById(userIds)
    const usersMap = Object.fromEntries(
        users.map(e => [e.userid, e])
    )

    book.comments = book.comments.map(comment => ({
        commentid: comment.commentid,
        comment: comment.comment,
        score: comment.score,
        userid: usersMap[comment.userid]
    }))

    return {
        'statusCode': 200,
        'body': JSON.stringify((BookMapper.toResponse(book)))
    }
};

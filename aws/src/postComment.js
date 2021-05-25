"use strict";

const uuid = require("uuid");

const booksDao = require("./dao/booksDao");
const userDao = require("./dao/usersDao");

const INVALID_BOOK_ID_RESPONSE = {"error": "Invalid book id"};
const BOOK_NOT_FOUND_RESPONSE = {"error": "Book not found"};
const USER_NOT_FOUND_RESPONSE = {"error": "User not found"};

exports.lambdaHandler = async (event, context) => {
    const id = event.pathParameters.id;
    const body = JSON.parse(event.body);

    const comment = {
        comment: body.comment,
        score: body.score,
        author: body.author
    };

    if (!uuid.validate(id))
        return {
            'statusCode': 400,
            'body': JSON.stringify(INVALID_BOOK_ID_RESPONSE)
        }

    const bookComments = await booksDao.getBookComments(id);
    if (!bookComments)
        return {
            'statusCode': 404,
            'body': JSON.stringify(BOOK_NOT_FOUND_RESPONSE)
        }

    const user = await userDao.getUserByName(comment.author);
    if (!user) return {
        'statusCode': 400,
        'body': JSON.stringify(USER_NOT_FOUND_RESPONSE)
    }

    bookComments.push({
        commentid: uuid.v1(),
        commet: comment.comment,
        score: comment.score,
        userid: user.userid,
    });

    try {
        const updatedComments = await booksDao.updateBookComments({
            bookid: id,
            comments: bookComments
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
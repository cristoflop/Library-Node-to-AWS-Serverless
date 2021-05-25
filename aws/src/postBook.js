"use strict";

const {addBook} = require("./dao/booksDao");

const BookMapper = require('./models/bookMapper.js');

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
            'body': JSON.stringify(savedBook)
        }
    } catch (error) {
        console.log(error);
        return {
            'statusCode': 400,
        }
    }
};
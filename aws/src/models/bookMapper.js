"use strict";

function all(document) {
    return document.map(elem => {
        return {
            id: elem.bookid,
            title: elem.title
        }
    })
}

function one(document) {
    return document;
}

function toResponse(document) {
    if (document instanceof Array) {
        return all(document);
    } else {
        return one(document);
    }
}

module.exports = {
    toResponse
}

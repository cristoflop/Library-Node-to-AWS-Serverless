"use strict";

const isValidEmail = function (email) {
    let mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    return typeof email == 'string' && email !== "" && mailformat.test(email);
}

function all(document) {
    return document.map(elem => toResponse(elem));
}

function one(document) {
    return document
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

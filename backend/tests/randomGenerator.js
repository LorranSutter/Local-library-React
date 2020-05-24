const moment = require('moment');

exports.randomString = (size) => {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < size; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

exports.randomNumber = (size) => {
    let number = "";
    const possible = "0123456789";

    for (let i = 0; i < size; i++)
        number += possible.charAt(Math.floor(Math.random() * possible.length));

    return number;
}

exports.changeId = (id) => {
    const last = id.slice(id.length - 1);
    const possible = "0123456789".replace(last, '');

    return id.slice(0, id.length - 1) + possible.charAt(Math.floor(Math.random() * possible.length));

}

exports.randomDate = (start = new Date(2020, 0, 1), end = new Date()) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

exports.generateGenre = () => {
    return { name: this.randomString(10) }
}

exports.generateAuthor = () => {
    return {
        first_name: this.randomString(10),
        family_name: this.randomString(15),
        date_of_birth: moment(this.randomDate(new Date(1950, 0, 1), new Date(1960, 0, 1))).format("YYYY-MM-DD"),
        date_of_death: moment(this.randomDate()).format("YYYY-MM-DD")
    }
}

exports.generateBook = (authorId, genreIds) => {
    return {
        title: this.randomString(10),
        author: authorId,
        summary: this.randomString(20),
        isbn: this.randomNumber(13),
        genre: genreIds
    }
}
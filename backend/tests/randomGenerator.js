exports.randomString = (size) => {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < size; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

exports.changeId = (id) => {
    const last = id.slice(id.length - 1);
    const possible = "0123456789".replace(last, '');

    return id.slice(0, id.length - 1) + possible.charAt(Math.floor(Math.random() * possible.length));

}
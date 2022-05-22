class HttpError extends Error {
    constructor(message, errorCode) {
        super(message); /// adaug message la clasa ( error e deja o clasa si de asta folosesc super)
        this.code= errorCode; //adaug error code la clasa

    }
}


module.exports = HttpError;
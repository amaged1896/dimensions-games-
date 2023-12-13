import { AppError } from './appError.js';

const handleErrDBCast = (err) => {
    const message = `invalid${err.path} ${err.value}`;
    return new AppError(message, 400);
};
const handleDuplicateFelidDB = (err) => {
    const value = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
    console.log(value);
    const message = `this ${value} is reserved use another value`;
    return new AppError(message, 400);
};

const handleJwt = (err) => {
    const message = `invalid login, please login again, ${err.name}`;
    return new AppError(message, 401);
};
const handleJwtExpiration = () => {
    const message = `login is expired ,please log again`;
    return new AppError(message, 401);
};

const handleValidationDB = (err) => {
    const error = Object.values(err.errors).map((el) => el.message);
    const message = error.join(' ,');
    return new AppError(message, 400);
};

const sendErrProduction = (err, res) => {
    console.log(err);
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.message,
            message: err.message,
        });
    } else {
        //log the error
        console.log('error', err.message);
        // send a dummy res to the client
        res.status(500).json({
            status: 'error',
            message: 'something went wrong',
        });
    }
};
const sendErrDevelopment = (err, res) => {

    res.status(err.statusCode).json({
        status: err.status,
        name: err.name,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

export const errorController = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500; //internal server error
    err.status = err.status || 'fail';
    //
    // console.log(process.env.NODE_ENV);
    if (process.env.NODE_ENV == 'development') {
        return sendErrDevelopment(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        // eslint-disable-next-line node/no-unsupported-features/es-syntax
        // let error = { ...err, };
        console.log(process.env.NODE_ENV);
        console.log(err);
        if (err.name === 'CastError') err = handleErrDBCast(err); //for requesting wrong id
        if (err.code === 11000) err = handleDuplicateFelidDB(err); // post the same name of tour
        if (err.name === 'ValidationError') err = handleValidationDB(err); //validation err
        if (err.name === 'JsonWebTokenError') err = handleJwt(err); //validation err
        if (err.name === 'TokenExpiredError') err = handleJwtExpiration(); // err expiration time for the token
        sendErrProduction(err, res);
    }
};
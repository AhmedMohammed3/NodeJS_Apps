const Option = require('../models/option.model');
const { handleError, throwError } = require('../helpers/error.helper');
const { validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');

exports.getOptions = (req, res, next) => {
    console.log('getOptions');
    Option.find()
        .then(options => {
            if (!options) {
                throwError('Can\'t find any options', StatusCodes.NOT_FOUND);
            }
            res.status(StatusCodes.ACCEPTED).json({
                message: 'Fetched options successfully',
                options: options
            });
        })
        .catch(err => handleError(err, next));
}

exports.postOption = (req, res, next) => {
    console.log('postOption');
    const optionText = req.body.optionText;
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     throwError('Option Already Exists', StatusCodes.UNPROCESSABLE_ENTITY);
    // }
    Option.findOne({ text: optionText })
        .then(fetchedOption => {
            if (fetchedOption) {
                throwError('Option Already Exists', StatusCodes.UNPROCESSABLE_ENTITY);
            }
            const newOption = new Option({
                text: optionText
            })
            return newOption.save();
        })
        .then(createdOption => {
            if (!createdOption) {
                throwError('Can\'t create option', StatusCodes.INTERNAL_SERVER_ERROR);
            }
            res.status(StatusCodes.CREATED).json({
                message: 'Created option successfully',
                createdOption: createdOption
            })
        })
        .catch(err => handleError(err, next))
}

exports.deleteOption = (req, res, next) => {
    console.log('deleteOption');
    const optionId = req.params.optionId
    Option.findByIdAndRemove(optionId)
        .then(deletedOption => {
            if (!deletedOption) {
                throwError('Can\'t delete option', StatusCodes.INTERNAL_SERVER_ERROR);
            }
            res.status(StatusCodes.OK).json({
                message: 'deleted option successfully',
                deletedOption: deletedOption
            })
        })
        .catch(err => handleError(err, next));
}
const { check, validationResult } = require('express-validator');

const validateUser = [
    check('email').isEmail().withMessage('Enter a valid email address'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

const validateLocation = [
    check('location.lat').isFloat({ min: -90, max: 90 }).withMessage('Enter a valid latitude'),
    check('location.lon').isFloat({ min: -180, max: 180 }).withMessage('Enter a valid longitude'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

const validateDate = [
    check('date').isISO8601().withMessage('Enter a valid date in ISO 8601 format'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

module.exports = { validateUser, validateLocation, validateDate };

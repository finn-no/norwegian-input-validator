"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

function validateWithPattern(pattern) {
    return function (value) {
        return pattern.test(value.trim());
    };
}

var Validator = (function () {
    function Validator() {
        var rules = arguments[0] === undefined ? [] : arguments[0];
        var options = arguments[1] === undefined ? {} : arguments[1];
        _classCallCheck(this, Validator);

        this._rules = rules;
        this._options = options;
    }

    _prototypeProperties(Validator, null, {
        validate: {
            value: function validate(value) {
                this._valid = true;

                if (this._options.required && value.trim() === "") {
                    this._valid = false;
                    this._errorMessage = this._options.requiredCustomErrorMessage || "Må fylles ut";
                } else if (value.trim() !== "") {
                    var failedRules = this._rules.filter(function (rule) {
                        return !rule.isValid(value);
                    });

                    if (failedRules.length > 0) {
                        this._valid = false;
                        this._errorMessage = failedRules[0].errorMessage;
                    }
                }
                return this;
            },
            writable: true,
            configurable: true
        },
        isValid: {
            value: function isValid() {
                if (typeof this._valid === "undefined") {
                    throw new Error("Not validated");
                }
                return this._valid;
            },
            writable: true,
            configurable: true
        },
        isRequired: {
            value: function isRequired() {
                return this._options.required ? true : false;
            },
            writable: true,
            configurable: true
        },
        getErrorMessage: {
            value: function getErrorMessage() {
                return this._errorMessage;
            },
            writable: true,
            configurable: true
        },
        required: {
            value: function required(customErrorMessage) {
                return new Validator(this._rules, { required: true, requiredCustomErrorMessage: customErrorMessage });
            },
            writable: true,
            configurable: true
        },
        phoneNumber: {
            value: function phoneNumber(customErrorMessage) {
                return this._newValidator({
                    isValid: validateWithPattern(/^(?:(?:(?:00)|\+)\s*(?:\d\s*){2})?(?:\d\s*){8}$|^0\d{4}$/),
                    errorMessage: customErrorMessage || "Ugyldig telefonnummer"
                });
            },
            writable: true,
            configurable: true
        },
        emailAddress: {
            value: function emailAddress(customErrorMessage) {
                return this._newValidator({
                    isValid: validateWithPattern(/^[a-zA-Z0-9._%&\-][a-zA-Z0-9._%&+\-]*@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,6}$/),
                    errorMessage: customErrorMessage || "Ugyldig e-postadresse"
                });
            },
            writable: true,
            configurable: true
        },
        maxLength: {
            value: function maxLength(max, customErrorMessage) {
                return this._newValidator({
                    isValid: function isValid(value) {
                        return value.trim().length <= max;
                    },
                    errorMessage: customErrorMessage || "Teksten er for lang"
                });
            },
            writable: true,
            configurable: true
        },
        postalNumber: {
            value: function postalNumber(customErrorMessage) {
                return this._newValidator({
                    isValid: validateWithPattern(/^[0-9]{4}$/),
                    errorMessage: customErrorMessage || "Ugyldig postnummer"
                });
            },
            writable: true,
            configurable: true
        },
        number: {
            value: function number(customErrorMessage) {
                return this._newValidator({
                    isValid: validateWithPattern(/^[0-9]*$/),
                    errorMessage: customErrorMessage || "Må være tall"
                });
            },
            writable: true,
            configurable: true
        },
        url: {
            value: function url(customErrorMessage) {
                return this._newValidator({
                    isValid: validateWithPattern(/^[^ ]+\.[^ ]+$/),
                    errorMessage: customErrorMessage || "Ugyldig url"
                });
            },
            writable: true,
            configurable: true
        },
        atLeastTwoWords: {
            value: function atLeastTwoWords(customErrorMessage) {
                return this._newValidator({
                    isValid: validateWithPattern(/[a-zA-ZæøåÆØÅ]{3,}.*\s[a-zA-ZæøåÆØÅ]{3,}/m),
                    errorMessage: customErrorMessage || "Må inneholde minst 2 ord"
                });
            },
            writable: true,
            configurable: true
        },
        atLeastThreeWords: {
            value: function atLeastThreeWords(customErrorMessage) {
                return this._newValidator({
                    isValid: validateWithPattern(/[a-zA-ZæøåÆØÅ]{3,}.*\s[a-zA-ZæøåÆØÅ]{3,}.*\s[a-zA-ZæøåÆØÅ]{3,}/m),
                    errorMessage: customErrorMessage || "Må inneholde minst 3 ord"
                });
            },
            writable: true,
            configurable: true
        },
        orgNumber: {
            value: function orgNumber(customErrorMessage) {
                return this._newValidator({
                    isValid: validateWithPattern(/^[89][0-9]{2}\s?[0-9]{3}\s?[0-9]{3}$/),
                    errorMessage: customErrorMessage || "Ugyldig organisasjonsnummer"
                });
            },
            writable: true,
            configurable: true
        },
        pattern: {
            value: function pattern(regexp, customErrorMessage) {
                return this._newValidator({
                    isValid: function isValid(value) {
                        return regexp.test(value.trim());
                    },
                    errorMessage: customErrorMessage
                });
            },
            writable: true,
            configurable: true
        },
        _newValidator: {
            value: function _newValidator(rule) {
                return new Validator(this._rules.concat([rule]), this._options);
            },
            writable: true,
            configurable: true
        }
    });

    return Validator;
})();

module.exports = Validator;

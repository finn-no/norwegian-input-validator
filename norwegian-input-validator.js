"use strict";

function validateWithPattern(pattern) {
    return function (value) {
        return pattern.test(value.trim());
    };
}

function isEmptyString(value) {
    return typeof value === "string" && value.trim() === "";
}

function isEmptyNumber(value) {
    return typeof value === "number" && value.trim() === "";
}

function getErrorMessageViaFn(customErrorMessage, value) {
    return typeof customErrorMessage === "function" ? customErrorMessage(value) : customErrorMessage;
}

class Validator {
    constructor(validations = [], options = {}) {
        this._validations = validations;
        this._options = options;
    }

    validate(value) {
        this._valid = true;

        if (this._options.required && (value === null || isEmptyString(value) || isEmptyNumber(value))) {
            this._valid = false;
            this._errorMessage = getErrorMessageViaFn(this._options.requiredCustomErrorMessage, value) || "Må fylles ut";
            return this;
        } else if (!isEmptyString(value) && !isEmptyNumber(value)) {
            const failedValidations = this._validations.filter(validation => !validation.isValid(value));

            if (failedValidations.length > 0) {
                this._valid = false;
                this._errorMessage = getErrorMessageViaFn(failedValidations[0].errorMessage, value);
            }
        }

        return this;
    }

    isValid() {
        if (typeof this._valid === "undefined") {
            throw new Error("Not validated");
        }
        return this._valid;
    }

    isRequired() {
        return this._options.required ? true : false;
    }

    getErrorMessage() {
        return this._errorMessage;
    }

    required(customErrorMessage) {
        return new Validator(this._validations, {required: true, requiredCustomErrorMessage: customErrorMessage});
    }

    phoneNumber(customErrorMessage) {
        return this._newValidator({
            isValid: validateWithPattern(/^(?:(?:(?:00)|\+)\s*(?:\d\s*){2})?(?:\d\s*){8}$|^0\d{4}$/),
            errorMessage: customErrorMessage || "Ugyldig telefonnummer"
        });
    }

    emailAddress(customErrorMessage) {
        return this._newValidator({
            isValid: validateWithPattern(/^[a-zA-Z0-9._%&\-][a-zA-Z0-9._%&+\-]*@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,6}$/),
            errorMessage: customErrorMessage || "Ugyldig e-postadresse"
        });
    }

    maxLength(max, customErrorMessage) {
        return this._newValidator({
            isValid(value) {
                return value.trim().length <= max;
            },
            errorMessage: customErrorMessage || "Teksten er for lang"
        });
    }

    postalNumber(customErrorMessage) {
        return this._newValidator({
            isValid: validateWithPattern(/^[0-9]{4}$/),
            errorMessage: customErrorMessage || "Ugyldig postnummer"
        });
    }

    number(customErrorMessage) {
        return this._newValidator({
            isValid: validateWithPattern(/^[0-9]*$/),
            errorMessage: customErrorMessage || "Må være tall"
        });
    }

    boolean(customErrorMessage) {
        return this._newValidator({
            isValid: (value) => {
                return typeof value === "boolean";
            },
            errorMessage: customErrorMessage || "Må være tall"
        });
    }


    url(customErrorMessage) {
        return this._newValidator({
            isValid: validateWithPattern(/^[^ ]+\.[^ ]+$/),
            errorMessage: customErrorMessage || "Ugyldig url"
        });
    }

    atLeastTwoWords(customErrorMessage) {
        return this._newValidator({
            isValid: validateWithPattern(/[a-zA-ZæøåÆØÅ]{3,}.*\s[a-zA-ZæøåÆØÅ]{3,}/m),
            errorMessage: customErrorMessage || "Må inneholde minst 2 ord"
        });
    }

    atLeastThreeWords(customErrorMessage) {
        return this._newValidator({
            isValid: validateWithPattern(/[a-zA-ZæøåÆØÅ]{3,}.*\s[a-zA-ZæøåÆØÅ]{3,}.*\s[a-zA-ZæøåÆØÅ]{3,}/m),
            errorMessage: customErrorMessage || "Må inneholde minst 3 ord"
        });
    }

    orgNumber(customErrorMessage) {
        return this._newValidator({
            isValid: validateWithPattern(/^[89][0-9]{2}\s?[0-9]{3}\s?[0-9]{3}$/),
            errorMessage: customErrorMessage || "Ugyldig organisasjonsnummer"
        });
    }

    pattern(regexp, customErrorMessage) {
        return this._newValidator({
            isValid(value) {
                return regexp.test(value.trim());
            },
            errorMessage: customErrorMessage
        });
    }

    allow(someValue, customErrorMessage) {
        return this._newValidator({
            isValid(value) {
                return someValue === value;
            },
            errorMessage: customErrorMessage || "Ugyldig verdi"
        });
    }

    _newValidator(rule) {
        return new Validator(this._validations.concat([rule]), this._options);
    }
}

module.exports = Validator;
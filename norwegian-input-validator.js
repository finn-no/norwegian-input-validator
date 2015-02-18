"use strict";

function validateWithPattern(pattern) {
    return function (value) {
        return pattern.test(value.trim());
    };
}

class Validator {
    constructor(rules = [], options = {}) {
        this._rules = rules;
        this._options = options;
    }

    validate(value) {
        this._valid = true;

        if (this._options.required && value.trim() === "") {
            this._valid = false;
            this._errorMessage = this._options.requiredCustomErrorMessage || "Må fylles ut";
        } else if (value.trim() !== "") {
            const failedRules = this._rules.filter(rule => !rule.isValid(value));

            if (failedRules.length > 0) {
                this._valid = false;
                this._errorMessage = failedRules[0].errorMessage;
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
        return new Validator(this._rules, {required: true, requiredCustomErrorMessage: customErrorMessage});
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

    _newValidator(rule) {
        return new Validator(this._rules.concat([rule]), this._options);
    }
}

module.exports = Validator;
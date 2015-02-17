"use strict";

const Validator = require("../src/norwegian-input-validator");
const expect = require("chai").expect;

describe("validation", function () {

    it("Should throw error when not being validated", () => {
        expect(() => {
            new Validator().phoneNumber().isValid();
        }).to.throw("Not validated");
    });

    describe("phoneNumber", () => {
        it("should pass for valid phone numbers", () => {
            expect(new Validator().phoneNumber().validate("12345678").isValid()).to.be.true;
            expect(new Validator().phoneNumber().validate("69 14 26 96").isValid()).to.be.true;
            expect(new Validator().phoneNumber().validate("6   9 14 26 9  6 ").isValid()).to.be.true;
            expect(new Validator().phoneNumber().validate("934 17 480").isValid()).to.be.true;
            expect(new Validator().phoneNumber().validate("0047 934 17 480").isValid()).to.be.true;
            expect(new Validator().phoneNumber().validate("+47 934 17 480").isValid()).to.be.true;
            expect(new Validator().phoneNumber().validate(" +47 934 17 480").isValid()).to.be.true;
            expect(new Validator().phoneNumber().validate("01234").isValid()).to.be.true;
        });

        it("should fail for invalid phone numbers", () => {
            expect(new Validator().phoneNumber().validate("6914269").isValid()).to.be.false;
            expect(new Validator().phoneNumber().validate("69-14-26-96").isValid()).to.be.false;
            expect(new Validator().phoneNumber().validate("691426963").isValid()).to.be.false;
            expect(new Validator().phoneNumber().validate("+0047 78978978").isValid()).to.be.false;
            expect(new Validator().phoneNumber().validate("12345").isValid()).to.be.false;
            expect(new Validator().phoneNumber().validate("12345").getErrorMessage()).to.be.equal("Ugyldig telefonnummer");
        });

        it("should use custom error message", () => {
            expect(new Validator().phoneNumber("custom message").validate("12345").getErrorMessage()).to.be.equal("custom message");
        });
    });

    describe("require", () => {
        it("should pass when something is provided", () => {
            expect(new Validator().required().validate("abc").isValid()).to.be.true;
            expect(new Validator().required().validate("a").isValid()).to.be.true;
            expect(new Validator().required().validate("123").isValid()).to.be.true;
            expect(new Validator().required().validate("-").isValid()).to.be.true;
        });

        it("should fail when nothing is provided", () => {
            expect(new Validator().required().validate("").isValid()).to.be.false;
            expect(new Validator().required().validate(" ").isValid()).to.be.false;
            expect(new Validator().required().validate("").getErrorMessage()).to.be.equal("Må fylles ut");
            expect(new Validator().required("custom error message").validate("").getErrorMessage()).to.be.equal("custom error message");
        });

        it("should fail and precede other rules when nothing is provided", () => {
            expect(new Validator().phoneNumber().required().validate("").isValid()).to.be.false;
            expect(new Validator().phoneNumber().required().validate("").getErrorMessage()).to.be.equal("Må fylles ut");
        });

        it("should pass when not required", () => {
            expect(new Validator().phoneNumber().validate("").isValid()).to.be.true;
        });

        it("should tell if it is required", () => {
            expect(new Validator().phoneNumber().required().isRequired()).to.be.true;
            expect(new Validator().phoneNumber().isRequired()).to.be.false;
        });
    });

    describe("number", () => {
        it("should pass legal number", () => {
            expect(new Validator().number().validate("1234").isValid()).to.be.true;
        });

        it("should fail numbers with chars", () => {
            expect(new Validator().number().validate("1234a").isValid()).to.be.false;
        });
    });

    describe("atleastTwoWords", () => {
        it("should pass with two words", () => {
            expect(new Validator().atLeastTwoWords().validate("one two").isValid()).to.be.true;
        });

        it("should require two words", () => {
            expect(new Validator().atLeastTwoWords().validate("one").isValid()).to.be.false;
        });
    });

    describe("atLeastThreeWords", () => {
        it("should pass with three words", () => {
            expect(new Validator().atLeastThreeWords().validate("one two three").isValid()).to.be.true;
        });

        it("should require three words", () => {
            expect(new Validator().atLeastThreeWords().validate("one two").isValid()).to.be.false;
        });
    });

    describe("orgNumber", () => {
        it("should pass with correct organization number", () => {
            expect(new Validator().orgNumber().validate("980872041").isValid()).to.be.true;
        });

        it("should fail on invalid organization number", () => {
            expect(new Validator().orgNumber().validate("123456789").isValid()).to.be.false;
            expect(new Validator().orgNumber().validate("123456789").getErrorMessage()).to.be.equal("Ugyldig organisasjonsnummer");
        });
    });

    describe("url", () => {
        it("should pass with correct url", () => {
            expect(new Validator().url().validate("http://finn.no").isValid()).to.be.true;
            expect(new Validator().url().validate("finn.no").isValid()).to.be.true;
        });

        it("should fail on invalid url", () => {
            expect(new Validator().url().validate("finnno").isValid()).to.be.false;
        });
    });

    describe("maxLength", () => {
        it("should pass max-length for valid values", () => {
            expect(new Validator().maxLength(3).validate("Ok!").isValid()).to.be.true;
        });

        it("should fail max-length for too long values", () => {
            expect(new Validator().maxLength(3).validate("Too long").isValid()).to.be.false;
        });
    });

    describe("postalNumber", () => {
        it("should pass for correct postal number", () => {
            expect(new Validator().postalNumber().validate("0877").isValid()).to.be.true;
        });

        it("should fail for invalid postal number", () => {
            expect(new Validator().postalNumber().validate("12345").isValid()).to.be.false;
        });
    });

    describe("emailAddress", () => {
        it("should pass for correct email address", () => {
            expect(new Validator().emailAddress().validate("name@internet.org").isValid()).to.be.true;
        });

        it("should fail for invalid email address", () => {
            expect(new Validator().emailAddress().validate("@internet.org").isValid()).to.be.false;
            expect(new Validator().emailAddress().validate("name@internet").isValid()).to.be.false;
            expect(new Validator().emailAddress().validate("name@").isValid()).to.be.false;
        });
    });

    describe("pattern", () => {
        it("should pass for correct pattern", () => {
            expect(new Validator().pattern(/\d+/).validate("123").isValid()).to.be.true;
        });

        it("should fail for invalid pattern", () => {
            expect(new Validator().pattern(/\d+/).validate("hello", "should be digit").isValid()).to.be.false;
            expect(new Validator().pattern(/\d+/, "should be digit").validate("hello").getErrorMessage()).to.be.equal("should be digit");
        });
    });
});

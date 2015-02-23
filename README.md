# norwegian-input-validator
Simple input validator that supports norwegian formats and error messages

## Install
```bash
npm install norwegian-input-validator --save
```
## Usage

```javascript
const Validator = require("norwegian-input-validator");
const numberValidator = new Validator().number().required();

numberValidator.validate("123").isValid() // => true
numberValidator.validate("abc").isValid() // => false
numberValidator.validate("abc").getErrorMessage() // => "Må være tall"

//required
numberValidator.validate("").getErrorMessage() // => "Må fylles ut"
```

## Custom error messages
```javascript
new Validator().required("My error message").validate("").getErrorMessage() // => "My error message"
```

## Validator methods
* Core
  * validate(value): validates and returns same validator
  * isValid(): true/false
  * isRequired(): true/false
  * getErrorMessage(): error message
* Validator rules
  * required(customErrorMessage): new Validator
  * phoneNumber(customErrorMessage): new Validator
  * emailAddress(customErrorMessage): new Validator
  * maxLength(max, customErrorMessage): new Validator
  * postalNumber(customErrorMessage): new Validator
  * number(customErrorMessage): new Validator
  * url(customErrorMessage): new Validator
  * atLeastTwoWords(customErrorMessage): new Validator
  * atLeastThreeWords(customErrorMessage): new Validator
  * orgNumber(customErrorMessage): new Validator
  * pattern(regexp, customErrorMessage): new Validator
  * allow(someValue, customErrorMessage): new Validator
const {
  angularPreprocessor,
} = require('@jscutlery/cypress-angular-preprocessor');

module.exports = (on, config) => {
  on('file:preprocessor', angularPreprocessor(config));
};

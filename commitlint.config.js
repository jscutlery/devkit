const { readdirSync } = require('fs');
const { join } = require('path');

const projects = readdirSync(join(__dirname, 'packages'));

module.exports = {
  extends: ['@commitlint/config-angular'],
  rules: {
    'scope-enum': [2, 'always', projects],
  },
};

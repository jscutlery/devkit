const { readFileSync } = require('fs');
const { normalize, resolve } = require('path');

const workspaceJson = JSON.parse(
  readFileSync(normalize(resolve(__dirname, 'workspace.json')))
);
const projects = Object.keys(workspaceJson.projects);

module.exports = {
  extends: ['@commitlint/config-angular'],
  rules: {
    'scope-enum': [2, 'always', projects],
  },
};

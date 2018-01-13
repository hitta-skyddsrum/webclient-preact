const HtmlReporter = require('nightwatch-html-reporter');

const reportsDirectory = process.cwd() + '/reports';
const reporter = new HtmlReporter({
  openBrowser: false,
  reportsDirectory,
  themeName: 'outlook',
});

module.exports = {
  reporter: reporter.fn,
  reportsDirectory,
};

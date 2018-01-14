const HtmlReporter = require('nightwatch-html-reporter');

const reportsDirectory = process.cwd() + '/reports';
const reporter = new HtmlReporter({
  openBrowser: false,
  reportsDirectory,
  themeName: 'outlook',
  reportFilename: 'index.html',
});

module.exports = {
  reporter: reporter.fn,
  reportsDirectory,
};

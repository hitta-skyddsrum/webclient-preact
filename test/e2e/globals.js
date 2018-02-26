const HtmlReporter = require('nightwatch-html-reporter');

const reportsDirectory = process.cwd() + '/reports';
const reporter = new HtmlReporter({
  openBrowser: false,
  reportsDirectory,
  themeName: 'outlook',
  reportFilename: 'index.html',
  uniqueFilename: true,
});

module.exports = {
  reporter: reporter.fn,
  reportsDirectory,
  beforeEach: (browser, done) => {
    const { windowSize } = browser.globals.test_settings;
    browser.resizeWindow(windowSize.width, windowSize.height, done);
  },
};

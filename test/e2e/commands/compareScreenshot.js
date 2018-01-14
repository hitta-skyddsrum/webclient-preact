// Based on https://gist.github.com/richard-flosi/8a5d2e10b6609ab9d06a

exports.command = function(filename, expected, callback) {
  const windowSize = this.options.desiredCapabilities.chromeOptions.args
    .filter(arg => arg.indexOf('window-size') !== -1)
    .map(arg => arg.replace('window-size=', ''))
    .map(size => size.replace(',', 'x'))
    .pop();

  const self = this,
    screenshotPath = this.globals.visual_regression.resultPath,
    resultPath = screenshotPath + '/results/' + filename.replace(/(\.[^.]+)$/, `-${windowSize}$1`);

  self.saveScreenshot(resultPath, (result, error) => {
    if (error) {
      console.error('compareScreenshot: Error while saving screenshot:', error);
    }

    self.assert.compareScreenshot(resultPath, expected, (result) => {
      if (typeof callback === 'function') {
        callback.call(self, result);
      }
    });
  });

  return this;
};

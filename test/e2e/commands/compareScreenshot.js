// Based on https://gist.github.com/richard-flosi/8a5d2e10b6609ab9d06a

exports.command = function(filename, expected, callback) {
  let self = this,
    screenshotPath = this.globals.visual_regression.resultPath,
    resultPath = screenshotPath + '/results/' + filename;

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

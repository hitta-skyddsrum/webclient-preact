// Based on https://gist.github.com/richard-flosi/8a5d2e10b6609ab9d06a

const resemble = require('resemble'),
  fs = require('fs'),
  path = require('path');

function ensureDirectoryExistence(filePath) {
  let dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

exports.assertion = function(resultPath, expected) {
  const outputPath = path.dirname(resultPath),
    filename = path.basename(resultPath),
    baselinePath = `${this.client.options.globals.visual_regression.baselinePath}/${filename}`,
    diffPath = outputPath + `diff-${filename}`;

  this.message = 'Unexpected compareScreenshot error.';
  this.expected = expected || 0;   // misMatchPercentage tolerance default 0%

  this.command = function(callback) {
    if (!fs.existsSync(baselinePath)) {
      console.log('WARNING: Baseline Photo does NOT exist.');
      console.log('Creating Baseline Photo from Result: ' + baselinePath);
      ensureDirectoryExistence(resultPath);
      fs.writeFileSync(baselinePath, fs.readFileSync(resultPath));
    }

    resemble
      .resemble(baselinePath)
      .compareTo(resultPath)
      .ignoreAntialiasing()
      .onComplete(callback);  // calls this.value with the result

    return this;
  };

  this.value = function(result) {
    let diff = new Buffer(result.getImageDataUrl().replace(/data:image\/png;base64,/,''), 'base64');
    fs.writeFileSync(diffPath, diff);

    return parseFloat(result.misMatchPercentage, 10);  // value this.pass is called with
  };

  this.pass = function(value) {
    let pass = value <= this.expected;
    if (pass) {
      this.message = 'Screenshots Matched for ' + filename +
                ' with a tolerance of ' + this.expected + '%.';
    } else {
      this.screenshots = [resultPath, diffPath].map(path => {
        const relativeReportsDir = this.globals.reportsDirectory.replace(`${process.cwd()}/`, '');

        return path.replace(`${relativeReportsDir}/`, '');
      });
      this.message = 'Screenshots Match Failed for ' + filename +
                ' with a tolerance of ' + this.expected + '%.\n' +
                '   Screenshots at:\n' +
                '    Baseline: ' + baselinePath + '\n' +
                '    Result: ' + resultPath + '\n' +
                '    Diff: ' + diffPath + '\n' +
                '   Open ' + diffPath + ' to see how the screenshot has changed.\n' +
                '   If the Result Screenshot is correct you can use it to update the Baseline Screenshot and re-run your test:\n' +
                '    cp ' + resultPath + ' ' + baselinePath;
    }
    return pass;
  };
};

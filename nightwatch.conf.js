const fs = require('fs');

const server_folder = 'node_modules/selenium-standalone/.selenium/selenium-server/';
const server_path = server_folder
  .concat(fs.readdirSync(server_folder)
    .find(file => file.indexOf('.jar') !== -1)
  );

module.exports = {
  "src_folders" : ["test/e2e"],
  "output_folder" : "reports",
  "custom_commands_path" : [
    "test/e2e/commands",
    "./node_modules/nightwatch-accessibility/commands",
  ],
  "custom_assertions_path" : [
    "test/e2e/assertions",
    "./node_modules/nightwatch-accessibility/assertions",
  ],
  "page_objects_path" : "",
  "globals_path" : "test/e2e/globals.js",

  "selenium" : {
    "start_process" : true,
    server_path,
    "log_path" : "",
    "port" : 4444,
    "cli_args" : {
      "webdriver.chrome.driver" : "",
      "webdriver.gecko.driver" : "./node_modules/.bin/geckodriver",
      "webdriver.edge.driver" : "",
    },
  },

  "test_settings" : {
    "default" : {
      "launch_url" : process.env.SITE_URL || "http://localhost:8080",
      "exclude": [
        "test/e2e/commands",
        "test/e2e/assertions",
        "test/e2e/globals.js",
      ],
      "selenium_port"  : 4444,
      "selenium_host"  : "localhost",
      "silent": true,
      "screenshots" : {
        "enabled" : true,
        "path" : "reports/errorshots",
      },
      "globals": {
        "visual_regression": {
          "baselinePath": "test/e2e/baseline",
          "resultPath": "reports/visual-regression",
        },
      },
    },

    "firefox": {
      "windowSize": {
        "width": 1024,
        "height": 627,
      },
      "desiredCapabilities": {
        "browserName": "firefox",
        "marionette": true,
        "moz:firefoxOptions": {
          "args": [
            "-headless",
          ],
        },
      },
    },

    "chrome" : {
      "windowSize": {
        "width": 1024,
        "height": 700,
      },
      "desiredCapabilities": {
        "browserName": "chrome",
        "chromeOptions": {
          "args" : [
            "--no-sandbox",
            "force-device-scale-factor=1",
            "user-dir=/tmp/foo",
            "disable-infobars",
            "hide-scrollbars",
            "headless",
          ],
        },
      },
    },

    "edge" : {
      "desiredCapabilities": {
        "browserName": "MicrosoftEdge",
      },
    },
  },
};

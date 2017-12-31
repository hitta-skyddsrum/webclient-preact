const fs = require('fs');

const server_folder = 'node_modules/selenium-standalone/.selenium/selenium-server/';
const server_path = server_folder
  .concat(fs.readdirSync(server_folder)
    .find(file => file.indexOf('.jar') !== -1)
  );

module.exports = {
  "src_folders" : ["test/e2e"],
  "output_folder" : "reports",
  "custom_commands_path" : "",
  "custom_assertions_path" : "",
  "page_objects_path" : "",
  "globals_path" : "",

  "selenium" : {
    "start_process" : true,
    server_path,
    "log_path" : "",
    "port" : 4444,
    "cli_args" : {
      "webdriver.chrome.driver" : "",
      "webdriver.gecko.driver" : "",
      "webdriver.edge.driver" : "",
    },
  },

  "test_settings" : {
    "default" : {
      "launch_url" : process.env.SITE_URL || "http://localhost:8080",
      "selenium_port"  : 4444,
      "selenium_host"  : "localhost",
      "silent": true,
      "screenshots" : {
        "enabled" : false,
        "path" : "",
      },
      "desiredCapabilities": {
        "browserName": "chrome",
        "marionette": true,
        "chromeOptions": {
          "args" : ["--no-sandbox"],
        },
      },
    },

    "chrome" : {
      "desiredCapabilities": {
        "browserName": "chrome",
      },
    },

    "edge" : {
      "desiredCapabilities": {
        "browserName": "MicrosoftEdge",
      },
    },
  },
};
module.exports = {
  'Home' (browser) {
    const windowSize = browser.options.desiredCapabilities.chromeOptions.args
      .filter(arg => arg.indexOf('window-size') !== -1)
      .map(arg => arg.replace('window-size=', ''))
      .map(size => size.replace(',', 'x'))
      .pop();

    browser
      .url(browser.launchUrl)
      .waitForElementVisible('body', 1000)
      .assert.title('Hitta skyddsrum')
      .waitForElementVisible('input[type=text]', 3000)
      .compareScreenshot(`home-step-1-${windowSize}.png`)
      .setValue('input[type=text]', 'Stockholmsvägen')
      .waitForElementVisible('ul li:first-child', 1000)
      .compareScreenshot(`home-step-2-${windowSize}.png`)
      .click('ul li:nth-child(2)')
      .waitForElementVisible('.leaflet-container', 1500)
      .compareScreenshot(`home-step-3-${windowSize}.png`)
      .assert.urlContains('lat=')
      .pause(1000)
      .end();
  },
};

module.exports = {
  'Home' (browser) {
    browser
      .url(browser.launchUrl)
      .waitForElementVisible('body', 1000)
      .assert.title('Hitta skyddsrum')
      .waitForElementVisible('input[type=text]', 3000)
      .compareScreenshot('home-step-1.png')
      .setValue('input[type=text]', 'Stockholmsvägen')
      .waitForElementVisible('ul li:first-child', 1000)
      .compareScreenshot('home-step-2.png')
      .click('ul li:nth-child(2)')
      .waitForElementVisible('.leaflet-container', 1500)
      .compareScreenshot('home-step-3.png')
      .assert.urlContains('lat=')
      .pause(1000)
      .end();
  },
};

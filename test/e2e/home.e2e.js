module.exports = {
  'Home' (browser) {
    browser
      .url(browser.launchUrl)
      .waitForElementVisible('body', 1000)
      .assert.title('Hitta skyddsrum')
      .waitForElementVisible('input[type=text]', 3000)
      .visualAreaShouldDisplay('an input field')
      .setValue('input[type=text]', 'Stockholmsvägen')
      .waitForElementVisible('.ap-suggestions .ap-suggestion', 1000)
      .visualAreaShouldDisplay('address suggestions')
      // Simulate a real user, to wait for async prefetch
      .pause(2000)
      .click('.ap-suggestions .ap-suggestion')
      .waitForElementVisible('.leaflet-container', 1500)
      .assert.urlContains('lat=')
      .end();
  },
};

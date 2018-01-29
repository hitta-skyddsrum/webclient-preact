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
      .click('.ap-suggestions .ap-suggestion')
      .visualAreaShouldDisplay('a spinning loader upon the map', 0.5)
      .waitForElementVisible('.leaflet-container', 1500)
      .assert.urlContains('lat=')
      .pause(1000)
      .end();
  },
};

module.exports = {
  'Home' (browser) {
    browser
      .url(browser.launchUrl)
      .waitForElementVisible('body', 1000)
      .assert.title('Hitta skyddsrum')
      .waitForElementVisible('input[type=text]', 3000)
      .visualAreaShouldDisplay('an input field')
      .setValue('input[type=text]', 'Stockholmsvägen')
      .waitForElementVisible('ul li:first-child', 1000)
      .visualAreaShouldDisplay('address suggestions')
      .click('ul li:nth-child(2)')
      .waitForElementVisible('.leaflet-container', 1500)
      .visualAreaShouldDisplay('a map')
      .assert.urlContains('lat=')
      .pause(1000)
      .end();
  },
};

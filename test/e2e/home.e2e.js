module.exports = {
  'Home' (browser) {
    browser
      .url(browser.launchUrl)
      .waitForElementVisible('body', 1000)
      .assert.title('Hitta skyddsrum')
      .setValue('input[type=text]', 'Stockholmsvägen')
      .waitForElementVisible('ul li:first-child', 1000)
      .click('ul li:nth-child(2)')
      .waitForElementVisible('.leaflet-container', 500)
      .assert.urlContains('lat=')
      .pause(1000)
      .end();
  },
};

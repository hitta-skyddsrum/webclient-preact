const arvikaSearchPath = '?lat=59.6537311&lon=12.5911133';

module.exports = {
  'Shelters: Basic page load and select a shelter' (browser) {
    browser
      .url(browser.launchUrl.concat(`/skyddsrum${arvikaSearchPath}`))
      .waitForElementVisible('body', 1000)
      .waitForElementVisible('.leaflet-marker-pane', 1000)
      .expect.element('.leaflet-marker-pane .youAreHere').to.be.present;

    browser
      .pause(500)
      .assert.title('Skyddsrum nära Järnvägsgatan, Arvika - Hitta skyddsrum')
      .waitForElementVisible('.leaflet-marker-pane img.shelter:nth-child(2)', 20000)
      .pause(1000)
      .visualAreaShouldDisplay('shelters near Arvika', 15)
      .expect.element('.leaflet-overlay-pane svg').to.not.be.present;

    browser
      .click('.leaflet-marker-pane img.shelter:nth-child(2)')
      .waitForElementVisible('.leaflet-overlay-pane svg', 2500)
      .waitForElementVisible('h1', 2000)
      .pause(100)
      .visualAreaShouldDisplay('details for a shelter', 10)
      .expect.element('h1').text.to.contain('Skyddsrum');

    browser
      .click('.close')
      .pause(1000)
      .visualAreaShouldDisplay('route to shelter without details', 15)
      .end();
  },
  'Shelters: Load shelter detail page with `I am here` search params' (browser) {
    browser
      .url(browser.launchUrl.concat(`/skyddsrum/144788-5${arvikaSearchPath}`))
      .waitForElementVisible('body', 1000)
      .pause(500)
      .assert.title('Skyddsrum 144788-5 - Hitta skyddsrum')
      .waitForElementVisible('.leaflet-marker-pane', 1000)
      .expect.element('.leaflet-marker-pane .youAreHere').to.be.present;

    browser.waitForElementVisible('.leaflet-marker-pane img.shelter:nth-child(2)', 20000);

    browser
      .waitForElementVisible('.leaflet-overlay-pane svg path', 1000);

    browser
      .waitForElementVisible('h1', 1000);

    browser
      .expect.element('h1').text.to.contain('Skyddsrum');

    browser
      .end();
  },
  'Shelters: Display a 404 upon shelter not found' (browser) {
    browser
      .url(browser.launchUrl.concat('/skyddsrum/11-not-found'))
      .waitForElementVisible('body', 1000)
      .pause(500)
      .waitForElementVisible('.error-dialog', 1000)
      .visualAreaShouldDisplay('error dialog')
      .click('.error-dialog button')
      .pause(500)
      .visualAreaShouldDisplay('map')
      .setValue('input[type=text]', 'Vikingstad')
      .waitForElementVisible('.ap-suggestions .ap-suggestion', 1000)
      .click('.ap-suggestions .ap-suggestion')
      .pause(1500)
      .visualAreaShouldDisplay('shelters on the map')
      .end();
  },
};

const arvikaSearchPath = '?lat=59.6537311&lon=12.5911133';

module.exports = {
  'Shelters: Basic page load and select a shelter' (browser) {
    browser
      .url(browser.launchUrl.concat(`/skyddsrum${arvikaSearchPath}`))
      .waitForElementVisible('body', 1000)
      .assert.title('Hitta skyddsrum')
      .waitForElementVisible('.leaflet-marker-pane', 1000)
      .expect.element('.leaflet-marker-pane .youAreHere').to.be.present;

    browser.waitForElementVisible('.leaflet-marker-pane img.shelter:nth-child(2)', 20000);

    browser
      .expect.element('.leaflet-overlay-pane svg').to.not.be.present;

    browser
      .click('.leaflet-marker-pane img.shelter:nth-child(2)')
      .waitForElementVisible('h1', 1500)
      .expect.element('h1').text.to.contain('Skyddsrum');

    browser
      .expect.element('.leaflet-overlay-pane svg').to.be.present;

    browser
      .end();
  },
  'Shelters: Load shelter detail page with `I am here` search params' (browser) {
    browser
      .url(browser.launchUrl.concat(`/skyddsrum/16114${arvikaSearchPath}`))
      .waitForElementVisible('body', 1000)
      .assert.title('Hitta skyddsrum')
      .waitForElementVisible('.leaflet-marker-pane', 1000)
      .expect.element('.leaflet-marker-pane .youAreHere').to.be.present;

    browser.waitForElementVisible('.leaflet-marker-pane img.shelter:nth-child(2)', 20000);

    browser
      .waitForElementVisible('.leaflet-overlay-pane svg path', 1000);

    browser
      .expect.element('h1').text.to.contain('Skyddsrum');

    browser
      .end();
  },
};

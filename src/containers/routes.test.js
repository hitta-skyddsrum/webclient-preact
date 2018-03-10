import { h } from 'preact';
import { expect } from 'chai';
import { shallow } from 'preact-render-spy';
import AsyncRoute from 'preact-async-route';

import Routes, { loadHome, loadShelters } from './routes';
import VadArEttSkyddsrum from '../components/vad-ar-ett-skyddsrum';
import OmTjansten from '../components/om-tjansten';
import Redirect from './redirect';
import Home from './home';
import Shelters from './shelters';
import NotFound from '../components/not-found';

describe('routes', () => {
  it('should route / to Home component', () => {
    expect(shallow(<Routes />).find(<AsyncRoute path='/' getComponent={loadHome} />).length).to.equal(1);

    return loadHome()
      .then(comp => expect(comp).to.equal(Home));
  });

  it('should route /vad-ar-ett-skyddsrum to VadArEttSkyddsrum componetn', () => {
    expect(shallow(<Routes />).find(<VadArEttSkyddsrum path='vad-ar-ett-skyddsrum' />).length)
      .to.equal(1);
  });

  it('should route /om-tjansten to OmTjansten component', () => {
    expect(shallow(<Routes />).find(<OmTjansten path='om-tjansten' />).length)
      .to.equal(1);
  });

  it('should redirect skyddsrum/koordinater/:lat/:lon to skyddsrum?lat=:lat&lon=:lon', () => {
    expect(shallow(<Routes />).find(<Redirect path='skyddsrum/koordinater/:lat/:lon' to='skyddsrum?lat=:lat&lon=:lon' />).length)
      .to.equal(1);
  });

  it('should route /skyddsrum to Shelters component', () => {
    expect(shallow(<Routes />).find(<AsyncRoute path='skyddsrum/:id?' getComponent={loadShelters} />).length).to.equal(1);

    return loadShelters()
      .then(comp => expect(comp).to.eql(Shelters));
  });

  it('should display NotFound as default', () => {
    expect(shallow(<Routes />).find(<NotFound default />).length).to.equal(1);
  });
});

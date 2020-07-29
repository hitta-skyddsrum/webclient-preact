import { h } from 'preact';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import AsyncRoute from 'preact-async-route';

import Routes, { loadHome, loadShelters } from './routes';
import VadArEttSkyddsrum from '../components/vad-ar-ett-skyddsrum';
import OmTjansten from '../components/om-tjansten';
import Redirect from './redirect';
import Home from '../components/home';
import Shelters from './shelters';
import NotFound from '../components/not-found';

describe('routes', () => {
  it('should route / to Home component', () => {
    expect(shallow(<Routes />).findWhere(n =>
      n.type() === AsyncRoute &&
      n.props().path === '/' &&
      n.props().getComponent === loadHome
    ).length).to.equal(1);

    return loadHome()
      .then(comp => expect(comp).to.equal(Home));
  });

  it('should route /vad-ar-ett-skyddsrum to VadArEttSkyddsrum componetn', () => {
    expect(shallow(<Routes />).findWhere(n =>
      n.type() === VadArEttSkyddsrum &&
      n.props().path === 'vad-ar-ett-skyddsrum'
    ).length)
      .to.equal(1);
  });

  it('should route /om-tjansten to OmTjansten component', () => {
    expect(shallow(<Routes />).findWhere(n =>
      n.type() === OmTjansten &&
      n.props().path === 'om-tjansten'
    ).length)
      .to.equal(1);
  });

  it('should redirect skyddsrum/koordinater/:lat/:lon to skyddsrum?lat=:lat&lon=:lon', () => {
    expect(shallow(<Routes />).findWhere(n =>
      n.type() === Redirect &&
      n.props().path === 'skyddsrum/koordinater/:lat/:lon' &&
      n.props().to === 'skyddsrum?lat=:lat&lon=:lon'
    ).length)
      .to.equal(1);
  });

  it('should route /skyddsrum to Shelters component', () => {
    expect(shallow(<Routes />).findWhere(n =>
      n.type() === AsyncRoute &&
      n.props().path === 'skyddsrum/:id?' &&
      n.props().getComponent === loadShelters
    ).length).to.equal(1);

    return loadShelters()
      .then(comp => expect(comp).to.eql(Shelters));
  });

  it('should display NotFound as default', () => {
    expect(shallow(<Routes />).findWhere(n =>
      n.type() === NotFound &&
      n.props().default === true
    ).length).to.equal(1);
  });
});

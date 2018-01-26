import { h } from 'preact';
import { expect } from 'chai';
import { shallow } from 'preact-render-spy';
import Helmet from 'preact-helmet';

jest.mock('material-ui/styles');

import App from './app';
import Home from '../components/home';
import Redirect from './redirect';
import Shelters from './shelters';

describe('App', () => {
  beforeAll(() => {
  });

  it('should provide a title template', () => {
    const titleTemplate = shallow(<App />)
      .find(<Helmet />).attr('titleTemplate');

    expect(titleTemplate).to.equal('%s - Hitta skyddsrum');
  });

  it('should provide a default title', () => {
    const defaultTitle = shallow(<App />)
      .find(<Helmet />).attr('defaultTitle');

    expect(defaultTitle).to.equal('Hitta skyddsrum');
  });

  it('should route / to Home component', () => {
    expect(shallow(<App />).find(<Home path='/' />).length).to.equal(1);
  });

  it('should redirect skyddsrum/koordinater/:lat/:lon to skyddsrum?lat=:lat&lon=:lon', () => {
    expect(shallow(<App />).find(<Redirect path='skyddsrum/koordinater/:lat/:lon' to='skyddsrum?lat=:lat&lon=:lon' />).length)
      .to.equal(1);
  });

  it('should route /skyddsrum to Shelters component', () => {
    expect(shallow(<App />).find(<Shelters path='skyddsrum/:id?' />).length).to.equal(1);
  });
});

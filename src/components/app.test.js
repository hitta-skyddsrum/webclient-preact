import { h } from 'preact';
import { expect } from 'chai';
import { shallow } from 'preact-render-spy';

import App from './app';
import Home from './home';
import Redirect from '../containers/redirect';
import Shelters from '../containers/shelters';

describe('App', () => {
  it('should route / to Home component', () => {
    expect(shallow(<App />).find(<Home path='/' />).length).to.equal(1);
  });

  it('should redirect skyddsrum/koordinater/:lat/:lon to skyddsrum?lat=:lat&lon=:lon', () => {
    expect(shallow(<App />).find(<Redirect path='skyddsrum/koordinater/:lat/:lon' to='skyddsrum?lat=:lat&lon=:lon' />).length)
      .to.equal(1);
  });

  it('should route /skyddsrum to Shelters component', () => {
    expect(shallow(<App />).find(<Shelters path='skyddsrum' />).length).to.equal(1);
  });
});

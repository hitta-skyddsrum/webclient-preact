import { h } from 'preact';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Helmet from 'preact-helmet';

import App from './app';
import Sidenav from '../components/sidenav';

describe('App', () => {
  beforeAll(() => {
    jest.mock('raven-js');
  });

  afterAll(() => {
    jest.unmock('raven-js');
  });

  it('should provide a title template', () => {
    const titleTemplate = shallow(<App />)
      .find(Helmet).prop('titleTemplate');

    expect(titleTemplate).to.equal('%s - Hitta skyddsrum');
  });

  it('should provide a default title', () => {
    const defaultTitle = shallow(<App />)
      .find(Helmet).prop('defaultTitle');

    expect(defaultTitle).to.equal('Hitta skyddsrum');
  });

  it('should display a Sidenav', () => {
    const context = shallow(<App />);

    expect(context.find(Sidenav).length).to.equal(1);
  });
});

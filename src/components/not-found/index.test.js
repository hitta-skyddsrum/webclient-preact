import { h } from 'preact';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Helmet from 'preact-helmet';
import NotFound from './.';

describe('components/NotFound', () => {
  it('should render a meta tag with noindex', () => {
    const context = shallow(<NotFound />);

    expect(context.find(Helmet).prop('meta')).to.deep.include({
      name: 'robots',
      content: 'noindex',
    });
  });

  it('should display a header', () => {
    const context = shallow(<NotFound />);
    expect(context.render().text()).to.contain('Sidan kunde inte hittas');
    expect(context.find(Helmet).prop('title')).to.contain('Sidan kunde inte hittas');
  });
});

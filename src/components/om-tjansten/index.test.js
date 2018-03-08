import { h } from 'preact';
import { shallow } from 'preact-render-spy';
import { expect } from 'chai';
import Helmet from 'preact-helmet';

import ContentWrapper from '../content-wrapper';
import OmTjansten from './';

describe('component/om-tjansten', () => {
  it('should display an accurate title', () => {
    const context = shallow(<OmTjansten />);

    expect(context.find(<Helmet />).attr('title')).to.equal('Om tjänsten');
  });

  it('should wrap the text within ContentWrapper', () => {
    expect(shallow(<OmTjansten />).find(<ContentWrapper />).length).to.equal(1);
  });
});

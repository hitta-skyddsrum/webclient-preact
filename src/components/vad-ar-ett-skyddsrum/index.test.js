import { h } from 'preact';
import { shallow } from 'preact-render-spy';
import { expect } from 'chai';
import Helmet from 'preact-helmet';
import ContentWrapper from '../content-wrapper';

import VadArEttSkyddsrum from './';

describe('components/vad-ar-ett-skyddsrum', () => {
  it('should have an accurate title', () => {
    const context = shallow(<VadArEttSkyddsrum />);

    expect(context.find(<Helmet />).attr('title')).to.equal('Vad är ett skyddsrum?');
  });

  it('should have text wrapped within ContentWrapper', () => {
    const context = shallow(<VadArEttSkyddsrum />);

    expect(context.find(<ContentWrapper />).length).to.equal(1);
  });
});

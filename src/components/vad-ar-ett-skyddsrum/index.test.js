import { h } from 'preact';
import { shallow } from 'preact-render-spy';
import { expect } from 'chai';
import ContentWrapper from '../content-wrapper';

import VadArEttSkyddsrum from './';

describe('components/vad-ar-ett-skyddsrum', () => {
  it('should have text wrapped within ContentWrapper', () => {
    const context = shallow(<VadArEttSkyddsrum />);

    expect(context.find(<ContentWrapper />).length).to.equal(1);
  });
});

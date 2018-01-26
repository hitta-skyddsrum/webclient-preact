import { h } from 'preact';
import { shallow } from 'preact-render-spy';
import { expect } from 'chai';

import ContentWrapper from '../content-wrapper';
import OmTjansten from './';

describe('component/om-tjansten', () => {
  it('should wrap the text within ContentWrapper', () => {
    expect(shallow(<OmTjansten />).find(<ContentWrapper />).length).to.equal(1);
  });
});

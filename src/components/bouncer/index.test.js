import { h } from 'preact';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import Bouncer from './';

describe('components/bouncer', () => {
  it('should display a div with three sub divs', () => {
    const elem = shallow(<Bouncer />);

    expect(elem.find('div').length).to.equal(4);
    expect(elem.find('div div').length).to.equal(3);
  });
});

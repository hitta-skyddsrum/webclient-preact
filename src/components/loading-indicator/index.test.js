import { h } from 'preact';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import CircularProgress from '../circular-progress';
import LoadingIndicator from './';

describe('components/loading-indicator', () => {
  it('should display a CircularProgress', () => {
    const wrapper = shallow(<LoadingIndicator />);

    expect(wrapper.find('div').find('div').find(CircularProgress).length)
      .to.equal(1);
  });

  it('should display correct message', () => {
    const message = 'Loaded';
    const wrapper = shallow(<LoadingIndicator message={message} />);

    expect(wrapper.render().text()).to.equal(message);
  });

  it('should hide the h3 when there\'s no message', () => {
    const wrapper = shallow(<LoadingIndicator />);

    expect(wrapper.find('h3').length).to.equal(0);
  });
});

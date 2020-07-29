import { h } from 'preact';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import MapNotification from './';

describe('components/map-notification', () => {
  it('should display provided message', () => {
    const message = 'Hey this is a notice';
    const wrapper = shallow(<MapNotification>{message}</MapNotification>);

    expect(wrapper.text()).to.equal(message);
  });
});

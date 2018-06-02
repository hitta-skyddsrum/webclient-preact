import { h } from 'preact';
import { shallow } from 'preact-render-spy';
import { expect } from 'chai';
import sinon from 'sinon';
import MapNotification from './';

describe('components/map-notification', () => {
  it('should display provided message', () => {
    const message = 'Hey this is a notice';
    const wrapper = shallow(<MapNotification>{message}</MapNotification>);

    expect(wrapper.text()).to.equal(message);
  });

  it('should call onClose upon click', ()  => {
    const onClose = sinon.spy();
    const wrapper = shallow(<MapNotification onClose={onClose} />);

    wrapper.find('div').simulate('click');

    expect(onClose).to.have.been.calledWith();
  });
});

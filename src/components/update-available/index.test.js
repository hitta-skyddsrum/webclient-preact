import { h } from 'preact';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import Button from '../button';
import UpdateAvailable from './';

describe('components.update-available', () => {
  it('should display a container with accurate message', () => {
    const wrapper = shallow(<UpdateAvailable />);

    expect(wrapper.html()).to.match(/Det finns en uppdatering tillgänglig/);
  });

  it('should fire onUpdate upon clicking on install button', () => {
    const onUpdate = sinon.spy();
    const wrapper = shallow(<UpdateAvailable onUpdate={onUpdate} />);

    wrapper.findWhere((n) => n.type() === Button && n.dive().text().search(/ladda om/i) === 0).first().props().onClick();

    expect(onUpdate).to.have.been.calledOnce;
  });

  it('should hide upon clicking on close button', () => {
    const timer = sinon.useFakeTimers();
    const onClose = sinon.spy();
    const wrapper = shallow(<UpdateAvailable onClose={onClose} />);

    wrapper.findWhere((n) => n.type() === Button && n.dive().text().search(/stäng/i) === 0).first().props().onClick();
    timer.tick(500);
    wrapper.update();

    expect(wrapper.exists()).to.equal(false);
  });
});


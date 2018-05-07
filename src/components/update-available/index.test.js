import { h } from 'preact';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'preact-render-spy';
import Button from '../button';
import UpdateAvailable from './';

describe('components.update-available', () => {
  const sandbox = sinon.createSandbox();

  it('should display a container with accurate message', () => {
    const wrapper = shallow(<UpdateAvailable />);

    expect(wrapper).to.match(/Det finns en uppdatering tillgänglig/);
  });

  it('should reload the page upon clicking on install button', () => {
    const wrapper = shallow(<UpdateAvailable />);
    sandbox.stub(window.location, 'reload');

    wrapper.find(<Button role="reload" />).simulate('click');

    expect(window.location.reload).to.have.been.calledOnce;
  });

  it('should hide upon clicking on close button', () => {
    const timer = sinon.useFakeTimers();
    const onClose = sinon.spy();
    const wrapper = shallow(<UpdateAvailable onClose={onClose} />);

    wrapper.find(<Button role="close" />).simulate('click');
    timer.tick(300);
    wrapper.rerender();

    expect(wrapper.output()).to.equal(null);
  });
});


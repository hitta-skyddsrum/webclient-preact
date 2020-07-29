import { h } from 'preact';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import Dialog from 'preact-material-components/Dialog';
import ErrorDialog from './';

describe('components/ErrorDialog', () => {
  const sandbox = sinon.createSandbox();

  it('should display a Dialog', () => {
    const context = mount(<ErrorDialog />);

    expect(context.find(Dialog).length).to.equal(1);
  });

  it('should call MDComponent.open when show prop changes from false to true', () => {
    const wrapper = mount(<ErrorDialog show={false} />);
    sandbox.stub(wrapper.instance().dialogRef.MDComponent, 'open');
    wrapper.setProps({ show: true });

    expect(wrapper.instance().dialogRef.MDComponent.open).to.have.been.calledWith();
  });

  it('should call MDComponent.close when show prop changes from true to false', () => {
    const wrapper = mount(<ErrorDialog show />);
    sandbox.stub(wrapper.instance().dialogRef.MDComponent, 'close');
    wrapper.setProps({ show: false });

    expect(wrapper.instance().dialogRef.MDComponent.close).to.have.been.calledWith();
  });

  it('should display a Dialog with correct title', () => {
    const title = 'Varning Harning';
    const context = mount(<ErrorDialog title={title} />);

    expect(context.find(Dialog.Header).text()).to.equal(title);
  });

  it('should display a Dialog with correct description', () => {
    const desc = 'Somethin went really wrong';
    const context = mount(<ErrorDialog desc={desc} />);

    expect(context.find(Dialog.Body).text()).to.equal(desc);
  });

  it('should fire prop onClose upon button click', () => {
    const onClose = sinon.spy();
    const context = mount(<ErrorDialog onClose={onClose} />);
    context.find(Dialog.FooterButton).first().prop('onClick')();

    expect(onClose.calledOnce).to.equal(true);
  });

  it('should fire prop onClose upon clicking outside of Dialog', () => {
    const onClose = sinon.spy();
    const context = mount(<ErrorDialog onClose={onClose} />, { depth: 2 });
    context.find(Dialog).prop('onCancel')();

    expect(onClose.calledOnce).to.equal(true);
  });
});

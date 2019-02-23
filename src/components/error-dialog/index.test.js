import { h } from 'preact';
import { deep } from 'preact-render-spy';
import { expect } from 'chai';
import sinon from 'sinon';

import Dialog from 'preact-material-components/Dialog';
import ErrorDialog from './';

describe('components/ErrorDialog', () => {
  const sandbox = sinon.createSandbox();

  it('should display a Dialog', () => {
    const context = deep(<ErrorDialog />);

    expect(context.find(<Dialog />).length).to.equal(1);
  });

  it('should call MDComponent.open when show prop changes from false to true', () => {
    const wrapper = deep(<ErrorDialog show={false} />);
    sandbox.stub(wrapper.component().dialogRef.MDComponent, 'open');
    wrapper.render(<ErrorDialog show />);

    expect(wrapper.component().dialogRef.MDComponent.open).to.have.been.calledWith();
  });

  it('should call MDComponent.close when show prop changes from true to false', () => {
    const wrapper = deep(<ErrorDialog show />);
    sandbox.stub(wrapper.component().dialogRef.MDComponent, 'close');
    wrapper.render(<ErrorDialog show={false} />);

    expect(wrapper.component().dialogRef.MDComponent.close).to.have.been.calledWith();
  });

  it('should display a Dialog with correct title', () => {
    const title = 'Varning Harning';
    const context = deep(<ErrorDialog title={title} />);

    expect(context.find(<Dialog.Header />).text()).to.equal(title);
  });

  it('should display a Dialog with correct description', () => {
    const desc = 'Somethin went really wrong';
    const context = deep(<ErrorDialog desc={desc} />);

    expect(context.find(<Dialog.Body />).text()).to.equal(desc);
  });

  it('should fire prop onClose upon button click', () => {
    const onClose = sinon.spy();
    const context = deep(<ErrorDialog onClose={onClose} />, { depth: 2 });
    context.find(<Dialog.FooterButton />).simulate('click');

    expect(onClose.calledOnce).to.equal(true);
  });

  it('should fire prop onClose upon clicking outside of Dialog', () => {
    const onClose = sinon.spy();
    const context = deep(<ErrorDialog onClose={onClose} />, { depth: 2 });
    context.find(<Dialog />).attr('onCancel')();

    expect(onClose.calledOnce).to.equal(true);
  });
});

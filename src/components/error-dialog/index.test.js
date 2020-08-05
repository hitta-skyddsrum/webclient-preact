import { h } from 'preact';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { Dialog, DialogButton, DialogContent, DialogTitle } from '@rmwc/dialog';
import ErrorDialog from './';

describe('components/ErrorDialog', () => {
  it('should display a Dialog', () => {
    const context = mount(<ErrorDialog />);

    expect(context.find(Dialog).length).to.equal(1);
  });

  it('should display a Dialog with correct title', () => {
    const title = 'Varning Harning';
    const context = mount(<ErrorDialog title={title} />);

    expect(context.find(DialogTitle).text()).to.equal(title);
  });

  it('should display a Dialog with correct description', () => {
    const desc = 'Somethin went really wrong';
    const context = mount(<ErrorDialog desc={desc} />);

    expect(context.find(DialogContent).text()).to.equal(desc);
  });

  it('should fire prop onClose upon button click', () => {
    const onClose = sinon.spy();
    const context = mount(<ErrorDialog onClose={onClose} />);
    context.find(DialogButton).first().prop('onClick')();

    expect(onClose.calledOnce).to.equal(true);
  });

  it('should fire prop onClose upon clicking outside of Dialog', () => {
    const onClose = sinon.spy();
    const context = mount(<ErrorDialog onClose={onClose} />, { depth: 2 });
    context.find(Dialog).prop('onCancel')();

    expect(onClose.calledOnce).to.equal(true);
  });
});

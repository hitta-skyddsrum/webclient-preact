import { h } from 'preact';
import { shallow, deep } from 'preact-render-spy';
import { expect } from 'chai';
import sinon from 'sinon';

import Dialog from 'material-ui/Dialog';
import ErrorDialog from './';

describe('components/ErrorDialog', () => {
  it('should display a Dialog', () => {
    const context = shallow(<ErrorDialog />);

    expect(context.find(<Dialog open={true} />).length).to.equal(1);
  });

  it('should display a Dialog with correct title', () => {
    const title = 'Varning Harning';
    const context = shallow(<ErrorDialog title={title} />);

    expect(context.find(<Dialog title={title} />).length).to.equal(1);
  });

  it('should display a Dialog with correct description', () => {
    const desc = 'Somethin went really wrong';
    const context = shallow(<ErrorDialog desc={desc} />);

    expect(context.find(<Dialog />).text()).to.equal(desc);
  });

  it('should fire prop handleClose upon button click', () => {
    const onClose = sinon.spy();
    const context = deep(<ErrorDialog handleClose={onClose} />, { depth: 1 });
    context.find(<Dialog />).attr('actions')[0].attributes.onClick();

    expect(onClose.calledOnce).to.equal(true);
  });

  it('should fire prop handleClose upon clicking outside of Dialog', () => {
    const onClose = sinon.spy();
    const context = deep(<ErrorDialog handleClose={onClose} />, { depth: 1 });
    context.find(<Dialog />).attr('onRequestClose')();

    expect(onClose.calledOnce).to.equal(true);
  });
});

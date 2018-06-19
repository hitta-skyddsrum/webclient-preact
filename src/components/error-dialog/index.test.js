import { h } from 'preact';
import { shallow, deep } from 'preact-render-spy';
import { expect } from 'chai';
import sinon from 'sinon';

import Dialog, {
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import ErrorDialog from './';

describe('components/ErrorDialog', () => {
  it('should display a Dialog', () => {
    const context = shallow(<ErrorDialog />);

    expect(context.find(<Dialog />).length).to.equal(1);
  });

  it('should display a Dialog with correct title', () => {
    const title = 'Varning Harning';
    const context = shallow(<ErrorDialog title={title} />);

    expect(context.find(<DialogTitle />).text()).to.equal(title);
  });

  it('should display a Dialog with correct description', () => {
    const desc = 'Somethin went really wrong';
    const context = shallow(<ErrorDialog desc={desc} />);

    expect(context.find(<DialogContentText />).text()).to.equal(desc);
  });

  it('should fire prop onClose upon button click', () => {
    const onClose = sinon.spy();
    const context = deep(<ErrorDialog onClose={onClose} />, { depth: 1 });
    context.find(<Button />).simulate('click');

    expect(onClose.calledOnce).to.equal(true);
  });

  it('should fire prop onClose upon clicking outside of Dialog', () => {
    const onClose = sinon.spy();
    const context = deep(<ErrorDialog onClose={onClose} />, { depth: 1 });
    context.find(<Dialog />).attr('onClose')();

    expect(onClose.calledOnce).to.equal(true);
  });
});

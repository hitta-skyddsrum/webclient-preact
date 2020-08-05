import { h } from 'preact';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { Fab } from '@rmwc/fab';
import BottomSheet from './';
import styles from './styles.scss';

describe('components/BottomSheet', () => {
  it('should render its children', () => {
    const children = 'tjenare';
    const wrapper = shallow(<BottomSheet>{children}</BottomSheet>);

    expect(wrapper.text()).to.match(new RegExp(children));
  });

  it('should call onClose upon click on close Fab', () => {
    const onClose = sinon.spy();
    const wrapper = shallow(<BottomSheet onClose={onClose}>hej</BottomSheet>);

    wrapper.find(Fab).props().onClick();

    expect(onClose).to.have.been.calledWith();
  });

  it('should append accurate class upon isOpen', () => {
    const wrapper = shallow(<BottomSheet isOpen />);

    expect(wrapper.find('div').first().prop('className')).to.contain(styles.IsOpen);
  });
});

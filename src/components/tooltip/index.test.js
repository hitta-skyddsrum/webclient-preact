import { h } from 'preact';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import styles from './style.scss';
import Tooltip from './';

describe('components/tooltip', () => {
  it('should display a header with text `Nyhet`', () => {
    const wrapper = shallow(<Tooltip />);

    expect(wrapper.find(`.${styles.header}`).text()).to.equal('Nyhet!');
  });

  it('should display the title', () => {
    const title = 'This is the title';
    const wrapper = shallow(<Tooltip title={title} />);

    expect(wrapper.text()).to.contain(title);
  });

  it('should not display if showUntil date has expired', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const wrapper = shallow(<Tooltip expires={yesterday} />);

    expect(wrapper.exists()).to.equal(false);
  });

  it('should call onClick upon click', () => {
    const onClick = sinon.spy();
    const event = new Event('click');
    const wrapper = shallow(<Tooltip onClick={onClick} />);

    wrapper.props().onClick(event);

    expect(onClick).to.have.been.calledWith(event);
  });
});

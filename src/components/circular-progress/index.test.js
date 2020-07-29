import { h } from 'preact';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import styles from './styles.scss';
import CircularProgress from './';

describe('components/CircularProgress', () => {
  it('should apply accurate styles', () => {
    const wrapper = shallow(<CircularProgress />);
    expect(wrapper.find('div').prop('className')).to.match(new RegExp(styles.CircularProgress));
  });
});

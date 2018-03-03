import { h } from 'preact';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'preact-render-spy';

import Home from './';
import SearchBox from '../search-box';

describe('components/home', () => {
  it('should show the home text', () => {
    const home = shallow(<Home/>);
    expect(home.find('h1').text()).to.equal('Hitta skyddsrum');
  });

  it('should display a SearchBox componet', () => {
    const onSelectAddress = sinon.spy();
    const home = shallow(<Home onSelectAddress={onSelectAddress} />);

    expect(home.contains(<SearchBox onSelectAddress={onSelectAddress} />)).to.equal(true);
  });
});

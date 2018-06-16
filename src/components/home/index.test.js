import { h } from 'preact';
import { expect } from 'chai';
import { shallow } from 'preact-render-spy';

import Home from './';
import SearchBox from '../../containers/search-box';

describe('components/home', () => {
  it('should show the home text', () => {
    const home = shallow(<Home/>);
    expect(home.find('h1').text()).to.equal('Hitta skyddsrum');
  });

  it('should display a SearchBox componet', () => {
    const home = shallow(<Home />);

    expect(home.contains(<SearchBox />)).to.equal(true);
  });
});

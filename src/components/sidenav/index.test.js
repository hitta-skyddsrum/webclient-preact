import { h } from 'preact';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { Drawer } from '@rmwc/drawer';
import MenuIcon from '@material-ui/icons/Menu';
import { Button } from '@rmwc/button';

import Sidenav from './';

describe('component/Sidenav', () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  it('should display a menu icon', () => {
    const context = shallow(<Sidenav location={{}} />);

    expect(context.find(MenuIcon).length).to.equal(1);
  });

  it('should display the menu on click hamburger menu button', () => {
    const wrapper = shallow(<Sidenav location={{}} />);

    wrapper.find(Button).at(0).props().onClick();

    expect(wrapper.find(Drawer).props().open).to.equal(true);
  });
});

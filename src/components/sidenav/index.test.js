import { h } from 'preact';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import MenuIcon from '@material-ui/icons/Menu';
import { MDCDrawer } from '@material/drawer';
import Button from 'preact-material-components/Button';

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
    const drawerMock = {
      open: false,
    };
    sandbox.stub(MDCDrawer, 'attachTo').returns(drawerMock);
    const context = shallow(<Sidenav location={{}} />);

    context.find(Button).at(0).props().onClick();

    expect(drawerMock.open).to.equal(true);
  });
});

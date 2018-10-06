import { h } from 'preact';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'preact-render-spy';
import { MDCDrawer } from '@material/drawer';
import Icon from 'preact-material-components/Icon';
import Button from 'preact-material-components/Button';

import Sidenav from './';

describe('component/Sidenav', () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  it('should display a hamburger menu', () => {
    const context = shallow(<Sidenav location={{}} />);

    expect(context.find(<Icon />).last().text()).to.equal('menu');
  });

  it('should display the menu on click hamburger menu button', () => {
    const drawerMock = {
      open: false,
    };
    sandbox.stub(MDCDrawer, 'attachTo').returns(drawerMock);
    const context = shallow(<Sidenav location={{}} />);

    context.find(<Button />).at(0).simulate('click');

    expect(drawerMock.open).to.equal(true);
  });
});

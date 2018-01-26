import { h } from 'preact';
import { expect } from 'chai';
import { shallow } from 'preact-render-spy';
import MenuIcon from 'material-ui-icons/Menu';
import Button from 'material-ui/Button';
import Drawer from 'material-ui/Drawer';
import { MenuItem } from 'material-ui/Menu';

import Sidenav from './';

describe('component/Sidenav', () => {
  it('should display a hamburger menu', () => {
    const context = shallow(<Sidenav location={{}} />);

    expect(context.find(<MenuIcon />).length).to.equal(1);
  });

  it('should hide the menu by default', () => {
    const context = shallow(<Sidenav location={{}} />);

    expect(context.find(<Drawer open={false} />).length).to.equal(1);
  });

  it('should display the menu on click hamburger menu button', () => {
    const context = shallow(<Sidenav location={{}} />);

    context.find(<Button />).at(0).simulate('click');

    expect(context.find(<Drawer open={true} />).length).to.equal(1);
  });

  it('should hide the menu upon Drawer onClick', () => {
    const context = shallow(<Sidenav location={{}} />);
    context.setState({ isOpen: true });

    context.find(<Drawer open={true} />).attr('onClose')();
    context.rerender();

    expect(context.find(<Drawer open={false} />).length).to.equal(1);
  });

  it('should hide the menu upon MenuItem onClick', () => {
    const context = shallow(<Sidenav location={{}} />);
    context.setState({ isOpen: true });

    context.find(<MenuItem />).simulate('click');

    expect(context.find(<Drawer open={false} />).length).to.equal(1);
  });

  it('should mark active MenuItem as selected', () => {
    const pathname = '/';
    const context = shallow(<Sidenav location={{ pathname }} />);

    expect(context.find(<MenuItem selected={true} />).attr('href')).to.equal(pathname);
  });
});

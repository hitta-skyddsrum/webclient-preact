import { h } from 'preact';
import { expect } from 'chai';
import { shallow } from 'preact-render-spy';
import Icon from 'preact-material-components/Icon';
import Button from 'preact-material-components/Button';
import Drawer from 'preact-material-components/Drawer';
import List from 'preact-material-components/List';

import Sidenav from './';

describe('component/Sidenav', () => {
  it('should display a hamburger menu', () => {
    const context = shallow(<Sidenav location={{}} />);

    expect(context.find(<Icon />).first().text()).to.equal('menu');
  });

  it('should hide the menu by default', () => {
    const context = shallow(<Sidenav location={{}} />);

    expect(context.find(<Drawer.TemporaryDrawer open={false} />).length).to.equal(1);
  });

  it('should display the menu on click hamburger menu button', () => {
    const context = shallow(<Sidenav location={{}} />);

    context.find(<Button />).at(0).simulate('click');

    expect(context.find(<Drawer.TemporaryDrawer open={true} />).length).to.equal(1);
  });

  it('should hide the menu upon Drawer onClick', () => {
    const context = shallow(<Sidenav location={{}} />);
    context.setState({ isOpen: true });

    context.find(<Drawer.TemporaryDrawer open={true} />).attr('onClose')();
    context.rerender();

    expect(context.find(<Drawer.TemporaryDrawer open={false} />).length).to.equal(1);
  });

  it('should hide the menu upon MenuItem onClick', () => {
    const context = shallow(<Sidenav location={{}} />);
    context.setState({ isOpen: true });

    context.find(<List.LinkItem />).simulate('click');

    expect(context.find(<Drawer.TemporaryDrawer open={false} />).length).to.equal(1);
  });
});

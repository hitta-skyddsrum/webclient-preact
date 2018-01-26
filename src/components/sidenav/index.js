import { h, Component } from 'preact';
import { Link } from 'preact-router/match';
import MenuIcon from 'material-ui-icons/Menu';
import InfoIcon from 'material-ui-icons/Info';
import NearMeIcon from 'material-ui-icons/NearMe';
import HelpIcon from 'material-ui-icons/Help';
import Button from 'material-ui/Button';
import Drawer from 'material-ui/Drawer';
import { MenuItem } from 'material-ui/Menu';
import Subheader from 'material-ui/List/ListSubheader';
import { autobind } from 'core-decorators';

import style from './style.scss';

export default class Sidenav extends Component {
  state = {
    isOpen: false,
  };

  @autobind
  handleOpen() {
    this.setState({
      isOpen: true,
    });
  }

  @autobind
  handleClose() {
    this.setState({
      isOpen: false,
    });
  }

  render() {
    const iconClasses = { root: style.menuItemIcon };
    const menuItems = [
      {
        title: 'Hitta skyddsrum',
        url: '/',
        icon: <NearMeIcon classes={iconClasses} />,
      },
      {
        title: 'Vad är ett skyddsrum?',
        url: '/vad-ar-ett-skyddsrum',
        icon: <HelpIcon classes={iconClasses} />,
      },
      {
        title: 'Om Hitta skyddsrum',
        url: '/om-hitta-skyddsrum',
        icon: <InfoIcon classes={iconClasses} />,
      },
    ];

    return (
      <div>
        <Button
          onClick={this.handleOpen}
          classes={{
            root: style.menuButton,
          }}
          color="primary"
        >
          <MenuIcon
            color="primary"
            titleAccess="Meny"
            classes={{
              root: style.menuButtonIcon,
            }}
          />
        </Button>
        <Drawer
          open={this.state.isOpen}
          anchor="right"
          onClose={this.handleClose}
          classes={{
            paper: style.menuContainer,
          }}
        >
          <Subheader color="primary">Hitta skyddsrum</Subheader>

          {menuItems.map(item => (
            <MenuItem
              classes={{ root: style.menuItem }}
              selected={this.props.location.pathname === item.url}
              component={Link}
              href={item.url}
            >
              {item.icon}
              {item.title}
            </MenuItem>
          ))}
        </Drawer>
      </div>
    );
  }
}

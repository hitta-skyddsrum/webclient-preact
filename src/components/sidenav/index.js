import { h, Component } from 'preact';
import { Link } from 'preact-router/match';
import MenuIcon from 'material-ui-icons/Menu';
import InfoIcon from 'material-ui-icons/Info';
import NearMeIcon from 'material-ui-icons/NearMe';
import HelpIcon from 'material-ui-icons/Help';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import { MenuItem } from '@material-ui/core/Menu';
import Subheader from '@material-ui/core/ListSubheader';

import style from './style.scss';

export default class Sidenav extends Component {
  state = {
    isOpen: false,
  };

  constructor() {
    super();

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleOpen() {
    this.setState({
      isOpen: true,
    });
  }

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
        url: '/om-tjansten',
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
              onClick={this.handleClose}
              onKeyDown={this.handleClose}
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

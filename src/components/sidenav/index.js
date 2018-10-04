import { h, Component } from 'preact';
import Icon from 'preact-material-components/Icon';
import Button from 'preact-material-components/Button';
import Drawer from 'preact-material-components/Drawer';
import List from 'preact-material-components/List';

import 'preact-material-components/Button/style.css';
import 'preact-material-components/Drawer/style.css';
import 'preact-material-components/Icon/style.css';
import 'preact-material-components/List/style.css';
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
      hasOpened: true,
      isOpen: true,
    });
  }

  handleClose() {
    this.setState({
      isOpen: false,
    });
  }

  render() {
    const iconClasses = style.menuItemIcon;
    const menuItems = [
      {
        title: 'Hitta skyddsrum',
        url: '/',
        icon: <Icon className={iconClasses}>near_me</Icon>,
      },
      {
        title: 'Vad är ett skyddsrum?',
        url: '/vad-ar-ett-skyddsrum',
        icon: <Icon className={iconClasses}>help</Icon>,
      },
      {
        title: 'Om Hitta skyddsrum',
        url: '/om-tjansten',
        icon: <Icon className={iconClasses}>info</Icon>,
      },
    ];
    console.log(this.state.isOpen);

    return (
      <div className={this.state.hasOpened && style.Animated || ''}>
        <Button
          onClick={this.handleOpen}
          className={style.menuButton}
          tabIndex={0}
          primary
        >
          <Icon
            primary
            titleAccess="Meny"
            className={style.menuButtonIcon}
          >
            menu
          </Icon>
        </Button>
        <Drawer.TemporaryDrawer
          open={this.state.isOpen}
          onClose={this.handleClose}
        >
          <Drawer.DrawerContent className={style.DrawerContent}>
            <List>
              {menuItems.map(item => (
                <List.LinkItem
                  className={style.menuItem}
                  onClick={this.handleClose}
                  ripple
                  href={item.url}
                >
                  {item.icon}
                  {item.title}
                </List.LinkItem>
              ))}
            </List>
          </Drawer.DrawerContent>
        </Drawer.TemporaryDrawer>
      </div>
    );
  }
}

import { h, Component } from 'preact';
import { MDCDrawer } from '@material/drawer';
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

    this.handleToggle = this.handleToggle.bind(this);
  }

  componentDidMount() {
    this.MDComponent = MDCDrawer.attachTo(this.control);
  }

  handleToggle() {
    this.MDComponent.open = !this.MDComponent.open;
    this.setState(state => ({
      isOpen: !state.isOpen,
    }));
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

    return (
      <div className={this.state.isOpen && style.containerOpen || ''}>
        <aside
          className="mdc-typography mdc-drawer mdc-drawer--dismissible"
          ref={ref => { this.control = ref; }}
          dir="rtl"
        >
          <Drawer.DrawerContent className={style.DrawerContent} dir="ltr">
            <List>
              {menuItems.map(item => (
                <List.LinkItem
                  className={style.menuItem}
                  ripple
                  href={item.url}
                >
                  {item.icon}
                  {item.title}
                </List.LinkItem>
              ))}
            </List>
          </Drawer.DrawerContent>
        </aside>
        <Button
          onClick={this.handleToggle}
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
      </div>
    );
  }
}

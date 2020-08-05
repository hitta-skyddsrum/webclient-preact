import { h, Component } from 'preact';
import HelpIcon from '@material-ui/icons/Help';
import InfoIcon from '@material-ui/icons/Info';
import MenuIcon from '@material-ui/icons/Menu';
import NearMeIcon from '@material-ui/icons/NearMe';
import { Button } from '@rmwc/button';
import { Drawer, DrawerContent } from '@rmwc/drawer';
import { List, ListItem } from '@rmwc/list';
import history from '../../history';

import '@rmwc/button/styles';
import '@rmwc/drawer/styles';
import '@rmwc/list/styles';
import style from './style.scss';

const menuItems = [
  {
    title: 'Hitta skyddsrum',
    url: '/',
    icon: <NearMeIcon className={style.menuItemIcon} />,
  },
  {
    title: 'Vad är ett skyddsrum?',
    url: '/vad-ar-ett-skyddsrum',
    icon: <HelpIcon className={style.menuItemIcon} />,
  },
  {
    title: 'Om Hitta skyddsrum',
    url: '/om-tjansten',
    icon: <InfoIcon className={style.menuItemIcon} />,
  },
];

export default class Sidenav extends Component {
  state = {
    isOpen: false,
  };

  handleToggle = (open) => {
    this.setState(state => ({
      isOpen: open === undefined ? !state.isOpen : open,
    }));
  }

  handleClickItem = ({ detail: { index } }) => {
    history.push(menuItems[index].url);
  };

  render() {
    return (
      <div className={this.state.isOpen && style.containerOpen || ''}>
        <Drawer className={style.Drawer} dir="rtl" dissmissable modal open={this.state.isOpen} onClose={() => this.handleToggle(false)}>
          <DrawerContent class={style.DrawerContent} dir="ltr">
            <List onAction={this.handleClickItem}>
              {menuItems.map(item => (
                <ListItem
                  aria-label={item.title}
                  className={style.menuItem}
                  ripple
                  href={item.url}
                >
                  {item.icon}
                  {item.title}
                </ListItem>
              ))}
            </List>
          </DrawerContent>
        </Drawer>
        <Button
          aria-label="Meny"
          onClick={() => this.handleToggle()}
          className={style.menuButton}
          tabIndex={0}
          raised
        >
          <MenuIcon className={style.menuButtonIcon} />
        </Button>
      </div>
    );
  }
}

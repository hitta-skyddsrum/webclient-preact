import { h, Component } from 'preact';
import { List, ListItem, ListItemPrimaryText } from '@rmwc/list';
import Helmet from 'preact-helmet';
import BottomSheet from '../bottom-sheet';

import style from './style.scss';

export default class ShelterDetail extends Component {
  render() {
    if (!this.props.shelter) return <div />;

    const address = [this.props.shelter.address, this.props.shelter.municipality]
      .filter(section => !!section)
      .join(', ');

    return (<BottomSheet
      onClose={this.props.onClose}
      isOpen={this.props.open}>
      {this.props.shelter.shelterId && (
        <div>
          <Helmet
            title={`Skyddsrum ${this.props.shelter.shelterId}`}
          />
          <List className="mdc-list--non-interactive">
            <ListItem disabled className={style.item}>
              <h1 class={style.title}>Skyddsrum {this.props.shelter.shelterId}</h1>
            </ListItem>
            <ListItem disabled className={style.item}>
              <ListItemPrimaryText>
                Fastighetsbeteckning: {this.props.shelter.estateId}
              </ListItemPrimaryText>
            </ListItem>
            <ListItem disabled className={style.item}>
              <ListItemPrimaryText>
                Adress: {address}
              </ListItemPrimaryText>
            </ListItem>
            <ListItem disabled className={style.item}>
              <ListItemPrimaryText>
                Antal platser: {this.props.shelter.slots}
              </ListItemPrimaryText>
            </ListItem>
            <ListItem disabled className={style.item.concat(' ', style.itemCoordinates)}>
              <ListItemPrimaryText>
                <span>Koordinater:&nbsp;
                  <a
                    href={`https://www.google.com/maps/place/${this.props.shelter.position.lat},${this.props.shelter.position.long}`}
                  >
                    {this.props.shelter.position.lat}, {this.props.shelter.position.long}
                  </a>
                </span>
              </ListItemPrimaryText>
            </ListItem>
          </List>
        </div>
      )}
    </BottomSheet>);
  }
}


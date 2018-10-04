import { h, Component } from 'preact';
import List from 'preact-material-components/List';
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
            <List.Item disabled className={style.item}>
              <h1 class={style.title}>Skyddsrum {this.props.shelter.shelterId}</h1>
            </List.Item>
            <List.Item disabled className={style.item}>
              <List.PrimaryText>
                Fastighetsbeteckning: {this.props.shelter.estateId}
              </List.PrimaryText>
            </List.Item>
            <List.Item disabled className={style.item}>
              <List.PrimaryText>
                Adress: {address}
              </List.PrimaryText>
            </List.Item>
            <List.Item disabled className={style.item}>
              <List.PrimaryText>
                Antal platser: {this.props.shelter.slots}
              </List.PrimaryText>
            </List.Item>
            <List.Item disabled className={style.item.concat(' ', style.itemCoordinates)}>
              <List.PrimaryText>
                <span>Koordinater:&nbsp;
                  <a
                    href={`https://www.google.com/maps/place/${this.props.shelter.position.lat},${this.props.shelter.position.long}`}
                  >
                    {this.props.shelter.position.lat}, {this.props.shelter.position.long}
                  </a>
                </span>
              </List.PrimaryText>
            </List.Item>
          </List>
        </div>
      )}
    </BottomSheet>);
  }
}


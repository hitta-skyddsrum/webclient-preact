import { h, Component } from 'preact';
import { BottomSheet } from 'material-ui-bottom-sheet';
import Button from 'material-ui/Button';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Helmet from 'preact-helmet';
import ClearIcon from 'material-ui-icons/Clear';

import style from './style.scss';

export default class ShelterDetail extends Component {
  render() {
    if (!this.props.shelter) return <div />;

    const closeButton = (
      <Button variant="fab" onClick={this.props.onClose} className="close">
        <ClearIcon />
      </Button>
    );

    const address = [this.props.shelter.address, this.props.shelter.municipality]
      .filter(section => !!section)
      .join(', ');

    return (<BottomSheet
      onRequestClose={this.props.onClose}
      style={{ height: 'auto' }}
      bodyStyle={{ transform: 'none' }}
      action={closeButton}
      actionStyle={{
        position: 'absolute',
        top: '-28px',
        right: '16px',
        float: 'none',
        marginTop: 0,
        marginRight: 0,
        zIndex: 2,
      }}
      open={this.props.open}>
      {this.props.shelter.shelterId && (
        <div>
          <Helmet
            title={`Skyddsrum ${this.props.shelter.shelterId}`}
          />
          <List>
            <ListItem disabled className={style.item}>
              <h1 class={style.title}>Skyddsrum {this.props.shelter.shelterId}</h1>
            </ListItem>
            <ListItem disabled className={style.item}>
              <ListItemText primary={`Fastighetsbeteckning: ${this.props.shelter.estateId}`} />
            </ListItem>
            <ListItem disabled className={style.item}>
              <ListItemText primary={`Adress: ${address}`} />
            </ListItem>
            <ListItem disabled className={style.item}>
              <ListItemText primary={`Antal platser: ${this.props.shelter.slots}`} />
            </ListItem>
            <ListItem disabled className={style.item.concat(' ', style.itemCoordinates)}>
              <ListItemText primary={
                <span>Koordinater:
                  <a
                    href={`https://www.google.com/maps/place/${this.props.shelter.position.lat},${this.props.shelter.position.long}`}
                  >
                    {this.props.shelter.position.lat}, {this.props.shelter.position.long}
                  </a>
                </span>}
              />
            </ListItem>
          </List>
        </div>
      )}
    </BottomSheet>);
  }
}


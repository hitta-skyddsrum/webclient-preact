import { h, Component } from 'preact';
import { BottomSheet } from 'material-ui-bottom-sheet';
import Button from 'material-ui/Button';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Helmet from 'preact-helmet';
import ClearIcon from 'material-ui-icons/Clear';

import style from './style.scss';

export default class ShelterDetail extends Component {
  bottomSheetRef = null;

  constructor() {
    super();

    this.handleBottomSheetRefChange = this.handleBottomSheetRefChange.bind(this);
    this.handleBottomSheetTransitionEnd = this.handleBottomSheetTransitionEnd.bind(this);
  }

  handleBottomSheetRefChange(ref) {
    if (!ref || !ref.base || !ref.base.firstChild) {
      // this.bottomSheetRef = null;
      this.props.onHeightChange(0);
      return;
    }

    if (this.bottomSheetRef === ref) return;

    this.bottomSheetRef = ref;

    // When this component is rendered upon page load, transitionend wont be triggered.

    this.props.onHeightChange(this.bottomSheetRef.base.firstChild.offsetHeight);

    this.bottomSheetRef.base.removeEventListener('transitionend', this.handleBottomSheetTransitionEnd);
    this.bottomSheetRef.base.addEventListener('transitionend', this.handleBottomSheetTransitionEnd);
  }

  handleBottomSheetTransitionEnd({ target }) {
    if (!target.firstChild) return;
    if (target.firstChild.className.indexOf('MuiPaper') === -1) return;

    this.props.onHeightChange(target.firstChild.offsetHeight);
  }

  render() {
    if (!this.props.shelter) return <div />;

    const closeButton = (
      <Button variant="fab" onClick={this.props.onClose} className="close">
        <ClearIcon />
      </Button>
    );

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
      ref={this.handleBottomSheetRefChange}
      open={this.props.open}>
      {this.props.shelter.shelterId && (
        <div>
          <Helmet
            title={`Skyddsrum ${this.props.shelter.shelterId}`}
          />
          <List>
            <ListItem disabled>
              <h1 class={style.title}>Skyddsrum {this.props.shelter.shelterId}</h1>
            </ListItem>
            <ListItem disabled>
              <ListItemText primary={`Fastighetsbeteckning: ${this.props.shelter.estateId}`} />
            </ListItem>
            <ListItem disabled>
              <ListItemText primary={`Adress: ${this.props.shelter.address}, ${this.props.shelter.municipality}`} />
            </ListItem>
            <ListItem disabled>
              <ListItemText primary={`Antal platser: ${this.props.shelter.slots}`} />
            </ListItem>
            <ListItem disabled>
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


import { Component, h } from 'preact';
import L from 'leaflet';
import { Marker } from 'react-leaflet';

export default class ShelterMarker extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.onClick(this.props.shelter);
  }

  render({ iconSize, shelter }) {
    // Add ref attr to solve https://github.com/developit/preact/issues/1011

    return (
      <Marker
        position={[shelter.position.lat, shelter.position.long]}
        onClick={this.handleClick}
        ref={ref => { this.elemRef = ref; }}
        icon={
          L.icon({
            iconUrl: '/assets/images/icon-shelter.png',
            iconSize,
            className: 'shelter',
          })
        }
      />
    );
  }
}


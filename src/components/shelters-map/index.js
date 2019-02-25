import { Component, h } from 'preact';
import L from 'leaflet';
import * as ReactLeaflet from 'react-leaflet';
// https://github.com/PaulLeCam/react-leaflet/issues/448
const { Map: LeafletMap, Marker, Polyline, TileLayer, ZoomControl } = ReactLeaflet;
import MarketClusterGroup from 'react-leaflet-markercluster';

import ShelterMarker from '../shelter-marker';
import isIE from '../../lib/is-ie';

import 'leaflet/dist/leaflet.css';
import style from './style.scss';

export default class SheltersMap extends Component {
  constructor(props) {
    super(props);

    this.bbox = null;
    this.zoom = null;

    this.handleBBoxChange = this.handleBBoxChange.bind(this);
  }

  componentDidMount() {
    document.addEventListener('gesturestart', this.preventZoom);
  }

  componentWillUnmount() {
    document.removeEventListener('gesturestart', this.preventZoom);
  }

  preventZoom = (event) => {
    event.preventDefault();
  };

  handleBBoxChange(event) {
    const bbox = event.target.getBounds().toBBoxString();
    const zoom = event.target.getZoom();

    this.props.onBBoxChange({
      bbox,
      oldBBox: this.bbox,
      oldZoom: this.zoom,
      zoom,
    });

    this.bbox = bbox;
    this.zoom = zoom;
  }

  render({
    center,
    shelters,
    routes,
    onSelectShelter,
    bounds = [],
    youAreHere = [],
    bottomPadding = 0,
    selectedShelterId,
  }) {
    const boundsOptions = { paddingTopLeft: [0, 100], paddingBottomRight: [0, bottomPadding] };

    return (
      <div className={style.mapContainer}>
        <LeafletMap
          boundsOptions={boundsOptions}
          zoom={14}
          style={{height: '100%'}}
          onMoveend={this.handleBBoxChange}
          onZoomend={this.handleBBoxChange}
          zoomControl={isIE()}
          {...!!center.length && { center }}
          {...!!bounds.length && { bounds }}
        >
          <TileLayer
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            attribution="&copy; <a href=&quot;https://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          {!!youAreHere.length && <Marker
            position={youAreHere}
            interactive={false}
            ref={ref => { this.yahElem = ref; }}
            icon={
              L.icon({
                iconUrl: '/assets/images/icon-you_are_here.png',
                iconSize: [22, 40],
                className: 'youAreHere',
              })
            }
          />}
          <MarketClusterGroup key="cluster-1">
            {shelters
              .map(shelter => ({
                shelter,
                iconSize: [50, 49].map(size => selectedShelterId === shelter.shelterId ? size * 1.5 : size),
              }))
              .map(({ shelter, iconSize }) => (
                <ShelterMarker
                  key={shelter.shelterId}
                  shelter={shelter}
                  onClick={onSelectShelter}
                  iconSize={iconSize}
                />
              ))}
          </MarketClusterGroup>
          {routes.map(route => <Polyline positions={route.coordinates} />)}
          {!isIE() && <ZoomControl position="bottomright" />}
        </LeafletMap>
      </div>
    );
  }
}

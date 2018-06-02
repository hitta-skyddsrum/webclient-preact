import { Component, h } from 'preact';
import L from 'leaflet';
import { Map, Marker, Polyline, TileLayer, ZoomControl } from 'react-leaflet';
import MarketClusterGroup from 'react-leaflet-markercluster';

import 'leaflet/dist/leaflet.css';
import style from './style.scss';

export default class SheltersMap extends Component {
  constructor(props) {
    super(props);

    this.bbox = null;
    this.zoom = null;

    this.handleBBoxChange = this.handleBBoxChange.bind(this);
  }

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
        <Map
          boundsOptions={boundsOptions}
          zoom={10}
          style={{height: '100%'}}
          onMoveend={this.handleBBoxChange}
          onZoomend={this.handleBBoxChange}
          zoomControl={false}
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
            icon={
              L.icon({
                iconUrl: '/assets/images/icon-you_are_here.png',
                iconSize: [22, 40],
                className: 'youAreHere',
              })
            }
          />}
          <MarketClusterGroup>
            {shelters
              .map(shelter => ({
                shelter,
                iconSize: [50, 49].map(size => selectedShelterId === shelter.shelterId ? size * 1.5 : size),
              }))
              .map(({ shelter, iconSize }) => (
                <Marker
                  position={[shelter.position.lat, shelter.position.long]}
                  onClick={() => onSelectShelter(shelter)}
                  icon={
                    L.icon({
                      iconUrl: '/assets/images/icon-shelter.png',
                      iconSize,
                      className: 'shelter',
                    })
                  }
                />
              ))}
          </MarketClusterGroup>
          {routes.map(route => <Polyline positions={route.coordinates} />)}
          <ZoomControl position="bottomright" />
        </Map>
      </div>
    );
  }
}

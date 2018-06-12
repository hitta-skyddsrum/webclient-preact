import { Component, h } from 'preact';
import L from 'leaflet';
import * as ReactLeaflet from 'react-leaflet';
// https://github.com/PaulLeCam/react-leaflet/issues/448
const { Map: LeafletMap, Marker, Polyline, TileLayer, ZoomControl } = ReactLeaflet;
import MarketClusterGroup from 'react-leaflet-markercluster';
import 'proj4leaflet';

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
    this.crs = new L.Proj.CRS(
      'EPSG:3006',
      '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      {
        bounds:  L.bounds([-1200000.000000, 8500000.000000], [4305696.000000, 2994304.000000]),
        origin: [-1200000.000000, 8500000.000000],
        resolutions: [
          4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8,
        ],
      },
    );
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
        <LeafletMap
          crs={this.crs}
          boundsOptions={boundsOptions}
          zoom={4}
          style={{height: '100%'}}
          onMoveend={this.handleBBoxChange}
          onZoomend={this.handleBBoxChange}
          maxZoom={9}
          zoomControl={isIE()}
          {...!!bounds.length && { bounds }}
          {...!!center.length && { center }}
        >
          <TileLayer
            maxZoom={9}
            minZoom={0}
            attribution="&amp;copy <a href=&quot;https://www.lantmateriet.se/en/&quot;>Lantmäteriet</a> Topografisk Webbkarta Visning, CCB"
            url={`https://api.lantmateriet.se/open/topowebb-ccby/v1/wmts/token/${process.env.LANTMATERIET_TOKEN}/1.0.0/topowebb/default/3006/{z}/{y}/{x}.png`}
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

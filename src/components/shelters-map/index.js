import { h } from 'preact';
import L from 'leaflet';
import { Map, Marker, Polyline, TileLayer } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import style from './style.scss';

export default ({
  center,
  shelters,
  routes,
  onSelectShelter,
  bounds,
  youAreHere = [],
}) => {
  const mapCenter = center.filter(pos => pos).length ? center : false;

  return (
    <div className={style.mapContainer}>
      <Map
        center={mapCenter}
        zoom={10}
        style={{height: '100vh'}}
        bounds={bounds}
      >
        <TileLayer
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
        {youAreHere.length && <Marker
          position={youAreHere}
          icon={
            L.icon({
              iconUrl: '/assets/images/icon-you_are_here.png',
              iconSize: [22, 40],
            })
          }
        />}
        {shelters.map(shelter => (<Marker
          position={[shelter.position.lat, shelter.position.long]}
          onClick={() => onSelectShelter(shelter)}
          icon={
            L.icon({
              iconUrl: '/assets/images/icon-shelter.png',
              iconSize: [50, 49],
            })
          }
        />))}
        {routes.map(route => <Polyline positions={route.coordinates} />)}
      </Map>
    </div>
  );
};

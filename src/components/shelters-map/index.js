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
  bounds = [],
  youAreHere = [],
  bottomPadding = 0,
  selectedShelterId,
}) => {
  const mapCenter = center.filter(pos => pos).length ? center : false;
  const boundsOptions = { paddingTopLeft: [0, 100], paddingBottomRight: [0, bottomPadding] };

  return (
    <div className={style.mapContainer}>
      <Map
        center={mapCenter}
        zoom={10}
        style={{height: '100vh'}}
        boundsOptions={{...boundsOptions}}
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
        {shelters
          .map(shelter => ({
            shelter,
            iconSize: [50, 49].map(size => selectedShelterId === shelter.id ? size * 1.5 : size),
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
        {routes.map(route => <Polyline positions={route.coordinates} />)}
      </Map>
    </div>
  );
};

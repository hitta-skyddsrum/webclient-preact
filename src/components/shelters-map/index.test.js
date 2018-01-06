import { h } from 'preact';
import { expect } from 'chai';
import { deep } from 'preact-render-spy';
import sinon from 'sinon';
import { Map, Marker, Polyline } from 'react-leaflet';

import SheltersMap from './';

describe('components/SheltersMap', () => {
  const bounds = [ [1, 2], [3, 4]];
  const center = [1, 2];
  const youAreHere = [123123, 87495];
  const shelters = [
    { position: { lat: 12, long: 13 } },
    { position: { lat: 14, long: 15 } },
  ];
  const routes = [
    { coordinates: [[1, 2], [3, 4], [5, 6]] },
    { coordinates: [[7, 8], [9, 10], [11, 12]] },
  ];
  const onSelectShelter = sinon.spy();
  let mapContext;

  beforeEach(() => {
    mapContext = deep(<SheltersMap
      bounds={bounds}
      center={center}
      shelters={shelters}
      onSelectShelter={onSelectShelter}
      routes={routes}
      youAreHere={youAreHere}
    />, { depth: 1 });
  });

  it('should render a map', () => {
    expect(mapContext.find(<Map zoom={10} bounds={bounds} center={center} />).length).to.equal(1);
  });

  it('should render a marker at the youAreHere position', () => {
    expect(mapContext.find(<Marker position={youAreHere} />).length).to.equal(1);
  });

  it('should not render a marker if no youAreHere is given', () => {
    mapContext.render(<SheltersMap center={[]} shelters={[]} routes={[]} />);

    expect(mapContext.find(<Marker />).length).to.equal(0);
  });

  it('should render all the shelters as markers', () => {
    expect(shelters.length).to.be.greaterThan(1);

    shelters.forEach(shelter =>
      expect(mapContext.find(<Marker position={[shelter.position.lat, shelter.position.long]} />).length).to.equal(1));
  });

  it('should call onSelectShelter handler upon shelter marker click', () => {
    expect(shelters.length).to.be.greaterThan(1);
    const shelter = shelters.pop();

    mapContext.find(<Marker position={[shelter.position.lat, shelter.position.long]} />).simulate('click');

    expect(onSelectShelter).to.have.been.calledWith(shelter);
  });

  it('should display the provided routes', () => {
    expect(routes.length).to.be.greaterThan(1);

    routes.forEach(route =>
      expect(mapContext.find(<Polyline positions={route.coordinates} />).length).to.equal(1));
  });
});

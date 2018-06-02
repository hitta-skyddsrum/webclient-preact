import { h } from 'preact';
import { expect } from 'chai';
import { shallow } from 'preact-render-spy';
import sinon from 'sinon';
import { Map, Marker, Polyline, ZoomControl } from 'react-leaflet';
import L from 'leaflet';

import SheltersMap from './';

describe('components/SheltersMap', () => {
  const bounds = [ [1, 2], [3, 4]];
  const center = [1, 2];
  const youAreHere = [123123, 87495];
  const shelters = [
    { shelterId: 1, position: { lat: 12, long: 13 } },
    { shelterId: 2, position: { lat: 14, long: 15 } },
  ];
  const routes = [
    { coordinates: [[1, 2], [3, 4], [5, 6]] },
    { coordinates: [[7, 8], [9, 10], [11, 12]] },
  ];
  const bottomPadding = 1337;
  const onBBoxChange = sinon.spy();
  const onSelectShelter = sinon.spy();
  let mapContext;

  beforeAll(() => {
    sinon.spy(L, 'icon');
  });

  beforeEach(() => {
    mapContext = shallow(<SheltersMap
      bounds={bounds}
      center={center}
      shelters={shelters}
      onBBoxChange={onBBoxChange}
      onSelectShelter={onSelectShelter}
      routes={routes}
      youAreHere={youAreHere}
      bottomPadding={bottomPadding}
    />);
  });

  afterEach(() => {
    L.icon.resetHistory();
  });

  it('should render a map', () => {
    expect(mapContext.find(
      <Map
        zoom={10}
        bounds={bounds}
        center={center}
        boundsOptions={{ paddingBottomRight: [0, bottomPadding] }}
      />
    ).length).to.equal(1);
  });

  it('should render a marker at the youAreHere position', () => {
    expect(mapContext.find(<Marker position={youAreHere} interactive={false} />).length).to.equal(1);
  });

  it('should not render a marker if no youAreHere is given', () => {
    mapContext.render(<SheltersMap center={[]} shelters={[]} routes={[]} />);

    expect(mapContext.find(<Marker />).length).to.equal(0);
  });

  it('should render all the shelters as markers', () => {
    expect(shelters.length).to.be.greaterThan(1);

    shelters.forEach(shelter =>
      expect(mapContext.find(<Marker position={[shelter.position.lat, shelter.position.long]} />).length).to.equal(1));

    const shelterIconCalls = L.icon.getCalls()
      .filter(call => call.args[0].className === 'shelter');

    expect(shelterIconCalls.length).to.equal(shelters.length);

    shelterIconCalls
      .forEach(call => expect(call.args[0].iconSize).to.eql([50, 49]));
  });

  it('should call onBBoxChange with zoom and bbox value upon map move end', () => {
    const bBoxString = '12,13,14,15';
    const zoom = 200;
    const mockEvent = {
      target: {
        getBounds: () => ({
          toBBoxString: () => bBoxString,
        }),
        getZoom: () => zoom,
      },
    };
    mapContext.find(Map).attr('onMoveend')(mockEvent);

    expect(onBBoxChange).to.have.been.calledWith({
      bbox: bBoxString,
      oldBBox: null,
      oldZoom: null,
      zoom,
    });

    const secondMockEvent = {
      target: {
        getBounds: () => ({
          toBBoxString: () => '16,17,18,19',
        }),
        getZoom: () => 300,
      },
    };
    mapContext.find(Map).simulate('moveend', secondMockEvent);

    expect(onBBoxChange).to.have.been.calledWith({
      bbox: secondMockEvent.target.getBounds().toBBoxString(),
      zoom: secondMockEvent.target.getZoom(),
      oldBBox: mockEvent.target.getBounds().toBBoxString(),
      oldZoom: mockEvent.target.getZoom(),
    });
  });

  it('should call onBBoxChange with zoom and bbox value upon map zoom end', () => {
    const bBoxString = '14, 15, 16, 16';
    const zoom = 199;
    const mockEvent = {
      target: {
        getBounds: () => ({
          toBBoxString: () => bBoxString,
        }),
        getZoom: () => zoom,
      },
    };
    mapContext.find(Map).attr('onZoomend')(mockEvent);

    expect(onBBoxChange).to.have.been.calledWith({
      bbox: bBoxString,
      oldBBox: null,
      oldZoom: null,
      zoom,
    });
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

  it('should display a ZoomControl in the bottom right corner', () => {
    expect(mapContext.find(<ZoomControl />).length).to.equal(1);
    expect(mapContext.find(<ZoomControl />).attr('position')).to.equal('bottomright');
  });
});

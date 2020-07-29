import { h } from 'preact';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { Map, Marker, Polyline, ZoomControl } from 'react-leaflet';
import L from 'leaflet';

import SheltersMap from './';
import ShelterMarker from '../shelter-marker';

describe('components/SheltersMap', () => {
  const bounds = [ [1, 2], [3, 4]];
  const center = [1, 2];
  const youAreHere = [123123, 87495];
  const shelters = [
    { shelterId: 1, position: { lat: 12, long: 13 } },
    { shelterId: 2, position: { lat: 14, long: 15 } },
  ];
  const features = [
    { geometry: { coordinates: [[1, 2], [3, 4], [5, 6]] }},
    { geometry: { coordinates: [[7, 8], [9, 10], [11, 12]] }},
  ];
  const bottomPadding = 1337;
  const onBBoxChange = sinon.spy();
  const onSelectShelter = sinon.spy();
  const sandbox = sinon.createSandbox();
  let mapContext;

  beforeEach(() => {
    sandbox.spy(L, 'icon');
    sandbox.spy(document, 'addEventListener');
    sandbox.stub(document, 'removeEventListener');
  });

  afterEach(() => {
    sandbox.restore();
  });

  beforeEach(() => {
    mapContext = shallow(<SheltersMap
      bounds={bounds}
      center={center}
      shelters={shelters}
      onBBoxChange={onBBoxChange}
      onSelectShelter={onSelectShelter}
      features={features}
      youAreHere={youAreHere}
      bottomPadding={bottomPadding}
    />);
  });

  afterEach(() => {
    L.icon.resetHistory();
  });

  it('should listen for gesturestart upon mount if shelter is provided', () => {
    expect(document.addEventListener).to.have.been.calledWith('gesturestart', sinon.match.func);
  });

  it('should remove all event listeners upon unmount', () => {
    expect(document.addEventListener).to.have.been.called;

    mapContext.unmount();

    document.addEventListener.getCalls().forEach(call => {
      expect(document.removeEventListener).to.have.been.calledWith(...call.args);
    });
  });

  it('should prevent default zoom behavior upon gesturestart if scale isnt 1', () => {
    document.addEventListener.restore();

    const event = Object.assign(new Event('gesturestart'), { scale: 2 });
    sinon.spy(event, 'preventDefault');
    document.dispatchEvent(event);

    expect(event.preventDefault).to.have.been.called;
  });

  it('should render a map', () => {
    expect(mapContext.findWhere(n =>
      n.type() === Map &&
      n.props().zoom === 14 &&
      n.props().bounds === bounds &&
      n.props().center === center &&
      n.props().boundsOptions.paddingBottomRight[0] === 0 &&
      n.props().boundsOptions.paddingBottomRight[1] === bottomPadding
    ).length).to.equal(1);
  });

  it('should render a marker at the youAreHere position', () => {
    expect(mapContext.findWhere(n =>
      n.type() === Marker &&
      n.props().position === youAreHere &&
      n.props().interactive === false
    ).length).to.equal(1);
  });

  it('should not render a marker if no youAreHere is given', () => {
    const wrapper = shallow(<SheltersMap center={[]} shelters={[]} routes={[]} />);

    expect(wrapper.find(ShelterMarker).length).to.equal(0);
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
    mapContext.find(Map).prop('onMoveend')(mockEvent);

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
    mapContext.find(Map).props().onMoveend(secondMockEvent);

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
    mapContext.find(Map).prop('onZoomend')(mockEvent);

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

    mapContext.findWhere(n =>
      n.type() === ShelterMarker &&
      n.props().shelter === shelter
    ).props().onClick();

    expect(onSelectShelter).to.have.been.calledWith();
  });

  it('should display the provided features', () => {
    expect(features.length).to.be.greaterThan(1);

    features.forEach(feat =>
      expect(mapContext.findWhere(n =>
        n.type() === Polyline &&
        n.props().positions[0][0] === feat.geometry.coordinates[0][1] &&
        n.props().positions[0][1] === feat.geometry.coordinates[0][0]
      ).length).to.equal(1));
  });

  it('should display a ZoomControl in the bottom right corner', () => {
    expect(mapContext.find(ZoomControl).length).to.equal(1);
    expect(mapContext.find(ZoomControl).prop('position')).to.equal('bottomright');
  });
});

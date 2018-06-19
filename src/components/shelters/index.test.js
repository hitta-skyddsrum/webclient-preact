import { h } from 'preact';
import { route } from 'preact-router';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'preact-render-spy';
import Helmet from 'preact-helmet';

import Shelters from './';

import SheltersMap from '../shelters-map';
import LoadingIndicator from '../loading-indicator';
import MapNotification from '../map-notification';
import ShelterDetail from '../shelter-detail';
import SearchBox from '../../containers/search-box';

describe('components/shelters', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      bounds: [],
      fetchShelters: sinon.spy(),
      onSetBounds: sinon.spy(),
      reverseGeocode: sinon.spy(),
      selectedAddress: {},
    };
  });

  it('displays a correct title', () => {
    const selectedAddress = {
      name: 'Gatvägen 1',
    };
    const context = shallow(<Shelters
      {...defaultProps}
      selectedAddress={{}}
      reverseGeocode={sinon.spy()}
    />);

    expect(context.find(<Helmet />).length).to.equal(0);

    context.render(<Shelters
      selectedAddress={selectedAddress}
      reverseGeocode={sinon.spy()}
    />);

    expect(context.find(<Helmet />).attr('title')).to.match(new RegExp(selectedAddress.name));
  });

  it('displays a LoadingIndicator when loading is truthy', () => {
    const context = shallow(<Shelters loading={4} {...defaultProps} />);

    expect(context.find(<LoadingIndicator />).length).to.equal(1);
  });

  it('should contain a SearchBox container', () => {
    const onGeolocation = sinon.spy();
    const onSelectAddress = sinon.spy();
    const context = shallow(<Shelters
      onGeolocation={onGeolocation}
      onSelectAddress={onSelectAddress}
      {...defaultProps}
    />);

    expect(context.find(<SearchBox onGeolocation={onGeolocation} onSelectAddress={onSelectAddress} />).length).to.equal(1);
  });

  it('should contain SheltersMap component', () => {
    const shelters = [{ name: 'shelter 1 '}];
    const routes = 'route 69';
    const youAreHere = [5, 8];
    const bounds = [15, 1];
    const selectedShelterId = 1355;
    const context = shallow(<Shelters
      {...defaultProps}
      routes={routes}
      bounds={bounds}
      shelters={shelters}
      youAreHere={youAreHere}
      selectedShelterId={selectedShelterId}
      onSelectShelter={sinon.spy()}
    />);

    expect(context.find(<SheltersMap
      routes={routes}
      shelters={shelters}
      center={youAreHere}
      youAreHere={youAreHere}
      bounds={bounds}
      selectedShelterId={selectedShelterId}
    />).length)
      .to.equal(1, 'Expected ShelersMap component to exist');
  });

  it('should call onSetBounds upon SheltersMap onBBoxChange and bounds is set', () => {
    const onSetBounds = sinon.spy();
    const wrapper = shallow(<Shelters
      {...defaultProps}
      bounds={[1, 2, 3, 4]}
      onSetBounds={onSetBounds}
    />);

    wrapper.find(<SheltersMap />).simulate('BBoxChange', {});

    expect(onSetBounds).to.have.been.calledWith([]);
  });

  it('should not call onBBoxChange upon SearchBox focus', () => {
    const onBBoxChange = sinon.spy();
    const fakeTimer = sinon.useFakeTimers();
    const bbox = { bbox: 10, oldBBox: 8, oldZoom: 16, zoom: 15 };
    const wrapper = shallow(<Shelters {...defaultProps} onBBoxChange={onBBoxChange} />);

    wrapper.find(SearchBox).attr('onFocus')();
    wrapper.find(<SheltersMap />).simulate('BBoxChange', bbox);
    fakeTimer.tick(500);

    expect(onBBoxChange).to.not.have.been.called;

    wrapper.find(SearchBox).attr('onBlur')();
    wrapper.find(<SheltersMap />).simulate('BBoxChange', bbox);
    fakeTimer.tick(500);

    expect(onBBoxChange).to.have.been.called;
  });

  it('should call onBBoxChange upon SheltersMap onBBoxChange', () => {
    const onBBoxChange = sinon.spy();
    const fakeTimer = sinon.useFakeTimers();
    const wrapper = shallow(<Shelters
      {...defaultProps}
      loading
      onBBoxChange={onBBoxChange}
    />);

    const bbox = { bb: 'ox' };
    wrapper.find(<SheltersMap />).simulate('BBoxChange', { bbox, zoom: 20 });

    fakeTimer.tick(100);
    expect(onBBoxChange).to.not.have.been.called;

    wrapper.render(<Shelters {...defaultProps} loading={false} onBBoxChange={onBBoxChange} />);

    fakeTimer.tick(100);
    expect(onBBoxChange).to.have.been.calledWith(bbox);
  });

  it('should debounce onBBoxChange upon SheltersMap onBBoxChange', () => {
    const onBBoxChange = sinon.spy();
    const fakeTimer = sinon.useFakeTimers();
    sinon.spy(fakeTimer, 'clearInterval');
    const wrapper = shallow(<Shelters
      {...defaultProps}
      onBBoxChange={onBBoxChange}
    />);
    
    wrapper.find(<SheltersMap />).simulate('BBoxChange', { bbox: 1, zoom: 20 });
    wrapper.find(<SheltersMap />).simulate('BBoxChange', { bbox: 2, zoom: 20 });

    expect(fakeTimer.clearInterval).to.have.been.calledOnce;

    fakeTimer.tick(200);

    expect(fakeTimer.clearInterval).to.have.been.calledTwice;
    expect(onBBoxChange).to.have.callCount(1);
    fakeTimer.restore();
  });

  it('should not call onBBoxChange when receiving an onBBoxChange event with higher zoom', () => {
    const onBBoxChange = sinon.spy();
    const fakeTimer = sinon.useFakeTimers();
    const wrapper = shallow(<Shelters {...defaultProps} onBBoxChange={onBBoxChange} />);

    wrapper.find(<SheltersMap />).simulate('BBoxChange', {
      bbox: 1,
      oldBBox: 2,
      oldZoom: 20,
      zoom: 21,
    });

    fakeTimer.tick(100);

    expect(onBBoxChange).to.not.have.been.called;
  });

  it('should not call onBBoxChange when bbox hasn\'t changed', () => {
    const onBBoxChange = sinon.spy();
    const fakeTimer = sinon.useFakeTimers();
    const wrapper = shallow(<Shelters {...defaultProps} onBBoxChange={onBBoxChange} />);

    wrapper.find(<SheltersMap />).simulate('BBoxChange', {
      bbox: 22,
      oldBBox: 22,
      oldZoom: 16,
      zoom: 15,
    });

    fakeTimer.tick(100);

    expect(onBBoxChange).to.not.have.been.called;
  });

  it('should display a MapNotification upon onBBoxChange and zoom level is too low', () => {
    const wrapper = shallow(<Shelters {...defaultProps} />);

    wrapper.find(<SheltersMap />).simulate('BBoxChange', { bbox: 1, zoom: 13 });

    expect(wrapper.find(<MapNotification />).length).to.equal(1);

    wrapper.rerender();
    wrapper.find(<SheltersMap />).simulate('BBoxChange', { bbox: 1, zoom: 14 });

    expect(wrapper.find(<MapNotification />).length).to.equal(0);
  });

  it('should provide Ytterhogdal as center if youAreHere is empty', () => {
    const context = shallow(<Shelters
      {...defaultProps}
    />);

    expect(context.find(<SheltersMap />).attr('center')).to.eql([62.166667, 14.95]);
  });

  it('should change route and keep center upon clicking on a shelter on SheltersMap', () => {
    jest.mock('preact-router');

    const shelter = { id: 37 };
    const routes = 'route 69';
    const center = {
      lat: 5,
      lon: 9,
    };

    const context = shallow(<Shelters
      routes={routes}
      shelters={[shelter]}
      youAreHere={[center.lat, center.lon]}
      {...defaultProps}
    />);

    context.find(<SheltersMap />).attr('onSelectShelter')(shelter);

    // https://github.com/facebook/jest/issues/890
    expect(route).to.have.been.called;
  });

  it('should display ShelterDetail when a clicking on a shelter', () => {
    const shelter = { shelterId: '1337', position: {} };
    const context = shallow(<Shelters
      shelters={[shelter]}
      selectedShelter={shelter}
      {...defaultProps}
    />);
    context.setState({ hideShelterDetail: true });

    context.find(<SheltersMap />).attr('onSelectShelter')(shelter);
    context.rerender();

    expect(context.find(<ShelterDetail open={true} shelter={shelter} />).length).to.equal(1);
  });

  it('should change route when no center is given upon clicking on a shelter', () => {
    jest.mock('preact-router');

    const shelter = { id: 37 };
    const routes = 'route 69';
    const context = shallow(<Shelters
      routes={routes}
      shelters={[shelter]}
      {...defaultProps}
    />);

    context.find(<SheltersMap />).attr('onSelectShelter')(shelter);

    expect(route).to.have.been
      .calledWith(`/skyddsrum/${shelter.shelterId}`);
  });

  it('should reverse geocode coordinates upon load', () => {
    const lat = 10.11;
    const lon = 12.13;

    shallow(<Shelters
      youAreHere={[lat, lon]}
      {...defaultProps}
    />);

    expect(defaultProps.reverseGeocode).to.have.been.calledWith([lat, lon]);
  });

  it('should select accurate shelter when an selectedShelterId prop is set', () => {
    const id = 'this-is-the-id';
    const onSelectShelter = sinon.spy();

    shallow(<Shelters
      selectedShelterId={id}
      onSelectShelter={onSelectShelter}
      {...defaultProps}
    />);

    expect(onSelectShelter).to.have.been.calledWith(id);
  });

  it('should select already fetched shelter upon new selectedShelterId received', () => {
    const shelter = { shelterId: 56 };
    const onSelectShelter = sinon.spy();
    const context = shallow(<Shelters
      shelters={[shelter]}
      onSelectShelter={onSelectShelter}
      {...defaultProps}
    />);

    context.render(<Shelters
      shelters={[shelter]}
      selectedShelterId={shelter.shelterId}
      {...defaultProps}
    />);

    expect(onSelectShelter).to.have.been.calledWith(shelter.shelterId);
  });

  it('should select shelter when a new selectedShelterId is received', () => {
    const shelters = [{ id: 56 }];
    const newShelter = { id: 59 };
    const onSelectShelter = sinon.spy();
    const context = shallow(<Shelters
      shelters={shelters}
      onSelectShelter={onSelectShelter}
      {...defaultProps}
    />);

    context.render(<Shelters
      shelters={shelters}
      selectedShelterId={newShelter.id}
      onSelectShelter={onSelectShelter}
      {...defaultProps}
    />);

    expect(onSelectShelter).to.have.been.calledWith(newShelter.id);
  });

  it('should unselect shelter when a falsy selectedShelterId is received', () => {
    const shelters = [{ id: 56, position: {} }];
    const oldShelter = { id: 59 };
    const onUnselectShelter = sinon.spy();
    const context = shallow(<Shelters
      shelters={shelters}
      selectedShelterId={oldShelter.id}
      onSelectShelter={sinon.spy()}
      onUnselectShelter={onUnselectShelter}
      {...defaultProps}
    />);

    context.render(<Shelters
      shelters={shelters}
      onUnselectShelter={onUnselectShelter}
      {...defaultProps}
    />);

    expect(onUnselectShelter).to.have.been.calledWith();
  });

  it('should display ShelterDetail when a new selectedShelter is received', () => {
    const shelter = { shelterId: '1337', position: {} };
    const context = shallow(<Shelters
      shelters={[shelter]}
      {...defaultProps}
    />);
    context.setState({ hideShelterDetail: true });

    expect(context.find(<ShelterDetail open={true} />).length).to.equal(0);

    context.find(<SheltersMap />).attr('onSelectShelter')(shelter);
    context.render(<Shelters
      shelters={[shelter]}
      selectedShelter={shelter}
      {...defaultProps}
    />);

    expect(context.find(<ShelterDetail open={true} shelter={shelter} />).length).to.equal(1);
  });

  it('should hide ShelterDetail when a falsy selectedShelter is received', () => {
    const shelter = { shelterId: '1337', position: {} };
    const context = shallow(<Shelters
      shelters={[shelter]}
      selectedShelter={shelter}
      {...defaultProps}
    />);
    context.setState({ hideShelterDetail: false });

    expect(context.find(<ShelterDetail open={true} />).length).to.equal(1);

    context.render(<Shelters
      shelters={[shelter]}
      selectedShelter={false}
      {...defaultProps}
    />);

    expect(context.find(<ShelterDetail open={true} />).length).to.equal(0);
  });

  it('should hide ShelterDetail upon closing selected shelter', () => {
    const selectedShelter = { shelterId: '1337', position: {} };
    const context = shallow(<Shelters
      selectedShelter={selectedShelter}
      shelters={[]}
      {...defaultProps}
    />);

    context.find(<ShelterDetail />).attr('onClose')();
    context.rerender();

    expect(context.find(<ShelterDetail open={false} />).length).to.equal(1);
  });

  it('should not throw an error if shelterDetailElem or it\'s base property is falsy', () => {
    let context = shallow(<Shelters
      {...defaultProps}
    />);

    expect(() => context.render(null)).to.not.throw();

    context = shallow(<Shelters
      {...defaultProps}
    />);
    const component = context.component();
    component.shelterDetailElem = {
      base: null,
    };

    expect(() => context.render(null)).to.not.throw();
  });
});

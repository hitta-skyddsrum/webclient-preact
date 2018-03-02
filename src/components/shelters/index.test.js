import { h } from 'preact';
import { route } from 'preact-router';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'preact-render-spy';
import Helmet from 'preact-helmet';

import Shelters from './';

import SheltersMap from '../shelters-map';
import ErrorDialog from '../error-dialog';
import LoadingIndicator from '../loading-indicator';
import ShelterDetail from '../shelter-detail';
import SearchBox from '../search-box';

describe('components/shelters', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      fetchShelters: sinon.spy(),
      reverseGeocode: sinon.spy(),
      selectedAddress: {},
    };
  });

  it('displays a correct title', () => {
    const selectedAddress = {
      name: 'Gatvägen 1',
    };
    const context = shallow(<Shelters
      fetchShelters={sinon.spy()}
      selectedAddress={{}}
      reverseGeocode={sinon.spy()}
    />);

    expect(context.find(<Helmet />).length).to.equal(0);

    context.render(<Shelters
      fetchShelters={sinon.spy()}
      selectedAddress={selectedAddress}
      reverseGeocode={sinon.spy()}
    />);

    expect(context.find(<Helmet />).attr('title')).to.match(new RegExp(selectedAddress.name));
  });

  it('displays a LoadingIndicator when loading is truthy', () => {
    const context = shallow(<Shelters loading={4} {...defaultProps} />);

    expect(context.find(<LoadingIndicator />).length).to.equal(1);
  });

  it('displays an ErrorDialog upon incoming humanError', () => {
    const humanError = {
      message: 'Varning',
      desc: 'Hold on',
    };
    const context = shallow(<Shelters
      shelters={[]}
      {...defaultProps}
    />);

    expect(context.find(<ErrorDialog />).length).to.equal(0);

    context.render(<Shelters
      humanError={humanError}
      shelters={[]}
      {...defaultProps}
    />);

    expect(context.find(<ErrorDialog title={humanError.message} desc={humanError.desc} />).length).to.equal(1);
  });

  it('fires onCloseError upon closing ErrorDialog', () => {
    const onCloseError = sinon.spy();
    const context = shallow(<Shelters
      humanError={new Error('What\'s going on?')}
      onCloseErrorDialog={onCloseError}
      {...defaultProps}
    />);

    context.find(<ErrorDialog />).attr('handleClose')();

    expect(onCloseError.calledOnce).to.equal(true);
  });

  it('should contain a SearchBox container', () => {
    const onSelectAddress = sinon.spy();
    const context = shallow(<Shelters
      onSelectAddress={onSelectAddress}
      {...defaultProps}
    />);

    expect(context.find(<SearchBox onSelectAddress={onSelectAddress} />).length).to.equal(1);
  });

  it('should contain SheltersMap component', () => {
    const shelters = [{ name: 'shelter 1 '}];
    const routes = 'route 69';
    const youAreHere = [5, 8];
    const bounds = [15, 1];
    const selectedShelterId = 1355;
    const context = shallow(<Shelters
      routes={routes}
      bounds={bounds}
      shelters={shelters}
      youAreHere={youAreHere}
      selectedShelterId={selectedShelterId}
      onSelectShelter={sinon.spy()}
      {...defaultProps}
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
      .calledWith(`/skyddsrum/${shelter.id}`);
  });

  it('should fetch shelters upon load', () => {
    const lat = 14.53;
    const lon = 12.01;

    shallow(<Shelters
      youAreHere={[lat, lon]}
      {...defaultProps}
    />);

    expect(defaultProps.fetchShelters).to.have.been.calledWith([lat, lon]);
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
    const shelter = { id: 56 };
    const onSelectShelter = sinon.spy();
    const context = shallow(<Shelters
      shelters={[shelter]}
      onSelectShelter={onSelectShelter}
      {...defaultProps}
    />);

    context.render(<Shelters
      shelters={[shelter]}
      selectedShelterId={shelter.id}
      {...defaultProps}
    />);

    expect(onSelectShelter).to.have.been.calledWith(shelter.id);
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

  it('should fetch shelters when a falsy selectedShelterId is received', () => {
    const oldShelter = { id: 59 };
    const context = shallow(<Shelters
      selectedShelterId={oldShelter.id}
      onSelectShelter={sinon.spy()}
      onUnselectShelter={sinon.spy()}
      {...defaultProps}
    />);

    const youAreHere = [111, 222];

    context.render(<Shelters
      onUnselectShelter={sinon.spy()}
      youAreHere={youAreHere}
      {...defaultProps}
    />);

    expect(defaultProps.fetchShelters).to.have.been.calledWith(youAreHere);
  });

  it('should fetch shelters when a new youAreHere is received', () => {
    const context = shallow(<Shelters
      {...defaultProps}
    />);

    defaultProps.fetchShelters.resetHistory();
    const youAreHere = [123123, 78912, 123];

    context.render(<Shelters
      youAreHere={youAreHere}
      {...defaultProps}
    />);

    expect(defaultProps.fetchShelters).to.have.been.calledWith(youAreHere);
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
});

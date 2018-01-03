import { h } from 'preact';
import { route } from 'preact-router';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'preact-render-spy';
import Shelters from './';

import SheltersMap from '../shelters-map';
import ErrorDialog from '../error-dialog';
import LoadingIndicator from '../loading-indicator';
import ShelterDetail from '../shelter-detail';
import SearchBox from '../../containers/search-box';

describe('containers/shelters', () => {
  let fetchShelters;

  beforeEach(() => {
    fetchShelters = sinon.spy();
  });

  it('displays a LoadingIndicator when loading is truthy', () => {
    const context = shallow(<Shelters fetchShelters={fetchShelters} loading={4} />);

    expect(context.find(<LoadingIndicator />).length).to.equal(1);
  });

  it('displays an ErrorDialog upon incoming humanError', () => {
    const fetchShelters = sinon.spy();
    const humanError = {
      message: 'Varning',
      desc: 'Hold on',
    };
    const context = shallow(<Shelters
      fetchShelters={fetchShelters}
      shelters={[]}
    />);

    expect(context.find(<ErrorDialog />).length).to.equal(0);

    context.render(<Shelters
      humanError={humanError}
      fetchShelters={fetchShelters}
      shelters={[]}
    />);

    expect(context.find(<ErrorDialog title={humanError.message} desc={humanError.desc} />).length).to.equal(1);
  });

  it('fires clearError upon closing ErrorDialog', () => {
    const clearError = sinon.spy();
    const context = shallow(<Shelters
      fetchShelters={sinon.spy()}
      humanError={new Error('What\'s going on?')}
      clearError={clearError}
    />);

    context.find(<ErrorDialog />).attr('handleClose')();

    expect(clearError.calledOnce).to.equal(true);
  });

  it('should contain a SearchBox container', () => {
    const context = shallow(<Shelters
      fetchShelters={fetchShelters}
    />);

    expect(context.find(<SearchBox />).length).to.equal(1);
  });

  it('should contain SheltersMap component', () => {
    const shelters = [{ name: 'shelter 1 '}];
    const routes = 'route 69';
    const center = [5, 8];
    const bounds = [15, 1];
    const context = shallow(<Shelters
      routes={routes}
      bounds={bounds}
      shelters={shelters}
      fetchShelters={fetchShelters}
      lat={center[0]}
      lon={center[1]}
    />);

    expect(context.find(<SheltersMap
      routes={routes}
      shelters={shelters}
      center={center}
      bounds={bounds}
    />).length)
      .to.equal(1, 'Expected ShelersMap component to exist');
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
      fetchShelters={fetchShelters}
      lat={center.lat}
      lon={center.lon}
    />);

    context.find(<SheltersMap />).attr('onSelectShelter')(shelter);

    // https://github.com/facebook/jest/issues/890
    expect(route).to.have.been.called;
  });

  it('should display ShelterDetail when a clicking on a shelter', () => {
    const fetchRouteToShelter = sinon.spy();
    const shelter = { shelterId: '1337', position: {} };
    const context = shallow(<Shelters
      shelters={[shelter]}
      selectedShelter={shelter}
      fetchRouteToShelter={fetchRouteToShelter}
      fetchShelters={fetchShelters}
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
      fetchShelters={fetchShelters}
    />);

    context.find(<SheltersMap />).attr('onSelectShelter')(shelter);

    expect(route).to.have.been
      .calledWith(`/skyddsrum/${shelter.id}`);
  });

  it('should fetch shelters upon load', () => {
    const lat = 14.53;
    const lon = 12.01;

    shallow(<Shelters lat={lat} lon={lon} fetchShelters={fetchShelters} />);

    expect(fetchShelters).to.have.been.calledWith(lat, lon);
  });

  it('should select accurate shelter when an id prop is set', () => {
    const id = 'this-is-the-id';
    const handleSelectShelter = sinon.spy();

    shallow(<Shelters
      id={id}
      handleSelectShelter={handleSelectShelter}
    />);

    expect(handleSelectShelter).to.have.been.calledWith(id);
  });

  it('should select already fetched shelter upon new id received', () => {
    const shelter = { id: 56 };
    const handleSelectShelter = sinon.spy();
    const fetchSingleShelter = sinon.spy();
    const context = shallow(<Shelters
      shelters={[shelter]}
      fetchShelters={fetchShelters}
      fetchSingleShelter={fetchSingleShelter}
      handleSelectShelter={handleSelectShelter}
    />);

    context.render(<Shelters shelters={[shelter]} id={shelter.id} />);

    expect(handleSelectShelter).to.have.been.calledWith(shelter.id);
  });

  it('should select shelter when a new id is received', () => {
    const shelters = [{ id: 56 }];
    const newShelter = { id: 59 };
    const handleSelectShelter = sinon.spy();
    const context = shallow(<Shelters
      shelters={shelters}
      fetchShelters={fetchShelters}
      handleSelectShelter={handleSelectShelter}
    />);

    context.render(<Shelters
      shelters={shelters}
      id={newShelter.id}
      fetchShelters={fetchShelters}
      handleSelectShelter={handleSelectShelter}
    />);

    expect(handleSelectShelter).to.have.been.calledWith(newShelter.id);
  });

  it('should unselect shelter when a falsy id is received', () => {
    const shelters = [{ id: 56, position: {} }];
    const oldShelter = { id: 59 };
    const handleUnselectShelter = sinon.spy();
    const context = shallow(<Shelters
      shelters={shelters}
      id={oldShelter.id}
      fetchShelters={fetchShelters}
      handleSelectShelter={sinon.spy()}
      handleUnselectShelter={handleUnselectShelter}
    />);

    context.render(<Shelters
      shelters={shelters}
      fetchShelters={fetchShelters}
      handleUnselectShelter={handleUnselectShelter}
    />);

    expect(handleUnselectShelter).to.have.been.calledWith();
  });

  it('should fetch route to shelter when selectedShelter is updated', () => {
    const center = { lat: 14, lon: 17 };
    const fetchRouteToShelter = sinon.spy();
    const context = shallow(<Shelters
      lat={center.lat}
      lon={center.lon}
      fetchShelters={fetchShelters}
      fetchRouteToShelter={fetchRouteToShelter}
      shelters={[]}
    />);
    const selectedShelter = { position: { lat: 180, long: 183 } };

    context.render(<Shelters shelters={[]} selectedShelter={selectedShelter} />);

    expect(fetchRouteToShelter).to.have.been.calledWith(
      center,
      { lat: selectedShelter.position.lat, lon: selectedShelter.position.long }
    );
  });

  it('should not fetch route to shelter when selectedShelter is updated and no lat is provided', () => {
    const fetchRouteToShelter = sinon.spy();
    const context = shallow(<Shelters
      fetchShelters={fetchShelters}
      fetchRouteToShelter={fetchRouteToShelter}
      shelters={[]}
    />);
    const selectedShelter = { position: { lat: 180, long: 183 } };

    context.render(<Shelters shelters={[]} selectedShelter={selectedShelter} />);

    expect(fetchRouteToShelter).to.not.have.been.called;
  });

  it('should not fetch route to shelter when selectedShelter is updated with falsy value', () => {
    const fetchRouteToShelter = sinon.spy();
    const context = shallow(<Shelters
      fetchShelters={fetchShelters}
      fetchRouteToShelter={fetchRouteToShelter}
      shelters={[]}
    />);

    context.render(<Shelters shelters={[]} selectedShelter={undefined} />);

    expect(fetchRouteToShelter).to.not.have.been.called;
  });

  it('should display ShelterDetail when a new selectedShelter is received', () => {
    const fetchRouteToShelter = sinon.spy();
    const shelter = { shelterId: '1337', position: {} };
    const context = shallow(<Shelters
      shelters={[shelter]}
      fetchRouteToShelter={fetchRouteToShelter}
      fetchShelters={fetchShelters}
    />);
    context.setState({ hideShelterDetail: true });

    expect(context.find(<ShelterDetail open={true} />).length).to.equal(0);

    context.find(<SheltersMap />).attr('onSelectShelter')(shelter);
    context.render(<Shelters
      shelters={[shelter]}
      selectedShelter={shelter}
    />);

    expect(context.find(<ShelterDetail open={true} shelter={shelter} />).length).to.equal(1);
  });

  it('should hide ShelterDetail upon closing selected shelter', () => {
    const fetchRouteToShelter = sinon.spy();
    const selectedShelter = { shelterId: '1337', position: {} };
    const context = shallow(<Shelters
      fetchRouteToShelter={fetchRouteToShelter}
      selectedShelter={selectedShelter}
      fetchShelters={fetchShelters}
      shelters={[]}
    />);

    context.find(<ShelterDetail />).attr('onClose')();
    context.rerender();

    expect(context.find(<ShelterDetail open={false} />).length).to.equal(1);
  });
});

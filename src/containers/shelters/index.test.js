import { h } from 'preact';
import { route } from 'preact-router';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'preact-render-spy';
import { Shelters } from './';

import SheltersMap from '../../components/shelters-map';
import ErrorDialog from '../../components/error-dialog';
import LoadingIndicator from '../../components/loading-indicator';
import ShelterDetail from '../../components/shelter-detail';

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

  it('should contain SheltersMap component', () => {
    const shelters = [{ name: 'shelter 1 '}];
    const routes = 'route 69';
    const center = [5, 8];
    const bounds = [15, 1];
    const context = shallow(<Shelters
      routes={routes}
      shelters={shelters}
      fetchShelters={fetchShelters}
      lat={center[0]}
      lon={center[1]}
    />);

    context.setState({ bounds });

    expect(context.find(<SheltersMap
      routes={routes}
      shelters={shelters}
      center={center}
      bounds={bounds}
    />).length)
      .to.equal(1, 'Expected ShelersMap component to exist');
  });

  it('should change route upon clicking on a shelter on SheltersMap', () => {
    jest.mock('preact-router');

    const shelter = { id: 37 };
    const routes = 'route 69';
    const center = [5, 8];
    const context = shallow(<Shelters
      routes={routes}
      shelters={[shelter]}
      fetchShelters={fetchShelters}
      lat={center[0]}
      lon={center[1]}
    />);

    context.find(<SheltersMap />).attr('onSelectShelter')(shelter);

    expect(route).to.have.been.calledWith(`/skyddsrum/${shelter.id}`);
  });

  it('should fetch shelters upon load', () => {
    const lat = 14.53;
    const lon = 12.01;

    shallow(<Shelters lat={lat} lon={lon} fetchShelters={fetchShelters} />);

    expect(fetchShelters).to.have.been.calledWith(lat, lon);
  });

  it('should fetch accurate shelter when an id prop is set', () => {
    const id = 'this-is-the-id';
    const handleSelectShelter = sinon.spy();
    const fetchSingleShelter = sinon.stub();
    const shelter = { shelterId: 12345 };
    fetchSingleShelter.returns(Promise.resolve({ shelter }));

    shallow(<Shelters
      id={id}
      handleSelectShelter={handleSelectShelter}
      fetchShelters={fetchShelters}
      fetchSingleShelter={fetchSingleShelter}
    />);

    expect(fetchSingleShelter).to.have.been.calledWith(id);
    expect(fetchShelters).to.not.have.been.called;

    return new Promise(resolve => setTimeout(resolve, 0))
      .then(() => expect(handleSelectShelter).to.have.been.calledWith(shelter));
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

    expect(handleSelectShelter).to.have.been.calledWith(shelter);
    expect(fetchSingleShelter).to.not.have.been.called;
  });

  it('should fetch shelters when a new id is received and shelter isn\'t already fetched', () => {
    const shelters = [{ id: 56 }];
    const newShelter = { id: 59 };
    const handleSelectShelter = sinon.spy();
    const fetchSingleShelter = sinon.stub();
    fetchSingleShelter.returns(Promise.resolve({ shelter: newShelter }));
    const context = shallow(<Shelters
      shelters={shelters}
      fetchShelters={fetchShelters}
      fetchSingleShelter={fetchSingleShelter}
      handleSelectShelter={handleSelectShelter}
    />);

    context.render(<Shelters
      shelters={shelters}
      id={newShelter.id}
      fetchShelters={fetchShelters}
      fetchSingleShelter={fetchSingleShelter}
      handleSelectShelter={handleSelectShelter}
    />);

    expect(fetchSingleShelter).to.have.been.calledWith(newShelter.id);

    return new Promise(resolve => setTimeout(resolve, 0))
      .then(() => expect(handleSelectShelter).to.have.been.calledWith(newShelter));
  });

  it('should set state property bounds upon first shelters received', () => {
    const smallest = { lat: 1, long: 2 };
    const biggest = { lat: 300, long: 400 };
    const shelters = [
      { position: { lat: 14, long: 3 } },
      { position: biggest },
      { position: smallest },
      { position: { lat: 20, long: 154 } },
    ];
    const context = shallow(<Shelters shelters={[]} fetchShelters={fetchShelters} />);

    context.render(<Shelters shelters={shelters} />);
    const bounds = [[smallest.lat, smallest.long], [biggest.lat, biggest.long]];

    expect(context.state('bounds')).to.eql(bounds);

    context.render(<Shelters shelters={[...shelters, { position: { lat: 3000, lon: 4000 } }]} />);

    expect(context.state('bounds')).to.eql(bounds);
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

  it('should display ShelterDetail upon selected shelter', () => {
    const fetchRouteToShelter = sinon.spy();
    const context = shallow(<Shelters
      shelters={[]}
      fetchRouteToShelter={fetchRouteToShelter}
      fetchShelters={fetchShelters}
    />);
    context.setState({ hideShelterDetail: true });

    expect(context.find(<ShelterDetail />).length).to.equal(0);

    const selectedShelter = { shelterId: '1337', position: {} };

    context.render(<Shelters
      fetchShelters={fetchShelters}
      shelters={[]}
      selectedShelter={selectedShelter}
    />);

    expect(context.find(<ShelterDetail open={true} shelter={selectedShelter} />).length).to.equal(1);
  });

  it('should hide ShelterDetail upon selected shelter', () => {
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

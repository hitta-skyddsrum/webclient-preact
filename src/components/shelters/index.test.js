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

  it('fires onCloseError upon closing ErrorDialog', () => {
    const onCloseError = sinon.spy();
    const context = shallow(<Shelters
      fetchShelters={sinon.spy()}
      humanError={new Error('What\'s going on?')}
      onCloseErrorDialog={onCloseError}
    />);

    context.find(<ErrorDialog />).attr('handleClose')();

    expect(onCloseError.calledOnce).to.equal(true);
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
    const youAreHere = [5, 8];
    const bounds = [15, 1];
    const context = shallow(<Shelters
      routes={routes}
      bounds={bounds}
      shelters={shelters}
      fetchShelters={fetchShelters}
      youAreHere={youAreHere}
    />);

    expect(context.find(<SheltersMap
      routes={routes}
      shelters={shelters}
      center={youAreHere}
      youAreHere={youAreHere}
      bounds={bounds}
    />).length)
      .to.equal(1, 'Expected ShelersMap component to exist');
  });

  it('should provide Ytterhogdal as center if youAreHere is empty', () => {
    const context = shallow(<Shelters
      fetchShelters={fetchShelters}
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
      fetchShelters={fetchShelters}
      youAreHere={[center.lat, center.lon]}
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

    shallow(<Shelters youAreHere={[lat, lon]} fetchShelters={fetchShelters} />);

    expect(fetchShelters).to.have.been.calledWith([lat, lon]);
  });

  it('should select accurate shelter when an selectedShelterId prop is set', () => {
    const id = 'this-is-the-id';
    const onSelectShelter = sinon.spy();

    shallow(<Shelters
      selectedShelterId={id}
      onSelectShelter={onSelectShelter}
    />);

    expect(onSelectShelter).to.have.been.calledWith(id);
  });

  it('should select already fetched shelter upon new selectedShelterId received', () => {
    const shelter = { id: 56 };
    const onSelectShelter = sinon.spy();
    const context = shallow(<Shelters
      shelters={[shelter]}
      fetchShelters={fetchShelters}
      onSelectShelter={onSelectShelter}
    />);

    context.render(<Shelters shelters={[shelter]} selectedShelterId={shelter.id} />);

    expect(onSelectShelter).to.have.been.calledWith(shelter.id);
  });

  it('should select shelter when a new selectedShelterId is received', () => {
    const shelters = [{ id: 56 }];
    const newShelter = { id: 59 };
    const onSelectShelter = sinon.spy();
    const context = shallow(<Shelters
      shelters={shelters}
      fetchShelters={fetchShelters}
      onSelectShelter={onSelectShelter}
    />);

    context.render(<Shelters
      shelters={shelters}
      selectedShelterId={newShelter.id}
      fetchShelters={fetchShelters}
      onSelectShelter={onSelectShelter}
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
      fetchShelters={fetchShelters}
      onSelectShelter={sinon.spy()}
      onUnselectShelter={onUnselectShelter}
    />);

    context.render(<Shelters
      shelters={shelters}
      fetchShelters={fetchShelters}
      onUnselectShelter={onUnselectShelter}
    />);

    expect(onUnselectShelter).to.have.been.calledWith();
  });

  it('should fetch shelters when a falsy selectedShelterId is received', () => {
    const oldShelter = { id: 59 };
    const context = shallow(<Shelters
      selectedShelterId={oldShelter.id}
      fetchShelters={fetchShelters}
      onSelectShelter={sinon.spy()}
      onUnselectShelter={sinon.spy()}
    />);

    context.render(<Shelters
      fetchShelters={fetchShelters}
      onUnselectShelter={sinon.spy()}
    />);

    expect(fetchShelters).to.have.been.calledWith();
  });

  it('should display ShelterDetail when a new selectedShelter is received', () => {
    const shelter = { shelterId: '1337', position: {} };
    const context = shallow(<Shelters
      shelters={[shelter]}
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
    const selectedShelter = { shelterId: '1337', position: {} };
    const context = shallow(<Shelters
      selectedShelter={selectedShelter}
      fetchShelters={fetchShelters}
      shelters={[]}
    />);

    context.find(<ShelterDetail />).attr('onClose')();
    context.rerender();

    expect(context.find(<ShelterDetail open={false} />).length).to.equal(1);
  });
});

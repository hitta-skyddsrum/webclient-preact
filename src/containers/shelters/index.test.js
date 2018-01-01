import { h } from 'preact';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'preact-render-spy';
import { Shelters } from './';
import SheltersMap from '../../components/shelters-map';
import ErrorDialog from '../../components/error-dialog';

describe('containers/shelters', () => {
  let fetchShelters;

  beforeEach(() => {
    fetchShelters = sinon.spy();
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
    const handleSelectShelter = sinon.spy();
    const bounds = [15, 1];
    const context = shallow(<Shelters
      routes={routes}
      shelters={shelters}
      fetchShelters={fetchShelters}
      lat={center[0]}
      lon={center[1]}
      handleSelectShelter={handleSelectShelter}
    />);

    context.setState({ bounds });

    expect(context.find(<SheltersMap
      routes={routes}
      shelters={shelters}
      center={center}
      onSelectShelter={handleSelectShelter}
      bounds={bounds}
    />).length)
      .to.equal(1, 'Expected ShelersMap component to exist');
  });

  it('should fetch shelters upon load', () => {
    const lat = 14.53;
    const lon = 12.01;

    shallow(<Shelters lat={lat} lon={lon} fetchShelters={fetchShelters} />);

    expect(fetchShelters).to.have.been.calledWith(lat, lon);
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
});

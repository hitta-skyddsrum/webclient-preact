import { h } from 'preact';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import L from 'leaflet';
import { Marker } from 'react-leaflet';
import ShelterMarker from './';

describe('components/shelter-marker', () => {
  it('should render a Marker component', () => {
    const shelter = {
      position: { lat: 1, long: 2 },
    };
    const iconSize = 300;
    sinon.stub(L, 'icon');
    const wrapper = shallow(<ShelterMarker iconSize={iconSize} shelter={shelter} />);
    const marker = wrapper.findWhere(n => n.type() === Marker && n.props().position[0] === shelter.position.lat && n.props().position[1] === shelter.position.long);

    expect(marker.length).to.equal(1);
    expect(L.icon).to.have.been.calledWithMatch({
      className: 'shelter',
      iconSize,
    });
  });

  it('should call onClick upon click', () => {
    const onClick = sinon.spy();
    const shelter = { position: {} };
    const wrapper = shallow(<ShelterMarker shelter={shelter} onClick={onClick} />);

    wrapper.find(Marker).props().onClick();

    expect(onClick).to.have.been.calledWith(shelter);
  });
});


import { h } from 'preact';
import { expect } from 'chai';
import { shallow } from 'preact-render-spy';
import sinon from 'sinon';
import Helmet from 'preact-helmet';

import List from 'preact-material-components/List';
import BottomSheet from '../bottom-sheet';
import ShelterDetail from './';

describe('components/shelter-detail', () => {
  const shelter = {
    shelterId: 'shelter-1',
    estateId: 'real estate',
    airCleaners: 42219263,
    slots: 300303,
    address: 'Abiskovägen 3',
    municipality: 'Jukkasjärvi',
    position: {
      lat: 11111111,
      long: 22222222,
    },
  };

  it('should be able to render without provided shelter', () => {
    expect(shallow(<ShelterDetail />)).to.not.throw;
  });

  it('should hide all content when no shelter is provided', () => {
    const context = shallow(<ShelterDetail />);

    expect(context.find(<Helmet />).length).to.equal(0);
    expect(context.find(<List />).length).to.equal(0);
  });

  it('should set the title when a shelter.shelterId is provided', () => {
    const context = shallow(<ShelterDetail onHeightChange={sinon.spy()} shelter={shelter} />);

    expect(context.find(<Helmet />).attr('title')).to.match(new RegExp(shelter.shelterId));
  });

  it('should have a BottomSheet', () => {
    const onClose = sinon.spy();
    const context = shallow(<ShelterDetail
      shelter={shelter}
      open={true}
      onClose={onClose}
      onHeightChange={sinon.spy()}
    />);

    expect(context.find(<BottomSheet isOpen onClose={onClose} />).length).to.equal(1);
  });

  it('should have the shelterId as header', () => {
    const context = shallow(<ShelterDetail onHeightChange={sinon.spy()} shelter={shelter} />);

    expect(context.find('h1')).match(new RegExp(shelter.shelterId));
  });

  it('should display estate id', () => {
    const context = shallow(<ShelterDetail onHeightChange={sinon.spy()} open shelter={shelter} />);

    expect(context.find(<List />)).match(new RegExp(shelter.estateId));
  });

  it('should display address', () => {
    const context = shallow(<ShelterDetail onHeightChange={sinon.spy()} open shelter={shelter} />);

    expect(context.find(<List />)).match(new RegExp(`${shelter.address}, ${shelter.municipality}`));
  });

  it('should display amount of slots', () => {
    const context = shallow(<ShelterDetail open onHeightChange={sinon.spy()} shelter={shelter} />);

    expect(context.find(<List />)).match(new RegExp(shelter.slots));
  });

  it('should display coordinates with geo URI link', () => {
    const context = shallow(<ShelterDetail open onHeightChange={sinon.spy()} shelter={shelter} />);

    expect(context.find(<List />)).match(new RegExp(`${shelter.position.lat}, ${shelter.position.long}`));
  });
});

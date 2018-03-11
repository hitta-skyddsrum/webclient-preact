import { h } from 'preact';
import { expect } from 'chai';
import { shallow } from 'preact-render-spy';
import sinon from 'sinon';
import Helmet from 'preact-helmet';

import { List } from 'material-ui';
import { BottomSheet } from 'material-ui-bottom-sheet';
import ShelterDetail from './';

describe('components/shelter-detail', () => {
  const shelter = {
    shelterId: 'shelter-1',
    estateId: 'real estate',
    airCleaners: 42219263,
    slots: 300303,
    address: 'Abiskovägen 3',
    municipality: 'Jukkasjärvi',
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

    expect(context.find(<BottomSheet open onRequestClose={onClose} />).length).to.equal(1);
  });

  it('should attach transitionend event upon BottomSheet ref cb', () => {
    const onHeightChange = sinon.spy();
    const context = shallow(<ShelterDetail
      shelter={shelter}
      onHeightChange={onHeightChange}
      open={true}
    />);

    const refElem = {
      base: {
        addEventListener: sinon.spy(),
        removeEventListener: sinon.spy(),
        firstChild: {
        },
      },
    };

    context.find('BottomSheet').attr('ref')(refElem);

    expect(refElem.base.removeEventListener).to.have.been.calledWith('transitionend', sinon.match.func);
    expect(refElem.base.addEventListener).to.have.been.calledWith('transitionend', sinon.match.func);
    expect(onHeightChange).to.have.been.calledWith(0);
    onHeightChange.resetHistory();

    const transitionEndCb = refElem.base.addEventListener.getCall(0).args[1];

    transitionEndCb({ target: {} });
    expect(onHeightChange).to.not.have.been.called;

    transitionEndCb({ target: { firstChild: { className: '' } } });
    expect(onHeightChange).to.not.have.been.called;

    const event = {
      target: {
        firstChild: {
          offsetHeight: 9991,
          className: 'MuiPaper',
        },
      },
    };
    refElem.base.addEventListener.getCall(0).args[1](event);
    expect(onHeightChange).to.have.been.calledWith(event.target.firstChild.offsetHeight);

    context.find('BottomSheet').attr('ref')(refElem);

    expect(refElem.base.addEventListener).to.have.been.calledOnce;
  });

  it('should call onHeightChange upon BottomSheet ref cb, if firstChild is given', () => {
    const onHeightChange = sinon.spy();
    const context = shallow(<ShelterDetail
      shelter={shelter}
      onHeightChange={onHeightChange}
      open={true}
    />);

    const refElem = {
      base: {
        addEventListener: sinon.spy(),
        removeEventListener: sinon.spy(),
        firstChild: {
          offsetHeight: 1010,
        },
      },
    };

    context.find('BottomSheet').attr('ref')(refElem);

    expect(onHeightChange).to.have.been.calledWith(refElem.base.firstChild.offsetHeight);
  });

  it('should call onHeightChange(0) when bottomSheetRef dissappears', () => {
    const onHeightChange = sinon.spy();
    const context = shallow(<ShelterDetail
      shelter={shelter}
      onHeightChange={onHeightChange}
      open
    />);

    const refElem = {
      base: {
        addEventListener: sinon.spy(),
      },
    };

    context.find('BottomSheet').attr('ref')(refElem);

    context.find('BottomSheet').attr('ref')(null);

    expect(onHeightChange).to.have.been.calledWith(0);
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
});

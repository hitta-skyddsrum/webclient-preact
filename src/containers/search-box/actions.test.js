import { expect } from 'chai';
import sinon from 'sinon';

import history from '../../history';
import * as types from './types';

describe('containers/search-box/actions/getCurrentPosition', () => {
  const dispatch = sinon.spy();

  beforeEach(() => {
    sinon.stub(history, 'push');
    global.navigator.geolocation = {
      getCurrentPosition: sinon.spy(),
    };
  });

  afterEach(() => {
    history.push.restore();
  });

  afterEach(() => {
    dispatch.resetHistory();
  });

  it('should dispatch GET_CURRENT_POSITION', () => {
    require('./actions').getCurrentPosition()(dispatch);

    expect(dispatch).to.have.been.calledWith({
      type: types.GET_CURRENT_POSITION,
    });
  });

  it('should call navigator.geolocation.getCurrentPosition', () => {
    require('./actions').getCurrentPosition()(dispatch);

    expect(global.navigator.geolocation.getCurrentPosition)
      .to.have.been.calledWith(sinon.match.func, sinon.match.func);
  });

  it('should dispatch GET_CURRENT_POSITION_SUCCESS upon success', () => {
    require('./actions').getCurrentPosition()(dispatch);
    const position = {
      coords: {},
    };
    global.navigator.geolocation.getCurrentPosition.lastCall.args[0](position);

    expect(dispatch).to.have.been.calledWith({
      type: types.GET_CURRENT_POSITION_SUCCESS,
      position,
    });
  });

  it('should call history push upon GET_CURRENT_POSITION_SUCCESS', () => {
    require('./actions').getCurrentPosition()(dispatch);
    const lat = 10;
    const lon = 200;
    const position = {
      coords: {
        latitude: lat,
        longitude: lon,
      },
    };
    global.navigator.geolocation.getCurrentPosition.lastCall.args[0](position);

    expect(history.push).to.have.been.calledWith(`/skyddsrum?lat=${lat}&lon=${lon}`);
  });

  it('should dispatch GET_CURRENT_POSITION_FAILED upon failure', () => {
    require('./actions').getCurrentPosition()(dispatch);
    const error = new Error();
    global.navigator.geolocation.getCurrentPosition.lastCall.args[1](error);

    expect(dispatch).to.have.been.calledWith({
      type: types.GET_CURRENT_POSITION_FAILED,
      error,
    });
  });

  it('should dispatch GET_CURRENT_POSITION_FAILED if browser lacks support', () => {
    delete window.navigator.geolocation;
    require('./actions').getCurrentPosition()(dispatch);

    expect(dispatch).to.have.been.calledWith({
      type: types.GET_CURRENT_POSITION_FAILED,
      error: sinon.match.instanceOf(Error),
    });
    expect(dispatch.lastCall.args[0].error.toString()).to.contain('Din webbläsare');
  });
});

describe('containers/shelters/actions/selectAddress', () => {
  it('creates SELECT_ADDRESS', () => {
    const address = { add: 'res' };
    expect(require('./actions').selectAddress(address))
      .to.eql({ type: types.SELECT_ADDRESS, address });
  });
});


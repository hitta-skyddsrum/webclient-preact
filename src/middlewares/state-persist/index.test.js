import { expect } from 'chai';
import sinon from 'sinon';
import mockLocalStorage from '../../../test/mock-ls';
import { HIDE_TOOLTIP } from '../../containers/tooltip/types';
import StatePersist, { getInitialState } from './';

describe('middlewares/state-persist', () => {
  beforeEach(() => {
    mockLocalStorage();
  });

  describe('getInitialState', () => {
    it('should export initialState as an empty object if there\'s no localStorage support', () => {
      Object.defineProperty(global, '_localStorage', {
        value: undefined,
      });

      expect(getInitialState()).to.eql({});
    });

    it('should export initialState as an empty object if the storage is unparseable', () => {
      global.localStorage.getItem.returns('not JSON');

      expect(getInitialState()).to.eql({});
      expect(global.localStorage.getItem).to.have.been.called;
    });

    it('should export initialState value', () => {
      const jsonState = {
        stored: 'state',
      };
      window.localStorage.getItem.returns(JSON.stringify(jsonState));

      expect(getInitialState()).to.eql(jsonState);
    });
  });

  describe('middleware', () => {
    const fakeTimer = sinon.useFakeTimers();
    const sandbox = sinon.createSandbox();
    const store = {
      getState: sandbox.stub(),
    };
    const next = sandbox.stub();

    afterEach(() => {
      sandbox.resetHistory();
    });

    it('should call next with action value', () => {
      const result = 'result from next';
      const action = { ac: 'tion' };
      next.returns(result);
      const returnedValue = StatePersist(store)(next)(action);

      expect(next).to.have.been.calledWith(action);
      expect(returnedValue).to.equal(result);
    });

    it('should store state upon HIDE_TOOLTIP', () => {
      const Tooltip = { tool: 'tip' };
      const state = {
        DontStoreThisState: 'something',
        Tooltip,
      };
      store.getState.returns(state);

      StatePersist(store)(next)({
        type: HIDE_TOOLTIP,
      });

      expect(localStorage.setItem).to.not.have.been.called;

      fakeTimer.next();

      expect(localStorage.setItem).to.have.been.calledWith('redux_store', JSON.stringify({
        Tooltip,
      }));
    });

    it('should not try store if browser doesn\'t support localStorage', () => {
      const result = 'result from next';
      next.returns(result);
      window.localStorage = undefined;

      const returnedValue = StatePersist(store)(next)({
        type: HIDE_TOOLTIP,
      });

      fakeTimer.runAll();

      expect(returnedValue).to.equal(result);
    });
  });
});

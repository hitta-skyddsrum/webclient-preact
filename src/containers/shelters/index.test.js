import { h } from 'preact';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'preact-redux';

import { expect } from 'chai';
import { mount } from 'enzyme';
import SheltersContainer from './';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('containers/shelters', () => {
  it('should map accurate state params as props',  () => {
    const state = {
      youAreHere: [],
      selectedShelterId: 2,
      selectedAddress: {},
      loading: 0,
      humanError: {},
      shelters: [],
      routes: [],
      bounds: [],
    };
    const store = mockStore({ Shelters: state });

    const wrapper = mount(<Provider store={store}><SheltersContainer /></Provider>);

    expect(wrapper.find(SheltersContainer).props()).to.equal(1);
  });
});

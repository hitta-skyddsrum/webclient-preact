import { h } from 'preact';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'preact-render-spy';
import { route } from 'preact-router';
import AlgoliaPlaces from 'algolia-places-react';
import SearchBox from './';

describe('components/search-box', () => {
  it('should contain AlgoliaPlaces component', () => {
    expect(<SearchBox />).to.contain(<AlgoliaPlaces
      placeholder="Var vill du söka från?"
      options={{
        language: 'sv',
        countries: ['se'],
      }}
    />);
  });

  it('should change route upon address selection', () => {
    jest.mock('preact-router');

    const context = shallow(<SearchBox onSelectAddress={sinon.spy()} />);
    const algoliaPlaces = context.find('AlgoliaPlaces');
    const lat = 14.53;
    const lon = 15.54;
    algoliaPlaces.output().attributes.onChange({ suggestion: { latlng: { lat, lng: lon } }});

    expect(route).to.have.been.calledOnce;

    const args = route.args[0][0];

    expect(args).to.match(/\/skyddsrum/);
    expect(args).to.match(new RegExp(`lat=${lat}`));
    expect(args).to.match(new RegExp(`lon=${lon}`));

    jest.unmock('preact-router');
  });
});

import { h } from 'preact';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'preact-render-spy';
import { route } from 'preact-router';
import { SearchBox } from './';
import Autocomplete from '../../components/autocomplete';

describe('containers/search-box', () => {
  const onMount = sinon.spy();

  it('should contain Autocomplete component', () => {
    expect(<SearchBox onMount={onMount} />).to.contain(<Autocomplete />);
  });

  it('should call onMount upon mount', () => {
    const lat = 1453;
    const lon = 1288;
    shallow(<SearchBox lat={lat} lon={lon} onMount={onMount} />);

    expect(onMount).to.have.been.calledWith(lat, lon);
  });

  it('should set searchValue upon receiving first selectedAddress', () => {
    const context = shallow(<SearchBox onMount={onMount} />);
    const selectedAddress = {
      name: 'Im selected',
    };
    context.render(<SearchBox selectedAddress={selectedAddress} />);

    expect(context.state('searchValue')).to.equal(selectedAddress.name);
  });

  it('should pass all props to Autocomplete component', () =>  {
    const randomProp = 5;
    const context = shallow(<SearchBox onMount={onMount} randomProp={randomProp} />);
    expect(context.find(<Autocomplete randomProp={randomProp} />).length).to.equal(1);
  });

  it('should dispatch fetchsuggestions upon value change', () => {
    const fetchAddSuggSpy = sinon.spy();
    const context = shallow(<SearchBox onMount={onMount} onSearchValueChange={fetchAddSuggSpy} />);
    const autocomplete = context.find(<Autocomplete />);
    const newValue = 'Rikemansgatan 1';

    autocomplete.output().attributes.onChange(newValue);
    expect(fetchAddSuggSpy).to.not.have.been.called;

    return new Promise(resolve => setTimeout(resolve, 250))
      .then(() => expect(fetchAddSuggSpy).to.have.been.calledWith(newValue));
  });

  it('should not dispatch fetchsuggestions when the component is unmounted', () => {
    const fetchAddSuggSpy = sinon.spy();
    const context = shallow(<SearchBox onMount={onMount} onSearchValueChange={fetchAddSuggSpy} />);
    const autocomplete = context.find(<Autocomplete />);

    autocomplete.output().attributes.onChange('');
    context.render(null);

    return new Promise(resolve => setTimeout(resolve, 350))
      .then(() => expect(fetchAddSuggSpy).to.not.have.been.called);
  });

  it('should change route upon address selection', () => {
    jest.mock('preact-router');

    const context = shallow(<SearchBox onMount={onMount} onSelectAddress={sinon.spy()} />);
    const autocomplete = context.find(<Autocomplete />);
    const lat = 14.53;
    const lon = 15.54;

    autocomplete.output().attributes.onSelection({ lat, lon });

    expect(route).to.have.been.calledOnce;

    const args = route.args[0][0];

    expect(args).to.match(/\/skyddsrum/);
    expect(args).to.match(new RegExp(`lat=${lat}`));
    expect(args).to.match(new RegExp(`lon=${lon}`));

    jest.unmock('preact-router');
  });

  it('should call onSelectAddress cb upon address selection', () => {
    const onSelectAddress = sinon.spy();
    const context = shallow(<SearchBox onMount={onMount} onSelectAddress={onSelectAddress} />);
    const autocomplete = context.find(<Autocomplete />);
    const address = { lat: 14, lon: 89 };

    autocomplete.output().attributes.onSelection(address);

    expect(onSelectAddress).to.have.been.calledWith(address);
  });

  it('should change search value upon address selection', () => {
    const shelter = {
      name: 'The best shelter',
    };
    const context = shallow(<SearchBox onMount={onMount} onSelectAddress={sinon.spy()} />);
    const autocomplete = context.find(<Autocomplete />);

    autocomplete.output().attributes.onSelection(shelter);

    expect(context.state('searchValue')).to.equal(shelter.name);
  });
});

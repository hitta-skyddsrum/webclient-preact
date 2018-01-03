import { h } from 'preact';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'preact-render-spy';
import { route } from 'preact-router';
import { SearchBox } from './';
import Autocomplete from '../../components/autocomplete';

describe('containers/search-box', () => {
  it('should contain Autocomplete component', () => {
    expect(<SearchBox />).to.contain(<Autocomplete />);
  });

  it('should pass all props to Autocomplete component', () =>  {
    const randomProp = 5;
    const context = shallow(<SearchBox randomProp={randomProp} />);
    expect(context.find(<Autocomplete randomProp={randomProp} />).length).to.equal(1);
  });

  it('should dispatch fetchAddressSuggestions upon value change', () => {
    const fetchAddSuggSpy = sinon.spy();
    const context = shallow(<SearchBox fetchAddressSuggestions={fetchAddSuggSpy} />);
    const autocomplete = context.find(<Autocomplete />);
    const newValue = 'Rikemansgatan 1';

    autocomplete.output().attributes.onChange(newValue);
    expect(fetchAddSuggSpy).to.not.have.been.called;

    return new Promise(resolve => setTimeout(resolve, 250))
      .then(() => expect(fetchAddSuggSpy).to.have.been.calledWith(newValue));
  });

  it('should not dispatch fetchAddressSuggestions when the component is unmounted', () => {
    const fetchAddSuggSpy = sinon.spy();
    const context = shallow(<SearchBox fetchAddressSuggestions={fetchAddSuggSpy} />);
    const autocomplete = context.find(<Autocomplete />);

    autocomplete.output().attributes.onChange('');
    context.render(null);

    return new Promise(resolve => setTimeout(resolve, 350))
      .then(() => expect(fetchAddSuggSpy).to.not.have.been.called);
  });

  it('should change route upon address selection', () => {
    jest.mock('preact-router');

    const clearSuggestions = sinon.spy();
    const context = shallow(<SearchBox clearSuggestions={clearSuggestions} />);
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

  it('should clear suggestions upon address selection', () => {
    const clearSuggestions = sinon.spy();
    const context = shallow(<SearchBox clearSuggestions={clearSuggestions} />);
    const autocomplete = context.find(<Autocomplete />);

    autocomplete.output().attributes.onSelection({});

    expect(clearSuggestions).to.have.been.calledOnce;
  });
});

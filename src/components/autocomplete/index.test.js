import { h } from 'preact';
import { shallow } from 'preact-render-spy';
import { expect } from 'chai';
import sinon from 'sinon';
import Autocomplete from './';
import Suggestion from '../suggestion';
import Bouncer from '../bouncer';

describe('components/Autocomplete', () => {
  it('should display an input field with accurate placeholder', () => {
    const ac = <Autocomplete/>;

    expect(ac).to.contain(<input type="text" placeholder="Var vill du söka från?"/>);
  });

  it('should display a Bouncer when loading is truthy', () => {
    const context = shallow(<Autocomplete loading={1} />);

    expect(context.find(<Bouncer />).length).to.equal(1);
  });

  it('should not display a Bouncer when loading is falsy', () => {
    const context = shallow(<Autocomplete loading={0} />);

    expect(context.find(<Bouncer />).length).to.equal(0);
  });

  it('should trigger the onChange callback upon value change in input field', () => {
    const onChangeCb = sinon.spy();
    const context = shallow(<Autocomplete onChange={onChangeCb}/>);

    context.find('[onInput]').simulate('input', { target: { value: 'Ill never be the same again' } });

    expect(onChangeCb).to.have.been.called;
  });

  it('should not list any suggestions when there\'s no one passed', () => {
    const ac = <Autocomplete/>;

    expect(ac).to.not.contain(<ul/>);
  });

  it('should display a list of all suggestions passed to it', () => {
    const suggestions = [
      {
        name: 'Maybe this one',
        desc: 'Or not?',
      },
      {
        name: 'Or this one?',
        desc: 'Probably',
      },
    ];

    const ac = <Autocomplete suggestions={suggestions}/>;

    suggestions.forEach(sugg => {
      expect(ac).to.contain(<Suggestion suggestion={sugg} />);
    });
  });
});

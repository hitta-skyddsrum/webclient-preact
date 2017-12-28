import { h } from 'preact';
import { shallow } from 'preact-render-spy';
import { expect } from 'chai';
import sinon from 'sinon';
import Suggestion from './';

describe('components/suggestion', () => {
  it('should display the suggestion name and suggestion', () => {
    const suggestion = { name: 'Eiffel 65', desc: 'Blue' };
    const sugg = <Suggestion suggestion={suggestion} />;

    expect(sugg).to.contain(suggestion.name);

    expect(sugg).to.contain(suggestion.desc);
  });

  it('should trigger onSelect callback upon suggestion selection', () => {
    const suggestion = {
      name: 'Maybe this one',
      desc: 'Or not?',
    };
    const onSelection = sinon.spy();
    const context = shallow(<Suggestion suggestion={suggestion} onClick={onSelection} />);

    context.find('a').simulate('click');

    expect(onSelection).to.have.been.calledWith(suggestion);
  });
});

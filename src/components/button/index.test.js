import { h } from 'preact';
import { expect } from 'chai';
import { shallow } from 'preact-render-spy';
import Button from './';

describe('components/Button', () => {
  it('should display a button with the accurate text', () => {
    const buttonContent = 'Dont press here';
    const wrapper = shallow(<Button>{buttonContent}</Button>);

    expect(wrapper.find('button').length).to.equal(1);
    expect(wrapper).to.match(new RegExp(buttonContent));
  });

  it('should pass any arbitrary props to the button element', () => {
    const props = { arbitrary: 'props' };
    const wrapper = shallow(<Button {...props}>Knappen</Button>);

    expect(wrapper.find('button').attr(Object.keys(props).pop())).to.eql(Object.values(props).pop());
  });
});

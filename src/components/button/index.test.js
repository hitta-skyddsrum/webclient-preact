import { h } from 'preact';
import { expect } from 'chai';
import Button from './';

describe('components/Button', () => {
  it('should display a button with the accurate text', () => {
    const buttonContent = 'Dont press here';
    const button = <Button>{buttonContent}</Button>;

    expect(button).to.contain(buttonContent);
  });
});

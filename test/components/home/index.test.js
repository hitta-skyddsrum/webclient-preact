import { h } from 'preact';
import { expect } from 'chai';

import Home from '../../../src/components/home';
import Button from '../../../src/components/button';

describe('components/home', () => {
  it('should show the home text', () => {
    const home = <Home/>;
    expect(home).to.contain(<h1>Hitta skyddsrum</h1>);
  });

  it('should display a button with the text `Börja nu`', () => {
    const home = <Home/>;

    expect(home).to.contain(<Button>Börja nu</Button>);
  });
});

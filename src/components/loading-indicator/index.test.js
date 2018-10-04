import { h } from 'preact';
import { expect } from 'chai';
import { shallow } from 'preact-render-spy';

import CircularProgress from '../circular-progress';
import LoadingIndicator from './';

describe('components/loading-indicator', () => {
  it('should display a CircularProgress', () => {
    const context = shallow(<LoadingIndicator />);

    expect(context.find('div').find('div').find(<CircularProgress />).length)
      .to.equal(1);
  });

  it('should display correct message', () => {
    const message = 'Loaded';
    const context = shallow(<LoadingIndicator message={message} />);

    expect(context.text()).to.equal(message);
  });

  it('should hide the h3 when there\'s no message', () => {
    const context = shallow(<LoadingIndicator />);

    expect(context.find('h3').length).to.equal(0);
  });
});

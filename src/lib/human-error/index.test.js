import { expect } from 'chai';
import { getMessageForGetPositionError } from './';

describe('lib/human-error/getMessageForGetPositionError', () => {
  it('should return an appropriate message upon error 1', () => {
    const error = new Error();
    error.code = 1;

    const message = getMessageForGetPositionError(error);
    expect(message.message).to.contain('Nekad behörighet');
    expect(message.desc).to.contain('webbläsare');
  });

  it('should return an appropriate message upon error 2', () => {
    const error = new Error();
    error.code = 2;

    const message = getMessageForGetPositionError(error);
    expect(message.message).to.contain('Misslyckades hämta din position');
    expect(message.desc).to.contain('Webbläsare');
  });

  it('should return an appropriate message upon error 3', () => {
    const error = new Error();
    error.code = 3;

    const message = getMessageForGetPositionError(error);
    expect(message.message).to.contain('för lång tid');
    expect(message.desc).to.contain('att hämta din position tog för lång');
  });
});

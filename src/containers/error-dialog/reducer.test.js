import { expect } from 'chai';
import sinon from 'sinon';

import * as humanError from '../../lib/human-error';
import {
  FETCH_SINGLE_SHELTER_FAILED,
  FETCH_SINGLE_SHELTER_FAILED_NOT_FOUND,
  FETCH_SHELTERS_FAILED,
  FETCH_ROUTE_TO_SHELTER_FAILED,
  FETCH_ROUTE_TO_SHELTER_FAILED_NOT_FOUND,
} from '../shelters/types';
import {
  GET_CURRENT_POSITION_FAILED,
  RATE_LIMIT_EXCEEDED,
  SEARCH_ERROR,
} from '../search-box/types';
import ErrorDialog from './reducer';
import { CLEAR_ERROR } from './types';

describe('containers/error-dialog/reducer', () => {
  it('should set title and desc upon FETCH_SINGLE_SHELTER_FAILED', () => {
    const error = new Error();

    expect(ErrorDialog(undefined, { type: FETCH_SINGLE_SHELTER_FAILED, error }).title)
      .to.match(new RegExp('Fel'));
    expect(ErrorDialog(undefined, { type: FETCH_SINGLE_SHELTER_FAILED, error }).desc)
      .to.match(new RegExp('misslyckades'));
  });

  it('should set title and desc upon FETCH_SINGLE_SHELTER_FAILED_NOT_FOUND', () => {
    const error = new Error();

    expect(ErrorDialog(undefined, { type: FETCH_SINGLE_SHELTER_FAILED_NOT_FOUND, error }).title)
      .to.match(new RegExp(/kunde inte hittas/i));
    expect(ErrorDialog(undefined, { type: FETCH_SINGLE_SHELTER_FAILED_NOT_FOUND, error }).desc)
      .to.match(new RegExp(/inte finns/i));
  });

  it('should add title and desc upon FETCH_SHELTERS_FAILED', () => {
    const error = new Error();

    expect(ErrorDialog(undefined, { type: FETCH_SHELTERS_FAILED, error}).title)
      .to.equal('Fel vid hämtning skyddsrumsdata');
    expect(ErrorDialog(undefined, { type: FETCH_SHELTERS_FAILED, error}).desc)
      .to.match(new RegExp('misslyckades'));
  });

  it('should add title and desc upon FETCH_ROUTE_TO_SHELTER_FAILED', () => {
    const error = new Error();

    expect(ErrorDialog(undefined, { type: FETCH_ROUTE_TO_SHELTER_FAILED, error}).title)
      .to.equal('Fel vid hämtning av vägbeskrivning');
    expect(ErrorDialog(undefined, { type: FETCH_ROUTE_TO_SHELTER_FAILED, error}).desc)
      .to.match(new RegExp('misslyckades'));
  });

  it('should add title and desc upon FETCH_ROUTE_TO_SHELTER_FAILED_NOT_FOUND', () => {
    const error = new Error();

    expect(ErrorDialog(undefined, { type: FETCH_ROUTE_TO_SHELTER_FAILED_NOT_FOUND, error}).title)
      .to.equal('Kunde inte hitta vägbeskrivning');
    expect(ErrorDialog(undefined, { type: FETCH_ROUTE_TO_SHELTER_FAILED_NOT_FOUND, error}).desc)
      .to.match(new RegExp('kunde inte hittas'));
  });

  it('should set title and desc upon GET_CURRENT_POSITION_FAILED', () => {
    const humanErrorMessage = {
      title: 'Humans only',
      desc: 'Desc',
    };
    sinon.stub(humanError, 'getMessageForGetPositionError').returns(humanErrorMessage);
    const error = new Error();
    const returnedState = ErrorDialog(undefined, {
      type: GET_CURRENT_POSITION_FAILED,
      error,
    });

    expect(returnedState.title).to.eql(humanErrorMessage.title);
    expect(returnedState.desc).to.eql(humanErrorMessage.desc);

    humanError.getMessageForGetPositionError.restore();
  });

  it('should remove error from state upon CLEAR_ERROR', () => {
    const initialState = {
      desc: 'Hej',
      title: 'då',
    };
    const returnedState = ErrorDialog(initialState, { type: CLEAR_ERROR });

    expect(returnedState.desc) .to.eql(null);
    expect(returnedState.title) .to.eql(null);
  });

  it('should set title and desc upon RATE_LIMIT_EXCEEDED', () => {
    const returnedState = ErrorDialog(undefined, { type: RATE_LIMIT_EXCEEDED });

    expect(returnedState.desc).to.contain('överbelastad');
    expect(returnedState.title).to.contain('kunde inte hämtas');
  });

  it('should set title and desc upon SEARCH_ERROR', () => {
    const error = new Error();
    const returnedState = ErrorDialog(undefined, { type: SEARCH_ERROR, error });

    expect(returnedState.desc).to.contain('inte tillgänglig');
    expect(returnedState.title).to.contain('kunde inte hämtas');
  });
});

import { getMessageForGetPositionError } from '../../lib/human-error';
import {
  GET_CURRENT_POSITION_FAILED,
  RATE_LIMIT_EXCEEDED,
  SEARCH_ERROR,
} from '../search-box/types';
import {
  FETCH_SINGLE_SHELTER_FAILED,
  FETCH_SINGLE_SHELTER_FAILED_NOT_FOUND,
  FETCH_SHELTERS_FAILED,
  FETCH_ROUTE_TO_SHELTER_FAILED,
  FETCH_ROUTE_TO_SHELTER_FAILED_NOT_FOUND,
} from '../shelters/types';
import { CLEAR_ERROR } from './types';

const initialState = {
  desc: null,
  title: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SINGLE_SHELTER_FAILED:
      return {
        ...state,
        title: 'Fel vid hämtning av skyddsrumsdata',
        desc: `Hämtningen av skyddsrumsdata för det skyddsrum du söker misslyckades.
          Felet kan bero på att länken är gammal eller på grund av ett tillfälligt fel.
          Vi rekommenderar att du besöker msb.se för att hämta data om skyddsrum.`,
      };
    case FETCH_SINGLE_SHELTER_FAILED_NOT_FOUND:
      return {
        ...state,
        title: 'Skyddsrummet kunde inte hittas',
        desc: `Skyddsrummet du sökte finns inte i vår databas. Detta kan bero på
          att skyddsrummet inte finns längre.`,
      };
    case FETCH_SHELTERS_FAILED:
      return {
        ...state,
        title: 'Fel vid hämtning skyddsrumsdata',
        desc: `Hämtningen av skyddsrumsdata för ditt
          sökområde misslyckades. Felet kan bero på att
          tjänsten är överbelastad. Vi rekommenderar att
          du besöker msb.se för att hämta data om skyddsrum.`,
      };
    case FETCH_ROUTE_TO_SHELTER_FAILED:
      return {
        ...state,
        title: 'Fel vid hämtning av vägbeskrivning',
        desc: `Hämtningen av vägbeskrivning för ditt valda
          skyddsrum misslyckades. Felet kan bero på att
          tjänsten är överbelastad.`,
      };
    case FETCH_ROUTE_TO_SHELTER_FAILED_NOT_FOUND:
      return {
        ...state,
        title: 'Kunde inte hitta vägbeskrivning',
        desc: `En vägbeskrivning mellan den plats du angett
          och det skyddsrum du valt kunde inte hittas. Detta
          kan bero på att bilvägar mellan platserna saknas eller
          att vår data-källa saknar kunskap om denna väg.`,
      };
    case GET_CURRENT_POSITION_FAILED: {
      const { title, desc } = getMessageForGetPositionError(action.error);

      return {
        ...state,
        desc,
        title,
      };
    }
    case CLEAR_ERROR:
      return {
        ...state,
        desc: null,
        title: null,
      };
    case RATE_LIMIT_EXCEEDED:
      return {
        ...state,
        desc: `Tjänsten är för tillfället överbelastad och kan därmed inte visa förslag utifrån din sökning. Vi rekommenderar att du istället besöker <a href="https://gisapp.msb.se/apps/kartportal/enkel-karta_skyddsrum/">MSB</a> för att hitta ditt närmaste skyddsrum.`,
        title: 'Adressförslagen kunde inte hämtas',
      };
    case SEARCH_ERROR:
      return {
        ...state,
        desc: `Tjänsten för att hämta addressförslag är för tillfället inte tillgänglig. Vi rekommenderar att du istället besöker <a href="https://gisapp.msb.se/apps/kartportal/enkel-karta_skyddsrum/">MSB</a> för att hitta ditt närmaste skyddsrum.`,
        title: 'Addressförslagen kunde inte hämtas',
      };
  }

  return state;
};

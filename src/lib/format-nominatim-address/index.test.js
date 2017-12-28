import { expect } from 'chai';

import formatNominatimAddress from './';

describe('lib/formatNominatimAddress', () => {
  it('should return place.display_name if there\'s no county', () => {
    const place = {
      display_name: 'place maker',
      address: {},
    };

    expect(formatNominatimAddress(place)).to.equal(place.display_name);
  });

  it('should return place.display_name when none of the specified params is given', () => {
    const place = {
      display_name: 'place 2',
      address: { county: 'Stockholm' },
    };

    expect(formatNominatimAddress(place)).to.equal(place.display_name);
  });

  it('should return place.address.pedestrian if it exists', () => {
    const place = {
      address: {
        county: 'Stockholm',
        pedestrian: 'Centralstationen',
        road: 'Vasagatan',
        farmyard: 'Bondegatan',
        bus_stop: 'T-centralen',
      },
    };

    expect(formatNominatimAddress(place)).to.equal(`${place.address.pedestrian}, ${place.address.county}`);
  });

  it('should return place.address.road if pedestrian doesn\'t exists', () => {
    const place = {
      address: {
        county: 'Stockholm',
        road: 'Vasagatan',
        farmyard: 'Bondegatan',
        bus_stop: 'T-centralen',
      },
    };

    expect(formatNominatimAddress(place)).to.equal(`${place.address.road}, ${place.address.county}`);
  });

  it('should return place.address.farmyard if road doesn\'t exists', () => {
    const place = {
      address: {
        county: 'Stockholm',
        farmyard: 'Bondegatan',
        bus_stop: 'T-centralen',
      },
    };

    expect(formatNominatimAddress(place)).to.equal(`${place.address.farmyard}, ${place.address.county}`);
  });

  it('should return place.address.bus_stop if farmyard doesn\'t exists', () => {
    const place = {
      address: {
        county: 'Stockholm',
        bus_stop: 'T-centralen',
      },
    };

    expect(formatNominatimAddress(place)).to.equal(`${place.address.bus_stop}, ${place.address.county}`);
  });
});

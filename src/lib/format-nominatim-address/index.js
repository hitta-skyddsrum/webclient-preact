export default place => {
  if (!place.address.county) {
    return place.display_name;
  }

  const lowGranular = [
    place.address.pedestrian,
    place.address.road,
    place.address.farmyard,
    place.address.bus_stop,
  ]
    .find(alt => !!alt);

  const highGranular = [
    place.address.town,
    place.address.city,
    place.address.county,
    place.address.state,
  ]
    .find(alt => !!alt);

  if (lowGranular) {
    return lowGranular.concat(highGranular && `, ${highGranular}`);
  }

  return place.display_name;
};

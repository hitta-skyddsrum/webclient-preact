export default place => {
  if (!place.address.county) {
    return place.display_name;
  }

  const formattedAddress = [
    place.address.pedestrian,
    place.address.road,
    place.address.farmyard,
    place.address.bus_stop,
  ]
    .find(alt => !!alt);

  if (formattedAddress) {
    return formattedAddress.concat(`, ${place.address.county}`);
  }

  return place.display_name;
};

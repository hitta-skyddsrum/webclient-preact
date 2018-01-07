export const getBoundsAroundPositions = positions => {
  const parsedPositions = positions
    .map(pos => pos.filter(p => !!p))
    .filter(pos => pos.length === 2)
    .map(([lat, lon]) => [parseFloat(lat), parseFloat(lon)]);

  const getExtremePosition = sortedBy => {
    const biggest = sortedBy === 'biggest' ? true : false;
    const sorter = (a, b) => biggest ? b - a : a - b;

    return [
      parsedPositions
        .map(([lat]) => lat)
        .sort(sorter)
        .shift(),
      parsedPositions
        .map(([, lon]) => lon)
        .sort(sorter)
        .shift(),
    ];
  };

  return [
    getExtremePosition('smallest'),
    getExtremePosition('biggest'),
  ];
};

export const isPositionWithinBounds = (position, bounds) => {
  return bounds
    .filter((pos, index) => {
      if (index === 0) {
        return position[0] >= pos[0] && position[1] >= pos[1];
      }
      return position[0] <= pos[0] && position[1] <= pos[1];
    }).length === 2;
};

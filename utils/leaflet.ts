const tileBounds = {
  10: { minX: -2, maxX: 1, minY: -2, maxY: 1 },
  11: { minX: -4, maxX: 2, minY: -4, maxY: 2 },
  12: { minX: -7, maxX: 5, minY: -8, maxY: 5 },
  13: { minX: -3, maxX: 5, minY: -7, maxY: 6 },
  14: { minX: -7, maxX: 11, minY: -15, maxY: 11 },
  15: { minX: -15, maxX: 23, minY: -31, maxY: 25 }
};
const k = {
  10: { minX: -2, maxX: 1, minY: -2, maxY: 1 },
  11: { minX: -4, maxX: 3, minY: -4, maxY: 3 },
  12: { minX: -8, maxX: 7, minY: -8, maxY: 7 },
  13: { minX: -16, maxX: 15, minY: -16, maxY: 15 },
  14: { minX: -32, maxX: 31, minY: -32, maxY: 31 },
  15: { minX: -64, maxX: 63, minY: -64, maxY: 63 }
};

const isOutOfBounds = (e: any, t: any, r: any, n = {}) => {
  const bounds = n[r] || k[r];
  return (
    !!bounds &&
    (e < bounds.minX || e > bounds.maxX || t < bounds.minY || t > bounds.maxY)
  );
};

export const leafletGetX = (tile: any) => {
  const x = tile.x - Math.pow(2, tile.z - 1);
  return isOutOfBounds(x, tile.y - Math.pow(2, tile.z - 1), tile.z, tileBounds)
    ? 'black'
    : x;
};

export const leafletGetY = (tile: any) => {
  const x = tile.x - Math.pow(2, tile.z - 1);
  const y = tile.y - Math.pow(2, tile.z - 1);
  return isOutOfBounds(x, y, tile.z, tileBounds) ? 'black' : y;
};

export const installEvent = {
  waitUntil: () => true,
};

export const cache = {
  addAll: () => true,
};

export default {
  caches: {
    open: () => Promise.resolve(cache),
  },
};

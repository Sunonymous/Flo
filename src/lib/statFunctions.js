const sum = (a, b) => a + b;

export const averageArray = (arr) => Math.floor(arr.reduce(sum) / arr.length);

export const mergeAdd = (obj1, obj2) => {
  const result = { ...obj1 };
  Object.keys(obj2).forEach((k) => {
    if (!result[k]) {
      result[k] = 0;
    }
    result[k] += obj2[k];
    return result;
  });
  return result;
};

export const frequencies = (arr) =>
  arr.reduce((acc, behavior) => {
    if (!acc[behavior]) {
      acc[behavior] = 0;
    }
    acc[behavior] += 1;
    return acc;
  }, {});
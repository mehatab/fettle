export const sortByProp = <T extends {}>(collection: T[], prop: keyof T) =>
  collection.sort((a: T, b: T) => {
    const aProp = a[prop];
    const bProp = b[prop];

    if (aProp > bProp) {
      return 1;
    } else if (aProp < bProp) {
      return -1;
    } else {
      return 0;
    }
  });

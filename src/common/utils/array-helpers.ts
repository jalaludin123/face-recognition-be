export const arrayShuffle = (array: any[]): any[] => {
  let currentIndex: number = array.length;
  let randomIndex: number = 0;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

export const arrayhasDuplicated = (array: any[], key?: string): boolean => {
  const sample = array.map((e) => (key ? e[key] : e));
  return new Set(sample).size !== sample.length;
};

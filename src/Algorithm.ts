import seedrandom from 'seedrandom'

interface NumberArray {
  length: number
  [index: number]: number
}

//Fisher–Yates shuffle by https://bost.ocks.org/mike/shuffle/
const shuffle = (seed?: string) => (array: NumberArray) => {
  let m = array.length,
    t,
    i

  const random = seedrandom(seed)

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(random() * m--)

    // And swap it with the current element.
    t = array[m]
    array[m] = array[i]
    array[i] = t
  }

  return array
}

export { shuffle }

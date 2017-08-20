// Contains various logic functions related to the set game.

// Converts a set of four properties, like [2,1,0,2] to a card index, like 59.
export function propToIndex(card) {
  return card.reduce((sum,v,i) => sum + v*Math.pow(3,i), 0)
}

// Converts a card index, like 59, to a set of four properties, like [2,1,0,2].
export function indexToProp(index) {
  const arr = []
  for (let i = 0; i < 4; i++) {
    arr[i] = index % 3
    index = (index - arr[i])/3
  }
  return arr
}

// Checks whether the given cards form a set. The array should be an array of three cards, where a "card" is an array of card properties.
export function isSet(cards) {
  if (cards.length !== 3)
  throw new Error('isSet received an array of cards that was not of length 3.')
  for (let i = 0; i < cards[0].length; i++) {
    if ((cards[0][i] + cards[1][i] + cards[2][i]) % 3 !== 0)
    return false
  }
  return true
}

// Finds all sets in an array of cards, where a "card" is an array of card properties. The sets are returned as an array of sets, where each set is three indices pointing to the cards forming that set.
export function findSets(cards) {
  let sets = []
  for (let i = 0; i < cards.length; i++) {
    for (let j = 0; j < i; j++) {
      for (let k = 0; k < j; k++) {
        if (isSet([cards[i], cards[j], cards[k]]))
        sets.push([k,j,i])
      }
    }
  }
  return sets
}

// Turns hotkeys into card positions.
export const keyToPos = {
  q: 0, w: 3, e: 6, r: 9, t: 12, y: 15, u: 18,
  a: 1, s: 4, d: 7, f: 10, g: 13, h: 16, j: 19,
  z: 2, x: 5, c: 8, v: 11, b: 14, n: 17, m: 20,
}

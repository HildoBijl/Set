// util contains various general utility functions.

// shuffle returns an array of length n with the numbers 0 to n-1 in random order.
export function shuffle(n) {
  const arr = new Array(n).fill(0).map((v,i) => i)
  arr.forEach((v,i) => {
    const ind = Math.floor(i + (n-i)*Math.random())
    arr[i] = arr[ind]
    arr[ind] = v
  })
  return arr
}

// deepClone makes a deep clone of the given object. So it also clones child elements, contrary to Object.assign or the spread operator.
export function deepClone(obj) {
  if (obj === undefined)
    throw new Error('deepClone was given an undefined object');
  if (!obj)
    return obj;
  return JSON.parse(JSON.stringify(obj));
}

// createAscendingArray creates an array having the numbers [min, min+1, ..., max-1, max].
export function createAscendingArray(min, max) {
  return Array.apply(null, {length: max - min + 1}).map((v,i) => i + min)
}

// factorial calculates n!
export function factorial(n) {
  return n*factorial(n-1)
}

// getPermutations returns an array containing arrays. These sub-arrays are all possible permutations of the numbers 0, 1, ..., n-1.
export function getPermutations(n) {
  let result = []
  const permute = (arr, m = []) => {
    if (arr.length === 0) {
      result.push(m)
    } else {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice();
        let next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next))
      }
    }
  }
  permute(createAscendingArray(0, n-1))
  return result;
}

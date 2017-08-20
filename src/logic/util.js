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

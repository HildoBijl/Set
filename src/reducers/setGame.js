import { shuffle } from '../logic/util.js'
import { indexToProp, findSets, isSet, calculatePoints } from '../logic/setGame.js'

export default function setGameReducer(state = getInitialState(), action) {
  switch (action.type) {
    case 'SelectCard':
      // Process the selected card into the selected array.
      const pos = action.pos
      let selected = state.selected.slice(0)
      const indexOf = selected.indexOf(pos)
      if (indexOf === -1) {
        selected.push(pos)
      } else {
        selected.splice(indexOf, 1)
      }

      // If less than three cards are selected, we are done.
      if (selected.length < 3)
        return { ...state, selected }

      // Check if it is a set.
      if (isSet(selected.map((v) => state.table[v]).map(indexToProp))) {
        let table = state.table.slice(0)
        selected.forEach((pos) => table[pos] = undefined)
        return addCardsToTable({
          ...state,
          table,
          selected: [],
          score: state.score + calculatePoints(state.lastSetAt),
          lastSetAt: new Date(),
        })
      } else {
        return { ...state, selected: [] }
      }
    case 'ResetGame':
      return getInitialState()
    default:
      return state
  }
}

// Sets up an initial state for the game and returns it.
function getInitialState() {
  let state = {
    deck: shuffle(81),
    table: [],
    selected: [],
    cardsUsed: 0,
    gameOver: false,
    score: 0,
    lastSetAt: new Date(),
  }
  return addCardsToTable(state)
}

// Adds cards from the deck to the table, until the table has a sufficient number of cards. Returns the new state, but also adjusts the one given.
function addCardsToTable(state) {
  // Keep moving cards from the deck to the table until all the required conditions are met.
  const tableAsProp = state.table.map(indexToProp)
  let numCardsOnTable = state.table.reduce((sum,v) => (v !== undefined ? sum + 1 : sum), 0)
  while (findSets(tableAsProp).length === 0 || numCardsOnTable < 12 || numCardsOnTable % 3 !== 0) {
    // If the deck is empty, stop adding cards.
    if (state.cardsUsed >= state.deck.length)
      break

    // Add a card to the table.
    const cardFromDeck = state.deck[state.cardsUsed++]
    const emptyPlace = state.table.indexOf(undefined)
    if (emptyPlace === -1) {
      state.table.push(cardFromDeck)
      tableAsProp.push(indexToProp(cardFromDeck))
    } else {
      state.table[emptyPlace] = cardFromDeck
      tableAsProp[emptyPlace] = indexToProp(cardFromDeck)
    }
    numCardsOnTable++
  }
  // Fill up the holes on the table by moving the cards too far left.
  let holePosition = state.table.indexOf(undefined)
  for (let i = numCardsOnTable; holePosition >= 0 && holePosition < numCardsOnTable; i++) {
    let cardToMove = state.table[i]
    if (cardToMove === undefined)
      continue
    state.table[holePosition] = cardToMove
    holePosition = state.table.indexOf(undefined)
  }
  state.table.length = numCardsOnTable // Remove the cards that we just moved.
  console.log(findSets(tableAsProp).length === 1 ? 'Er is nu 1 set.' : 'Er zijn nu ' + findSets(tableAsProp).length + ' sets.')

  // If we have no sets, then the game is over.
  if (findSets(tableAsProp).length === 0)
    state.gameOver = true

  return state
}

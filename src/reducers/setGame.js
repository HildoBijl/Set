import { shuffle } from '../logic/util.js'
import { indexToProp, findSets, isSet } from '../logic/setGame.js'

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
        selected.sort((a,b) => b-a).forEach((pos) => table.splice(pos, 1))
        return addCardsToTable({ ...state, table, selected: [] })
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
  }
  return addCardsToTable(state)
}

// Adds cards from the deck to the table, until the table has a sufficient number of cards. Returns the new state, but also adjusts the one given.
function addCardsToTable(state) {
  // Keep moving cards from the deck to the table until all the required conditions are met.
  const tableAsProp = state.table.map(indexToProp)
  while (findSets(tableAsProp).length === 0 || state.table.length < 12 || state.table.length % 3 !== 0) {
    // If the deck is empty, stop adding cards.
    if (state.cardsUsed >= state.deck.length)
      break

    // Add a card to the table.
    const cardFromDeck = state.deck[state.cardsUsed++]
    state.table.push(cardFromDeck)
    tableAsProp.push(indexToProp(cardFromDeck))
  }
  console.log(findSets(tableAsProp).length === 1 ? 'Er is nu 1 set.' : 'Er zijn nu ' + findSets(tableAsProp).length + ' sets.')

  // If we have no sets, then the game is over.
  if (findSets(tableAsProp).length === 0)
    state.gameOver = true

  return state
}

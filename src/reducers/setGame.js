import { shuffle } from '../logic/util.js'
import { indexToProp, findSets, isSet, calculatePoints } from '../logic/setGame.js'
import { deepClone, getPermutations } from '../logic/util.js';

export default function setGameReducer(oldState = getInitialState(), action) {
  let state = deepClone(oldState)
  state.lastSetAt = oldState.lastSetAt
  switch (action.type) {
    case 'SelectCard':
      // Process the selected card into the selected array.
      const pos = action.pos
      let selected = state.selected
      const indexOf = selected.indexOf(pos)
      if (indexOf === -1) {
        selected.push(pos)
      } else {
        selected.splice(indexOf, 1)
      }

      // If less than three cards are selected, we are done.
      if (selected.length < 3)
        return state

      // Check if it is a set.
      if (isSet(selected.map((v) => state.table[v]).map(indexToProp))) {
        selected.forEach((pos) => {
          state.lastCardChange[state.table[pos]] = new Date()
          state.table[pos] = undefined
        })
        state.selected = []
        state.score+= calculatePoints(state.lastSetAt)
        state.lastSetAt = new Date()
        return addCardsToTable(state)
      } else {
        state.selected = []
        return state
      }
    case 'PrepareStartGame':
      state = getInitialState()
      state.gameOver = false
      state.finalScore = oldState.finalScore
      return state
    case 'StartGame':
      state.lastSetAt = new Date()
      return addCardsToTable(state)
    default:
      return state
  }
}

// Sets up an initial state for the game and returns it.
function getInitialState() {
  return {
    deck: shuffle(81), // The 81 cards in the deck. Index is the position in the deck.
    lastCardChange: new Array(81), // Datetime objects indicating when a card was last changed. Index is the card index.
    table: [], // The cards that are on the table.
    selected: [], // The cards on the table that are selected.
    cardsUsed: 0, // The number of cards that have been taken from the deck.
    gameOver: true, // Is the game finished?
    score: 0, // The total accumulated score.
    finalScore: 0, // The final score at the end of the game.
    lastSetAt: new Date(), // The time at which the last set was obtained. Used for scoring purposes.
  }
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
      state.lastCardChange[cardFromDeck] = new Date()
    } else {
      state.table[emptyPlace] = cardFromDeck
      tableAsProp[emptyPlace] = indexToProp(cardFromDeck)
      state.lastCardChange[cardFromDeck] = new Date()
    }
    numCardsOnTable++
  }

  // Fill up the holes on the table by moving the cards too far left.
  let holePosition = state.table.indexOf(undefined)
  if (holePosition !== -1) {
    // Find the empty places and the cards that we need to move.
    const emptyPlaces = state.table.reduce((result, cardIndex, pos) => {
      if (cardIndex === undefined && pos < numCardsOnTable)
        result.push(pos)
      return result
    }, [])
    const cardsToMove = state.table.reduce((result, cardIndex, pos) => {
      if (cardIndex !== undefined && pos >= numCardsOnTable)
        result.push(pos)
      return result
    }, [])

    // Find the optimal match between the cards to move and the empty places, and apply this match.
    const shifts = findOptimalCardMove(cardsToMove, emptyPlaces)
    cardsToMove.forEach((v,i) => {
      const cardIndex = state.table[cardsToMove[i]]
      state.table[emptyPlaces[shifts[i]]] = cardIndex
      state.lastCardChange[cardIndex] = new Date()
    })
    state.table.length = numCardsOnTable // Remove the cards that we just moved.
  }
  console.log(findSets(tableAsProp).length === 1 ? 'Er is nu 1 set.' : 'Er zijn nu ' + findSets(tableAsProp).length + ' sets.')

  // If we have no sets, then the game is over.
  if (findSets(tableAsProp).length === 0) {
    state.gameOver = true
    state.finalScore = state.score / (state.deck.length - state.table.length) * state.deck.length
  }

  return state
}

// Finds a map from the cards on positions p1 (an array of card positions) to the cards on positions p2 such that the distance between the matched card positions is minimal. If the result is [2,0,1], the p1[0] must be matched to p2[2], p1[1] to p2[0] and p1[2] to p2[1].
function findOptimalCardMove(p1, p2) {
  const orders = getPermutations(p1.length)
  const distances = orders.map((order) => order.reduce((sum,v,i) => sum + getDistance(p1[i], p2[v]), 0))
  const optimum = Math.min.apply(null, distances)
  return orders[distances.indexOf(optimum)]
}

// Returns the distance between two card positions. For example, the distance between card positions 4 (being x=1,y=1) and 8 (being x=2,y=2) is sqrt(2).
function getDistance(pos1, pos2) {
  const y1 = pos1 % 3
  const y2 = pos2 % 3
  const x1 = (pos1 - y1)/3
  const x2 = (pos2 - y2)/3
  const dx = x1 - x2
  const dy = y1 - y2
  return Math.sqrt(dx*dx + dy*dy)
}
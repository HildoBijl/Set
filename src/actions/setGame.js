const actions = {
  selectCard: (pos) => ({
    type: 'SelectCard',
    pos,
  }),
  resetGame: () => ({
    type: 'ResetGame',
  }),
}
export default actions

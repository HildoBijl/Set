import { movingTime } from '../assets/config.js'

const actions = {
  selectCard: (pos) => ({
    type: 'SelectCard',
    pos,
  }),
  resetGame: () => (
    (dispatch) => {
      dispatch({ type: 'PrepareStartGame' })
      setTimeout(() => dispatch({ type: 'StartGame' }), movingTime)
    }
  ),
}
export default actions

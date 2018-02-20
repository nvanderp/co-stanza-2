import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_POEM = 'GET_POEM'

/**
 * INITIAL STATE
 */
const defaultPoem = {}

/**
 * ACTION CREATORS
 */
const getPoem = poem => ({type: GET_POEM, poem})

/**
 * THUNK CREATORS
 */
export const fetchNewPoem = () =>
  dispatch =>
    axios.get('/api/quotes')
      .then(res => {
        const randomNum = Math.floor(Math.random() * (res.data.length))
        const result = res.data.filter(poem => poem.id === randomNum)
        dispatch(getPoem(result[0] || defaultPoem))
      })
      .catch(err => console.log(err))

/**
 * REDUCER
 */
export default function (state = defaultPoem, action) {
  switch (action.type) {
    case GET_POEM:
      return action.poem
    default:
      return state
  }
}

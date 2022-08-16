import axios from "axios";

export const GET_POKEMONS = "GET_POKEMONS";

export default function getPokemons(search) {
  return function (dispatch) {
    axios
      .get(`http://localhost:3001/pokemons${search?`?name=${search}`:``}`)
      .then((res) =>
        dispatch({
          type: GET_POKEMONS,
          payload: res.data,
        })
      )
      .catch((e) => console.log(e));
  };
}

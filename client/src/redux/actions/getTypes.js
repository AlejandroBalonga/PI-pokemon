import axios from "axios";

export const GET_TYPES = "GET_TYPES";

export default function getTypes() {
  return function (dispatch) {
    axios
      .get(`http://localhost:3001/types`)
      .then((res) =>
        dispatch({
          type: GET_TYPES,
          payload: res.data,
        })
      )
      .catch((e) => console.log(e));
  };
}

import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { GET_POKEMONS } from "./actions/getPokemos";
import { GET_TYPES } from "./actions/getTypes";
import { SET_PAGE_STATE } from "./actions/setPageState";

const InitialState = {
  pokemons: [],
  types: [],
  pageState: {
    page: 0,
    filters: {
      search: "",
      type: "",
      originNatural: true,
      originCreated: true,
      order: "name-asc",
    },
  },
};

const store = createStore((state = InitialState, action) => {
  switch (action.type) {
    case GET_POKEMONS:
      return {
        ...state,
        pokemons: action.payload,
      };
    case GET_TYPES:
      return {
        ...state,
        types: action.payload,
      };
    case SET_PAGE_STATE:
      return {
        ...state,
        pageState: action.payload,
      };

    default:
      return state;
  }
}, applyMiddleware(thunk));

export default store;

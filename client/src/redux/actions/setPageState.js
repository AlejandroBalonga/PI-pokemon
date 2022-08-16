export const SET_PAGE_STATE = "SET_PAGE_STATE";

export default function setPageState(pageState) {
  return function (dispatch) {
        dispatch({
          type: SET_PAGE_STATE,
          payload: pageState,
        })
  };
}

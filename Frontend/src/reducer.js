export const initialState = {
  category: [],
  userLoggedIn: sessionStorage?.getItem("token") ? true : false,
  favorites: JSON.parse(sessionStorage?.getItem("liked")?sessionStorage?.getItem("liked"):"[]"),
  bookmarks: JSON.parse(sessionStorage?.getItem("bookmarked")?sessionStorage?.getItem("bookmarked"):"[]"),
  username: sessionStorage?.getItem("username"),
};

function reducer(state, action) {
  // console.log(action);
  switch (action.type) {
    case "SET_LOGIN_STATUS":
      return {
        ...state,
        userLoggedIn: action.status,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.status,
      };
    case "SET_CATEGORY":
      return {
        ...state,
        category: action.category,
      };

    case "SET_FAVORITE_LIST":
      sessionStorage.setItem(
        "liked",
        JSON.stringify(action.data)
      );
      return { ...state, favorites: action.data };

    case "ADD_TO_FAVORITES_LIST":
      sessionStorage.setItem("liked",[...state.favorites, action.id])
      return { ...state, favorites: [...state.favorites, action.id] };

    case "REMOVE_FROM_FAVORITES_LIST":
      sessionStorage.setItem("liked", state.favorites.filter((item) => item !== action.id))

      return {
        ...state,
        favorites: state.favorites.filter((item) => item.id !== action.item.id),
      };
    case "SET_BOOKMARK_LIST":
      sessionStorage.setItem(
        "bookmarked",
        JSON.stringify(action.data)
      );
      return { ...state, bookmarks: action.data };

    case "ADD_TO_BOOKMARK_LIST":
      sessionStorage.setItem("bookmarked",[...state.bookmarks, action.item])

      return { ...state, bookmarks: [...state.bookmarks, action.item] };

    case "REMOVE_FROM_BOOKMARK_LIST":
      sessionStorage.setItem("bookmarked",state.bookmarks.filter((item) => item !== action.id))

      return {
        ...state,
        bookmarks: state.bookmarks.filter((item) => item.id !== action.item.id),
      };

    default:
      return state;
  }
}

export default reducer;

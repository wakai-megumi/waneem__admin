import { createContext, useReducer } from "react"
import propsvalidation from "prop-types"

const Initial_state = {
  destination: undefined,
  date: [],
  service_info: {
    adults: 1,
    child: 0,
    rooms: 1,
  },
}

export const Searchcontext = createContext(Initial_state)

const SearchReducer = (state, action) => {
  switch (action.type) {
    case "NEW_SEARCH":
      return action.payload
    case "RESET_SEARCH":
      return Initial_state
    default:
      return state
  }
}

export const SearchcontextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(SearchReducer, Initial_state)

  return (
    <Searchcontext.Provider
      value={{
        destination: state.destination,
        date: state.date,
        service_info: state.service_info,
        dispatch,
      }}
    >
      {children}
    </Searchcontext.Provider>
  )
}

SearchcontextProvider.propTypes = {
  children: propsvalidation.node.isRequired,
}

import React, { createContext, useReducer } from 'react'
import BidReducer from './BidReducer'

// Create Context
export const BidContext = createContext([])

// Provider Component
const BidContextProvider = (props) => {

    const [bids, bidDispatch] = useReducer(BidReducer, [])

    return (
        <BidContext.Provider value={{ bids, bidDispatch }}>
            {props.children}
        </BidContext.Provider>
    )
}

export default BidContextProvider
import React, { createContext, useReducer, useEffect } from 'react'
import AuctionReducer from './AuctionReducer'

// Create Context
export const AuctionContext = createContext([])

// Provider Component
const AuctionContextProvider = (props) => {

    const [auctions, auctionDispatch] = useReducer(AuctionReducer, [])

    useEffect(() => {
        // get data from db in first render, set Auction
        auctionDispatch({ type: 'GET_AUCTIONS' })
    }, [])

    return (
        <AuctionContext.Provider value={{ auctions, auctionDispatch }}>
            {props.children}
        </AuctionContext.Provider>
    )
}

export default AuctionContextProvider
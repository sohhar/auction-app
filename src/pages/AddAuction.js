import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { InputForm } from '../components'
import { Web3Context } from '../context/Web3Context'
import { AuctionContext } from '../context/AuctionContext'

export default function AddAuction() {

  const { account } = useContext(Web3Context)
  const { auctions, dispatch } = useContext(AuctionContext)
  const history = useHistory()

  const addAuctionDB = async (data) => {

    console.log(`addauction ${JSON.stringify(data)}`)
    dispatch({
      type: 'ADD_AUCTION', 
      payload: {
        id: auctions ? auctions.length : 0,
        title: data.title,
        seller: account,
        image: data.image,
        startbid: Number(data.startbid),
        reservebid: Number(data.startbid),
        duration: Number(data.duration),
        description: data.description,
        currentbid: 0,
        numbid: 0,
        bcid: 0,
        starttime: '',
        dstarttime: '',
        status: 0,
        transactionhash: ''
      }
    })

    history.push('/auctions')

  }

  return (
    <>
      <InputForm
        seller={account}
        addAuction={addAuctionDB}
      />
    </>
  );
}

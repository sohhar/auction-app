import React, { useContext, useState, useEffect } from 'react'
import { useLocation } from 'react-router'
import firebase from '../firebase'
import { Web3Context } from '../context/Web3Context';
import { AuctionContext } from '../context/AuctionContext';
import { BidContext } from '../context/BidContext';
import { AuctionDetail } from '../components'

export default function Auction(props) {

  const { account, contract, web3 } = useContext(Web3Context)
  const { auctions, auctionDispatch } = useContext(AuctionContext)
  const { bids, bidDispatch } = useContext(BidContext)
  const [auction, setAuction] = useState([])  // array stores all bids of the auction
  const [balance, setBalance] = useState()
  const [bidInput, setBidInput] = useState(0)
  const location = useLocation()

  // every render or change in location
  useEffect(() => {

    // setAuction from location data
    const selectedAuction = {
      id: location.state.id,
      title: location.state.title,
      seller: location.state.seller,
      image: location.state.image,
      startbid: Number(location.state.startbid),
      reservebid: Number(location.state.startbid),
      duration: Number(location.state.duration),
      currentbid: location.state.currentbid,
      numbid: location.state.numbid,
      bcid: location.state.bcid,
      starttime: location.state.starttime,
      dstarttime: location.state.dstarttime,
      status: location.state.status,
      transactionhash: location.state.transactionhash
    }

    // set auction State
    console.log(`selected auctions ${JSON.stringify(selectedAuction)}`)

    //    const selectedAuction = auctions.find(auction => auction.id == location.state.id)
    setAuction(selectedAuction)

    if (selectedAuction.numbid > 0) {
      const _bids = []
      firebase.firestore().collection("Bid").where("auctionid", "==", selectedAuction.id)
        .get()
        .then(data => {
          //          console.log(data)
          data.forEach(doc => _bids.push(doc.data()))
          _bids.sort(function (a, b) {
            return parseInt(b.bidid) - parseInt(a.bidid);
          })
          //          bidDispatch({ type: 'GET_BIDS', payload: { auctionId: selectedAuction.id } })
          bidDispatch({ type: 'GET_BIDS', payload: _bids })

          // if auction is won, update winner and amount info in auction
          if (selectedAuction.status === 2 && !selectedAuction.winner) {
            auctionDispatch({
              type: 'UPDATE_AUCTION',
              payload: {
                id: selectedAuction.id,
                winner: _bids[0].bidder,
                winningAmount: _bids[0].bidamount
              }
            })
            console.log(`winner ${auction.winner} ${auction.winningAmount}`)
          }
        })
      console.log(`bid state ${JSON.stringify(bids)}`)
    }
  }, [location.state.id]);

  useEffect(() => {
    // Get balance of account
    const getBalance = async () => {
      return web3.utils.fromWei(
        (await web3.eth.getBalance(account)).toString(), 'ether')
    }
    getBalance().then(_balance => {
      setBalance(Number(_balance).toFixed(4))
      //      console.log(`balance ${_balance} ${balance}`)
    })
    console.log(`set balance ${balance}`)
  }, [balance]);

  const placeBid = async () => {

    if (bidInput <= auction.currentbid) {
      alert(`Submitted bid ${bidInput} must to higher than current bid of ${auction.currentbid}eth. Please increase your bid`)
    } else if (bidInput <= auction.startbid) {
      alert(`Submitted bid ${bidInput} must to higher than starting bid of ${auction.startbid}eth. Please increase your bid`)
    } else {
      const _bidInput = web3.utils.toWei(bidInput, 'ether')
      console.log(`submit ${_bidInput} ${bidInput} ${JSON.stringify(auction, null, 2)}`)

      // Place a bid into smart contract
      const result = await contract.placeBid(
        auction.bcid,
        Date.now(),
        { from: account, value: _bidInput.toString() })

      await contract.contractBalance().then(function (_return) {
        console.log(`Contract balance aft place bid = ${_return}`)
      })
      // Update balance of wallet
      const _balance = web3.utils.fromWei(
        (await web3.eth.getBalance(account)).toString(),
        'ether')
      setBalance(Number(_balance).toFixed(4))

      console.log(`result ${JSON.stringify(result.logs[0].args.bidder, undefined, 2)}`)
      console.log(`refund ${JSON.stringify(result.logs[1].args.bidder, undefined, 2)}`)

      // update auction db
      auctionDispatch({
        type: 'UPDATE_AUCTION',
        payload: {
          id: auction.id,
          numbid: auction.numbid + 1
        }
      })

      const _dTimestamp = new Intl.DateTimeFormat(
        ['ban', 'sg'],
        {
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit', second: '2-digit'
        }).format(result.logs[0].args.timstamp)

      // update new bid state & db
      bidDispatch({
        type: 'ADD_BID',
        payload: {
          auctionId: auction.id,
          bidId: Number(result.logs[0].args.bidId),
          bidAmount: Number(bidInput),
          bidder: result.logs[0].args.bidder,
          dTimestamp: _dTimestamp,
          timestamp: result.logs[0].args.timstamp,
          transactionHash: result.logs[0].transactionHash
        }
      })

      // update refunded bid state & db
      if (Number(result.logs[0].args.bidId) > 0) {
        bidDispatch({
          type: 'UPDATE_BID',
          payload: {
            auctionId: auction.id,
            bidId: Number(result.logs[0].args.bidId) - 1,
            refunded: true,
            refundTxHash: result.logs[1] ? result.logs[1].transactionHash : ""
          }
        })
      }
    }
  }

  // set bidInput state from user input field
  const updateBidInput = (_bidInput) => {
    setBidInput(_bidInput)
  }

  return (
    <>
      <AuctionDetail
        account={account}
        balance={balance}
        id={auction.id}
        image={auction.image}
        title={auction.title}
        seller={auction.seller}
        startbid={auction.startbid}
        currentbid={auction.currentbid}
        starttime={auction.starttime}
        dstarttime={auction.dstarttime}
        duration={auction.duration}
        status={auction.status}
        winner={auction.winner}
        bids={bids}
        bidInput={bidInput}
        updateBidInput={updateBidInput}
        placeBid={placeBid}
      />
    </>
  )
}
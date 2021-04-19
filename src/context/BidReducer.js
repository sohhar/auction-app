import firebase from '../firebase'

export default (state, action) => {
    switch (action.type) {
        case 'GET_BIDS':
            //            console.log(`getBid aucID ${JSON.stringify(action.payload)}`)
            return action.payload
        /*            let bids = []
                    const _auctionid = action.payload.auctionId
        
                    firebase.firestore().collection("Bid").where("auctionid", "==", _auctionid)
                        // firebase.firestore().collection("Bid").where('auctionid', '==', 3)
                        .get()
                        .then(data => {
                            data.forEach(doc => {
                                bids.push(doc.data())
        //                        console.log(doc.id, '=>', doc.data())
                            })
                            bids.sort(function (a, b) {
                                console.log(`bids ${JSON.stringify(bids)}`)
                                return (parseInt(b.bidid) - parseInt(a.bidid));
                            })
                            return bids
                        })
        */

        case 'ADD_BID':
            return {
                bids: [...state, addBid(action.payload)]
            }

        case 'UPDATE_BID':
            const newBids = updateBid(state, action.payload)
            console.log(`updBid ${JSON.stringify(newBids)}`)
            return newBids

        default:
            return state
    }
}

function addBid(payload) {

    console.log(`addAuc ${JSON.stringify(payload)}`)
    // Update DB
    const db = firebase.firestore()
    db.collection("Bid").add({
        auctionId: payload.auctionId,
        bidId: Number(payload.bidId),
        bidAmount: Number(payload.bidAmount),
        bidder: payload.bidder,
        dTimestamp: payload.dTimestamp,
        refunded: false,
        refundTxHash: '',
        timestamp: payload.timestamp,
        transactionHash: payload.transactionHash
    })

    // return object to set Bids
    return {
        auctionId: payload.auctionId,
        bidId: Number(payload.bidId),
        bidAmount: Number(payload.bidAmount),
        bidder: payload.bidder,
        dTimestamp: payload.dTimestamp,
        refunded: false,
        refundTxHash: '',
        timestamp: payload.timestamp,
        transactionHash: payload.transactionHash
    }
}

function updateBid(state, payload) {

    // Update DB
    let docId
    const dbRef = firebase.firestore().collection('Bid')
    dbRef
        .where('auctionId', '==', payload.auctionId)
        .where('bidId', '==', payload.bidId)
        .get()
        .then(data => {
            data.forEach(doc => docId = doc.id)
            dbRef.doc(docId).update(
                "refunded", payload.refunded,
                "refundtxhash", payload.refundTxHash)
                .then(function (docRef) {
                    console.log("Bid updated with ID: ", docRef)
                })
                .catch(function (error) {
                    console.error("Error updating bid: ", error)
                })
        })

    let newBids = [...state]
    newBids[payload.bidId].refunded = payload.refunded
    newBids[payload.bidId].refundTxHash = payload.refundTxHash
    return (newBids)
}
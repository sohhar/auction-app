import firebase from '../firebase'

export default (state, action) => {
    switch (action.type) {
        case 'SET_AUCTIONS':
            console.log (`set auc ${JSON.stringify(action.payload)}`)
            return action.payload

        case 'GET_AUCTIONS':
            const auctions = []
            firebase.firestore().collection("Auction").get().then(async data => {
                data.docs.forEach(doc => {
                    auctions.push(doc.data())

                    // Handle expired auctions
                    if (doc.data().status === 1 &&
                        Date.now() > Number(doc.data().starttime) +
                        Number(doc.data().duration) * 60000) {
                        if (doc.data().numbid > 0)
                            auctions[doc.data().id].status = 2
                        else
                            auctions[doc.data().id].status = -1
                        const _auctionRef = firebase.firestore()
                            .collection('Auction')
                            .doc(doc.data().id.toString())
                        _auctionRef.update(auctions[doc.data().id])
                    }
                })
                auctions.sort(function (a, b) {
                    console.log(`get aucs ${JSON.stringify(auctions)}`)
                    return parseInt(b.id) - parseInt(a.id);
                })
            })
            return auctions

        case 'ADD_AUCTION':
//            const test = [...state, addAuction(action.payload)]
//            console.log (`add auction combine  ${JSON.stringify(test)}`)
            return [...state, addAuction(action.payload)]

        case 'UPDATE_AUCTION':
            const newAuctions = updateAuction(state, action.payload)
            console.log(`updAuc ${JSON.stringify(newAuctions)}`)
            return newAuctions

        default:
            return state
    }
}

function addAuction(payload) {

    console.log(`addAuc ${JSON.stringify(payload)}`)
    // Update DB
    const db = firebase.firestore()
    db.collection("Auction").doc(payload.id.toString()).set({
        id: payload.id,
        title: payload.title,
        seller: payload.seller,
        image: payload.image,
        startbid: Number(payload.startbid),
        reservebid: Number(payload.startbid),
        duration: Number(payload.duration),
        description: payload.description,
        currentbid: 0,
        numbid: 0,
        bcid: 0,
        starttime: '',
        dstarttime: '',
        status: 0,
        transactionhash: ''
    })

    // return object to set Auctions
    return {
        id: payload.id,
        title: payload.title,
        seller: payload.seller,
        image: payload.image,
        startbid: Number(payload.startbid),
        reservebid: Number(payload.startbid),
        duration: Number(payload.duration),
        description: payload.description,
        currentbid: 0,
        numbid: 0,
        bcid: 0,
        starttime: '',
        dstarttime: '',
        status: 0,
        transactionhash: ''
    }
}

function updateAuction(state, payload) {

    let newAuctions = [...state]
    newAuctions[payload.id].transactionhash = payload.transactionhash ? payload.transactionhash : newAuctions[payload.id].transactionhash
    newAuctions[payload.id].bcid = payload.bcid ? payload.bcid : newAuctions[payload.id].bcid
    newAuctions[payload.id].status = payload.status ? payload.status : newAuctions[payload.id].status
    newAuctions[payload.id].starttime = payload.starttime ? payload.starttime : newAuctions[payload.id].starttime
    newAuctions[payload.id].dstarttime = payload.dstarttime ? payload.dstarttime : newAuctions[payload.id].dstarttime
    newAuctions[payload.id].numbid = payload.numbid ? payload.numbid : newAuctions[payload.id].numbid
    newAuctions[payload.id].winner = payload.winner ? payload.winner : newAuctions[payload.id].winner
    newAuctions[payload.id].winningAmount = payload.winningAmount ? payload.winningAmount : newAuctions[payload.id].winningAmount

    // Update DB
    const db = firebase.firestore()
    db.collection("Auction").doc(payload.id.toString()).update(newAuctions[payload.id])

    return (newAuctions)
}

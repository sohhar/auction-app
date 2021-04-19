import firebase from '../firebase'

export default (state, action) => {
    switch (action.type) {
        case 'GET_AUCTIONS':
            const auctions = []
                firebase.firestore().collection("Auction").get().then(data => {
                    data.docs.forEach(async (doc) => {
                        await auctions.push(doc.data())
                    })
                    console.log(`test auc ${JSON.stringify(auctions)}`)
                    console.log(`getAuc ${JSON.stringify(action.payload)}`)
//                    return auctions
            return action.payload
                })
        case 'ADD_AUCTION':
            return {
                auctions: [...state, addAuction(action.payload)]
            }

        case 'UPDATE_AUCTION':
            const newAuctions = updateAuction(state, action.payload)
            console.log(`updAuc ${JSON.stringify(newAuctions)}`)
            return newAuctions

        default:
            return state
    }
}

function addAuction(payload) {
/*
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
*/
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
    newAuctions[payload.id].transactionhash = payload.transactionhash
    newAuctions[payload.id].bcid = payload.bcid
    newAuctions[payload.id].status = payload.status
    newAuctions[payload.id].starttime = payload.starttime
    newAuctions[payload.id].dstarttime = payload.dstarttime

/*    // Update DB
    const db = firebase.firestore()
    db.collection("Auction").doc(payload.id.toString()).update(newAuctions[payload.id])
*/
    return (newAuctions)
}
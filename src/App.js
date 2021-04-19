import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import GlobalStyle from './globalStyles'
import { Navbar, Footer } from './components'
import Web3ContextProvider from './context/Web3Context'
import AuctionContextProvider from './context/AuctionContext'
import BidContextProvider from './context/BidContext'
import Home from './pages/Home/Home'
import AddAuction from './pages/AddAuction'
import Auctions from './pages/Auctions'
import Auction from './pages/Auction'

function App() {

  return (
    <>
      <Web3ContextProvider>
        <AuctionContextProvider>
          <BidContextProvider>
            <Router>
              <GlobalStyle />
              <Navbar />
              <Switch>
                <Route path='/' exact component={Home} />
                <Route path='/add-auction' component={AddAuction} />
                <Route path='/auctions' exact component={Auctions} />
                <Route path='/auction' exact component={Auction} />
                <Route path='/auction/:id' component={Auction} />
              </Switch>
              <Footer />
            </Router>
          </BidContextProvider>
        </AuctionContextProvider>
      </Web3ContextProvider>
    </>
  );
}

export default App;

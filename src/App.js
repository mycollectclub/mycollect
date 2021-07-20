import React from 'react';
import { HashRouter as Router, Route } from "react-router-dom";
import Home from "./home/Home";
// import ListScroll from "./home/ListScroll";
// import MoveDetail from "./MoveDetail";
import Editkodihost from "./home/Editkodihost";
import DownList from "./home/DownList";
import ListCenter from "./home/ListCenter";
import Search from "./Search";
// import Test from "./Ipfsadd";
import Other from "./home/Other";
import PubOther from "./home/PubOther";
import PlayMove from "./home/PlayMove";



function App() {
  return (
   <Router>
            <div>
 				<Route path="/" exact component={Home}></Route>
				<Route path="/home" component={Home}></Route>
				<Route path="/downList" component={DownList} />
				<Route path="/other" component={Other} />
				<Route path="/pubother" component={PubOther} />
				<Route path="/editkodihost" component={Editkodihost} />
				<Route path="/listCenter" component={ListCenter} />
				<Route path="/search" component={Search} />
				<Route path="/playMove" component={PlayMove} />
            </div>
    </Router>
  );
}

export default App;

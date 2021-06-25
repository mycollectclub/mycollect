import React from 'react'
import { Player, ControlBar, ClosedCaptionButton} from 'video-react';
// import ipfsClient from 'ipfs-http-client'
import axios from 'axios'
import 'video-react/dist/video-react.css';




const host = window.location.host;

// const host = '127.0.0.1:5001'


class PlayMove extends React.Component {
  constructor () {
    super()
	this.state = {
		playerSrc:"",

		}

    }


	componentDidMount() {
		let address=this.getQueryVariable("address")
		if (address){
			this.setState({ 
				playerSrc:address
			},()=>{this.player.load();
			// this.player.toggleFullscreen()
			});
		}
	
		
	}
	getQueryVariable(variable){
	   let URL=window.location.href
	   console.log(URL)
	   let n=URL.indexOf("?")
		URL=URL.slice(n+1)
		console.log(URL)
	   var pair = URL.split("=");
	   console.log(pair)
	   if(pair[0] == variable){return pair[1];}   
	
	   return(false);
	}

	

  render () {
		
	return (
	<div >	 	   
			<Player 
				ref={player => {
					this.player = player;
				  }}			
				autoPlay
				  >
				<source src={this.state.playerSrc} />
			</Player>	 
   </div>
 
 
    );
  }
}



export default PlayMove;












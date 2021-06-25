import React from "react";
import { Grid,Modal,Button,WhiteSpace } from 'antd-mobile';
import axios from 'axios';
import MoveDetail from '../MoveDetail'
import './Home.css';

const host = window.location.host;

// const host = '192.168.31.250:5100'



class ListScroll extends React.Component {
  constructor () {
	super()
	  this.state = {
		moveList:[],
		moveDetailmodal:false,
		linkData:{},
		data:{}
	  };
	  this.handleClick=this.handleClick.bind(this)
	}
	
	async handleClick(pathname,linkData,e){
		e.preventDefault()
		if(pathname=="/listScroll"){
			let res = await axios.get("http://"+host+linkData.data)
			if (res.data.length<124){
				this.setState({ 
					showList:true,
					// linkData:linkData,
					// listData:res.data,
				},()=>{
					this.setState({ 

					linkData:linkData,
					listData:res.data,})
				});		 
			}else{
				let state={
					data:res.data,
					ownhash:this.props.linkData.ownhash,
					pubhash:this.props.linkData.pubpath,
					
				}
				var path = {

				  pathname:'/listCenter',

				  state:state,

				}
				this.props.history.push(path)
			}
			
		}else{
			let res = await axios.get("http://"+host+linkData.data)
				let list = res.data;
				if (linkData.own){
					list.own=true
				}
				if(res.data.parentfiles==undefined||res.data.parentfiles==null ||res.data.parentfiles==""){
					
					this.setState({ 
						moveDetailmodal: true,
						linkData:linkData,
						data:list

					});	
				}else{
					
					try{				
						let parentfiles=await axios.get("http://"+host+this.props.pubpath+"/respool"+res.data.parentfiles)
						if (parentfiles.data.files&&parentfiles.data.files.length>0){
							parentfiles.data.files.map((file,index)=>{
								file.pubown=true
								list.files.push(file)
							})
						}
					}catch(err){
						console.log(err)
					}
					this.setState({ 
						moveDetailmodal: true,
						linkData:linkData,
						data:list

					});					
					
				}
		
	
		}
	}
	
	closeDetail=()=>{
		this.setState({ 
			moveDetailmodal: false,
		});
	}   

  render() {
	  const List = ({ listData}) => (

			<Grid data={listData}
			  columnNum={3}
			  hasLine={false}
			  itemStyle={{ height: '55vw'}}
			  renderItem={data => {
				let hash="";
					 let rootpath="";
					 
					 let linkData={};
					 let pathname="";
					 
					 if(data.compilation){
						hash=this.props.linkData.ownhash
						rootpath="/homeimg/"
						pathname="/listScroll"
						linkData={
						  ownhash:this.props.linkData.ownhash,
						  pubhash:this.props.linkData.pubpath,
						  host:host,
						  data:hash+"/compilation"+data.path,
						}
					 }else {
						pathname="/moveDetail"
						if(data.own){
							hash=this.props.linkData.ownhash
						}else{
							hash=this.props.linkData.pubpath
						}
						if(data.editImg){
							rootpath="/homeimg/"
						}else{
							let obj=data.path.lastIndexOf("/");
							if(obj!==-1){							 
								rootpath="/imgpool"+data.path.substring(0,obj+1)
							}
						}
						linkData={
						  img:hash+rootpath+data.img,
						  data:hash+"/respool"+data.path,
						  own:data.own
						}
					 }
			  
			  return(
				<div>
					<a onClick={(e)=>this.handleClick(pathname,linkData,e)}>
					<div className="card">
						  <img src={"http://"+host+hash+rootpath+data.img} 
								className="image"
								alt={data.title} 
							/>
						  <span style={{position:"absolute",
										 bottom: "0", 
										 right: "0.5vw",
										 color: "yellow",
										fontSize: "2vw",whiteSpace:"nowrap",overflow: "hidden" 
										}}>{data.rating}</span>
					</div>
				  <div style={{ color: '#888', fontSize: '3vw', marginTop: '6px' }}>
					<span>{data.title}</span>
				  </div>
				  </a>
				</div>
			  )}}
			/>


		);
	  
	

    return (
	<div className="showbackground" style={{ height: "92vh"}}>
        <WhiteSpace size="md" />		 
		<List listData={this.props.data}  />
         <Modal
			  popup
			  visible={this.state.moveDetailmodal}
			  onClose={this.closeDetail}
			  animationType="slide-up"
			>
			  <MoveDetail 
				linkData={this.state.linkData} 
				data={this.state.data}			
				closeDetail={this.closeDetail}
				/>
			</Modal>
		<WhiteSpace size="md" />
		<Button type="primary" onClick={()=>this.props.closeList()}>返回</Button>
		
	</div>
    );
  }
}



export default ListScroll;
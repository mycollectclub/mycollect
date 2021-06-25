import React from 'react';
import { WingBlank,Grid,Carousel,WhiteSpace,Button ,Modal,Icon} from 'antd-mobile';

import MoveDetail from '../MoveDetail';
import ListScroll from './ListScroll';
//import ipfsClient from 'ipfs-http-client'
import axios from 'axios'

import './Home.css';


const host = window.location.host;


// const host = '192.168.31.250:5100'



class Homelist extends React.Component {
  constructor () {
	   super()
	  this.state = {
		// showDetail:false,
		showList:false,
		// showTvDetail:false,
		linkData:{},
		data:{},
		listData:[],
		moveDetailmodal:false
	  };

	   this.handleClick = this.handleClick.bind(this)

  };
    

	async handleClick(pathname,linkData,e){
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
					ownhash:this.props.privatepath,
					pubhash:this.props.pubpath,
					
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
					e.preventDefault()
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
					e.preventDefault()
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
	closeList=()=>{
		this.setState({ 
			showList: false,
		});
	}   

  render() {
	  		
			const HomelistDeploy = ({homeListData}) => {
				  return (
				  <div>
					
					 {homeListData&&homeListData.map((data, index) => {
						  switch(data.model){
							case "Homelist01":
								return <Homelist01 key={index} homeListData={data} />; 
								break;
							case "Homelist02":
								return <Homelist02 key={index} homeListData={data} />; 
								break;
							case "Homelist11":
								return <Homelist11 key={index} homeListData={data} />; 
								break;
							case "Homelist12":
								return <Homelist12 key={index} homeListData={data} />; 
								break;
							case "Homelist13":
								return <Homelist13 key={index} homeListData={data} />; 
								break;
							case "customize":
								return <div key={index} dangerouslySetInnerHTML={{ __html: data.customize }} /> ; 
								break;
							 default:return null;
						}
					 }
					)}
					</div>

			)}
			
			
			
			const Homelist01 = ({ homeListData}) => (
			  <div>
			  <WhiteSpace size="sm" />
			  <Carousel
				  autoplay={true}
				  infinite
				>
				 {homeListData.files.map((data, index) => {	
					  let hash="";
					 let rootpath="";
					 
					 let linkData={};
					 let pathname="";
					 
					 if(data.compilation){
						hash=this.props.privatepath
						rootpath="/homeimg/"
						pathname="/listScroll"
						linkData={
						  ownhash:this.props.privatepath,
						  pubhash:this.props.pubpath,
						  host:host,
						  data:hash+"/compilation"+data.path,
						}
					 }else {
						pathname="/moveDetail"
						if(data.own){
							hash=this.props.privatepath
						}else{
							hash=this.props.pubpath
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
					return (
						<div className="card2" key={index}>
						<a onClick={(e)=>this.handleClick(pathname,linkData,e)}>
							<img className="image" style={{width: "100%", height:"50vw"}} src={"http://"+host+hash+rootpath+data.img} alt={data.title}></img>
							<div className="img-content">
								<span>{data.title}</span>
							</div>
						</a>
						</div>

				 
					)}
				 )}
				</Carousel>
				</div>
			)
			
			
			
			const Homelist02 = ({ homeListData}) => (
		
					<Grid data={homeListData.files}
					  columnNum={3}
					  hasLine={false}
					  itemStyle={{ height: '45vw',padding: "0"}}
					  renderItem={data => {
							let hash="";
							 let rootpath="";
							 
							 let linkData={};
							 let pathname="";
							 
							 if(data.compilation){
								hash=this.props.privatepath
								rootpath="/homeimg/"
								pathname="/listScroll"
								linkData={
								  ownhash:this.props.privatepath,
								  pubhash:this.props.pubpath,
								  host:host,
								  data:hash+"/compilation"+data.path,
								}
							 }else {
								pathname="/moveDetail"
								if(data.own){
									hash=this.props.privatepath
								}else{
									hash=this.props.pubpath
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
							<div className="card" >
								<a onClick={(e)=>this.handleClick(pathname,linkData,e)}>
									<img className="image" style={{width: "100%"}} src={"http://"+host+hash+rootpath+data.img} alt={data.title}></img>
									<div className="img-content">
										<span>{data.title}</span>
									</div>
								</a>
							</div>					
						  )}}
						/>
						
						
				);
	  
	  
	  
		const Homelist11 = ({ homeListData}) => {			
			 return (
				  <ul className="center-list">
					 {homeListData.files.map((data, index) => {
						 let hash="";
						 let rootpath="";
						 
						 let linkData={};
						 let pathname="";
						 
						 if(data.compilation){
							hash=this.props.privatepath
							rootpath="/homeimg/"
							pathname="/listScroll"
							linkData={
							  ownhash:this.props.privatepath,
							  pubhash:this.props.pubpath,
							  host:host,
							  data:hash+"/compilation"+data.path,
							}
						 }else {
							pathname="/moveDetail"
							if(data.own){
								hash=this.props.privatepath
							}else{
								hash=this.props.pubpath
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
						return (
							<li className="center-item" key={index}>
							
							<Button type="ghost" onClick={(e)=>this.handleClick(pathname,linkData,e)} style={{ margin: "4vw 0" }} size="small" inline>{data.title}</Button>

							
							</li>
					 
						)}
					 )}			
				</ul>
			)}

	  const Homelist12 = ({ homeListData}) => (
		<div>		
			<div className="row">
				<span className="h">{homeListData.title}</span>
			</div>
			<Grid data={homeListData.files}
			  columnNum={2}
			  hasLine={false}
			  itemStyle={{ height: '39vw'}}
			  renderItem={data => {
					let hash="";
					 let rootpath="";
					 
					 let linkData={};
					 let pathname="";
					 
					 if(data.compilation){
						hash=this.props.privatepath
						rootpath="/homeimg/"
						pathname="/listScroll"
						linkData={
						  ownhash:this.props.privatepath,
						  pubhash:this.props.pubpath,
						  host:host,
						  data:hash+"/compilation"+data.path,
						}
					 }else {
						pathname="/moveDetail"
						if(data.own){
							hash=this.props.privatepath
						}else{
							hash=this.props.pubpath
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
					<div className="card4">
						  <img src={"http://"+host+hash+rootpath+data.img} 
								className="image"
								alt={data.title} 
							/>
						  <span style={{position:"absolute",
										 bottom: "0", 
										 right: "0.5vw",
										 color: "yellow",
										fontSize: "2vw"
										}}>{data.rating}</span>
					</div>
				  <div style={{ color: '#888', fontSize: '3vw', marginTop: '6px' }}>
					<span>{data.title}</span>
				  </div>
				 </a>
				</div>
			  )}}
			/>

		  </div>
		);
	  
	  	const Homelist13 = ({ homeListData}) => (
		<div>
			<div className="row">
				<span className="h">{homeListData.title}</span>
			</div>

			<Grid data={homeListData.files}
			  columnNum={3}
			  hasLine={false}
			  itemStyle={{ height: '55vw'}}
			  renderItem={data => {
					let hash="";
					 let rootpath="";
					 
					 let linkData={};
					 let pathname="";
					 
					 if(data.compilation){
						hash=this.props.privatepath
						rootpath="/homeimg/"
						pathname="/listScroll"
						linkData={
						  ownhash:this.props.privatepath,
						  pubhash:this.props.pubpath,
						  host:host,
						  data:hash+"/compilation"+data.path,
						}
					 }else {
						pathname="/moveDetail"
						if(data.own){
							hash=this.props.privatepath
						}else{
							hash=this.props.pubpath
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
										fontSize: "2vw"
										}}>{data.rating}</span>
					</div>
				  <div style={{ color: '#888', fontSize: '3vw', marginTop: '6px' }}>
					<span>{data.title}</span>
				  </div>
				  </a>
				</div>
			  )}}
			/>

		  </div>
		);
		

    return (
    
		<div style={{backgroundColor: "white" }} >				
			<WingBlank >
				<div className="listSearchAll" >
					<a   onClick = {this.props.handleClickSearch}>
						<div className="search" style={{width: "50vw",}}>
							<span style={{margin: "auto"}}>搜索资源</span>
							<Icon type="search" size="sm" />
						</div>
					</a>
					<a onClick = {this.props.handleClickall} >
						<div className="search">
							<span style={{margin: "auto 0"}}>全部筛选</span>
						</div>
					</a>
				</div>
				< HomelistDeploy homeListData={this.props.homedata}/>
			</WingBlank>
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
			
			<Modal
			  popup
			  visible={this.state.showList}
			  onClose={this.closeList}
			  animationType="slide-up"
			>
				 <ListScroll 
					showList={this.state.showList}
					linkData={this.state.linkData} 
					data={this.state.listData}
					closeList={this.closeList}
				/>:
			</Modal>			
			<div style={{width: "100%", height: "3vw"}}></div>
		</div>

    );
  }
}

export default Homelist;





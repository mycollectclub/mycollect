import React from "react";
// import { Link } from "react-router-dom";
import { Toast,List,NavBar } from 'antd-mobile';
import ipfsClient from 'ipfs-http-client'
import axios from 'axios';
import './Other.css';
const Item = List.Item;
const Brief = Item.Brief;


const hostname = window.location.hostname;

const apiport = window.location.port;

const host = window.location.host;

// const host = '127.0.0.1:5001'
// const hostname = "127.0.0.1"
// const apiport="5001"

var pubhash="/ipfs/QmW7sVdGx6kbCHBFA1txxkRCAhG5VA2Yun9pesqBW15Sbp"





class Other extends React.Component {
  constructor () {
	super()
	  this.state = {
			lists:[],
			downlists:[],
			websitelists:[],
			websitedown:[],
			favoritesList:[],
			blacklist:[],
			hasAPi:true
	  };
	   this.ipfs = ipfsClient({ host: hostname, port: apiport, protocol: 'http' })
	    this.handleClick = this.handleClick.bind(this)
		this.handleWebsiteClick = this.handleWebsiteClick.bind(this)
		this.tick = this.tick.bind(this)
		this.handleBlackClick = this.handleBlackClick.bind(this)

	}


	
	

	async componentDidMount(){
		this.timerID=setInterval(()=>this.tick(),2000);		
		try {
			const id = await this.ipfs.id()			
		}catch{
			this.setState({ 
				hasAPi:false,
			})
		}
		let config={}
		try {
			let getpubdata=await axios.get("http://"+host+"/homeconfig/homeconfig")
			config=getpubdata.data			
			if(config.PubData){
				pubhash=config.PubData
			}
			
		}catch{}	
		
		let pub={
			Cid:"pub",
			Name:"公共资源池",
			Path:pubhash,
			"Overview":"公共资源池"
		}
		let favoritesList=[pub];
		let blacklist=[];
		axios.get("http://"+host+pubhash+'/shareData').then(res => {
			let data=res.data				
			if (config.FavoritesList&&config.FavoritesList.length>0){
				config.FavoritesList.map((item)=>{
					if(data.Data&&data.Data.length>0){
						data.Data.map((list)=>{
							if (list.Cid==item){
								favoritesList.push(list)
							}
						})
					}
				})					
			}
			if (config.Blacklist&&config.Blacklist.length>0){
				let array_diff=(a, b) =>{ 
					for(var i=0;i<b.length;i++) 
					{ 
						for(var j=0;j<a.length;j++) 
						{ 
							if(a[j].Cid==b[i]){ 
								blacklist.push(a[j])
								a.splice(j,1); 
								j=j-1; 
							} 
						} 
					} 
					return a; 
				}
				array_diff(data.Data,config.Blacklist)
				
					
			}
			this.setState({ 
				lists:data.Data,
				websitelists:data.Website,
				blacklist:blacklist,
				favoritesList:favoritesList
			}) 
			let pinfiles=[]
			if (favoritesList&&favoritesList.length>0&&this.state.hasAPi){
				favoritesList.map((item)=>{
					pinfiles.push({"Cid":item.Path})
				})			
				axios.post("http://"+host+"/cidislocal",pinfiles).then(res => {
					if (res.data&&res.data.length>0){
						res.data.map((item)=>{
							favoritesList.map((list)=>{									
								if (item.Cid==list.Path){
									if(item.Has){
										list.Has="ok"
									}
								}
							})
						})
						
					}
					this.setState({ 
						favoritesList:favoritesList
					}) 
				})

				
			}
	
		});
		
	
    }
	
  componentWillUnmount(){
        clearInterval(this.timerID);
    }
    async tick(){
		if(!this.state.hasAPi){
			let res={}
			if (this.state.downlists.length > 0||this.state.websitedown.length > 0){
				res= await axios.get("http://"+host+'/pinfiles')
			}
			if (this.state.downlists.length > 0){
				let downlists=this.state.downlists
				// let res= await axios.get("http://"+host+'/pinfiles')
				downlists.map((down,index)=>{
					if (res.data.length>0){
						res.data.map((item) => {						
							if (item.Cid==down){
								let lists=this.state.lists	
								if (item.Size>100000000){								
									downlists.splice(index,1); 
									let cancel={
										"Cmd":"cancel",
										"Cid":item.Cid,
										"Name":item.Name
									}
									axios.post("http://"+host+'/pinfiles',cancel).then()
									lists.map((list)=>{									
										if (list.Path==item.Cid ){										
											list.Has="toobig"
										}
									})
								}
								if (item.Ok){
																
									lists.map((list)=>{									
										if (list.Path==item.Cid ){										
											list.Has="ok"
										}
									})
									downlists.splice(index,1); 
									this.setState({ 
										lists:lists,
										downlists:downlists
									})
									let rmfile={
										"Cmd":"rmfile",
										"Cid":item.Cid,
										"Name":item.Name
									}
									axios.post("http://"+host+'/pinfiles',rmfile).then()							
								}
							}
							
						})
					}			
				})
				
				
			}
			if (this.state.websitedown.length > 0){
				let websitedown=this.state.websitedown
				// let res= await axios.get("http://"+host+'/pinfiles')
				websitedown.map((down,index)=>{
					if (res.data.length>0){
						res.data.map((item) => {
							if (item.Cid==down){
								let websitelists=this.state.websitelists
								if (item.Size>100000000){								
									websitedown.splice(index,1); 
									let cancel={
										"Cmd":"cancel",
										"Cid":item.Cid,
										"Name":item.Name
									}
									axios.post("http://"+host+'/pinfiles',cancel).then()
									websitelists.map((list)=>{									
										if (list.Path==item.Cid ){										
											list.Has="toobig"
										}
									})
								}
								if (item.Ok){
																	
									websitelists.map((list)=>{									
										if (list.Path==item.Cid ){										
											list.Has="ok"
										}
									})
									websitedown.splice(index,1); 
									this.setState({ 
										websitelists:websitelists,
										websitedown:websitedown
									})
									let rmfile={
										"Cmd":"rmfile",
										"Cid":item.Cid,
										"Name":item.Name
									}
									axios.post("http://"+host+'/pinfiles',rmfile).then()							
								}
							}
							
						})
					}			
				})
				
				
			}	
			
		}		
    }




	handleClick(data){
		if (data.Has=="ok"||data.Has=="toobig"||data.Cid=="pub"||!this.state.hasAPi){
			
			let state={
				data:data,				
			}			
			let path = {

			  pathname:'/',

			  state:state,

			}
			this.props.history.push(path)
			// this.props.getotherdata(data)
			this.info("切换")
		}else if (data.Has=="down"){
			this.info("下载未完成未成功")
		}else{
			let add={
				"Cmd":"add",
				"Cid":data.Path,
				"Name":"网站数据--"+data.Name
			}
			axios.post("http://"+host+'/pinfiles',add).then(res=>{ 				
				let downlists=this.state.downlists
				downlists.push(data.Path)
				let lists=this.state.lists								
				lists.map((list)=>{					
					if (list.Path==data.Path ){
						list.Has="down"
					}
				})
				this.setState({ 
					downlists:downlists,
					lists:lists

				})
			}).catch(()=>{
				this.info("未成功")
			})	;
		}

		
	}
	
	handleBlackClick(data){
		let state={
			data:data,				
		}			
		let path = {

		  pathname:'/',

		  state:state,

		}
		this.props.history.push(path)
		// this.props.getotherdata(data)
		this.info("切换...")
		
	}	
	
	handleWebsiteClick(data){
		if (data.Has=="ok"||!this.state.hasAPi){
			window.location=("http://"+host+data.Path);		
		}else if (data.Has=="down"){
			this.info("下载未完成未成功")
		}else{
			let add={
				"Cmd":"add",
				"Cid":data.Path,
				"Name":"网站数据--"+data.Name
			}
			axios.post("http://"+host+'/pinfiles',add).then(res=>{ 				
				let websitedown=this.state.websitedown
				websitedown.push(data.Path)
				let websitelists=this.state.websitelists								
				websitelists.map((list)=>{					
					if (list.Path==data.Path ){
						list.Has="down"
					}
				})
				this.setState({ 
					websitedown:websitedown,
					websitelists:websitelists

				})
			}).catch(()=>{
				this.info("未成功")
			})	;
		}

		
	}

	info = (msg) => {
	  Toast.info(msg);
	};
	backClick=()=>{
	
		window.location.href="javascript:history.go(-1)"
	}


  render() {
		  
	  const OtherList = ({ listData}) => {
		  if (listData&&listData.length!==0){
			 return (
			 <List >
				{	
					listData&&listData.map((data, index) => {
								
					return (
						<Item
						  multipleLine
					      key={index}
						>					
							<a onClick={()=>this.handleClick(data)}>
								{data.Name}
								{data.Has=="ok"?<span className="otherok-text">完成</span>
									:data.Has=="down"?<span className="otherdown-text">下载中</span>
										:data.Has=="toobig"?<span className="otherdown-text">文件太大</span>
											:null}
								<Brief>{data.Overview}<br />{data.Cid}</Brief> 
							</a>							  
						</Item>
					)
					
				})}
				
				
				
			</List> 
			)
			  
		  }else{
			  return null
		  }
		}
	  const BlackList = ({ listData}) => {
		  if (listData&&listData.length!==0){
			  
			return (
				  
				<List >				
					{listData.map((data, index) => {
				
						return (
							<Item
							  multipleLine
							  key={index}
							>					
								<a onClick={()=>this.handleBlackClick(data)}>
									{data.Name}
									{data.Has=="ok"?<span className="otherok-text">完成</span>
										:data.Has=="down"?<span className="otherdown-text">下载中</span>
											:data.Has=="toobig"?<span className="otherdown-text">文件太大</span>
												:null}
									<Brief>{data.Overview}<br />{data.Cid}</Brief> 
								</a>							  
							</Item>					 
						)}
					 )}
				</List> 
			)  
			  
		  }else{
			  return null
		  }
		}		
	const Website = ({ listData}) => {
		if (listData&&listData.length!==0){
			return (			  
				<List >
					
					{listData.map((data, index) => {
				
						return (
						
							<Item
							  multipleLine
							  key={index}
							>					
								<a onClick={()=>this.handleWebsiteClick(data)}>
									{data.Name}
									{data.Has=="ok"?<span className="otherok-text">完成</span>
										:data.Has=="down"?<span className="otherdown-text">下载中</span>
											:data.Has=="toobig"?<span className="otherdown-text">文件太大</span>
												:null}
									<Brief>{data.Overview}<br />{data.Cid}</Brief> 
								</a>							  
							</Item>						 
						)}
					 )}
				</List> 
			)
		}else{
			  return null
		  }
	}	
	  

    return (
	<div >
		<NavBar
		  mode="dark"
		  leftContent="返回"
		  onLeftClick={this.backClick}
		>资源池</NavBar>
		<div className="rowtext">
			<span >收藏</span>
		</div>		
		<OtherList listData={this.state.favoritesList}/>
		<div className="rowtext">
			<span >资源池</span>
		</div>
		<OtherList listData={this.state.lists}/>
		<div className="rowtext">
			<span >网站</span>
		</div>
		<Website listData={this.state.websitelists}/>
		<div className="rowtext">
			<span >黑名单</span>
		</div>
		<BlackList listData={this.state.blacklist}/>
	</div>
    );
  }
}



export default Other;
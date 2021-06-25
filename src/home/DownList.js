import React from "react";
// import { Link } from "react-router-dom";
import { List,Toast,Switch ,Button,Popover,Icon,NavBar} from 'antd-mobile';
import ipfsClient from 'ipfs-http-client'
import axios from 'axios';
import './DownList.css';

const Item = List.Item;
const Brief = Item.Brief;

const hostname = window.location.hostname;

const apiport = window.location.port;

const host = window.location.host;

// const host = '192.168.31.250:5100'
// const hostname = "192.168.31.250"
// const apiport="5100"

var kodihost=window.location.hostname+":8080"
var finddata={}


class DownList extends React.Component {
  constructor () {
	super()
	  this.state = {
			lists:[],
			up:0,
			down:0,
			repoSize:0,
			storageMax:0,
			gwconnect:true,
			visible: false,
	  };
	  this.ipfs = ipfsClient({ host: hostname, port: apiport, protocol: 'http' })
	}


	

	async componentDidMount(){
        let kodidata = window.sessionStorage.getItem("kodiaddres");
		if (kodidata){
			let finddata= JSON.parse(kodidata);
			kodihost=finddata.address+":"+finddata.port
		}
		
		let res= await axios.get("http://"+host+'/pinfiles')
		if (res.data&&res.data.length>0){
			this.setState({ 
				lists:res.data 
			})
		}
		try {
			const stats = await this.ipfs.repo.stat()
			this.setState({ 
					lists:res.data ,
					repoSize:parseInt(stats.repoSize.toFixed(0), 10),
					storageMax:parseInt(stats.storageMax.toFixed(0), 10),

			})
			this.timerID=setInterval(()=>this.tick(),2000);
		}catch{
			this.setState({ 
					gwconnect:false,
					lists:res.data ,
			})
			this.timerID=setInterval(()=>this.tick(),10000);
		}
		

    }
	
    componentWillUnmount(){
        clearInterval(this.timerID);
    }
    async tick(){
        let res= await axios.get("http://"+host+'/pinfiles')
		if (this.state.gwconnect){
			try {
				let stats = await this.ipfs.stats.bw()			
				if (JSON.stringify(res.data)==JSON.stringify(this.state.lists)){
					this.setState({ 
						up:parseInt(stats.rateOut.toFixed(0), 10),
						down:parseInt(stats.rateIn.toFixed(0), 10)
					})
				}else{	
					if (stats.rateOut){
						this.setState({ 
							up:parseInt(stats.rateOut.toFixed(0), 10),
							down:parseInt(stats.rateIn.toFixed(0), 10),
							lists:res.data ,
						})					
					}
					
				}
			}catch(err){console.log(err)}
			
			
			
			
		}else{
			if (JSON.stringify(res.data)!=JSON.stringify(this.state.lists)){
				this.setState({ 
					lists:res.data ,
				})
			}			
		}

		
    }


	getfilesize(size) {
        if (!size)
            return "";
        var num = 1024.00; //byte
        if (size < num)
            return size + "B";
        if (size < Math.pow(num, 2))
            return (size / num).toFixed(2) + "K"; //kb
        if (size < Math.pow(num, 3))
            return (size / Math.pow(num, 2)).toFixed(2) + "M"; //M
        if (size < Math.pow(num, 4))
            return (size / Math.pow(num, 3)).toFixed(2) + "G"; //G
        return (size / Math.pow(num, 4)).toFixed(2) + "T"; //T
    }


	handleClick(disrm,data){
		if(disrm){
			return
		}
		let rmpin={
				"Cmd":"rmpin",
				"Cid":data.Cid,
				"Name":data.Name
			}
		axios.post("http://"+host+'/pinfiles',rmpin).then(res => { 
			this.setState({ 
				visible: false,
			});
		}).catch((response) => {
          Toast.info("失败")        
        });
	}
	
	handlePlay=(item)=>{
		let URL=window.location.href
		let n=URL.lastIndexOf("#")
		URL=URL.slice(0,n+1)
		let newURL=URL.concat("/playmove?address="+"http://"+host+"/ipfs/"+item.Cid) 
		window.open(newURL,"playmove","fullscreen=yes,location=no")
		this.setState({ 
			visible: false,
		});
		
		
	}
	
	addClick=(checked,data)=>{
		if(checked){
			return
		}
		let add={
			"Cmd":"add",
			"Cid":data.Cid,
			"Name":data.Name
		}
		axios.post("http://"+host+'/pinfiles',add).then(res => {
			this.setState({ 
				visible: false,
			});
		}).catch((response) => {
          Toast.info("失败")        
        });
	}
	cancelClick=(checked,data)=>{
		if(checked){
			return
		}
		let cancel={
			"Cmd":"cancel",
			"Cid":data.Cid,
			"Name":data.Name
		}
		axios.post("http://"+host+'/pinfiles',cancel).then(res => {
			this.setState({ 
				visible: false,
			});
		}).catch((response) => {
          Toast.info("失败")        
        });
	}
		
	kodiopen=(hash)=>{
		let josnApi={ 
			"id": 1, 
			"jsonrpc": "2.0",
			"method": "Player.Open", 
			"params": {
				"item": { "file": "http://"+host+"/ipfs/"+hash } 
			} 
		}
		let body=JSON.stringify(josnApi)
		let data = {
			"URI":"http://"+kodihost+"/jsonrpc",
			"METHOD":"POST",
			"HEADER":"application/json",
			"BODY":body,			
		}
		
		if(JSON.stringify(finddata) == "{}"){
			let kodidata = window.sessionStorage.getItem("kodiaddres");
			if (kodidata){
				finddata= JSON.parse(kodidata);
				kodihost=finddata.address+":"+finddata.port
			}
		}
		if (finddata["password"]){
			data.USER=finddata.user
			data.PASSWORD=finddata["password"]
		}
		let config = {
			headers: {
				'Content-Type': 'application/json'
			}
		}
		axios.post("http://"+host+"/jsonapi",data,config).then(res => {
 			
			
			let backdata=res.data
			if(typeof(backdata)=='object'){
				if (backdata.error){
					Toast.info(backdata.error.message)
				}else{
					Toast.info("已播放")
				}
				
			}else if (typeof(backdata)=='string'&&backdata.indexOf("Client.Timeout")!=-1){
				Toast.info("连接超时")
			}else{
				if (typeof(backdata)=='string'&&backdata.indexOf("401 Unauthorized")!=-1){
					Toast.info("需要密码")
				}else{
					Toast.info("无法连接")
				}
				
			}
		})
		
	}
	
	backClick=()=>{
		// let pushpath = {

			// pathname:"/home",		

			// }
		// this.props.history.push(pushpath)
		window.location.href="javascript:history.go(-1)"
	}

  render() {
	  const ListDown = ({ listData}) => {		
		if (!(listData&&listData.length>0)){
			return(null)
		}
		return (
			<List renderHeader={() => '下载列表'} className="my-list">
				{	
					listData&&listData.map((data, index) => {
					let disitemadd=true
					let disitemcancel=true
					if ((data.Cancel||data.UnPin)&&(!data.Ok)) {
						disitemadd=false
					}

					if (data.Cancel==false&&data.UnPin==false&&data.Ok==false){
						disitemcancel=false
					}
					let rmshow=true
					if ((data.Ok||data.Cancel)&&(!data.UnPin)){
						rmshow=false
					}
					let size=this.getfilesize(data.Size)				
					return (
						<Item
						  multipleLine
					      key={index}
						>
							<div style={{ display: "flex" ,alignItems: "center"}}>
								<a style={{ width: '90%'}} onClick={()=>this.kodiopen(data.Cid)}>
									<div >{data.Name}<Brief>{size}{data.Ok?<span style={{ color: 'red',float:"right"}}>完成</span>:null}<br />{data.Cid}</Brief> </div>
								</a>
								
								<Popover mask
									overlayClassName="fortest"
									overlayStyle={{ color: 'currentColor'}}
									visible={this.state.visible}
									overlay={[
									  (<Item key="4" disabled={disitemadd} onClick={()=>this.addClick(disitemadd,data)} value="scan" >下载</Item>),
									  (<Item key="5" disabled={disitemcancel} onClick={()=>this.cancelClick(disitemcancel,data)} value="special"  style={{ whiteSpace: 'nowrap' }}>取消</Item>),
									  (<Item key="6" disabled={rmshow} onClick={()=>this.handleClick(rmshow,data)} value="button ct" >释放</Item>),
									  (<Item key="6" onClick={()=>this.handlePlay(data)} value="buttonplay" >网页播放</Item>),
									]}
									align={{
									  overflow: { adjustY: 0, adjustX: 0 },
									  offset: [-10, 0],
									}}

								  >
									<div style={{
									  height: '100%',
									  padding: '0 15px',
									  marginRight: '-15px',
									  display: 'flex',
									  alignItems: 'center',
									}}
									>
									  <Icon type="ellipsis" />
									</div>
								  </Popover>
							  </div>
						</Item>
					)
					
				})}
				
				
				
			</List>



		)}	
	  
	

    return (
	<div >
		<NavBar
		  mode="dark"
		  leftContent="返回"
		  onLeftClick={this.backClick}
		>下载页面</NavBar>
		<div className="rategrid">
			<span className="rate-text">接收: {this.getfilesize(this.state.down)}</span>
			<span className="rate-text">发送: {this.getfilesize(this.state.up)}</span>
			<span className="rate-text">已使用: {this.getfilesize(this.state.repoSize)}</span>
			<span className="rate-text">最大空间: {this.getfilesize(this.state.storageMax)}</span>
		</div>
		<ListDown listData={this.state.lists} />		
	</div>
    );
  }
}



export default DownList;
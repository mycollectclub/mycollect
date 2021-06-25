import React from 'react'
import axios from 'axios'
import './MoveDetail.css';
import { Popover,Toast,Button,Radio,Accordion,WhiteSpace,Card,List,Icon,SegmentedControl,Grid} from 'antd-mobile';
import copy from 'copy-to-clipboard'
import { Switch } from 'antd-mobile';
const Item = List.Item;
const Brief = Item.Brief;


const host = window.location.host;

// const host = '127.0.0.1:5100'

var finddata={}
class MoveDetail extends React.Component {
  constructor () {
    super()
	this.state = {	
		okList:[],
		onClick:-1,
		segmentedNo:0,
		visible:false,
		// kodikey:"",
		// kodilist:[]
		}

    }
	
	// componentDidMount() {
		// let kodidata = window.sessionStorage.getItem("kodiaddres");
		// if (kodidata){
			// let finddata= JSON.parse(kodidata);
			// kodihost=finddata.address+":"+finddata.port
		// }
		
		
	// }
	

	kodiopen=(hash)=>{
		let josnApi={ 
			"id": 1, 
			"jsonrpc": "2.0",
			"method": "Player.Open", 
			"params": {
			"item": { "file": "http://"+host+"/ipfs/"+hash } 
			} 
		}
		let kodidata = window.sessionStorage.getItem("kodiaddres");
		let kodihost=""
		let finddata={}
		if (kodidata){
			finddata= JSON.parse(kodidata);
			kodihost=finddata.address+":"+finddata.port
		}else{
			kodihost=window.location.hostname+":8080"
		}
		let body=JSON.stringify(josnApi)
		let data = {
			"URI":"http://"+kodihost+"/jsonrpc",
			"METHOD":"POST",
			"HEADER":"application/json",
			"BODY":body,			
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
		Toast.info("发送指令")
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

	handleClick=(hash)=>{
		
		this.kodiopen(hash)
		// window.location=("http://"+host+"/ipfs/"+hash);		

	}
	
	segmentedonChange = (e) => {
		// console.log(`selectedIndex:${e.nativeEvent.selectedSegmentIndex}`);
		
		this.setState({ 
			segmentedNo:e.nativeEvent.selectedSegmentIndex
		})
	  }
	
	handleTvClick=(hash,index,title,episode)=>{
		this.setState({ 
			onClick:index
		})
		if(this.state.segmentedNo==0){
			this.kodiopen(hash)
		}else if(this.state.segmentedNo==1){
			let add={
				"Cmd":"add",
				"Cid":hash,
				"Name":title+"-"+episode
			}
			axios.post("http://"+host+'/pinfiles',add).then(res=>{ 				
				this.info("已添加下载列表")
			}).catch(()=>{
				this.info("未成功")
			})	;
		}else{
			if(this.state.segmentedNo==3){
				let URL=window.location.href
				let n=URL.lastIndexOf("#")
				URL=URL.slice(0,n+1)
				let newURL=URL.concat("/playmove?address="+"http://"+host+"/ipfs/"+hash)
				window.open(newURL,"playmove","fullscreen=yes,location=no")		
			}else{
				copy("http://"+host+"/ipfs/"+hash)			
				this.info("已复制链接")
			}
			
			}
		
		
	}
	
	async componentDidMount() {
		const { data  } = this.props;
		if (data.files&&data.files.length>0){
			let pinfiles=[]
			data.files.map((item)=>{
				pinfiles.push({"Cid":item.hash})
			})
			axios.post("http://"+host+"/cidislocal",pinfiles).then(res => {	
				this.setState({ 
					okList:res.data
				}) 
			})
		}		 
	
  }
	
	// componentWillReceiveProps(nextProps) {
		// const { data  } = this.props;
		// console.log(data)
		// if (data!== nextProps.data) {
			// if (nextProps.data.files&&nextProps.data.files.length>0){
				// let pinfiles=[]
				// nextProps.data.files.map((item)=>{
					// pinfiles.push({"Cid":item.hash})
				// })
				// axios.post("http://"+host+"/cidislocal",pinfiles).then(res => {
					// console.log(res.data)
					// this.setState({ 
						// okList:res.data
					// }) 
				// })
			// }		 
		// }
	// }
  	closeDetail=()=>{
		this.props.closeDetail()
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
	getfiletime=(i)=>{
		if (!i)
            return "";
		return parseInt(i/60);
	}
	
	handleDown=(item)=>{
		let add={
				"Cmd":"add",
				"Cid":item.hash,
				"Name":item.filename
			}
			axios.post("http://"+host+'/pinfiles',add).then(res=>{ 				
				this.setState({ 
					visible: false,
				});
				this.info("已添加下载列表")
			}).catch(()=>{
				this.info("未成功")
			})	;
	}
	handleCopy=(item)=>{
		copy("http://"+host+"/ipfs/"+item.hash)
		this.setState({ 
			visible: false,
		});
		this.info("已复制链接")
	}
	handlePlay=(item)=>{
		let URL=window.location.href
		let n=URL.lastIndexOf("#")
		URL=URL.slice(0,n+1)
		let newURL=URL.concat("/playmove?address="+"http://"+host+"/ipfs/"+item.hash)
		window.open(newURL,"playmove","fullscreen=yes,location=no")		

		this.setState({ 
			visible: false,
		});
		
		
	}
	info = (msg) => {
	  Toast.info(msg);	  
	};
	// onChange=(e)=> {
	  // console.log(`radio checked:${e.target.value}`);
	// }
  render () {
		const {linkData,data}=this.props
		  // let playerSrc=linkData.host+this.state.hash

		const Detaildata = ({ detaildata}) => {
		let that=this
		if(data.type=="tv"){			
			return (
			<List >
				<Item
				   multipleLine
				>
					 <div className="moveDetailitem-grid" >
						<div className="moveDetailitem-grid-item">
							<span className="moveDetailtext">分辨率：</span><span>{data.width}✖{data.height}</span>
						</div>											
						<div className="moveDetailitem-grid-item">
							<span className="moveDetailtext">编码：</span><span>{data.codec_name}</span>
						</div>
						<div className="moveDetailitem-grid-item">
							<span className="moveDetailtext">格式：</span><span>{data.pix_fmt}</span>
						</div>
						{data.size?<div className="moveDetailitem-grid-item">
								<span className="moveDetailtext">大小：</span><span>{this.getfilesize(data.size)}</span>
							</div>:null
						}
						<div className="moveDetailitem-grid-item">
							<span className="moveDetailtext">码率：</span><span>{this.getfilesize(parseInt(data.bit_rate))}</span>
						</div>
						<div className="moveDetailitem-grid-item">
							<span className="moveDetailtext">单片时长：</span><span>{data.duration}分钟</span>
						</div>						
					</div>
				
					<ul className="moveaudioDetailitem-ul">
						{
							data.audio&&data.audio.map((audio,i)=>{
								return (
									<li  className="moveDetailitem-li" key={i}>
										<span className="moveDetailtext">声道：</span><span>{audio.channel_layout}</span>
										<span className="moveDetailtext">语言：</span><span>{audio.language}</span>
									</li>
								)
							})
							
						}
					</ul>
					<ul className="moveaudioDetailitem-ul">
						{
							data.subtitle&&data.subtitle.map((subtitle,y)=>{
								return (
									<li className="moveDetailitem-subtitlelanguage-li" key={y}>
										<span className="moveDetailtext">字幕：</span><span>{subtitle.subtitlelanguage}</span>											
									</li>
								)
							})
							
						}
					</ul>
				</Item>
			 <SegmentedControl
			  values={['KODI播放', '添加下载', '复制网址','网页播放']}
			  onChange={this.segmentedonChange}
			  selectedIndex={this.state.segmentedNo}
			/>			
			<WhiteSpace size="md" />
			<Grid data={detaildata}
			  columnNum={6}
			  hasLine={true}
			  square={true}
			  activeStyle={{ backgroundColor:"red"}}
			  itemStyle={{ padding: "0"}}
			  renderItem={(data,index) => {			
						let privateown=false
						if (this.props.data.own&&(!data.pubown)){
							privateown=true
						}
					  return(
					  <a onClick={()=>{that.handleTvClick(data.hash,index,that.props.data.title,data.episode)}}>
								<div className={that.state.onClick==index?"moveDetailitem-tvClickonClick":"moveDetailitem-tvClick"} style={privateown? { color:"#108ee9"}:{}}>
									<span >{data.episode}</span> 
								</div>								
							</a>
							
								
					  )
					  }}
				/>
			<WhiteSpace size="md" />
			</List>
				
			)
		}else{
			return (
				<List renderHeader={() => '文件列表'} >
					{detaildata&&detaildata.map((item, index) => {						
						let ok=false
						let privateown=false
						if (this.props.data.own&&(!item.pubown)){
							privateown=true
						}
						{this.state.okList&&this.state.okList.map((list)=>{
							if (item.hash==list.Cid){
								if(list.Has){
									ok=true
								}
							}
						})}						
						return (
							<div key={index} style={{ margin: '0 0 5vw 0',borderTop:"2px solid #108ee9 "}} >
								<Item
								  data-seed="logId"
								  key={""+index+"a"}
								>
									<div className="itemfilename">{item.filename}</div>
								</Item>
								<Item
								  multipleLine
								  key={""+index+"c"}
								>
									<div className="itemplay">
									
										{privateown?<span className="fontredcolor">归属：私有</span>:<span>归属：公共</span>}									
										{ok?<span className="fontredcolor">访问：访问过</span>:<span>访问：无</span>}										
										<a onClick={()=>{this.handleClick(item.hash)}}>
											<div className="itemplayIcon">
												KODI播放
												<Icon type='right' />
											</div>
										</a>									
										<Popover mask
											overlayClassName="fortest"
											overlayStyle={{ color: 'currentColor',flexGrow:"0"}}
											visible={this.state.visible}
											overlay={[
											  (<Item key="4"  onClick={()=>this.handleDown(item)} value="scan" >添加下载列表</Item>),
											  (<Item key="5"  onClick={()=>this.handleCopy(item)} value="special"  >复制播放网址</Item>),
											  (<Item key="6"  onClick={()=>this.handlePlay(item)} value="play"  >网页中播放</Item>),
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
								<Item
								  multipleLine
								  key={""+index+"b"}
								>
									<div >
										 <div className="moveDetailitem-grid" >
											<div className="moveDetailitem-grid-item">
												<span className="moveDetailtext">分辨率：</span><span>{item.width}✖{item.height}</span>
											</div>											
											<div className="moveDetailitem-grid-item">
												<span className="moveDetailtext">编码：</span><span>{item.codec_name}</span>
											</div>
											<div className="moveDetailitem-grid-item">
												<span className="moveDetailtext">格式：</span><span>{item.pix_fmt}</span>
											</div>
											<div className="moveDetailitem-grid-item">
												<span className="moveDetailtext">大小：</span><span>{this.getfilesize(item.size)}</span>
											</div>
											<div className="moveDetailitem-grid-item">
												<span className="moveDetailtext">码率：</span><span>{this.getfilesize(parseInt(item.bit_rate))}</span>
											</div>
											<div className="moveDetailitem-grid-item">
												<span className="moveDetailtext">时长：</span><span>{this.getfiletime(parseInt(item.fileDuration))}分钟</span>
											</div>	
											
										</div>
										<ul className="moveaudioDetailitem-ul">
											{
												item.audio&&item.audio.map((audio,i)=>{
													return (
														<li  className="moveDetailitem-li" key={i}>
															<span className="moveDetailtext">声道：</span><span>{audio.channel_layout}</span>
															<span className="moveDetailtext">语言：</span><span>{audio.language}</span>
														</li>
													)
												})
												
											}
										</ul>
										<ul className="moveaudioDetailitem-ul">
											{
												item.subtitle&&item.subtitle.map((subtitle,y)=>{
													return (
														<li className="moveDetailitem-subtitlelanguage-li" key={y}>
															<span className="moveDetailtext">字幕：</span><span>{subtitle.subtitlelanguage}</span>											
														</li>
													)
												})
												
											}
										</ul>


									
										
									  </div>
								</Item>
							
							</div>
							
					 
						)}
					 )}
				</List>
			

			)
		}
	}	
	
	return (
	<div  className="showbackground"  >	   
	   <WhiteSpace size="md" />
	   <div className="moveDetailcontainer2">
		<div style={{width: "30vw", height: "45vw"}}>
			<img 

				style={{width: "30vw", objectFit: "cover", height: "100%", display: "block"}} 
				src={"http://"+host+linkData.img} 
				alt={data.title}>
			</img>
		</div>
		<div className="moveDetailtextout">
			<div className="moveDetailcontainer1">
				
				<span style={{ marginRight:"2vw",overflow:"hidden"}}>{data.title}</span> 
				
				<span style={{color: "red",}}>{data.rating}</span>
				
 				
			</div>
			<div className="moveDetailtext-grid">
				<div className="movecasttextout">
					<span className="moveDetailtext">上映日期：</span><span>{data.year}</span> <br/>
				</div >
				<div className="movecasttextout">	
					<span className="moveDetailtext">国家/地区：</span><span>{data.region}</span> <br/>
				</div >
				<div className="movecasttextout">
					<span className="moveDetailtext">类型：</span><span>{data.genre}</span> <br/>
				</div >
				<div className="movecasttextout">	
					<span className="moveDetailtext">导演：</span><span>{data.director}</span> <br/>
				</div >
				<div className="movecasttextout">			
					<span className="moveDetailtext">主演：</span><span>{data.cast}</span> <br/>
				</div>
			</div>
		</div>
	   </div>
	   <Accordion style={{textAlign: "left",fontSize:"3.5vw" }}  >
          <Accordion.Panel header={<span className="itemfilename">简介：</span>}>
            <span className="moveDetailtext">{data.overview}</span> 
          </Accordion.Panel>          
        </Accordion>
		<div>

			<Detaildata detaildata={data.files} />			
	  
	   </div>

		<Button type="primary" onClick={this.closeDetail}>返回</Button>
 
   </div>
 
 
    );
  }
}



export default MoveDetail;












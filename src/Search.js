import React from 'react'
// import ipfsClient from 'ipfs-http-client'
import axios from 'axios'
import './Search.css';
// import { message} from 'antd';
import { Modal,List,NavBar,Badge,Icon } from 'antd-mobile';
import MoveDetail from './MoveDetail';
// import copy from 'copy-to-clipboard'
// import { Switch } from 'antd';
import PinyinMatch from 'pinyin-match'
import InfiniteScroll from "react-infinite-scroll-component";
const Item = List.Item;
const Brief = Item.Brief;

var size = 24 ;

const host = window.location.host;
// const host = '192.168.31.250:5100'

const letters=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","1","2","3","4","5","6","7","8","9","0"]



class Search extends React.Component {
  constructor () {
    super()
	this.state = {	
		input:"",
		listsall:[],
		filterlists:[],
		hasMore:true,
		items: [],
		showDetail:false,
		linkData:{},
		data:{},
		showinput:true
		}
	this.getdata = this.getdata.bind(this)
	this.play = this.play.bind(this)
    }
	async componentDidMount() {
		let lists=[]
		let publist=[]				
		try{	
			let privatepath=this.props.location.state.privatepath		
			lists=await this.getdata(privatepath+"/respool",true)
		}catch(err){
		}
		try{
			let pubpath=this.props.location.state.pubpath	
			 publist=await this.getdata(pubpath+"/respool",false)
		}catch(err){
			
		}
		this.setState({
			listsall:lists.concat(publist),
		});		
	}

	async getdata (path,own){		
		let res = await axios.get("http://"+host+"/getdirlist",{
			params: {  
			   path: path,
			}
		})
		let lists=[]
		if(res.data&&res.data.length>0){
			await Promise.all(
				res.data.map(async(item)=>{
					if(item.Type==1){
						let list=await this.getdata(path+"/"+item.Name,own)
						lists=lists.concat(list)
					}else{
						item.Path=path+"/"+item.Name
						if (own){
							item.own=true
						}
						lists.push(item)
					}
				})
			)
		}
		return 	lists
	}

	fetchMoreData = () => {
		if (this.state.items.length >= this.state.filterlists.length-size) {
		  
		  this.setState({ 
		  items: this.state.filterlists,
		  hasMore: false 
		  });
		  return;
		}else { 
		this.setState({
		   items: this.state.filterlists.slice(0,this.state.items.length+size)
		   })
		}	
	 };

	handleinputClick=(item)=>{
		let lists=[]
		let filterlists=[]
		if(this.state.input==""||this.state.input==null||!this.state.input){
			lists=this.state.listsall
		}else{
			lists=this.state.filterlists
		}
		let input=this.state.input+item
		if (lists&&lists.length>0){
			lists.map((list)=>{
				let m=PinyinMatch.match(list.Name, input)
				if(m){
					list.Show=this.redFont(list.Name, m[0], m[1])
					filterlists.push(list)
				}
				
			})
		}
		this.setState({
			input:input,
			filterlists:filterlists,
			items: filterlists.slice(0,size),
			hasMore: true 
			
		});		
	}
	handleclearClick=()=>{
		this.setState({
			input:"",
			filterlists:[],
			items: [],
			hasMore: true ,
			
		});	
	}
	handlebackClick=()=>{
		let input=this.state.input.substring(0,(this.state.input.length-1));
		if (input==""||input==null||!input){
			this.setState({
				input:"",
				filterlists:[],
				items: [],
				hasMore: true ,
				
			});	
		}else{
			let lists=this.state.listsall
			let filterlists=[]	
			if (lists&&lists.length>0){
				lists.map((list)=>{
					let m=PinyinMatch.match(list.Name, input)
					if(m){
						list.Show=this.redFont(list.Name, m[0], m[1])
						filterlists.push(list)
					}
					
				})
			}
			this.setState({
				input:input,
				filterlists:filterlists,
				items: filterlists.slice(0,size),
				hasMore: true 
				
			});		
		}
		
	}

	closeList=()=>{
		window.location.href="javascript:history.go(-1)"
	}
	redFont=(str, start ,end)=> {
        return str.substring(0, start) + '<b style="color:#108ee9">' + str.substring(start, end + 1) + '</b>' + str.substring(end + 1)
      }
	  
	  
	async play (item){
		let res = await axios.get("http://"+host+item.Path)
		let list = res.data;
		if (item.own){
				list.own=true
			}
		let linkData={
		  img:"/ipfs/"+list.img,
		}		
		if(res.data.parentfiles==undefined||res.data.parentfiles==null ||res.data.parentfiles==""){
			this.setState({ 
				showDetail: true,
				linkData:linkData,
				data:res.data

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
				showDetail: true,
				linkData:linkData,
				data:res.list

			});					
		}
		
	}
	closeDetail=()=>{
		this.setState({ 
			showDetail: false,
		});
	}  
	closeInput=()=>{
		this.setState({ 
			showinput: false,
		});
	}  
	showInput=()=>{
		this.setState({ 
			showinput: true,
		});
	}  

  render () {
		

	return (
	<div className="searchbackground">
		 <NavBar
			  mode="dark"
			  leftContent="返回"
			  onLeftClick={()=>this.closeList()}
		></NavBar>
		<div className="searchgrid" >
			<div >
				 <InfiniteScroll
					  dataLength={this.state.items.length}
					  next={this.fetchMoreData}
					  hasMore={this.state.hasMore}
					 
					  
					>  
					<List  >
     
						{
							this.state.items&&this.state.items.map((item,index)=>{
								return(
										 <Item key={index} className="searchItenCorner" onClick={()=>{this.play(item)}}>
											{(item.own)?
												<Badge style={{ backgroundColor: '#f19736', borderRadius: 2 }} text={'私'} corner>
													<div className="searchshowlists">
														<div  dangerouslySetInnerHTML={{ __html: item.Show }} />
													</div>
													
												</Badge>
												:<div className="searchshowlists" dangerouslySetInnerHTML={{ __html: item.Show }} />
											}
										</Item>												
										
								)
							})
						}
					</List>
				</InfiniteScroll>
				
			
			
			
			</div  >
			
			{this.state.showinput?
				<div className="searchinput">					
					<div  className="searchinputbottomgrid">
						<a  onClick={()=>{this.handleclearClick()}} >
							<div className="searchinputbottom">
								<span style={{margin: "auto "}}>清空</span>
							</div>
						</a>
						<div className="searchtext">
							<span style={{margin: "auto "}}>{this.state.input}</span>
						</div>					
						<a  onClick={()=>{this.handlebackClick()}} >
							<div className="searchinputbottom">
								<span style={{margin: "auto "}}>回退</span>
							</div>
						</a>
						<a onClick={()=>{this.closeInput()}}> 
							<div className="searchinputbottom" style={{width: "10vw"}}>
								<Icon type="down" color="white" />
							</div>
						</a>
					</div>
					<div className="searchinputlettersgrid">
						{
							letters.map((item, index)=>{
								return(
								<a className="searchinputletters" onClick={()=>{this.handleinputClick(item)}} key={index}>
								
										<span style={{margin: "auto "}}>{item}</span>
									
								</a>	
								)
							})
						}
					</div>
					
				</div  >
				:
				<a  onClick={()=>{this.showInput()}} >
				<div className="searchinput" style={{height: "3vh",display:"flex",justifyContent:"center",alignItems:"center"}}>
					<Icon type="up" color="white" />
				</div>
				</a>
			}
		</div>
		
		 <Modal
			  popup
			  visible={this.state.showDetail}
			  onClose={this.closeDetail}
			  animationType="slide-up"
			>
			  <MoveDetail 
				linkData={this.state.linkData} 
				data={this.state.data}			
				closeDetail={this.closeDetail}
				/>
		</Modal>	
		
   </div>
 
 
    );
  }
}


export default Search;













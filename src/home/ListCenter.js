import React from "react";
// import { render } from "react-dom";
import axios from 'axios';
import InfiniteScroll from "react-infinite-scroll-component";
import MoveDetail from '../MoveDetail';
import { Grid,Modal,Button,WhiteSpace,NavBar,WingBlank } from 'antd-mobile';
// import { Radio, Row, Col ,Card ,Avatar, Icon,Button} from 'antd';
// import List from './List'
import './ListCenter.css';
// import '../MoveDetail.css';

var size = 24 ;


const host = window.location.host;

// const host = '192.168.31.250:5100'

const genre=["全部","爱情","武侠","喜剧","动作","剧情","科幻","悬疑","恐怖","动画","惊悚","犯罪","同性","音乐","歌舞","传记","历史","战争","西部","奇幻","冒险","灾难","情色"]
const region=["全部","大陆","香港","台湾","美国","韩国","日本","泰国","印度","英国","其它"]
const year=["全部","2020","2019","2010","2000","90年代","80年代","70年代","更早"]

 
class ListCenter extends React.Component {
  constructor () {
	   super()
	  this.state = {
		moveList:[],  
		items: [],
		hasMore: true,
		showDetail:false,
		linkData:{},
		data:{},
		genreClick:0,
		regionClick:0,
		yearClick:0,
		rating:false,
	  };
	  this.filterAll = this.filterAll.bind(this)
	  this.handleClick=this.handleClick.bind(this)
  }
  fetchMoreData = () => {
	if (this.state.items.length >= this.state.moveList.length-size) {
      
	  this.setState({ 
	  items: this.state.moveList,
	  hasMore: false 
	  });
      return;
    }else { 
    this.setState({
       items: this.state.moveList.slice(0,this.state.items.length+size)
	   })
	}	
  };

	componentDidMount() {

		if(this.props.location.state&&this.props.location.state.data){
			 this.setState({ 
				moveList:this.props.location.state.data ,
				items:this.props.location.state.data.slice(0,size),

			});
		}
		
	
	}
	
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
				console.log(path)
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
						showDetail: true,
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
						showDetail: true,
						linkData:linkData,
						data:list

					});					
					
				}
		
	
		}
	}
	
	// async handleClick(linkData,item,e){
		// e.preventDefault()
		// let res = await axios.get("http://"+host+linkData.data)
		// const list = res.data;
		// if (linkData.own){
					// list.own=true
				// }
		// if(!(item.parentfiles==undefined||item.parentfiles==null ||item.parentfiles=="")){
			// try{
				// let parentfiles=await axios.get("http://"+host+this.props.location.state.pubhash+"/respool"+item.parentfiles)
				// if (parentfiles.data.files&&parentfiles.data.files.length>0){
					// parentfiles.data.files.map((file,index)=>{
						// file.pubown=true
						// list.files.push(file)
					// })
				// }
			// }catch(err){
				// console.log(err)
			// }
			// this.setState({ 
				// showDetail: true,
				// linkData:linkData,
				// data:list

			// });		
			
		// }else if(!(res.data.parentfiles==undefined||res.data.parentfiles==null ||res.data.parentfiles=="")){
			
			// try{				
				// let parentfiles=await axios.get("http://"+host+this.props.location.state.pubhash+"/respool"+res.data.parentfiles)
				// if (parentfiles.data.files&&parentfiles.data.files.length>0){
					// parentfiles.data.files.map((file,index)=>{
						// file.pubown=true
						// list.files.push(file)
					// })
				// }
			// }catch(err){
				// console.log(err)
			// }
			// this.setState({ 
				// showDetail: true,
				// linkData:linkData,
				// data:list
			// });				
		// }else{
			// this.setState({ 
				// showDetail: true,
				// linkData:linkData,
				// data:list

			// });
		// }
	// }
	closeDetail=()=>{
		this.setState({ 
			showDetail: false,
		});
	}   
	handleGenreClick=(data,index)=>{
		if(this.state.genreClick==index){
			return
		}
		let genreFilter=[]
		if (this.state.genreClick==0){
			genreFilter=this.state.moveList.filter((ele) =>{
				// console.log(ele,data)
				 // console.log(ele.genre.indexOf(data))
				 if (ele.genre==undefined||ele.genre==null){
					 ele.genre=" "
				 }
				return ele.genre.indexOf(data)>=0
			})
		
			
		}else{
			genreFilter=this.filterAll(index,this.state.regionClick,this.state.yearClick,this.state.rating)
		}
		this.setState({ 
			moveList:genreFilter,
			genreClick:index,
			items: genreFilter.slice(0,size),
			hasMore: true,
		});
		
	}
	handleRegionClick=(data,index)=>{
		if(this.state.regionClick==index){
			return
		}
		let regionFilter=[]
		if (this.state.regionClick==0){
			if (data=="其它"){
				regionFilter=this.state.moveList.filter((ele) =>{
					let has=true
					for (var i = 1; i < region.length-1; i++) { 
						if(ele.region.indexOf(region[i])>=0){
							has=false
							break
						}					
					}
					
					return has
				})
				
			}else{
				regionFilter=this.state.moveList.filter((ele) =>{
					if (ele.region==undefined||ele.region==null){
						 ele.region=" "
					 }
					return ele.region.indexOf(data)>=0
				})
			}
			
		}else{
			regionFilter=this.filterAll(this.state.genreClick,index,this.state.yearClick,this.state.rating)
		}
		this.setState({ 
			moveList:regionFilter,
			regionClick:index,
			items: regionFilter.slice(0,size),
			hasMore: true,

		});
	}
	handleYearClick=(data,index)=>{
		if(this.state.yearClick==index){
			return
		}
		let yearFilter=[]
		if (this.state.yearClick==0){
			switch(data)
				{
					case "2020":
						yearFilter=this.state.moveList.filter((ele) =>{
							if (ele.year==undefined||ele.year==null){
								return false
							}else{
								return ele.year.substring(0,3)=="202"
							}
							
						})
						break;
					case "2019":
						yearFilter=this.state.moveList.filter((ele) =>{
							return ele.year=="2019"
						})
						break;
					case "2010":
						yearFilter=this.state.moveList.filter((ele) =>{
							if (ele.year==undefined||ele.year==null){
								return false
							}else{
								return ele.year.substring(0,3)=="201"
							}
							
						})
						break;
					case "2000":
						yearFilter=this.state.moveList.filter((ele) =>{
							if (ele.year==undefined||ele.year==null){
								return false
							}else{
								return ele.year.substring(0,3)=="200"
							}
							
						})
						break;
					case "90年代":
						yearFilter=this.state.moveList.filter((ele) =>{
							if (ele.year==undefined||ele.year==null){
								return false
							}else{
								return ele.year.substring(0,3)=="199"
							}
							
						})
						break;
					case "80年代":
						yearFilter=this.state.moveList.filter((ele) =>{
							if (ele.year==undefined||ele.year==null){
								return false
							}else{
								return ele.year.substring(0,3)=="198"
							}
							
						})
						break;
					case "70年代":
						yearFilter=this.state.moveList.filter((ele) =>{
							if (ele.year==undefined||ele.year==null){
								return false
							}else{
								return ele.year.substring(0,3)=="197"
							}							
						})
						break;
					case "更早":
						yearFilter=this.state.moveList.filter((ele) =>{
							if (ele.year==undefined||ele.year==null){
								return false
							}else{
								return parseInt(ele.year)<1970
							}							
						})
						break;					
					default:
						
				}
		}else{
			yearFilter=this.filterAll(this.state.genreClick,this.state.regionClick,index,this.state.rating)
		}
		this.setState({ 
			moveList:yearFilter,
			yearClick:index,
			items: yearFilter.slice(0,size),
			hasMore: true,

		});
	}
	
	handleRatingClick=()=>{
		if (this.state.rating){
			let moveList=this.filterAll(this.state.genreClick,this.state.regionClick,this.state.yearClick,false)
			this.setState({ 
				rating:false,
				moveList:moveList,
				items:moveList.slice(0,size),
				hasMore:true,
			});
		}else{
			let moveList=this.state.moveList.slice(0)
			function sortData(a, b){
				return b.rating - a.rating
			}
			moveList.sort(sortData)
			this.setState({ 
				rating:true,
				moveList:moveList,
				items:moveList.slice(0,size),
				hasMore: true,
			});
		}
	}
	filterAll=(genreClick,regionClick,yearClick,rating)=>{
		let regionlength=this.state.regionClick.length
		var regionfun=function (){
			if (regionClick!=0){
				if(regionClick===regionlength-1){
					return function(regionitem){
						let has=false
						for (var j = 1; j < region.length-1; j++) { 						
							if(regionitem.region.indexOf(region[j])>=0){
								has=true
								break
							}						
						}		
						
						return has
					}
				}else{
					return function(regionitem){
						if (regionitem.region==undefined||regionitem.region==null){
							 regionitem.region=" "
						 }
						return regionitem.region.indexOf(region[regionClick])===-1
					}
				}
				
			}else{
				return function(regionitem){
					return false
				}
			}			
		}
		
		var genrefun=function(){
			if(genreClick!=0){
				return function(genreitem){
					if (genreitem.genre==undefined||genreitem.genre==null){
						 genreitem.genre=" "
					 }
					return genreitem.genre.indexOf(genre[genreClick])==-1
				}
			}else{
				return function(genreitem){
					return false
				}
			}
		}
		var yearfun=function(){
			if(yearClick!=0){
				switch(year[yearClick])
				{
					case "2020":
						return function(yearitem){
							if (yearitem.year==undefined||yearitem.year==null){
								return true
							}else{
								return yearitem.year.substring(0,3)!="202"
							}							
						}						
						break;
					case "2019":
						return function(yearitem){
							return yearitem.year!="2019"
						}
						break;
					case "2010":
						return function(yearitem){
							if (yearitem.year==undefined||yearitem.year==null){
								return true
							}else{
								return yearitem.year.substring(0,3)!="201"
							}							
						}
						break;
					case "2000":
						return function(yearitem){
							if (yearitem.year==undefined||yearitem.year==null){
								return true
							}else{
								return yearitem.year.substring(0,3)!="200"
							}							
						}
						break;
					case "90年代":
						return function(yearitem){
							if (yearitem.year==undefined||yearitem.year==null){
								return true
							}else{
								return yearitem.year.substring(0,3)!="199"
							}							
						}
						break;
					case "80年代":
						return function(yearitem){
							if (yearitem.year==undefined||yearitem.year==null){
								return true
							}else{
								return yearitem.year.substring(0,3)!="198"
							}							
						}
						break;
					case "70年代":
						return function(yearitem){
							if (yearitem.year==undefined||yearitem.year==null){
								return true
							}else{
								return yearitem.year.substring(0,3)!="197"
							}							
						}
						break;
					case "更早":
						return function(yearitem){
							if (yearitem.year==undefined||yearitem.year==null){
								return true
							}else{
								return parseInt(yearitem.year)>=1970
							}							
						}
						break;					
					default:
						
				}
			}else{
				return function(yearitem){
					return false
				}
			}
		}
		
		var regionExe = regionfun()
		var genreExe=genrefun()
		var yearExe=yearfun()
		let filter=[]
		for (var i = 0; i < this.props.location.state.data.length; i++) { 
			if(regionExe(this.props.location.state.data[i])){
				continue
			}
			if(genreExe(this.props.location.state.data[i])){
				continue
			}
			if(yearExe(this.props.location.state.data[i])){
				continue
			}
			filter.push(this.props.location.state.data[i])
		}	
		if(rating){
			function sortData(a, b){
				return b.rating - a.rating
			}
			filter.sort(sortData)
		}
		return filter
		

	}
	closeList=()=>{
	 window.location.href="javascript:history.go(-1)"
	}

  render() {

	   
	   const ScrollList = ({ listData}) => (
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
						hash=this.props.location.state.ownhash
						rootpath="/homeimg/"
						pathname="/listScroll"
						linkData={
						  ownhash:this.props.location.state.ownhash,
						  pubhash:this.props.location.state.pubhash,
						  host:host,
						  data:hash+"/compilation"+data.path,
						}
					 }else {
						pathname="/moveDetail"
						if(data.own){
							hash=this.props.location.state.ownhash
						}else{
							hash=this.props.location.state.pubhash
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
				  <div style={{ color: '#888', 
								fontSize: '3vw', 
								marginTop: '6px' ,
								overflow: "hidden",								
								}}>
					<span>{data.title}</span>
				  </div>
				  </a>
				</div>
			  )}}
			/>

			
			
			
		)	
		
	
		
    return (
      <div className="listcenterbackground">
		 <NavBar
			  mode="dark"
			  leftContent="返回"
			  onLeftClick={()=>this.closeList()}
		></NavBar>
		 <WingBlank size="md">
		 
		 <div style={{width: "100%", height: "3vw"}}>
		 
		</div>		
		 <div className="listcenter-listlist">				
	
			{
				genre&&genre.map((data, index)=>{
					
					return (
						<div  key={index}>							
							{(index==this.state.genreClick)?
								<a onClick={()=>{this.handleGenreClick(data,index)}}>
								<div className="listcenter-listClick">
									<span >{data}</span> 
								</div>
								</a>
									:<a onClick={()=>{this.handleGenreClick(data,index)}}>
									<div className="listcenter-list">
										<span >{data}</span> 
									</div>
									</a>
							}							
							
						</div>
					)
				})
			}
	
		</div>			
		
		<div className="listcenter-listlist">

			
			{
				region&&region.map((data, index)=>{
					
					return (
						<div  key={index}>							
							{(index==this.state.regionClick)?
								<a onClick={()=>{this.handleRegionClick(data,index)}}>
								<div className="listcenter-listClick">
									<span >{data}</span> 
								</div>
								</a>
									:<a onClick={()=>{this.handleRegionClick(data,index)}}>
									<div className="listcenter-list">
										<span >{data}</span> 
									</div>
									</a>
							}							
							
						</div>
					)
				})
			}
		
		</div>

			<div className="listcenter-listlist"  >
			
			{
				year&&year.map((data, index)=>{
					
					return (
						<div  key={index}>							
							{(index==this.state.yearClick)?
								<a onClick={()=>{this.handleYearClick(data,index)}}>
								<div className="listcenter-listClick" style={{width:"15vw"}} >
									<span >{data}</span> 
								</div>
								</a>
									:<a onClick={()=>{this.handleYearClick(data,index)}}>
									<div className="listcenter-list" style={{width:"15vw"}}>
										<span >{data}</span> 
									</div>
									</a>
							}							
							
						</div>
					)
				})
			}
			</div>		
	
		<div className="listcenterselect" style={{margin: "0 0 4vw 0",gridTemplateColumns: "1fr 4fr" }}>
			<span style={{margin: "auto 0", fontSize:"4vw",color: "#BEBEBE"}}>排序：</span>
			{(this.state.rating)?
				<a onClick={()=>{this.handleRatingClick()}}>					
					<span className="listcenter-listClick" style={{margin: "auto 0",width:"100%",display:"inline"}} >评分最高</span>					
				</a>
					:<a onClick={()=>{this.handleRatingClick()}}>						
						<span className="listcenter-list" style={{margin: "auto 0",width:"100%",display:"inline"}}>评分最高</span> 					
					</a>
			}
		
		</div>
		 <InfiniteScroll
		  dataLength={this.state.items.length}
		  next={this.fetchMoreData}
		  hasMore={this.state.hasMore}
		  loader={<h4>Loading...</h4>}
		  endMessage={
			<p style={{ textAlign: "center" }}>
			  <b>Yay! You have seen it all</b>
			</p>
		  }
		> 
			<ScrollList listData={this.state.items}  />

		</InfiniteScroll>
        
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
		</WingBlank>
      </div>
    );
  }
}



export default ListCenter;
import React from 'react';
// import { hashHistory } from "react-router-dom";
import axios from 'axios'
import { NavBar,ActivityIndicator,Picker, List,Toast,Tabs, WhiteSpace,Icon,Menu } from 'antd-mobile';
import './Home.css';
// import List from './List'
import Homelist from './Homelist'
import DownList from './DownList'
import Other from './Other'
import 'antd-mobile/dist/antd-mobile.css'


const menuData = [
  {   
    value: '1',
    label: '下载列表',
    path:'/downList',
	isLeaf: true,
  },
  {
    value: '2',
    label: '即时资源池',
    path:'/pubother',
	isLeaf: true,	
  },
  {
    value: '3',
    label: '资源池列表',
    path:'/other',
	isLeaf: true,	
  },
  {
    value: '4',
    label: '编辑播放设备',
    path:'/editkodihost',
	isLeaf: true,	
  },
  {value: '5',
    label: '频道操作',
    children: [
      {
        label: '收藏',
        value: '1',        
      },
      {
        label: '黑名单',
        value: '2',
      }, {
        label: '加入导航栏',
        value: '3',
      }, {
        label: '移出导航栏',
        value: '4',
      }],
	},
	{
    value: '10',
    label: '数据重新加载刷新',
    path:'/',
	isLeaf: true,	
  },
];


// const host = window.location.host;

const host = '192.168.31.250:5100'
var kodihost=window.location.hostname+":8080"

var ownpath =""
var privateDirValue=undefined
var	publicDirValue=undefined
var kodiList=[]
var pubpath="/ipfs/QmW7sVdGx6kbCHBFA1txxkRCAhG5VA2Yun9pesqBW15Sbp"
var privatepath=""
class Home extends React.Component {
  constructor () {
	   super()
	  this.state = {
			index:-1,
			navdata:[],			
			homedata:[],
			kodikey:"",
			menuShow:false,
			initData: '',
	
	  };

	   this.handleClick = this.handleClick.bind(this)
	   this.handleAddblacklist = this.handleAddblacklist.bind(this)
	   this.handleAddfavoritesList = this.handleAddfavoritesList.bind(this)
	    this.loading = this.loading.bind(this)
		this.handleClickall=this.handleClickall.bind(this)

  };


	componentDidMount() {
		
		if(this.props.location.state&&this.props.location.state.data){
			this.getotherdata(this.props.location.state.data)
			this.getkodidata()
			return
		}		

		let data = window.sessionStorage.getItem("hometmpdata");
		if (data) {
			data = JSON.parse(data);
			privatepath=data.privatepath
			pubpath=data.pubpath
			ownpath=data.ownpath
			privateDirValue=data.privateDirValue;
			publicDirValue=data.publicDirValue;
			kodiList=data.kodiList
			this.setState({ 
				index:data.index,
				navdata:data.navdata,
				homedata: data.homedata,
				// kodikey:data.kodikey,
				// kodiList:data.kodiList,
				// menuShow:data.menuShow,
				initData:data.initData,
			},() => {
				  // console.log(data.scrollpx)
				  // if(data.scrollpx){
					  // console.log(data.scrollpx)
						// window.scrollTo(0, data.scrollpx)
					// }
				});	

					
			
			
		 }else{
			 this.loading()
		 }		
		
		this.getkodidata()
			
	}

	componentWillUnmount() {
		let topa = document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset
		let scrollTop  = this.refs.bodyBox.scrollTop;  
		let scrollHeight = this.refs.bodyBox.scrollHeight;
		let data = {
			index: this.state.index,
			scrollpx: document.documentElement.scrollTop,
			navdata: this.state.navdata,
			homedata:this.state.homedata,
			kodikey:this.state.kodikey,
			kodiList:this.state.kodiList,
			// menuShow:this.state.menuShow,
			initData:this.state.initData,
			privatepath:privatepath,
			pubpath:pubpath,
			ownpath:ownpath,
			privateDirValue:privateDirValue,
			publicDirValue:publicDirValue,			
		}	
		window.sessionStorage.setItem('hometmpdata', JSON.stringify(data));
	}

	async getkodidata(){
		let data = window.sessionStorage.getItem("kodiaddres");
		let kodi={};
		let finddata={};
		let key=[];
		if (data){
			finddata= JSON.parse(data);			
			kodihost=finddata.address+":"+finddata.port
			finddata.value=finddata.key
			finddata.label=finddata.name+kodihost
			if(finddata.key==null||finddata.key==undefined||finddata.key==""){
				return
			}else{
				let kodiwindow = window.sessionStorage.getItem("kodihost");
				key[0]=finddata.key				
				kodiList=JSON.parse(kodiwindow)
				this.setState({ 
					kodikey: key,
					kodiList:kodiList
				});
			}				
		}else{
			try {
				let res=await axios.get("http://"+host+"/homeconfig"+"/kodihost"+"?time="+Date.now())
				kodi=res.data
				console.log(kodi)
				if (!(kodi.Data)||(!kodi.Data.length>0)){
					finddata={
						address:window.location.hostname,
						port:"8080"
					}
					window.sessionStorage.setItem('kodiaddres', JSON.stringify(finddata));
					return
				}else{
					kodi.Data.map((item)=>{
						item.label=item.name+item.address+":"+item.port
						item.value=item.key
					})
					kodiList=kodi.Data
					window.sessionStorage.setItem('kodihost', JSON.stringify(kodi.Data));
				}								
				if (kodi.Defaultkey==null||kodi.Defaultkey==undefined||kodi.Defaultkey==""){
					kodihost=kodi.Data[0].address+":"+kodi.Data[0].port
					key[0]=kodi.Data[0].key	
					// console.log(key)
					kodiList=kodi.Data
					this.setState({ 
						kodikey: key,
						kodiList:kodiList
					});
					finddata=kodi.Data[0]
					window.sessionStorage.setItem('kodiaddres', JSON.stringify(finddata));					
				}else{
					let finddata=kodi.Data.find(item => item.key == kodi.Defaultkey)
					if (finddata==undefined){
						kodihost=kodi.Data[0].address+":"+kodi.Data[0].port
						key[0]=kodi.Data[0].key				
						kodiList=kodi.Data
						this.setState({ 
							kodikey: key,
							kodiList:kodiList
						});
						finddata=kodi.Data[0]
						window.sessionStorage.setItem('kodiaddres', JSON.stringify(finddata));	
					}else{
						kodihost=finddata.address+":"+finddata.port
						key[0]=kodi.Defaultkey				
						kodiList=kodi.Data
						this.setState({ 
							kodikey: key,
							kodiList:kodiList
						});
						window.sessionStorage.setItem('kodiaddres', JSON.stringify(finddata));
					}
				}		
								
			}catch(err){
				finddata={address:window.location.hostname,port:"8080"}				
				window.sessionStorage.setItem('kodiaddres', JSON.stringify(finddata));
			}
			
		}		
	}



	async loading (){
		try {
			let root=await axios.get("http://"+host+"/getfilesroot"+"?time="+Date.now())
			ownpath=root.data+"/privcollect"
		}catch(err){
		   console.log(err);
		}	
		let navdata=[]
		try {
			let res = await axios.get("http://"+host+"/ipfs/"+ownpath+"/navData")
			
			if (res.data&&res.data.length>0){				
					res.data.map((item)=>{
						let own={}
						own.belong="own"
						own.name="本地"
						own.path="/ipfs/"+ownpath+"/home"+item.path
						own.title=item.title
						own.privatepath="/ipfs/"+ownpath
						navdata.push(own)
				})
			}
		}catch(err){
		   console.log(err);
		}
		let homeconfig={}
		try {
			let res=await axios.get("http://"+host+"/homeconfig"+"/homeconfig"+"?time="+Date.now())
			homeconfig=res.data
			if (!(homeconfig.PubData==undefined||homeconfig.PubData==null||homeconfig.PubData=="")){
				pubpath=homeconfig.PubData
			}			
		}catch(err){
		   console.log(err);
		}
		
		if (navdata&&navdata.length>0&&(this.state.index==-1)){
			let homedata=[]
			try {
				let res = await axios.get("http://"+host+navdata[0].path)
				if(res.data&&res.data.list){
					homedata=res.data.list
					privateDirValue=res.data.privateValue
					publicDirValue=res.data.publicValue
				}				
			}catch(err){
			   console.log(err);
			}
			privatepath=navdata[0].privatepath
			this.setState({ 
				navdata:navdata,
				homedata:homedata,
				index:0
			});
		}
		if (!(homeconfig&&homeconfig.NoPub)){
			try {
				let pubnav = await axios.get("http://"+host+pubpath+"/navData")
				if (pubnav.data&&pubnav.data.length>0){				
					let pubnavlists=[]
					pubnav.data.map((item)=>{
						let nav={}
						nav.belong="pub"
						nav.name="公共池"
						nav.path=pubpath+"/home"+item.path
						nav.title=item.title
						nav.privatepath=pubpath						
						pubnavlists.push(nav)						
					})	
					navdata.push(...pubnavlists)
				}
				
			}catch(err){
			   console.log(err);
			}
		}	
		if (navdata&&navdata.length>0&&this.state.index==-1){
			let homedata=[]
			try {
				let res = await axios.get("http://"+host+navdata[0].path)
				if(res.data&&res.data.list){
					homedata=res.data.list
					privateDirValue=res.data.privateValue
					publicDirValue=res.data.publicValue
				}	
			}catch(err){
			}
			privatepath=navdata[0].privatepath
			this.setState({ 
				navdata:navdata,
				homedata:homedata,
				index:0
			});
		}
		if (homeconfig&&homeconfig.Share&&homeconfig.Share.length>0){
			try {
				let shareData = await axios.get("http://"+host+pubpath+"/shareData")
				if (shareData.data&&shareData.data.Data&&shareData.data.Data.length>0){
					await Promise.all(homeconfig.Share.map(async(item)=>{
						if(item.Cid=="pub"){
							return
						}
						await Promise.all(shareData.data.Data.map(async (share)=>{
							if (item.Cid==share.Cid){
								try {
									let NavData = await axios.get("http://"+host+share.Path+"/navData")	
									if (NavData.data&&NavData.data.length>0){
										if(item.Path&&item.Path>0){
											item.Path.map((path)=>{
												NavData.data.map((idnav)=>{
													if (path==idnav.path){													
														let nav={}
														nav.belong=share.Cid
														nav.name=share.Name
														nav.title=idnav.title
														nav.path=share.Path+"/home"+idnav.path
														nav.privatepath=share.Path
														navdata.push(nav)
													}
												})
												
											})
										}else{
											NavData.data.map((idnav)=>{
												let dnav={}
												dnav.belong=share.Cid
												dnav.name=share.Name
												dnav.title=idnav.title
												dnav.path=share.Path+"/home"+idnav.path
												dnav.privatepath=share.Path
												navdata.push(dnav)
											})
											
										}
										
									}	
								}catch{}
								
							
								
							}
							
						}))
						
					}))
				}
				
			}catch{
					if (this.state.index==-1){
						this.setState({ 						
							index:510
						});
					}
				}
				
			
		}
		if (navdata&&navdata.length>0&&this.state.index==-1){
			let homedata=[]
			try {
				let res = await axios.get("http://"+host+navdata[0].path)
				if(res.data&&res.data.list){
					homedata=res.data.list
					privateDirValue=res.data.privateValue
					publicDirValue=res.data.publicValue
				}	
			}catch(err){
			   console.log(err);
			}
			privatepath=navdata[0].privatepath
			this.setState({ 
				navdata:navdata,
				homedata:homedata,
				index:0
			});
		}else{
			// if (this.state.index!=510){
				this.setState({ 
					navdata:navdata,				
				});
			// }
		}

		
	}

	
	handleClick (nav,index) {
		this.setState({ index:index});
		privatepath=nav.privatepath
		axios.get("http://"+host+nav.path).then(res => {
		// const list = res.data;
		let homedata=[]
		if (res.data&&res.data.list){
			homedata=res.data.list
			privateDirValue=res.data.privateValue
			publicDirValue=res.data.publicValue
		}
		this.setState({ homedata:homedata});
      }).catch((err) => console.log(err));
		
	};


	
	async getotherdata(data) {
		
		let resnav = await axios.get("http://"+host+data.Path+'/navData')
		let navdata=[]
		let homedata=[]
		if (resnav.data&&resnav.data.length>0){
			resnav.data.map((item)=>{
				let nav={}
				nav.share=true
				nav.belong=data.Cid
				nav.path=data.Path+"/home"+item.path
				nav.name=data.Name
				nav.title=item.title
				nav.privatepath=data.Path
				navdata.push(nav)	
			
			})
			
			if (navdata&&navdata.length>0){					
				try {
					let res = await axios.get("http://"+host+navdata[0].path)
					if(res.data&&res.data.list){
						homedata=res.data.list
						privateDirValue=res.data.privateValue
						publicDirValue=res.data.publicValue
					}				
				}catch(err){
				   console.log(err);
				}
				privatepath=navdata[0].privatepath
				
			}
			this.setState({ 
				navdata:navdata,
				homedata:homedata,
				index:0
			});

		}
							
	

	};	
	async handleAddblacklist(){
		if (this.state.index<this.state.navdata.length){
			if (this.state.navdata[this.state.index].belong=="pub"||this.state.navdata[this.state.index].belong=="own"){
				this.info("无法处理本地/公共")
				return	
			}else{
				let list={}
				try{
					let res= await axios.get("http://"+host+"/homeconfig"+"/homeconfig")
					list=res.data
					if(res.data&&res.data.Blacklist&&res.data.Blacklist.length>0){
						let has=false
						res.data.Blacklist.map((item)=>{
							if(this.state.navdata[this.state.index].belong==item){
								has=true
							}
						})
						if (has){
							this.info("已经名单中")
							return
						}
						list.Blacklist.push(this.state.navdata[this.state.index].belong)
					}else{
						list.Blacklist=[this.state.navdata[this.state.index].belong]
					}					
					
					if (res.data&&res.data.FavoritesList&&res.data.FavoritesList.length>0){
						list.FavoritesList.map((item,index)=>{
							if(this.state.navdata[this.state.index].belong==item){
								list.FavoritesList.splice(index,1);
							}							
						})
					}
					console.log(list)
				}catch{
					list.Blacklist=[this.state.navdata[this.state.index].belong]
					console.log(list)
				}
				console.log(list)
				let blob = new Blob([JSON.stringify(list)],{type : 'application/json'});
				let formData = new FormData();
				formData.append('uploadfile', blob, 'homeconfig');
				let config = {
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				}
				axios.post("http://"+host+'/uphomeconfig',formData,config).then(()=>{this.info("成功加入黑名单")})
				.catch(()=>{
					this.info("未成功")
				})					
		
			}
			
		
		}else{
			this.info("无法处理")
			return
		}
	}

	async handleAddfavoritesList(){
		if (this.state.index<this.state.navdata.length){
			if (this.state.navdata[this.state.index].belong=="pub"||this.state.navdata[this.state.index].belong=="own"){
				this.info("无法处理本地/公共")
				return	
			}else{
				let list={}	
				try {	
					let res= await axios.get("http://"+host+"/homeconfig"+"/homeconfig")					
					list=res.data
					if(res.data&&res.data.FavoritesList&&res.data.FavoritesList.length>0){
						let has=false
						res.data.FavoritesList.map((item)=>{
							if(this.state.navdata[this.state.index].belong==item){
								has=true
							}
						})

						if (has){
							this.info("已经在清单中")
							return
						}
						list.FavoritesList.push(this.state.navdata[this.state.index].belong)
					}else{
						list.FavoritesList=[this.state.navdata[this.state.index].belong]
					}
					
					if (res.data&&res.data.Blacklist&&res.data.Blacklist.length>0){
						list.Blacklist.map((item,index)=>{
							if(this.state.navdata[this.state.index].belong==item){
								list.Blacklist.splice(index,1);
							}
							
						})						
					}
				}catch{
					list.FavoritesList=[this.state.navdata[this.state.index].belong]
				}
				let blob = new Blob([JSON.stringify(list)],{type : 'application/json'});
				let formData = new FormData();
				formData.append('uploadfile', blob, 'homeconfig');
				let config = {
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				}
				axios.post("http://"+host+'/uphomeconfig',formData,config).then(()=>{this.info("成功加入清单")})
				.catch(()=>{
					this.info("未成功")
				})	
					
			}
			
		
		}else{
			this.info("无法处理")
			return
		}
	}
	async handleAddNav(){
		if (this.state.index<this.state.navdata.length){
			let config={}
			try {
				let res= await axios.get("http://"+host+"/homeconfig"+"/homeconfig")
				let has=false
				if (this.state.navdata[this.state.index].belong=="pub"){
					config.NoPub=false
				}else if (config.Share&&config.Share.length>0){
					config.Share.map((item)=>{
						if (item.Cid==this.state.navdata[this.state.index].belong){
							has=true
							this.info("已经在")
							return
						}
					})
					config.Share.push({"Cid":this.state.navdata[this.state.index].belong})
				}else{
					config.Share=[{"Cid":this.state.navdata[this.state.index].belong}]
				}
				if (has){
					return
				}
			}catch{				
				config.Share=[{"Cid":this.state.navdata[this.state.index].belong}]
			}
			let blob = new Blob([JSON.stringify(config)],{type : 'application/json'});
			let formData = new FormData();
			formData.append('uploadfile', blob, 'homeconfig');
			let axiosconfig = {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			}
			axios.post("http://"+host+'/uphomeconfig',formData,axiosconfig).then(()=>{this.info("成功加入")})
			.catch(()=>{
				this.info("未成功")
			})			
		}else{
			this.info("无法处理")
			return
		}	
	}
	async handleRmNav(){
		if (this.state.index<this.state.navdata.length){
			if (this.state.navdata[this.state.index].belong=="own"){
				this.info("本地无法处理")
				return
			}
			let config={}
			console.log("http://"+host+"/homeconfig"+"/homeconfig")
			try {
				let res= await axios.get("http://"+host+"/homeconfig"+"/homeconfig")
				console.log(res)
				config=res.data
			}catch{
				
			}
			let has=false
			if (this.state.navdata[this.state.index].belong=="pub"){
				config.NoPub=true
			}else if (config.Share&&config.Share.length>0){
				config.Share.map((item,index)=>{
					if (item.Cid==this.state.navdata[this.state.index].belong){
						config.Share.splice(index,1);							
					}
				})				
			}			
			let blob = new Blob([JSON.stringify(config)],{type : 'application/json'});
			let formData = new FormData();
			formData.append('uploadfile', blob, 'homeconfig');
			let axiosconfig = {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			}
			console.log(config)
			axios.post("http://"+host+'/uphomeconfig',formData,axiosconfig).then(()=>{
				let oldnavdata=this.state.navdata
				let navdata=[]
				if (this.state.navdata[this.state.index].belong=="pub"){
					navdata = oldnavdata.filter(item => item.belong!="pub") 
				}else{
					let cid=this.state.navdata[this.state.index].belong
					navdata = oldnavdata.filter(item => item.belong!=cid) 
				}
				if(navdata.length==0){
					let pushpath = {

						pathname:"/other",		

						}
					this.props.history.push(pushpath)	
				}else if (this.state.index<navdata.length){
					this.setState({ 
					navdata:navdata						
					});
				}else{
					this.setState({ 
						navdata:navdata,
						index:navdata.length-1
					});
				}
				
				this.info("成功删除")
				})
			.catch(()=>{
				this.info("未成功")
			})				
		
			console.log("get")
			
		}else{
			this.info("无法处理")
			return
		}	
	}

	info = (msg) => {
	  Toast.info(msg);
	};
	handleClickSearch=()=>{
		let state={
			privatepath:privatepath,
			pubpath:pubpath,
			ownpath:ownpath
			
		}
		var path = {

		  pathname:'/search',

		  state:state,

		}
		this.props.history.push(path)
	}
	async handleClickall(){
	
		async function getFiles  (roothash,dir,own) {
			let files=[]
			let res=await axios.get("http://"+host+"/getdirlist"+"?path="+roothash+dir)
			if(res.data==undefined||res.data==null||JSON.stringify(res.data) == '[]'||res.data==""){
				return files
			}
			await Promise.all(res.data.map(async(item,index)=>{
				if(item.Type==2){
					try{
						let res = await axios.get(encodeURI("http://"+host+roothash+dir+"/"+item.Name))
						let newData=res.data
						if (!(newData==undefined||newData==null||newData=="")){
							let cutData={
								title:newData.title,
								rating:newData.rating,
								genre:newData.genre,
								region:newData.region,
								year:newData.year,
								path:newData.path,
								img:newData.img,
							}
							if(!(newData.parentfiles==undefined||newData.parentfiles==null||newData.parentfiles=="")){
								cutData.parentfiles=newData.parentfiles
							}
							if(newData.type =="tv"){
								cutData.type=newData.type
							}
							if (own==true){
								cutData.own=true
							}
							files.push(cutData)
						}
					}catch{}
					
					
				}else if(item.Type==1){
					let dirfiles=await getFiles(roothash,dir+"/"+item.Name,own)
					files=files.concat(dirfiles);
					
				}
			}))
			return files
		}
		let privateFiles=[]
		let publicFiles=[]
		if (!(privateDirValue==undefined||privateDirValue==null||privateDirValue=="")){
			try{
				let respub = await axios.get("http://"+host+privatepath+"/collect"+privateDirValue)
				if(respub.data&&respub.data.length>0){
					privateFiles=respub.data
					privateFiles.map((item)=>{
						item.own=true
					})
					
				}else{
					privateFiles=await getFiles(privatepath,privateDirValue,true);
				}
			}catch{
				privateFiles=await getFiles(privatepath,privateDirValue,true);
			}	
		}
		if (!(publicDirValue==undefined||publicDirValue==null||publicDirValue=="")){
			
			try{
				let respub = await axios.get("http://"+host+pubpath+"/collect"+publicDirValue)
				if(respub.data&&respub.data.length>0){
					publicFiles=respub.data
				}else{
					publicFiles=await getFiles(pubpath,publicDirValue,false);
					privateFiles.map((item,id)=>{
						let index = publicFiles.findIndex(File => File.title === item.title);
						if (index>-1){
							item.parentfiles=publicFiles[index].path
							publicFiles.splice(index, 1);
						}
					})	
				}
			}catch{
				publicFiles=await getFiles(pubpath,publicDirValue,false);
				privateFiles.map((item,id)=>{
					let index = publicFiles.findIndex(File => File.title === item.title);
					if (index>-1){
						item.parentfiles=publicFiles[index].path
						publicFiles.splice(index, 1);
					}
				})				
			}			
		}
		privateFiles=privateFiles.concat(publicFiles)
		let state={
			data:privateFiles,
			ownhash:privatepath,
			pubhash:pubpath,
			
		}
		let path = {

		  pathname:'/listCenter',

		  state:state,

		}
		this.props.history.push(path)


		
		
	}
	
	getkodiselect=(e)=>{
		console.log(e)
		let finddata=this.state.kodiList.find(item => item.key == e)		
		kodihost=finddata.address+":"+finddata.port
		this.setState({ 
			kodikey: e,
		});
		window.sessionStorage.setItem('kodiaddres', JSON.stringify(finddata));	
	}
	menuClick = (e) => {
		e.preventDefault(); // Fix event propagation on Android
		// console.log("menuClick",this.state.menuShow)
		this.setState({
		  menuShow: !this.state.menuShow,
		});
	}
	onMaskClick = () => {
		this.setState({
		  menuShow: false,
		});
		// if (!this.state.initData) {
		  // setTimeout(() => {
			// this.setState({
			  // initData: menuData,
			// });
		  // }, 500);
		// }
	}
	onMenuChange = (value) => {
		let path = '';
		menuData.forEach((dataItem) => {
		  if (dataItem.value === value[0]) {
			path = dataItem.path;
			if (dataItem.children && value[1]) {			 
			  switch (value[1]) {
				case "1":					
					this.handleAddfavoritesList()
					break;
				case "2":					
					this.handleAddblacklist()
					 break;
				case "3":					
					this.handleAddNav()
					 break;
				case "4":					
					this.handleRmNav()
					 break;
				 default:
					break;
			  }			  
				this.setState({
					  menuShow: false,
				});
			}else{
				
				if (value[0]==10){
					sessionStorage.clear()
					window.location.href="javascript:history.go(0)"
					// let pushpath = {
						// pathname:path,
						// }					
					// this.props.history.push(pushpath)	
				}else{
					let pushpath = {
						pathname:path,
						}					
					this.props.history.push(pushpath)	
				}
				
				
			}
		  }
		});	
	}
	testsc=()=>{
		let top123a = document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset
		
		// let stats = await this.ipfs.stats.bw() 
		console.log(top123a)
		console.log(document.body.scrollTop,document.documentElement.scrollTop,window.pageYOffset)
		let scrollTop  = this.refs.bodyBox.scrollTop;  
		let scrollHeight = this.refs.bodyBox.scrollHeight;
		console.log(scrollTop,scrollHeight)
		
	}
	
  render() {
	 const Navname=()=>{
		if ((this.state.index<this.state.navdata.length)&&this.state.index>=0){
			return(
				<div style={{width:"50vw"}}>
					<span>  {this.state.navdata[this.state.index].name}</span>
				</div>
			)
		}else{return null} 
	  }
	 const menuEl = (
      <Menu
        className="foo-menu"
        data={menuData}
        value={['5']}
        onChange={this.onMenuChange}
        height={document.documentElement.clientHeight * 0.6}
      />
    );
    const loadingEl = (
      <div style={{ width: '100%', height: document.documentElement.clientHeight * 0.6, display: 'flex', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </div>
    ); 
	

    return (
    
	 <div  ref="bodyBox" >
		 {this.state.kodikey?<NavBar
							  mode="dark"
							  className="top-nav-bar"
							  leftContent={[
								<div className="picker-list">
									 <Picker
									  data={this.state.kodiList}
									  title="选择播放地址"
									  value={this.state.kodikey}
									  cols={1}
									  onChange={this.getkodiselect}
									
									>
									  <List.Item  arrow="horizontal" ></List.Item>
									</Picker> 
								</div>,
								<Navname/>
								
							  ]}
							  rightContent={
								<a onClick = {this.menuClick}>
									<Icon type="ellipsis" />
								</a>			
							  }
							></NavBar>
							:
							<NavBar
							  mode="dark"
							  className="top-nav-bar"
							  leftContent={								
								<Navname/>								
							  }
							  rightContent={
								<a onClick = {this.menuClick}>
									<Icon type="ellipsis" />
								</a>			
							  }
							></NavBar>
			 
		 }
		
		
		{this.state.menuShow ? menuData ? menuEl : loadingEl : null}
		{this.state.menuShow ? <div className="menu-mask" onClick={this.onMaskClick} /> : null}
				
		 <Tabs tabs={this.state.navdata}
		  page={this.state.index}
		  destroyInactiveTab={true}
		  renderTabBar={props => <Tabs.DefaultTabBar {...props} page={4} />}
		  onChange={(tab, index) => { this.handleClick(tab, index); }}
		>	
			<Homelist 
					homedata={this.state.homedata}
					privatepath={privatepath}
					pubpath={pubpath}
					history={this.props.history} 
					handleClickSearch={this.handleClickSearch}
					handleClickall={this.handleClickall}
				/>	
		 </Tabs>   

    </div>
	

    );
  }
}

export default Home;





import React from 'react'
import ipfsClient from 'ipfs-http-client'
import axios from 'axios'
import './home/Home.css';
// import PinyinMatch from 'pinyin-match'
import { Grid,NavBar,Picker, List,Toast,Tabs, WhiteSpace,Icon,Button } from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css'
const Item = List.Item;
const Brief = Item.Brief;
//const ipfs = ipfsClient({ host: 'localhost', port: '5001', protocol: 'http' })
//const ipfs = ipfsClient('localhost', '5001')
//const stringToUse = 'hello world from webpacked IPFS'
const host = '192.168.31.250:5100'
const hostname = "192.168.31.250"
const apiport="5100"
var pubpath="/ipfs/QmbNsTEhCh95nc8ZqtVvSQtb8XhtqFHED5FR1c4tb7VF1v"
var  privatepath="/ipfs/QmbNsTEhCh95nc8ZqtVvSQtb8XhtqFHED5FR1c4tb7VF1v"
const seasons = [
  [
    {
      label: '2013',
      value: '2013',
    },
    {
      label: '2014',
      value: '2014',
    },
  ],
  [
    {
      label: '春',
      value: '春',
    },
    {
      label: '夏',
      value: '夏',
    },
  ],
];

	const imgdata=[
				{
				  "title": "星际宝贝：终极任务 Leroy & Stitch",
				  "rating": "8.1",
				  "genre": "喜剧/科幻/动画/家庭/冒险",
				  "region": "美国",
				  "year": "2006",
				  "path": "/电影/星际宝贝：终极任务 Leroy & Stitch",
				  "img": "Qmf2aUhHcGb56VizZzXXxSPGNCTdXaEgPcdp4dXmnsS4wv",
				  "own": true
				},
				{
				  "title": "泰山 Tarzan",
				  "rating": "7.6",
				  "genre": "剧情/动画/家庭/冒险",
				  "region": "美国",
				  "year": "1999",
				  "path": "/电影/泰山 Tarzan",
				  "img": "QmQhhcc5L9jbwwSwTBqSFoEXQfHdCn3KPj3415CrZDnUPd",
				  "own": true
				},				
				{
				  "title": "星际宝贝 Lilo & Stitch",
				  "rating": "8.1",
				  "genre": "喜剧/科幻/动画/家庭/冒险",
				  "region": "美国",
				  "year": "2002",
				  "path": "/电影/星际宝贝 Lilo & Stitch",
				  "img": "QmYx7gkwWENUkN3Qcgqp31u1PitPy8YC2wdvaihRaCwAKp",
				  "own": true
				}
			]


const workPlaceList=[{"value":"P2Wt","label":"127.0.0.1","port":"8080","name":"默认"},{"value":"8QJx","label":"192.168.31.23","port":"8090","name":"手机"}]


class Ipfsadd extends React.Component {
  constructor () {
    super()
    this.state = {
		added_file_hash: null,
		value: "",
		treeData: [{ id: 1, pId: 0, value: 'home', title: 'incoming' }],
//	  posts: []
    }
	this.ipfs = ipfsClient({ host: hostname, port: apiport, protocol: 'http' })
	// this.pinfiles=this.pinfiles.bind(this)
		// this.getpinfiles=this.getpinfiles.bind(this)
	this.handleClick = this.handleClick.bind(this)
  }

	onChangekodi = (e) => {
		console.log('dismiss', e)
		this.setState({ 
							value:e
						}) 
	  };
	  componentWillUnmount() {
		  let topa456 = document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset
		
		// let stats = await this.ipfs.stats.bw() 
		console.log(topa456)
		console.log(document.body.scrollTop,document.documentElement.scrollTop,window.pageYOffset)
	  }
	  
 async handleClick () {
			window.location.href="javascript:history.go(0)"
			
			// let pinfiles=[]
			// pinfiles.push({"Cid":"QmPYmezJXi14hrJTwzcyrs9gzQtvhbNS1NDpc9WF4eRvrr"})
			// axios.post("http://"+host+"/cidislocal",pinfiles).then(res => {
				// console.log(res)
				// })
		
		// let stats = await this.ipfs.stats.bw() 
		
		
	}
	
  render () {
    const GridExample = () => (
	<div>
		
		<div className="sub-title">Custom content</div>
		<Grid data={imgdata}
		  columnNum={3}
		  hasLine={false}
		  itemStyle={{ height: '70vw'}}
		  renderItem={data => {
				let hash="";
				 let rootpath="";
				 
				 let linkData={};
				 let pathname="";
				 
				 if(data.compilation){
					hash=privatepath
					rootpath="/homeimg/"
					pathname="/listScroll"
					linkData={
					  ownhash:privatepath,
					  pubhash:pubpath,
					  host:host,
					  data:hash+"/compilation"+data.path,
					}
				 }else {
					pathname="/moveDetail"
					if(data.own){
						hash=privatepath
					}else{
						hash=pubpath
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
					  // host:host
					}
				 }
		  
		  return(
			<div>
				<div style={{ padding: '1vw',
						position:"relative",
						textAlign: "center",
						width: "100%",
						height:"50vw",
						backgroundImage: "linear-gradient(rgba(0,0,0,0),rgba(0,0,0,0),rgba(0,0,0,0),rgba(0,0,0,0),rgba(0,0,0,0.6))"
				}}>
					  <img src={"http://"+host+hash+rootpath+data.img} 
							style={{ 
								width: '100%',
								height: '50vw',
								objectFit: "cover" ,
								display: "block",
								mixBlendMode: "overlay"
								}} 
							alt={data.title} 
						/>
					  <span style={{position:"absolute",
									 bottom: "0", 
									 right: "0.5vw",
									 color: "yellow",
									fontSize: "1.5vw"
									}}>{data.rating}</span>
				</div>
			  <div style={{ color: '#888', fontSize: '14px', marginTop: '12px' }}>
				<span>{data.title}</span>
			  </div>
			</div>
		  )}}
		/>

	  </div>
	)
	
	
	
	return (
      <div>
		  <NavBar
		  mode="dark"
		  leftContent="Back"
		  rightContent={[
			<div className="picker-list">
				<Picker
				  data={workPlaceList}
				  title="选择季节"
				  value={this.state.value}
				  cols={1}
				  onChange={this.onChangekodi}
				indicatorStyle={{ backgroundColor: '#108ee9',color:"white" }}
				 itemStyle={{ backgroundColor: '#108ee9',color:"white" }}
				
				>
				  <List.Item Style={{ backgroundColor: '#108ee9',color:"white" }} arrow="horizontal">Multiple</List.Item>
				</Picker>
			</div>,
			<Icon key="1" type="ellipsis" />,
		  ]}
		>NavBar</NavBar>
		<div style={{ width:"50%" }}> 
			 <Picker
			  data={workPlaceList}
			  title="选择季节"
			  value={this.state.value}
			  cols={1}
			  onChange={this.onChangekodi}
			
			>
			  <List.Item style={{ backgroundColor: '#606266',color:"white" }} arrow="horizontal">Multiple</List.Item>
			</Picker>
		</div>
	  <GridExample/>
      <Button type="ghost" onClick={()=>this.handleClick()} style={{ margin: "4vw 0" }} size="small" inline>test</Button>
	  <List renderHeader={() => 'Basic Style'} className="my-list">
			<Item
						  multipleLine
		
						>
						<div style={{ display: "flex"  }}>
						
							<div style={{ width: '80%' }}>test
							</div>
							<div style={{ width: '10%' }}>test1
							</div>
						</div>
			</Item>
	  </List>
		  <div > 
				er<br />
				er<br />
				er<br />
				er<br />
				er<br />
				er<br />
				er<br />
				er<br />
				er<br />
				er<br />
				er<br />
				er<br />
				er<br />
				er<br />
				er<br />
				er<br />
				er<br />
				er<br />
				er<br />
				er<br />
				er<br />
				er<br />
				er<br />
				er<br />
				er<br />
				er<br />
				er<br />
				er<br />
				er<br />
				er<br />
				er<br />
				er<br />
				er<br />
				er<br />
				er<br />
				er<br />
				er<br />
				er<br />
				
		  
		  </div>
	  </div>
	  
    )
  }
}
export default Ipfsadd;












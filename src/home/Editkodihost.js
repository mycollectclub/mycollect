import React from 'react';
import { List, InputItem, Switch, Stepper, Range, Button,Toast,Popover,Icon,NavBar } from 'antd-mobile';
import axios from 'axios'
import { createForm } from 'rc-form';
const Item = List.Item;
const Brief = Item.Brief;


const host = window.location.host;
// const host = '127.0.0.1:5100'



const config = {
		headers: {
				'Content-Type': 'multipart/form-data'
		}
	}


class BasicInput extends React.Component {
  state = {
	edit:false
  }
  componentDidMount(){
        this.props.onRef(this);
	
    }
  
  editformData=(data,dfkey)=>{
	  let defaultkey=false
	  if (data.key==dfkey){
		  defaultkey=true
	  }
	  this.props.form.setFieldsValue({		
		name:data.name,
		address: data.address,
		port: data.port,
		user:data.user,
		password:data.password,
		defaultkey:defaultkey
	})
	this.setState({ 
		edit:true,
	
	});
	  
  }
	onEditSubmit=()=>{
		this.props.form.validateFields({ force: true }, (error) => {
		  if (!error) {			
			this.props.handleEditSubmit(this.props.form.getFieldsValue())
			this.setState({ 
				edit:false,			
			});
			this.props.form.resetFields();
		  } else {
			Toast.info('输入有误');
		  }
		});

	}
  cancelSubmit=()=>{
	  this.setState({ 
			edit:false,			
		});
		this.props.form.resetFields();
  }
  
  onSubmit = () => {
    this.props.form.validateFields({ force: true }, (error) => {
      if (!error) {
		this.props.handleAdd(this.props.form.getFieldsValue())
      } else {
        Toast.info('输入有误');
      }
    });
  }
  onReset = () => {
    this.props.form.resetFields();
  }
 
  render() {
    const { getFieldProps, getFieldError } = this.props.form;

    return (<form>
      <List
        renderHeader={() => '添加设备'}        
      >
        <InputItem
          {...getFieldProps('name', {  
            rules: [        
            ],
          })}
          placeholder="设备名称"
        >名称</InputItem>
		<InputItem
          {...getFieldProps('address', {
            rules: [ 
				{ required: true, message: '请输入IP地址' },			
            ],
          })}
		  clear
          error={!!getFieldError('address')}
          onErrorClick={() => {
            alert(getFieldError('address').join('、'));
          }}
          placeholder="IP地址(必填)192.168.0.1"
        >地址</InputItem>
		<InputItem
          {...getFieldProps('port', {
            rules: [ 
				{ required: true, message: '请输入端口' },	
            ],
          })}
		  clear
          error={!!getFieldError('port')}
          onErrorClick={() => {
            alert(getFieldError('port').join('、'));
          }}
          placeholder="端口(必填)8080"
        >端口</InputItem>
		<InputItem
          {...getFieldProps('user', {
            rules: [        
            ],
          })}
          placeholder="如设置了请输入"
        >用户名</InputItem>
		<InputItem
          {...getFieldProps('password', {
            rules: [        
            ],
          })}
          placeholder="如设置了请输入"
        >密码</InputItem>
        <Item
          extra={<Switch {...getFieldProps('defaultkey', { initialValue: false, valuePropName: 'checked' })} />}
        >是否默认播放设备</Item>        
        <Item>
		{this.state.edit?<div style={{display: "flex",justifyContent:"space-between" }}>
							<Button type="primary" size="small" inline onClick={this.cancelSubmit}>取消</Button>
							<Button type="primary" size="small" inline onClick={this.onEditSubmit}>编辑</Button>
						</div>	
			:<Button type="primary" size="small" inline onClick={this.onSubmit}>添加</Button>
		}
		  
        </Item>
      </List>
    </form>);
  }
}
const BasicInputWrapper = createForm()(BasicInput);


 
class Editkodihost extends React.Component {
  constructor () {
	super()
	  this.state = {
			data:"",
			visible: false,
			defaultkey:"",
			editdata:"",
	  };
		this.handleEdit = this.handleEdit.bind(this);
	}

 
 async componentDidMount() {
	window.sessionStorage.removeItem('kodiaddres')
	window.sessionStorage.removeItem('kodihost')
		try {
			let res=await axios.get("http://"+host+"/homeconfig"+"/kodihost")
			let kodihost=res.data
			if (!(kodihost.Data==undefined||kodihost.Data==null||kodihost.Data=="")){
				
				let data=kodihost.Data; 
				console.log(data);				
				this.setState({ data: data,defaultkey:kodihost.Defaultkey});
			}			
		}catch(err){

		}
  }


  randomWord(randomFlag, min, max){
    var str = "",
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    // 随机产生
    if(randomFlag){
        range = Math.round(Math.random() * (max-min)) + min;
    }
    for(var i=0; i<range; i++){
        let pos = Math.round(Math.random() * (arr.length-1));
        str += arr[pos];
    }
    return str;
}
  
  handleAdd = (data) => {
	let newdata=this.state.data;
	let key=this.randomWord(false,4)
	if(newdata==undefined||newdata==null||newdata==""){
		newdata=[]
	}
	newdata.push({
		key:key,
		name:data.name,
		address: data.address,
		port: data.port,
		user:data.user,
		password:data.password
	  });
	  let olddefaultkey=this.state.defaultkey
		if(data.defaultkey){
			olddefaultkey=key
		}		
		let kodihost={}
		kodihost.Data=newdata;		
		kodihost.Defaultkey=olddefaultkey;
		let blob = new Blob([JSON.stringify(kodihost)],{type : 'application/json'});
		let formData = new FormData();
		formData.append('uploadfile', blob, 'kodihost');
		axios.post("http://"+host+'/uphomeconfig',formData,config).then(()=>{
				this.setState({ 
					data: newdata,
					defaultkey:olddefaultkey
				});
				Toast.info("成功保存")
		}).catch(function(error){
           Toast.info("保存错误");            
        })    
  };
	
	handleEdit (data) {
		
		this.basicInputWrapper.editformData(data,this.state.defaultkey);		
		this.setState({ 
			editdata: data,
	
		});
		
	
	  };
	handleEditSubmit=(data)=>{
		let key=this.state.editdata.key
		let dataSource = [...this.state.data];
		let olddefaultkey=this.state.defaultkey
		if(data.defaultkey){
			olddefaultkey=key
		}else{
			if (this.state.defaultkey==key){
				olddefaultkey=""
			}
		}		
		dataSource.map((item)=>{
			
			if(item.key==key){
					item.name=data.name
					item.address=data.address
					item.port=data.port
					item.user=data.user
					item.password=data.password
			}
		})
		
		let kodihost={}
		kodihost.Data=dataSource;		
		kodihost.Defaultkey=olddefaultkey;
		let blob = new Blob([JSON.stringify(kodihost)],{type : 'application/json'});
		let formData = new FormData();
		formData.append('uploadfile', blob, 'kodihost');
		axios.post("http://"+host+'/uphomeconfig',formData,config).then(()=>{
				this.setState({ 
					data: dataSource,
					defaultkey:olddefaultkey
				});
				this.info("成功保存")
		}).catch(function(error){
           this.info("保存错误");            
        })    
	}
	componentWillUnmount() {
		let kodiList=this.state.data
		let defaultkey=this.state.defaultkey
		let finddata={}
		if (kodiList.length>0){			
			kodiList.map((item)=>{
				item.label=item.name+item.address+":"+item.port
				item.value=item.key
			})
			window.sessionStorage.setItem('kodihost', JSON.stringify(kodiList));
			if (defaultkey==null||defaultkey==undefined||defaultkey==""){
					finddata=kodiList[0]
					window.sessionStorage.setItem('kodiaddres', JSON.stringify(finddata));					
				}else{
					let finddata=kodiList.find(item => item.key == defaultkey)
					if (finddata==undefined){
						finddata=kodiList[0]
						window.sessionStorage.setItem('kodiaddres', JSON.stringify(finddata));	
					}else{
						window.sessionStorage.setItem('kodiaddres', JSON.stringify(finddata));
					}
				}	
		}else{
			finddata={
				address:window.location.hostname,
				port:"8080"
			}
			window.sessionStorage.setItem('kodiaddres', JSON.stringify(finddata));
		}
		
		
	}
	
	handleDelete = data => {
		let dataSource = [...this.state.data];
		let deldata=dataSource.filter(item => item.key !== data.key)
		
		let olddefaultkey=this.state.defaultkey
		if(data.key==this.state.defaultkey){
			olddefaultkey=""
		}
		let kodihost={}		
		kodihost.Data=deldata;
		kodihost.Defaultkey=olddefaultkey;
		let blob = new Blob([JSON.stringify(kodihost)],{type : 'application/json'});
		let formData = new FormData();
		formData.append('uploadfile', blob, 'kodihost');
		axios.post("http://"+host+'/uphomeconfig',formData,config).then(()=>{
				this.setState({ 
					data: deldata,
					defaultkey:olddefaultkey
				});
				Toast.info("成功保存")
		}).catch(function(error){
           Toast.info("保存错误");            
        })
	  };
	info = (msg) => {
	  Toast.info(msg);
	};
	backClick=()=>{

		window.location.href="javascript:history.go(-1)"
	}
	
	formOnRef=(ref) => {
        this.basicInputWrapper = ref
    }
	
  render() {
		const KodiList = ({ listData}) => {
		  if (listData&&listData.length>0){
			 return (
			 <List renderHeader={() => '设备列表'} >
				{	
					listData&&listData.map((data, index) => {		
					return (
						<Item
						  multipleLine
					      key={index}
						>
							<div style={{ display: "flex" ,alignItems: "center"}}>
								
								<div style={{ width: '90%'}}>
									{data.name}
									{data.key==this.state.defaultkey?<span style={{color: 'red',float:"right", fontSize: "3.5vw"}}>默认</span>
											:null}
									<Brief>{data.address}:{data.port}<br />用户名：{data.user}<br />密码：{data.password}</Brief>
								</div>
								
								
								<Popover mask
									overlayClassName="fortest"
									overlayStyle={{ color: 'currentColor'}}
									visible={this.state.visible}
									overlay={[
									  (<Item key="4"  onClick={()=>this.handleEdit(data)} value="edit" >编辑</Item>),
									  (<Item key="5"  onClick={()=>this.handleDelete(data)} value="scan" >删除</Item>),
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
			)
			  
		  }else{
			  return null
		  }
		}

    return (
		<div>
			<NavBar
			  mode="dark"
			  leftContent="返回"
			  onLeftClick={this.backClick}
			>播放设备编辑</NavBar>
			<KodiList listData={this.state.data} />
			<BasicInputWrapper 
				handleAdd={this.handleAdd}
				handleEditSubmit={this.handleEditSubmit}
				onRef={this.formOnRef}
				/>
		</div>
    );
  }
}

export default Editkodihost;


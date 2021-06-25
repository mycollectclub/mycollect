import React from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Button,message} from 'antd';
import axios from 'axios'

// const host = window.location.host;


const host = '127.0.0.1:5100'

var data = [];
var kodihost ={};
const config = {
		headers: {
				'Content-Type': 'multipart/form-data'
		}
	}
const EditableContext = React.createContext();

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                // {
                  // required: true,
                  // message: `Please Input ${title}!`,
                // },
              ],
              initialValue: record[dataIndex],
            })(this.getInput())}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data, editingKey: '',defaultkey:"" };
    this.columns = [
      {
        title: '名称',
        dataIndex: 'name',
        width: '25%',
        editable: true,
      },
	  {
        title: '地址',
        dataIndex: 'address',
        width: '25%',
        editable: true,
      },
      {
        title: '端口',
        dataIndex: 'port',
        width: '15%',
        editable: true,
      },
	  {
        title: '用户',
        dataIndex: 'user',
        width: '15%',
		editable: true,
      },
	  {
        title: '密码',
        dataIndex: 'password',
        width: '15%',
		editable: true,
      },
      {
        title: '删除',
        dataIndex: 'del',
        render: (text, record) =>
          this.state.data.length >= 1 ? (
            <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
              <a>Delete</a>
            </Popconfirm>
          ) : null,
      },
      {
        title: '修改',
        dataIndex: 'operation',
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <a
                    onClick={() => this.save(form, record.key)}
                    style={{ marginRight: 8 }}
                  >
                    Save
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : (
            <a disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>
              Edit
            </a>
          );
        },
      },
    ];
  }
  
 async componentDidMount() {
	window.sessionStorage.removeItem('kodiaddres')
	window.sessionStorage.removeItem('kodihost')
		try {
			let res=await axios.get("http://"+host+"/homeconfig"+"/kodihost")
			let kodihost=res.data
			if (!(kodihost.Data==undefined||kodihost.Data==null||kodihost.Data=="")){
				
				data=kodihost.Data; 
				console.log(data);				
				this.setState({ data: data,defaultkey:kodihost.Defaultkey});
			}			
		}catch(err){

		}
  }

  isEditing = record => record.key === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        console.log(error)
		return;
      }	  
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ data: newData, editingKey: '' });		
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: '' });
      }
	  kodihost.Data=newData;
	  kodihost.Defaultkey=this.state.defaultkey
	  console.log(kodihost)
	  let blob = new Blob([JSON.stringify(kodihost)],{type : 'application/json'});
		let formData = new FormData();
		formData.append('uploadfile', blob, 'kodihost');
		axios.post(
			"http://"+host+'/uphomeconfig',formData,config).then(()=>{this.info("成功保存")}
		).catch(function(error){
           console.log(error);
            
        })
    });
  }

  edit(key) {
    this.setState({ editingKey: key });
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
  
  handleAdd = () => {
    let newdata=this.state.data;
	let key=this.randomWord(false,4)
	newdata.push({
		key:key,
		address: "",
		port: ""
	  });
    this.setState({
      data: newdata

    });
  };
	handleDelete = key => {
		console.log(key);
		let dataSource = [...this.state.data];
		let deldata=dataSource.filter(item => item.key !== key)
		this.setState({ data: deldata });
		kodihost.Data=deldata;
		kodihost.Defaultkey=this.state.defaultkey;
		console.log(kodihost);
	  let blob = new Blob([JSON.stringify(kodihost)],{type : 'application/json'});
		let formData = new FormData();
		formData.append('uploadfile', blob, 'kodihost');
		axios.post(
			"http://"+host+'/uphomeconfig',formData,config).then(()=>{this.info("成功保存")}
		).catch(function(error){
           console.log(error);
            
        })
	  };
	info = (msg) => {
	  message.info(msg);
	};

  render() {
    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });
	const rowSelection = {
	  type: 'radio',
	  onChange: (selectedRowKeys, selectedRows) => {
		// console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
		this.setState({ defaultkey: selectedRowKeys[0]});
		kodihost.Data=this.state.data;
		kodihost.Defaultkey=selectedRowKeys[0];
	  let blob = new Blob([JSON.stringify(kodihost)],{type : 'application/json'});
		let formData = new FormData();
		formData.append('uploadfile', blob, 'kodihost');
		axios.post(
			"http://"+host+'/uphomeconfig',formData,config).then(()=>{this.info("成功保存")}
		).catch(function(error){
           console.log(error);
            
        })
	  },
	  selectedRowKeys:this.state.defaultkey,
	  // getCheckboxProps: record => ({
		  // defaultChecked:record.key==this.state.defaultkey
		  // selectedRowKeys:record.key==this.state.defaultkey
		// disabled: record.key === '1DfM', // Column configuration not to be checked
		// name: record.name,
	  // }),
	};


    return (
      <EditableContext.Provider value={this.props.form}>
        <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
          增加
        </Button>
		<Table
		  rowSelection={rowSelection}
          components={components}
          bordered
          dataSource={this.state.data}
          columns={columns}
          rowClassName="editable-row"
		  rowKey={record => record.key}
          pagination={{
            onChange: this.cancel,
          }}
        />
      </EditableContext.Provider>
    );
  }
}

const Editkodihost = Form.create()(EditableTable);
export default Editkodihost;


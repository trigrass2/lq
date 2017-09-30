layui.use('layer',function(){
	layer=layui.layer;
});

/*公用方法*/
var mesCom=new mesComMethod();

$(function(){
	//搜索条件
	var mainSearchData=[{
		idName:'textSearchNo',
		text:'编码类型',
		field:'no'
	},{
		idName:'textSearchName',
		text:'类型名称',
		field:'name'
	},{
		idName:'textlistNo',
		text:'编码值',
		field:'detailNo'
	},{
		idName:'textlistName',
		text:'编码值名称',
		field:'detailName'
	}]

	Ew.search('.searchForm',{
		title:'查询',
		textValues:mainSearchData,
		btnValues:[{
			btnId:'btnSearch',
			text:'搜索',
			onClick:function(data){
				$('#tableSysCodeType').bootstrapTable('refreshOptions',{pageNumber:1});
				$('#tableSysCodeList').bootstrapTable('removeAll');
			}
		},{
			btnId:'btnClear',
			text:'重置',
			tableid:['tableSysCodeType']
		}]
	});

	//主表格
	Ew.table('.mainTable',{
		btnValues:[{
			btnId:'btnAdd',text:'新增',onClick:function(){
				daliogShow('add');
			}
		},{
			btnId:'btnEdit',text:'编辑',otherOption:[{id:'tableSysCodeType',selectNum: 1}],onClick:function(){
				daliogShow('change');
			}
		},{
			btnId:'btnDelete',text:'删除',isTrue:true,otherOption:[{id:'tableSysCodeType',selMinNum: 1}],onClick:function(){
				var rows = $('#tableSysCodeType').bootstrapTable('getSelections');
				var flag = true;
				var ids = [];
				$.each(rows,function(index,row){
					if (row.isEdit=='是'){
						ids.push(row.tsSysCodeTypeId);
						flag = false;
					}
				});
				if(flag){
					return;
				}
				datas = JSON.stringify(ids);
				var url = '/system/codeType/delete'
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#tableSysCodeType').bootstrapTable('refreshOptions',{pageNumber:1});
				});
			}
		}],
		tableId:'tableSysCodeType',
		tableValue:{
			searchParams:mainSearchData,
			queryParams:function(){
				return{}
			},
			onClickRow:function(item,$element){
				$('#tableSysCodeList').bootstrapTable('refresh',{query:{tsSysCodeTypeId:item.tsSysCodeTypeId}});//或者{query:{}}直接设置查询条件
			},
			onLoadSuccess:function(data){

            },
			url:'/system/codeType/querylistByPage',
			columns:[{
				checkbox: true
			},{
				field: 'no',
				title: '编码类型',
				align: 'center',
				sortable:true
			},{
				field: 'name',
				title: '名称',
				align: 'center',
				sortable:true
			},{
				field: 'isEdit',
				title: '可前台编辑',
				align: 'center',
				sortable:true
			},{
				field: 'remark',
				title: '备注',
				align: 'center',
				sortable:true
			}]
		}
	});
})

var isSave = false,dataJson,codeId;
function daliogShow(type){
    var title=type=='add'?'新增':'编辑';
	var defaultTable=type=='add'?'':'tableSysCodeType';
    if(type == 'change'){
		var typeValue=$('#'+defaultTable).bootstrapTable('getSelections')[0].isEdit=='是'?'1':'0';
    }
    var isEdit=type=='add'?'1':typeValue;
    Ew.dialog('mainFromEdit',{
		title:title,
		btnValues:[{
			btnId:'btnSave',
			text:'保存',
			formid:'form',
			onClick:function(data){
                if(type=='change'){
					data.tsSysCodeTypeId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tsSysCodeTypeId;
                }
				if(data.isEdit == '是'){
					data.isEdit='1';
				}
				if(data.isEdit == '否'){
					data.isEdit='0';
				}
				datas = JSON.stringify(data);
				var url = (type=='add'?'/system/codeType/add':'/system/codeType/update');
				$.when(Ew.ewAjax(url,datas)).done(function(results){
                    dataJson = JSON.parse(datas);
                    dataNos = {no:dataJson.no}
                    $.ajax({
						type:'POST',
                        url: apiUrl + '/system/codeType/querylistByPage',
                        contentType:"application/json",
                        data: JSON.stringify(dataNos),
                        dataType: 'JSON',
                        success: function (data) {
							codeId = data.results[0].tsSysCodeTypeId;
                        }
					});
                    isSave = true;
				});
			}
		},{
			btnId:'btnCancel',
			text:'取消'
		}],
		form:{
			formId:'form',
			columnNum:4,
			listWidth:250,
			formList:[{
				idName:'textNo',
				text:'编码类型',
				field:'no',
				valid:['notEmpty',{type:"string",min:0,max:20}],
				disabled:type=='add'?false:true
			},{
				idName:'textName',
				text:'类型名称',
				field:'name',
				valid:['notEmpty',{type:"string",min:0,max:50}],
				disabled:isEdit=='1'?false:true
			},{
				idName:'areaRemark',
				text:'备注',
				field:'remark',
				n:2,
				valid:['notEmpty',{type:"string",min:0,max:200}],
				disabled:isEdit=='1'?false:true
			},{
				idName:'switchIsEdit',
				text:'前端编辑',
				field:'isEdit',
				ontext:'是',
				offtext:'否',
				disabled:isEdit=='1'?false:true
			},{
	        	idName:'textVersion',
					text:'版本号',
					field:'version',
					hidden:true
				}],
			defaultTable:defaultTable
		}
	},function () {
        $('#mainFromEdit .modal-footer').after('<div class="subTable" style="float: right; width: 100%"></div>');
        //子表格
        Ew.table('.subTable',{
            tableTitleSub:'编码值',
            btnValues:[{
                btnId:'btnAddSub',text:'新增',onClick:function(){
                    if (type === 'add') {
                        if (isSave) {
                            daliogShow_sub('add');
                            backColor();
                        } else {
                            mesCom.msgWarning('请先保存上面数据！');
                        }
					} else if (type === 'change') {
                        var isEdit=$('#tableSysCodeType').bootstrapTable('getSelections')[0].isEdit=='是'?'1':'0';
                        if(isEdit=='0'){
                            mesCom.msgWarning('该数据不可编辑！');
                            return;
                        } else {
                            if (isSave) {
                                daliogShow_sub('add');
                                backColor();
                            } else {
                                mesCom.msgWarning('请先保存上面数据！');
                            }
						}
					}
                }
            },{
                btnId:'btnEditSub',text:'编辑',otherOption:[{id:'tableSysCodeType',selectNum: 1},{id:'tableSysCodeList',selectNum: 1}],onClick:function(){
                    if (type === 'add') {
                        if (isSave) {
                            daliogShow_sub('change');
                            backColor();
                        } else {
                            mesCom.msgWarning('请先保存上面数据！');
                        }
                    } else if (type === 'change') {
                        var isEdit=$('#tableSysCodeType').bootstrapTable('getSelections')[0].isEdit=='是'?'1':'0';
                        if(isEdit=='0'){
                            mesCom.msgWarning('该数据不可编辑！');
                            return;
                        } else {
                            if (isSave) {
                                daliogShow_sub('change');
                                backColor();
                            } else {
                                mesCom.msgWarning('请先保存上面数据！');
                            }
                        }
                    }
                }
            },{
                btnId:'btnDeleteSub',text:'删除',isTrue:true,otherOption:[{id:'tableSysCodeList',selMinNum: 1}],onClick:function(){
                    var rows = $('#tableSysCodeList').bootstrapTable('getSelections');
                    var isEdit=$('#tableSysCodeType').bootstrapTable('getSelections')[0].isEdit=='是'?'1':'0';
                    if(isEdit=='0'){
                        mesCom.msgWarning('该数据不可编辑！');
                        return;
                    }
                    var ids = [];
                    var flag = true;
                    $.each(rows,function(index,row){
                        ids.push(row.tsSysCodeListId);
                    });
                    datas = JSON.stringify(ids);
                    var url = '/system/codeList/delete'
                    $.when(Ew.ewAjax(url,datas)).done(function(results){
                        $('#tableSysCodeList').bootstrapTable('refreshOptions',{pageNumber:1});
                    });
                }
            }],
            tableId:'tableSysCodeList',
            tableValue:{
                queryParams:function(){
                    var getSelection = $('#tableSysCodeType').bootstrapTable('getSelections')[0];
                    var id = getSelection?getSelection.tsSysCodeTypeId:-1;
                	if (type==='add') {
                		id = -1;
                        return {tsSysCodeTypeId:id}
                    } else if (type==='change') {
                        return {tsSysCodeTypeId:id};
					}
                },
                onClickRow:function(item,$element){

                },
                onLoadSuccess:function(){

                },
                url:'/system/codeList/querylistByPage',
                columns:[{
                    checkbox: true
                },{
                    field: 'no',
                    title: '编码值',
                    align: 'center',
                    sortable:true
                },{
                    field: 'name',
                    title: '编码值名称',
                    align: 'center',
                    sortable:true
                },{
                    field: 'listSeq',
                    title: '顺序号',
                    align: 'center',
                    sortable:true
                },{
                    field: 'remark',
                    title: '备注',
                    align: 'center',
                    sortable:true
                }]
            }
        });
    });
}

// 弹框背景改变
function backColor() {
    $('.modal-backdrop').eq(1).css('display','none');
    $('.modal-backdrop.in').css('z-index','1055');
}

// 关闭按钮
$('body').on('click','.close',function () {
    $('.modal-backdrop.in').css('z-index','0');
})

function daliogShow_sub(type){
	var title=type=='add'?'新增':'编辑';
	var defaultTable=type=='add'?'':'tableSysCodeList';
	var isEdit=dataJson.isEdit=='是'?'1':'0';
	Ew.dialog('mainFromEditSub',{
		title:title,
		btnValues:[{
			btnId:'btnSaveSub',
			text:'保存',
			formid:'form1',
			onClick:function(data){
                $('.modal-backdrop.in').css('z-index','0');
				if(type=='change'){
					data.tsSysCodeListId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tsSysCodeListId;
				}
				data.tsSysCodeTypeId = codeId;
				datas = JSON.stringify(data);
				var url = (type=='add'?'/system/codeList/add':'/system/codeList/update');
				$.when(Ew.ewAjax(url,datas)).done(function(results){
                    $('#mainFromEditSub').modal('hide');
                    $('#mainFromEdit').modal('hide');
                    $('#tableSysCodeType').bootstrapTable('refresh');
                    $('#tableSysCodeList').bootstrapTable('refresh');
				});
			}
		},{
			btnId:'btnCancelSub',
			text:'取消',
			onClick: function () {
                $('.modal-backdrop.in').css('z-index','0');
            }
		}],
		form:{
			formId:'form1',
			columnNum:2,
			listWidth:250,
			formList:[{
				idName:'textNo',
				text:'编码类型',
				field:'codeno',
				valid:['notEmpty',{type:"string",min:0,max:50}],
				defaultValue:dataJson.no,
				disabled:true
			},{
				idName:'textName',
				text:'编码类型',
				field:'codename',
				valid:['notEmpty',{type:"string",min:0,max:50}],
				defaultValue:dataJson.name,
				disabled:true
			},{
				idName:'textListNo',
				text:'编码值',
				field:'no',
				valid:['notEmpty',{type:"string",min:0,max:20}],
				disabled:type=='change'?true:false
			},{
				idName:'textListName',
				text:'编码值名称',
				field:'name',
				valid:['notEmpty',{type:"string",min:0,max:50}]
			},{
				idName:'numberlistSeq',
				text:'顺序号',
				field:'listSeq',
				valid:['notEmpty',{type:'number',min:0,max:999}]
			},{
				idName:'areaRemark',
				text:'备注',
				field:'remark',
				n:2,
				valid:[{type:"string",min:0,max:200}]
			},{
	        	idName:'textVersionSub',
					text:'版本号',
					field:'version',
					hidden:true
				}],
			defaultTable:defaultTable
		}
	})
}

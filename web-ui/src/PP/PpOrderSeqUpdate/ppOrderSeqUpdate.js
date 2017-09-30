	/*公用方法*/
	var mesCom=new mesComMethod();
	
	var queryTbSubUrl = apiUrl + '/base/pporderseq/querylistByPage';
	
	/*表格搜索条件*/
	var keyword='';//关键字搜索
	var tmBasPlantId='';//工厂
	var tmBasPartId='';//产品
	var orderType='';//类型
	var tmBasRouteId='';//工艺路径
	var orderNo='';//订单编号
	var planStartDate='';//订单计划上线日期
	var planEndDate='';//订单计划下线日期
	var tmBasPlantId='';//工厂
	var currentPlanDate = '';//当前查询列表的排产日期
	var currentRoute = '';//当前查询列表的工艺路径
	var currentShift = '';//当前查询列表的班次
	var count = 0;

  Ew.getBtnPower(function(re){
    if($.inArray('btnUpdate',re) > -1){
      $('#btnUpdate').css('display','inline-block')
    }
    if($.inArray('btnSave',re) > -1){
      $('#btnSave').css('display','inline-block')
    }
  })

	/*日期控件初始化*/
    $("#planDateA").jeDate({
        ishmsVal:true,
        format: 'YYYY-MM-DD',
        zIndex:3000
    }); 
	
	   /*selectShift班次数据绑定*/
    $.ajax({
        type: 'POST',
        contentType: "application/json; charset=gbk",
        dataType: 'json',
        async: false,
        url:  apiUrl+'/system/codeList/getSelect',
        data: 'SHIFT_NO',
        success: function (res) {
            var shiftData = new Array();
            $.each(res.results, function(index, item) {
                var obj = new Object();
                obj.id = item.no;
                obj.text = item.name;
                shiftData.push(obj);
            });
            $("#selectShiftA").select2({
                multiple: false,//是否多選
                minimumResultsForSearch: -1,//去掉搜索框
                data: shiftData,
                placeholder: '请选择班次'
            });
        }
    });

	
	/*表格搜索数据*/
	var getSearchTableModel = function () {
	    var postData={};
		postData.tmBasPlantId = $('#combo30').val();
		postData.tmBasRouteId = $("#combo31").val();
		postData.shiftno = $('#combo34').val();
		postData.orderType = $('#combo33').val();
		postData.planDate = $('#day30').val();
		postData.orderNo = $('#text30').val();
		postData.tmBasPartId = $('#inputCom30').val();
	    postData.pageSize = 10;
	    postData.offset = 1;
	    postData.pageIndex = 1;
	    return postData;
	};

	/*表格ajax请求*/
	var ajaxGridOptions = {
	    contentType: "application/json; charset=gbk",
	    type: 'POST',
	    // dataType: 'json',
	    // type: 'POST',
	    // contentType: 'application/json',
	    // crossDomain: true, //如需跨域
	    // xhrFields: {
	    //     withCredentials: true
	    // },
	    error: function(error) {
	        if (error.status == 401) {
	        }
	    }
	};

	/*初始化子表数据*/
	var initEmptyGrid = function (colModel) {
	    $.jgrid.defaults.styleUI = 'Bootstrap';
	    $("#dataListChild").jqGrid({
	        url: queryTbSubUrl,
	        postData: getSearchTableModel(),//此数组内容直接赋值到url上，参数类型：{name1:value1…}
	        ajaxGridOptions: ajaxGridOptions,//对ajax参数进行全局设置，可以覆盖ajax事件
	        datatype: "json",//从服务器端返回的数据类型，默认xml。可选类型：xml，local，json，jsonnp，script，xmlstring，jsonstring，clientside
	        mtype: "POST",//ajax提交方式。POST或者GET，默认GET
	        loadonce: false,//如果为ture则数据只从服务器端抓取一次，之后所有操作都是在客户端执行，翻页功能会被禁用
	        cellsubmit : 'rclientArray',
	        colModel: colModel,
	        viewrecords: true,//是否要显示总记录数信息
	        altRows:true,//隔行变色
	        altclass:"ui-widget-content-altclass",//隔行变色样式
	        shrinkToFit: false,////当为ture时，调整列宽度不会改变表格的宽度。当shrinkToFit 为false时，此属性会被忽略
	        autoScroll: true,
	        height: 300,//表格高度，可以是数字，像素值或者百分比
	        // rownumbers: true,//如果为ture则会在表格左边新增一列，显示行顺序号，从1开始递增。此列名为'rn'
	        // rownumWidth: 25,
	        multiselect: true,//定义是否可以多选
	        beforeRequest: function (t) {//向服务器端发起请求之前触发此事件但如果datatype是一个function时例外
	        	if(count == 0){
	        		count++;
	        		return;
	        	}
	            var model = getSearchTableModel();
	            model.pageIndex = 1;
	            model.pageSize = 999999;
	            $("#dataListChild").jqGrid("setGridParam", {
	                postData: JSON.stringify(model)
	            });
	        },
	        regional: 'cn',
	        jsonReader: {//描述json 数据格式的数组
	            root: function (obj) {//Json数据
	                // $.each(obj.results, function (index, item) {
	                //     item.operatorInfo = '<a href="#">查看</a> ';
	                //     // item.dataCreated = item.dataCreated.Format("yyyy-MM-dd");
	                // });
	                return obj.results;
	            },
	            records: function (obj) {//总记录数
	                return obj.count;
	            },
	            repeatitems: false//以name匹配
	        },
	        gridComplete: function () {//当表格所有数据都加载完成而且其他的处理也都完成时触发此事件，排序，翻页同样也会触发此事件
	            var ids = $("#dataListChild").getDataIDs();
	            for(var i=0;i<ids.length;i++){
	                var rowData = $("#dataListChild").getRowData(ids[i]);
	                if(rowData.isUrgent.indexOf('是') > -1){//紧急订单显示红色
	                    $('#'+ids[i]).find("td").addClass("SelectBG");
	                }
	            }
	        	
	            var width = $('#dataListChild').closest('.jqGrid_wrapper').width();
	            $('#dataListChild').setGridWidth(width);
	        }
	    });
	    // $("#dataListChild").jqGrid('gridDnD',{connectWith:'#dataList'});
	    $("#dataListChild").jqGrid('sortableRows');
	};

	//序列调整
	function openAddWin(){
	    var idsChild=$("#dataListChild").jqGrid("getGridParam","selarrrow");
	    if(idsChild.length == 0){
	        mesCom.msgWarning('请先选择需要调整的数据！');
	        return;
	    }
	    if(idsChild.length > 1){
	        mesCom.msgWarning('调整的数据不能大于1！');
	        return;
	    }
	    
		var rowData = $("#dataListChild").jqGrid("getRowData",idsChild[0]);
		
		var routeArray = [];
		routeArray[0] = rowData.tmBasRouteId;//工艺路径id
		routeArray[1] = rowData.route;//工艺路径
	        
		Ew.dialog('demoadd',{
			title:'序列调整',
			btnValues:[{
				btnId:'btnSaveSeq',
				text:'保存',
				formid:'formEditList',
				onClick:function(data){
				    var planDate=$('#day31').val();
				    var shiftno=$('#combo35').val();
				    var orderNo=$('#text31').val();
				    var tmBasRouteId=$('#combo36').val();
				    var planSeq=$('#text32').val();
				    var flag = isInteger(planSeq);
				    
				    if(planDate == ''){
					    mesCom.msgError('排产上线日期不能为空');
					    return;			
			        }
				        
			        if(tmBasRouteId == ''){
					    mesCom.msgError('工艺路径不能为空');
					    return;			
			        }
			        
			        if(planSeq == ''){
					    mesCom.msgError('序号不能为空');
					    return;			
			        }
			            
				    if(!flag){
				        mesCom.msgWarning('请输入正确的序号，必须为大于0的整数');
				        return;
				    }

				    var schedulingData={};
				    schedulingData.planDate=planDate;
				    schedulingData.shiftno=shiftno;
				    schedulingData.tmBasRouteId=tmBasRouteId;
				    schedulingData.orderNo=orderNo;
				    schedulingData.planSeq=planSeq;
				    if((planDate != '' && planDate != undefined) && (tmBasRouteId != '' && tmBasRouteId != undefined)) {
				    	if(planDate < (new Date().Format("yyyy-MM-dd"))){
				    	    mesCom.msgWarning('排产日期不能小于当前日期!');
				    		return;
				    	}
				    	
				        $.ajax({
				            url: apiUrl + '/base/pporderseq/updateSeq',
				            type: "POST",
				            data: JSON.stringify(schedulingData),
				            contentType: "application/json; charset=gbk",
				            dataType: "JSON",
				            async: false,
				            success: function (res) {
				                if (res.code == 10000) {
				                    //从服务器获取数据进行绑定
				                    mesCom.msgSuccess('保存成功');
				                	$('#demoadd').modal('hide');
				                    $("#dataListChild").trigger("reloadGrid");
				                } else {
				                    mesCom.msgError(res.message);
				                }
				            }
				        });
				    }
				}
			},{
				btnId:'btnCancel',
				text:'取消'
			}],
			form:{
				formId:'formEditList',
				columnNum:2,
				listWidth:333,
				formList:[
	        {
	          idName:'text31',
	          text:'订单编号',
	          defaultValue:rowData.orderNo,
	          field:'orderNo',
	          disabled:true
	        },{
	    		idName: 'day31',
	    		text: '排产上线日期',
	    		defaultValue:rowData.planDate,
	    		valid:['notEmpty'],
	    		field: 'planDate'	
	        },{
	    		idName:'combo35',
	    		text:'班次',
	    		comboUrl:'/system/codeList/getSelect',
	    		comboId:'no',
	    		comboText:'name',
	     		defaultValue:rowData.shift,
	    		field:'shiftno',
	    		comboData:'SHIFT_NO',
	    		n:1
	    	},{
	    		idName:'combo36',
	    		text:'工艺路径',
	    		comboUrl:'/base/route/queryRoute',
	    		comboData:
	    		{
	    		id:['combo30','inputCom30'],
	    		field:['tmBasPlantId','tmBasPartId'],
	    		other:{routeStatus: 'P'}
	    		},
	    		comboId:'tmBasRouteId',
	    		comboText:'route',
	    		valid:['notEmpty'],
	    		field:'tmBasRouteId',
	    		defaultValue:routeArray,
	    		isSearch:true,
	    		onSuccess:function(data){
	    		  console.log(data)
	        	}
	    	 },
	    	 {
		        idName:'text32',
		        text:'序号',
		      	valid:['notEmpty'],
		        defaultValue:rowData.planSeq,
		        field:'planSeq'
		      }
			]
		  }
		});
	}

	//是否正整数
	function isInteger(number){
	return number > 0 && String(number).split('.')[1] == undefined
	}


	$("#addModal").on("hidden.bs.modal", function() {
		$(this).removeData("bs.modal");
	});

    Ew.getDictVal(['ORDER_TYPE','ORDER_SOURCE','YESORNO','SHIFT_NO','ORDER_STATUS'], function (re) {
	 var colModelSub = [{
	        label: "ttPpOrderId",
	        name: "ttPpOrderId",
	        index: "ttPpOrderId",
	        key: true,
	        hidden: true
	    },{
	        label: "ttPpOrderSeqId",
	        name: "ttPpOrderSeqId",
	        index: "ttPpOrderSeqId",
	        key: true,
	        hidden: true
	    },{
	        label: "shift",
	        name: "shift",
	        index: "shift",
	        hidden: true
	    },{
	        label: "tmBasRouteId",
	        name: "tmBasRouteId",
	        index: "tmBasRouteId",
	        hidden: true
	    }, {
	        label: "排产上线日期",
	        name: "planDate",
	        index: "planDate",
	        sortable: false,
	        width: 90
	    }, {
	        label: "班次",
	        name: "shiftno",
	        index: "shiftno",
	        sortable: false,
	        width: 90,
	        formatter: function (value, row, index) {
	        	if(value == ''){
	        		return '';
	        	}
	            return re.SHIFT_NO[value];       
	        }
	    },{
	        label: "工艺路径",
	        name: "route",
	        index: "route",
	        sortable: false,
	        width: 150
	    }, {
	        label: "序号",
	        name: "planSeq",
	        index: "planSeq",
	        sortable: true,
	        width: 90
	    }, {
	        label: "订单编号",
	        name: "orderNo",
	        index: "orderNo",
	        sortable: true,
	        width: 130
	    }, {
	        label: "工厂",
	        name: "plant",
	        index: "plant",
	        sortable: false,
	        width: 110
	    }, {
	        label: "产品",
	        name: "part",
	        index: "part",
	        sortable: false,
	        width: 130
	    }, {
	        label: "可上线数量",
	        name: "canOnlineQty",
	        index: "canOnlineQty",
	        sortable: true,
	        width: 90
	    },{
	        label: '订单状态',
	        name: "orderStatus",
	        index: "orderStatus",
	        sortable: false,
	        width: 90,
	        formatter: function (value, row, index) {
	            return re.ORDER_STATUS[value];          
	     }
	    }, {
	        label: '订单数量',
	        name: "orderQty",
	        index: "orderQty",
	        sortable: false,
	        width: 90
	    },{
	        label: '客户',
	        name: "tmBasCustomId",
	        index: "tmBasCustomId",
	        sortable: false,
	        width: 110
	    }, {
	        label: '车间',
	        name: "workshop",
	        index: "workshop",
	        sortable: false,
	        width: 110
	    },{
	        label: "预计上线时间",
	        name: "planStartDate",
	        index: "planStartDate",
	        sortable: false,
	        width: 90
	    }, {
	        label: "预计下线时间",
	        name: "planEndDate",
	        index: "planEndDate",
	        sortable: false,
	        width: 130
	    },{
	        label: '订单类型',
	        name: "orderType",
	        index: "orderType",
	        sortable: false,
	        width: 90,
	        formatter: function (value, row, index) {
	           return re.ORDER_TYPE[value];          
	     }
	    }, {
	        label: '紧急状态',
	        name: "isUrgent",
	        index: "isUrgent",
	        sortable: false,
	        width: 90,
	        formatter: function (value, row, index) {
	            return re.YESORNO[value];               
	     }
	    }, {
	        label: '来源',
	        name: "orderSource",
	        index: "orderSource",
	        sortable: false,
	        width: 90,
	        formatter: function (value, row, index) {
	            return re.ORDER_SOURCE[value];        
	     }
	    }, {
	        label: 'BOM版本号',
	        name: "tmBasBomId",
	        index: "tmBasBomId",
	        sortable: false,
	        width: 90
	    }];
	    
	    //初始化grid表格
	    initEmptyGrid(colModelSub);
  })   
    
$(function(){
	//搜索条件
	var mainSearchData=[{
		idName:'combo30',
		text:'工厂',
		comboUrl:'/base/plant/publicPlantSelect',
		comboId:'tmBasPlantId',
		comboText:'plant',
		field:'tmBasPlantId',
		onClick:function(data){
	        $('#inputCom30').val('');
            $('#combo31').val('');
		}
	},{
    idName:'inputCom30',
		text:'产品',
		comboUrl:'/worktime/part/publicProduct',
		comboData:
      {
			id:['combo30'],
			field:['tmBasPlantId'],
			other:{partType1:['S','P'],enabled:1}
      },
		comboId:'tmBasPartId',
		comboText:'part',
		field:'tmBasPartId',
    onSuccess:function(data){
		  console.log(data)
    }
	},{
		idName:'combo33',
		text:'订单类型',
		comboUrl:'/system/codeList/getSelect',
		comboId:'no',
		comboText:'name',
		field:'orderType',
		comboData:'ORDER_TYPE',
		n:1
	},{
    idName:'combo31',
		text:'工艺路径',
		comboUrl:'/base/route/queryRoute',
		comboData:
      {
			id:['combo30'],
			field:['tmBasPlantId'],
      other:{}
      },
  		valid:['notEmpty'],
		comboId:'tmBasRouteId',
		comboText:'route',
		field:'tmBasRouteId',
		isSearch:true,
    onSuccess:function(data){
		  console.log(data)
    }
	},{
    idName:'text30',
		text:'订单编号',
		field:'orderNo'
	},{
		idName: 'day30',
		text: '排产上线日期',
		defaultValue:Ew.getNowday(''),
		valid:['notEmpty'],
		field: 'planDate'
	},{
		idName:'combo34',
		text:'班次',
		comboUrl:'/system/codeList/getSelect',
		comboId:'no',
		comboText:'name',
		field:'shiftno',
		comboData:'SHIFT_NO',
		n:1
	}];

	//搜索11

	/*
	*搜索框函数
	*
	*el：为html标签
	*
	*option（参数设置）：
	*@title搜索框标题名称
	*@listWidth搜索条件的宽度默认250px
	*@textValues为弹出框中搜索条件设置为数组[]
	*text：为页面显示的条件名称，
	*field：为当前条件的字段名称，取决后台需求，
	*idName：为input的id，input的类型取决于id名包含字段，
	*包含text，为输入文本框，
	*包含combo，为下拉框，
	*下拉数据调用后台方法
	*comboUrl为接口地址，comboData为接口条件，comboId接口id字段，comboText接口text字段
	*下拉数据调用本地方法，
	*comboData：[{id:1,text:'2222'}],内容为写死的json
	*
	*包含day为时间控件年月日
	*
	*
	*@btnValues为按钮设置为数组[]
	*btnId:为按钮id
	*text：为按钮名称
	*onClick：为点击事件默认有个data为搜索条件[{他的field：他的值},......]
	*如果text为清空自动生成点击事件把搜索条件全部清空
	*
	*
	*
	*
	*
	*/

	Ew.search('.demoSearch',{
		title:'查询',
		listWidth:'300px',
		textValues:mainSearchData,
		btnValues:[{
			btnId:'btnSearch',
			text:'搜索',
			onClick:function(data){	
		        var planDate=$('#day30').val();
		        var routeId = $('#combo31').val();
		        if(planDate == ''){
		        	 mesCom.msgWarning('排产上线日期不能为空');
		        	 return;
		        }
		        if(routeId == ''){
		       	 mesCom.msgWarning('工艺路径不能为空');
	        	 return;
		        }
		        
		        $("#dataListChild").trigger("reloadGrid");
		        currentPlanDate = planDate;
		        currentRoute = $('#combo31').val();
		        currentShift = $('#combo34').val();
			}
		},
			{
			btnId:'btnClear',
			text:'重置',
			onClick:function(data){
		        $("#combo30").select2('val','');//工厂
		        $('#inputCom30').attr('data-id','');//产品
		        $("#combo33").select2('val','');//类型
		        $('#combo31').attr('data-id','');//工艺路径
		        $("#text30").val('');//订单编号
		        $("#day30").val(new Date().Format("yyyy-MM-dd"));//设置日期初始值
		        $("#combo34").select2('val',' ');//班次
		        $("#dataListChild").jqGrid('clearGridData');//清空表格数据

                //    $('#combo30').select2("destroy").select2();
                //    $('#combo30').select2('val','0');
                //    $('#inputCom30').val('');//产品
                //    $('#combo33').select2("destroy").select2();
                //    $('#combo33').select2('val','0');
                //    $('#inputCom31').val('');//工艺路径
                //    $("#text30").val('');//订单编号
                //    $('#day30').val('');//订单计划上线日期
                //    $('#day31').val('');//订单计划下线日期
                //    $('#combo35').select2("destroy").select2(); //排产工艺路径
                //    $('#combo35').select2('val','0');
                //    $('#day32').val(''); //排产日期
                //    $('#combo34').select2("destroy").select2(); //班次
                //    $('#combo34').select2('val','0');
                //    $("#dataList").jqGrid("clearGridData");//清空表格数据
                //    $("#dataListChild").jqGrid("clearGridData");//清空表格数据
			}
		}
		]
	});
	
	    /*浏览器窗口改变时重新适应表格大小*/
	    $(window).bind('resize', function() {
	        var childWidth = $('#dataListChild').closest('.jqGrid_wrapper').width();
	        $('#dataListChild').setGridWidth(childWidth);
	    });
	    
	    /*moveRowUp行上移事件*/
	    $('body').on('click','#moveRowUp',function () {
	        var idsChild=$("#dataListChild").jqGrid("getGridParam","selarrrow");
	        if(idsChild.length == 0){
	            mesCom.msgWarning('请先选择需要调整的数据！');
	        } else {
                var $tr = $("#dataListChild #" + idsChild[0]);
                if (idsChild.length > 1) {
                    var idsIndex = [],
                        selectIds = [],
                        setObj = {};
                    for (var a = 0, b = $('#dataListChild tr').length; a < b; a++) {
                        if ($($('#dataListChild tr')[a]).hasClass('success')) {
                            idsIndex.push(a);
                            selectIds.push($($('#dataListChild tr')[a]).attr('id'));
                        }
                    }
                    idsIndex.sort(sortByOrder);
                    var firstId = $($('#dataListChild tr')[idsIndex[0]]);
                    for (var i = 0, j = idsChild.length; i < j; i++) {
                        $tr = $("#dataListChild #" + idsChild[i]);
                        var $td = idsIndex[i];
                        setObj['' + $td + ''] = idsChild[i];
                    }
                    var idsArr = [],
                        trIds = [];
                    for (var m = 0, n = idsIndex.length; m < n; m++) {
                        idsArr.push($("#dataListChild #" + setObj['' + idsIndex[m] + '']).attr('id'));
                        trIds.push($('#dataListChild tr')[m + 1].id)
                    }
                    if (firstId.prev().before().attr('id') === undefined) {
                        if (trIds.toString() === selectIds.toString()) {
                            mesCom.msgWarning('不好意思，已经是最顶部了！');
                        } else {
                            firstId.fadeOut().fadeIn();
                            for (var a = 0, b = idsIndex.length, c = idsIndex.length; a < b; a++) {
                                $tr = $("#dataListChild #" + setObj['' + idsIndex[1] + '']);
                                var otherIds = $("#dataListChild #" + selectIds[c--]);
                                otherIds.fadeOut().fadeIn();
                                firstId.after($tr);
                                firstId.after(otherIds);
                            }
                        }
                    } else {
                        firstId.fadeOut().fadeIn();
                        firstId.prev().before(firstId);
                        var otherId;
                        for (var k = 0, l = idsIndex.length, m = idsIndex.length; k < l; k++) {
                            otherId = $("#dataListChild #" + selectIds[m--]);
                            otherId.fadeOut().fadeIn();
                            firstId.after(otherId);
                        }
                    }
                } else {
                    if ($tr.prev().before().attr('id') === undefined) {
                        mesCom.msgWarning('不好意思，已经是最顶部了！');
                    } else {
                        $tr.fadeOut().fadeIn();
                        $tr.prev().before($tr);
                    }
                }
	        }
	    });
	    /*moveRowDown行下移事件*/
	    $('body').on('click','#moveRowDown',function () {
	        var idsChild=$("#dataListChild").jqGrid("getGridParam","selarrrow");
	        if(idsChild.length == 0){
	            mesCom.msgWarning('请先选择需要调整的数据！');
	        } else {
                var $tr = $("#dataListChild #"+idsChild[0]);// 点击的第一个
                if (idsChild.length > 1) {
                    var idsIndex = [],
                        selectIds = [],
                        setObj = {};
                    for (var a = 0, b = $('#dataListChild tr').length; a < b; a++) {
                        if ($($('#dataListChild tr')[a]).hasClass('success')) {
                            idsIndex.push(a);
                            selectIds.push($($('#dataListChild tr')[a]).attr('id'));
                        }
                    }
                    idsIndex.sort(sortByOrder);
                    for (var i = 0, j = idsChild.length; i < j; i++) {
                        $tr = $("#dataListChild #"+idsChild[i]);
                        var $td = idsIndex[i];
                        setObj[''+$td+''] = idsChild[i];
                    }
                    var lastId = $($('#dataListChild tr')[idsIndex[idsIndex.length - 1]]);
                    if (lastId.next().after().attr('id') === undefined) {
                        var idsArr = [],
                            trIds = [];
                        for (var m = 0, n = idsIndex.length; m < n; m++) {
                            idsArr.push($("#dataListChild #" + setObj['' + idsIndex[m] + '']).attr('id'));
                            var trLens = $('#dataListChild tr').length -n;
                            trIds.push($('#dataListChild tr')[trLens + m].id);
                        }
                        if (trIds.toString() === selectIds.toString()) {
                            mesCom.msgWarning('不好意思，已经是最底部了！');
                        } else {
                            var otherIds;
                            for (var a = 0,b = idsIndex.length,c = idsIndex.length -1; a < b; a++) {
                                otherIds = $("#dataListChild #" + selectIds[a]);
                                otherIds.fadeOut().fadeIn();
                                lastId.before(otherIds);
                            }
                        }
                    } else {
                        lastId.next().after(lastId);
                        for (var k = 0, l = idsIndex.length; k < l; k++) {
                            var otherId = $("#dataListChild #" + selectIds[k]);
                            otherId.fadeOut().fadeIn();
                            lastId.before(otherId);
                        }
                    }
                } else {
                    if ($tr.next().after().attr('id') == undefined) {
                        mesCom.msgWarning('不好意思，已经是最底部了！');
                    } else {
                        $tr.fadeOut().fadeIn();
                        $tr.next().after($tr);
                    }
                }
	        }
	    });

	    /*btnSave保存事件*/
	    $('body').on('click','#btnSave',function () {
	        var planDate=$('#day30').val();
	        var shiftno=$('#combo34').val();
	        var tmBasRouteId=$('#combo31').val();
	        
	        if(tmBasRouteId == ''){
			    mesCom.msgError('工艺路径不能为空');
			    return;			
	        }
	        
	        if(planDate == ''){
			    mesCom.msgError('排产上线日期不能为空');
			    return;			
	        }
	        
	        // var shiftnoText=$('#selectShift option:selected').text();
	        var schedulingData={};
	        var ppOrderSeqsArry=[];
	        var ids = $("#dataListChild").jqGrid('getDataIDs');//获取总行数
	        
	        if(ids.length == 0){
	    	    mesCom.msgError('没有可操作的数据');
			    return;	
	        }
	        
	        for(var i=0,j=ids.length;i<j;i++){
	            var rowData = $("#dataListChild").jqGrid("getRowData",ids[i]);
	            ppOrderSeqsArry.push({
	                ttPpOrderId : rowData.ttPpOrderId,
	                orderNo : rowData.orderNo,
	                planSeq : rowData.planSeq,
	                ttPpOrderSeqId : rowData.ttPpOrderSeqId
	            });
	        }
	        schedulingData.ppOrderSeqs=ppOrderSeqsArry;
	        schedulingData.planDate=planDate;
	        schedulingData.shiftno=shiftno;
	        schedulingData.tmBasRouteId=tmBasRouteId;
	        if((planDate != '' && planDate != undefined) && (tmBasRouteId != '' && tmBasRouteId != undefined)) {
	        	if(planDate != currentPlanDate || tmBasRouteId != currentRoute){
	                mesCom.msgWarning('查询列表中的数据与查询条件选择的不一致,请修改！');
	        		return;
	        	}
	        	
	            $.ajax({
	                url: apiUrl + '/base/pporderseq/updateSeqs',
	                type: "POST",
	                data: JSON.stringify(schedulingData),
	                contentType: "application/json; charset=gbk",
	                dataType: "JSON",
	                async: false,
	                success: function (res) {
	                    if (res.code == 10000) {
	                        //从服务器获取数据进行绑定
	                        mesCom.msgSuccess('保存成功');
	                        $("#dataListChild").trigger("reloadGrid");
	                    } else {
	                        mesCom.msgError(res.message);
	                    }
	                }
	            });
	        }
	    });
	/*焦点移入清空错误提示*/
	$('body').on('focus','input',function () {
	   $(this).closest('.col-lg-3').find('.err-span-msg').remove();
	   $(this).removeClass('bc-red');
	});
    // 排序
    function sortByOrder(a, b) {
        return a - b;
    }
});
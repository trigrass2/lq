//全局变量API服务URL
//var apiUrl = 'http://10.16.1.23:8088/ewap-auth';
var apiUrl = 'http://127.0.0.1:8088/ewap-auth';// 测试环境
/*
*
*函数框架
* */
function Ew(){
  var _this=this;
  layui.use(['layer'], function(){
    _this.layer = layui.layer;
  });
  this.apiUrl = apiUrl;//  接口地址 前缀
  this.dragDrop={
    isdragDrop : false,
    disX:0,
    disY:0
  }
  this.isShift = false;
  this.isAlt = false;
  this.alt = [];
  $('body').keydown(function(e){
    var event = window.event || e;
    var code = event.keyCode || event.which
    if(code == 16){
      _this.isShift = true
    }
    else if(code == 17){
      _this.isAlt = true
    }
  })
  $('body').keyup(function(e){
    var event = window.event || e;
    var code = event.keyCode || event.which
    if(code == 16){
      _this.isShift = false
    }
    if(code == 17){
      _this.alt = [];
      _this.isAlt = false
    }
  })
  this.ajaxTimes = 0;
  this.tableflag = [];
  this.settableId = [];
  this.buttonPower = [];
  this.init() //初始化加载
}

/*
 * panel函数
 *
 *@title 标题
 *@content 内容
 *@onLoadsucess 执行函数
 *@panelType 类型 默认down下拉 left右 right左 none无
 *
 * */
Ew.prototype.panel=function(el,option){
  var type = option.panelType ? option.panelType :'down'
  var $el=$(el);
  $el.css('box-sizing','border-box')
  $el.append(
    '<div class="panel-heading" style="border: none; border-bottom: 1px solid #ddd"><span class="dot"></span>' +
    option.title+
    '<span class="closeBtn"></span>'+
    '</div>' +
    '<div>'+
    '<div class="panel-body" style="margin-top: 10px;">' +
    '</div>' +
    '</div>'
  );

  if(type != 'none'){
    $el.children('div').find('.closeBtn').css('background','url(../../../img/icons/'+ type +'_btn.png) no-repeat');
    $el.children('div').find('.closeBtn').on('click',function(){
      Ew.slide(this,type)
    })
  }
  else{
    $el.children('div').find('.closeBtn').css('background','none');
  }

  $el.css({border: '1px solid #ccc'});
  if(type == 'right'){
    $el.after('<div class="closeExpen" style="float: left; height: '+ $el.height() +'px; width: 30px; background-color: #286090; cursor: pointer; display: none; justify-content: center;align-items: center; z-index: 10000"><img src="../../../img/icons/leftw_btn.png" /></div>');
    $el.next('.closeExpen').on('click',function(){
      $(this).css('display','none')
      $(this).prev('div').animate({'margin-left':'0px'},'fast');
    })
  }
  else if(type == 'left'){
    $el.before('<div class="closeExpen" style="float: left; height: '+ $el.height() +'px; width: 30px; background-color: #286090;cursor: pointer; display: none ; justify-content: center;align-items: center"><img src="../../../img/icons/rightw_btn.png" /></div>');
    $el.prev('.closeExpen').on('click',function(){
      $(this).css('display','none')
      $(this).next('div').animate({'margin-right':'0px'},'fast');
    })
  }



  if(option.titleNone){
    $el.find('.panel-heading').css('display','none')
  }
  if(option.content){
    $el.find('.panel-body').append(option.content)
  }
  if(option.onLoadsucess){
    option.onLoadsucess()
  }
}





/*
* 搜索框 函数
*
*el：为html标签
*
*option（参数设置）：
*@title  搜索框 标题名称
*@listWidth  搜索条件的宽度 默认250px
*@textValues 为弹出框中 搜索条件设置 为数组[]
*     text：为页面显示的条件名称，
*     field：为当前条件的字段名称，取决后台需求，
*     moreSearch：与更多搜索配套使用，代表一开始隐藏
*     idName：为input的id，input的类型取决于id名包含字段，
*         包含text，为输入文本框，
*         包含combo，为下拉框，
*           下拉数据调用后台方法
*                comboUrl为接口地址，comboData为接口条件，comboId接口id字段，comboText接口text字段
*           下拉数据调用本地方法，
*                comboData：[{id: 1, text: '2222'}],内容为写死的json
*
*         包含day为时间控件 年月日
*
* @btnValues 为按钮设置 为数组[]
*     btnId:为按钮id
*     text：为按钮名称
*     onClick：为点击事件 默认有个data为搜索条件[{他的field：他的值},... ...]
*     如果text为清空 自动生成点击事件 把搜索条件全部清空
*     如果text为更多搜索， 自动生成自动搜索，把moreSearch:true的列全部隐藏
*
*
*
*
*/

/*
例如：
 Ew.search('.demoSearch',
 {
 title: '条件查询',
 textValues: [
   {idName: 'text1', text: '物料名称', field: 'wain'},
   {
   idName: 'combo55',
   text: '工厂',
   comboUrl: '/base/plant/queryPlantSelect',
   comboData: {parentiD: ''},
   comboId: 'tmBasPlantId',
   comboText: 'plant',
   field: 'partNo'
   },
   {idName: 'combo5', text: '下拉默认', comboData: [{id: 1, text: '2222'}]},
   {idName: 'day3', text: '日期', field: 'code'},

 ],
 btnValues: [{
 btnId: 'search', text: '搜索', onClick: function (data) {
    $('#table1').bootstrapTable('refresh');
 }
 },
 {btnId: 'clear', text: '清空'}，
 {btnId: 'clear', text: '更多搜索'}，
 ]1
 }
 );


 */

Ew.prototype.search=function(el,optiondata,callback){
  if(callback){
    callback()
  }
  var optionDefaut={
    textValues:[],
    btnValues:[],
    listWidth:'250px',
    widthInput:150
  }
  var _this=this;
  var option=$.extend({},optionDefaut,optiondata);
  _this.panel(el, option)
  var $el=$(el);
  var formId = option.formId?option.formId:'nofromId'
  var el1 = el.replace(/[\.\#\s+]/g,'').toString();
  var formLeft = [];
  $el.find('.panel-body').append('<form id="'+formId+'" class="form-horizontal" autocomplete="off" ><ul class="panel-body-content"></ul></form>')

  //加载搜索条件
  var validatorsData= {
//        live: 'disabled',
    message: 'This value is not valid',
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    }
  };
  var validatorsFiled={};
  var maxLength = option.textValues.map(function(it){
    return it.text.length
  })
  var maxWidth = ((Math.max.apply(Math, maxLength))*14 + 30 + option.widthInput)
    $.each(option.textValues,function(index,value){
      var typeIsplay=value.moreSearch?'none':'block';
      var isblock = 'none'
        if(value.valid){
          isblock=$.inArray("notEmpty", value.valid)>=0?'block':'none';
        }
      if(index%4 == 0){
        formLeft.push(value.text.length)
        $el.find('.panel-body').find('.panel-body-content').append(
          '<li class="form-group" style="float:left;margin-bottom: 10px; display: '+typeIsplay+';width:'+maxWidth+'px; clear: both ">' +
          '<div class="'+el1+'searchInput'+index+'" style="float: right; margin: 0 10px 0 10px; width: '+option.widthInput+'px ">'+
          '</div>'+
          '<label class="control-label" for="" style="float: right; line-height: 30px">'+value.text+'</label>'+
          '<i style="float:right;color: red; margin-right: 4px; display: '+isblock+'">*</i>'+
          '</li>'
        );
      }
      else{
        $el.find('.panel-body').find('.panel-body-content').append(
          '<li class="form-group" style="float:left; margin-bottom: 10px; display: '+typeIsplay+';width:'+maxWidth+'px">' +
          '<div class="'+el1+'searchInput'+index+'" style="float: right; margin: 0 10px 0 10px; width: '+option.widthInput+'px ">'+
          '</div>'+
          '<label class="control-label" for="" style="float: right; line-height: 30px">'+value.text+'</label>'+
          '<i style="float:right;color: red; margin-right: 4px;display: '+isblock+'">*</i>'+
          '</li>'
        );
      }
      var inputForm = formId != 'noformId'? formId: '';
      var InputValid= _this.getInputhl((el1+'searchInput'+index),value,inputForm,value.defaultValue,option.widthInput);
      if(InputValid){
        validatorsFiled[value.field]={validators:InputValid};
      }
    })
  var maxLeft = (Math.max.apply(Math, formLeft))*14 + option.widthInput +40;
  $('#' +formId).css('margin-left',(maxLeft - maxWidth )+'px')
  $el.find('.panel-body').append(
  '<div class="btn_bg" style="float: right; margin: 0 10px 10px 5px"></div>'
  )

  if(formId != 'noformId'){
    //验证
    validatorsData.fields=validatorsFiled;
    $('#'+formId).bootstrapValidator(validatorsData);
  }

  if(option.btnValues) {
    var btnValues = option.btnValues;
    _this.getBtnPower(function (re) {
      var btnValues = option.btnValues.filter(function (ite) {
        return $.inArray(ite.btnId, re) > -1 || ite.text == '搜索' || ite.text == '重置'
    })


      //按钮
      $.each(btnValues, function (index, value) {
        $el.find('.btn_bg').append(
          '<button type="button" id="' + value.btnId + '" class="btn btn-primary" style="margin-left: 5px">' + value.text + '</button>'
        )
        $('#' + value.btnId).on('click', function () {
          var data = _this.getObj(option.textValues, 'field', 'idName');
          if (value.text == '重置') {
            $.each(option.textValues, function (index, value1) {
              if (value1.defaultValue) {
                $('#' + value1.idName).val(value1.defaultValue)
              }
              else if (value1.idName.indexOf('combo') > -1) {
                $('#' + value1.idName).select2('val', [''])
                if (value1.comboUrl) {
                  Ew.selectLink({
                    comboUrl: value1.comboUrl,
                    comboData: value1.comboData,
                    id: [value1.idName],
                    comboId: value1.comboId,
                    comboText: value1.comboText
                  });
                }
                else {
                  $('#' + value1.idName).select2('val', [''])
                }
              }
              else {
                $('#' + value1.idName).val('')
              }
            })
            var tableIndex = 1
            $.each(value.tableid, function (index3, value3) {
              $('#' + value3).parents('.bootstrap-table').find('.searchRemove').click()
//              $('#' + value3).bootstrapTable('refresh', {query: {}})
              if(tableIndex == 1){
            	  $('#' + value3).bootstrapTable('refresh')
              } else {
            	  $('#' + value3).bootstrapTable('removeAll');
              }
              tableIndex = tableIndex + 1;
            })
          }
          else if (value.text == '更多搜索') {
            if ($('#' + value.btnId).text() == '更多搜索') {
              $.each(option.textValues, function (index2, value2) {
                $('#' + value2.idName).parents('.form-group').show()
              });
              // if($el.height()>100){
              //   $el.find('.btn_bg').css({float: 'right'});
              //   $el.find('.panel-body-content').children('li').css({'width':option.listWidth,'margin-left':0})
              // }
              $('#' + value.btnId).text('收起')
            }
            else {
              $.each(option.textValues, function (index2, value2) {
                if (value2.moreSearch == true) {
                  $('#' + value2.idName).parents('.form-group').hide();
                  if (value2.idName.indexOf('combo') > -1) {
                    $('#' + value2.idName).select2('val', 0)
                  }
                  else {
                    $('#' + value2.idName).val('')
                  }
                }
              })
              // if($el.height()<100){
              //   $el.find('.btn_bg').css({float: 'left'});
              //   $el.find('.panel-body-content').children('li').css({'width':'auto','margin-left':30})
              // }
              $('#' + value.btnId).text('更多搜索')
            }
          }
          else {
            if (formId != 'noformId') {
              $('#' + formId).bootstrapValidator('validate');
              if ($('#' + formId).data('bootstrapValidator').isValid() == true) {
                value.onClick(data)
              }
            }
            else {
              value.onClick(data)
            }
          }
        })
      })
    })
  }
  // window.onload=window.onresize=function(){
  //   if($el.height()>100){
  //     $el.find('.btn_bg').css({float: 'right'});
  //     $el.find('.panel-body-content').children('li').css({'width':option.listWidth,'margin-left':0})
  //   }
  //   else{
  //     $el.find('.btn_bg').css({float: 'left'});
  //     $el.find('.panel-body-content').children('li').css({'width':'auto','margin-left':30})
  //   }
  // }
}





/*
* 获取按钮的html 事件
*@$el 为html标签
*@option 为参数对象
*@data 为默认值
* */
Ew.prototype.getBtnhl=function($el,option,data){
  var _this=this;
  $el.append('<button type="button" id="'+option.btnId+'" class="btn btn-primary" style="margin-left: 5px">'+option.text+'</button>');
  if(option.attrValue){
    $('#'+option.btnId).attr(option.attrValue)
  }
  if(option.classValue){
    $('#'+option.btnId).addClass(option.classValue)
  }

  if(option.text == '导入'){
    $el.append('<form autocomplete="off" id="'+option.btnId+'_form" style="display: none"><input id="'+option.btnId+'_input" name="file" type="file" /></form>');
    $('#'+option.btnId).on('click',function(){
      $('#'+option.btnId+'_input').click()
    })
    $('#'+option.btnId+'_input').change(function(){
      $.ajax({
        url:  _this.apiUrl+option.url,
        type: 'POST',
        cache: false,
        data: new FormData($('#'+option.btnId+'_form')[0]),
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success:function (data) {
          $('#'+option.btnId+'_input').val('')
          layer.alert(data.message, {icon: 7});
          $('#'+option.tableId).bootstrapTable('refresh');
        }
      })
    })
  }
  else{
    $('#'+option.btnId).on('click',function(){
      if(option.formid){
        $('#'+option.formid).bootstrapValidator('validate');
        if(option.onClick) {
          if($('#'+option.formid).data('bootstrapValidator').isValid()==true){
            if(option.isTrue){
              _this.layer.confirm('确定'+option.text+'数据吗？',{icon:7}, {
                btn: ['确定', '取消'] //可以无限个按钮
                ,yes: function(index, layero){
                  _this.layer.close(index)
                  option.onClick(_this.getObj(data,'field','idName'))
                }
              });
            }
            else{
              option.onClick(_this.getObj(data,'field','idName'))
            }
          }
        }
      }
      else{
        if(option.onClick) {
          if(option.isTrue){
            _this.layer.confirm('确定'+option.text+'数据吗？',{icon:7},
              function(index, layero){
                _this.layer.close(index)
                option.onClick()
              })
          }
          else{
            option.onClick()
          }
        }
      }
    })
  }
}





/*
* 表格
*
*el：为html标签
*option(参数设置)：
*@btnValues为控制表格的按钮
*   selectNum为只能选取的条数
*   selMinNum为最少选择的条数
*@tableId 为table的id
*@tableValue 为table参数值
*   searchParams：搜索的条件为 搜索里的textValues值 格式[{idName: 'text1', field: 'wain'},{... ...},... ...]
*   queryParams:为 默认想要添加的条件 为函数function(){ return {key：value}}return 一个对象 用keyvalue值传入
*   onClickRow为 点击事件 为函数 function (item, $element) {},item为点击那行的参数 $element为选择器
*   url：为获取表格的后台接口
*   columns：为表格的参数值
*   otherOption:[{id:'table2',selectNum: 1},{textId:'text666'}] 验证按钮可不可编辑 id为表格id selectNum为只选的条数 selMinNum为最少选择条数 textId为文本框是否必填的文本id
*   otherBtn:true, 该按钮为其他地方按钮 只做验证判断
*   nohidden 字段显示多行文本 默认单行省略号 表示
*   height 高度 默认10行高度
*   detailView 是否使用父子表
*   noSearch 没有搜索框
*   onExpandRow: function (index, row, $detail) {} 父子表点击事件 var cur_table = $detail.html('<div class="tableson"></div>').find('table');
*
* */

/*
 Ew.table('.demoTable',
 {
 btnValues: [{
 btnId: 'add', text: '新增', onClick: function () {

 }
 },
 {
 btnId: 'change', text: '修改', selectNum: 1, onClick: function () {
 daliogShow('change')
 }
 }
 ],
 tableId: 'table1',
 tableValue: {
 searchParams: mainSearchData,
 queryParams: function () {
 return {}
 },
 onClickRow: function (item, $element) {

 },
 url: '/worktime/part/querylistByPage',
 columns: [{
 checkbox: true
 }, {
 field: 'tmBasPlantId',
 title: '工厂',
 align: 'center'
 }]
 }
 }
 )
 })
*/
Ew.prototype.table=function(el,option,callback){
  var titletable = option.tableTitle ? option.tableTitle :option.tableTitleSub;
  var panelType = option.panelType ? option.panelType :'down';
  if(callback){
    callback()
  }
  var $el1=$(el);
   var _this=this;
  if($el1.parent('div').parent().prop("tagName") == 'BODY'){
    _this.settableId.push(el)
    _this.tableflag.push(option.tableId)
  }
  $el1.addClass('panel panel-default');
  _this.panel(el,{
    title:titletable,
    panelType:panelType,
    content:'<div class="'+el.substr(1)+'_table" style="width: 100%"></div>',
  })
  if(!option.tableTitle){
    $el1.find('.panel-heading').css('display','none')

    // $el1.find('.panel-heading').css('background-color','#fff');
    // $el1.find('.dot').css('background-color','#fff');
  }
  $el1.css('border','none');

  var $el=$('.'+el.substr(1)+"_table");
  //添加html
  $el.append(
    '<div id="toolbar_'+option.tableId+'"  class="btn-group1" style="margin-top: 1px"></div>'+
    '<table id="'+option.tableId+'" ></table>'
  )

  _this.getBtnPower(function(re){
    var btnValues = option.btnValues? option.btnValues :[] ;
    if(option.btnValues){
      btnValues = option.btnValues.filter(function(ite){
        return $.inArray(ite.btnId,re) > -1 || !ite.btnId
      })
    }
    if(btnValues.length > 0){
      //添加按钮html
      $.each(btnValues,function(index,value){
        if(value.btnId){
          if(!value.otherBtn){
            _this.getBtnhl($el.find('.btn-group1'),value)
          }
          // $el.find('.btn-group1').append(
          //   '<button id="'+value.btnId+'" type="button" class="btn btn-primary" style="margin-right: 5px">'+value.text+'</button>'
          // )
          // $('#'+value.btnId).on('click',function(){
          //   value.onClick()
          // })
        }
        else{
          $el.find('.btn-group1').append(
            '<li class="form-group" style="float:left; margin-top: 10px;">' +
            '<div class="btnInput'+index+'" style="float: right; margin: 0 10px 0 10px; width:300px ">'+
            '</div>'+
            '<label class="control-label" for="" style="float: right; line-height: 30px">'+value.text+'</label>'+
            '</li>'
          )
          _this.getInputhl(('btnInput'+index),value,'','')
          $('#'+value.idName).keyup(function(){
            if(btnValues){
              $.each(btnValues,function(index,item){
                if(item.otherOption){
                  var otherOption=true;
                  $.each(item.otherOption,function(index1,item1){
                    if(typeof item1 == 'boolean'){
                      otherOption=otherOption && item1
                    }
                    else if(item1.selectNum){
                      otherOption=otherOption && ($('#'+item1.id).bootstrapTable('getSelections').length == item1.selectNum)
                    }
                    else if(item1.selMinNum){
                      otherOption=otherOption && ($('#'+item1.id).bootstrapTable('getSelections').length >= item1.selMinNum)
                    }
                    else if(item1.textId){
                      otherOption=otherOption && ($('#'+item1.textId).val() != '')
                    }
                  })
                  $('#'+item.btnId).prop('disabled', !otherOption);
                }
              })
            }
          })
        }
      })
    }

    var columns= option.tableValue.columns;
    var noSearch= option.tableValue.noSearch?false:true;
    var detailView= option.tableValue.detailView?true:false;
    var singleclick= option.tableValue.singleSelect == false?option.tableValue.singleSelect:true;
    var pagination = option.tableValue.pagination == false?option.tableValue.pagination:true;

    $.each(columns,function(index9,item9){
      if(!item9.checkbox){
        columns[index9].align = 'left';
        if(!item9.formatter){
          if(!item9.width){
            columns[index9].width = '120px';
          }
          var smath = Math.floor(parseInt(columns[index9].width)/14)
          columns[index9].formatter=function (value, row, index) {
            if(value !=null && value.length > smath){
              return '<div class = "avc" title="'+value+'" href="javascript:void(0)" >'+value+'</div>';
            }
            return value;
          }
        }
      }
    });
    // columns.push({
    //   field:'',
    //   title:'',
    //   align:'',
    //   sortable:false,
    //   width:'auto',
    //   formatter:function (value, row, index) {
    //     return ''
    //   }
    // })
    var treeView = false
    var treeCollapseAll = ''
    var treeId = ''
    var treeField = ''
    var treeRootLevel = ''

    if(option.tableValue.treeView){
      treeView = true;
      treeCollapseAll = option.tableValue.treeCollapseAll;
      treeId = option.tableValue.treeId;
      treeField = option.tableValue.treeField;
      treeRootLevel = option.tableValue.treeRootLevel;
    }

    //表格
    $('#'+option.tableId).bootstrapTable({
      url: _this.apiUrl+option.tableValue.url,         //请求后台的URL（*）
      method: 'post',                      //请求方式（*）
      toolbar: '#toolbar_'+option.tableId,                //工具按钮用哪个容器
      treeView: treeView,
      treeCollapseAll: treeCollapseAll,//是否全部展开
      treeId: treeId,
      treeField: treeField,
      treeRootLevel: treeRootLevel,
      stickyHeader:false,
      striped: true,                      //是否显示行间隔色
      cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
      pagination: pagination,                   //是否显示分页（*）
      sortable: true,                     //是否启用排序
      resizable:true,
      sortOrder: "asc", //排序方式
      dataField: "data",					//这是返回的json数组的key.默认好像是"rows".这里只有前后端约定好就行
      onLoadSuccess:function(){
        if(!option.tableValue.nohidden){
          $('.table > tbody > tr > td').css({'white-space':'nowrap'})
        }
        else{
          $('.table > tbody > tr > td').css({'word-break':'break-all','word-wrap':'break-word'})
        }
        if(btnValues){
          $.each(btnValues,function(index,item){
            if(item.otherOption){
              var otherOption=true;
              $.each(item.otherOption,function(index1,item1){
                if(item1.selectNum){
                  otherOption=otherOption && ($('#'+item1.id).bootstrapTable('getSelections').length == item1.selectNum)
                }
                else if(item1.selMinNum){
                  otherOption=otherOption && ($('#'+item1.id).bootstrapTable('getSelections').length >= item1.selMinNum)
                }
                else if(item1.textId){
                  otherOption=otherOption && ($('#'+item1.textId).val() != '')
                }
                else if(typeof item1 == 'boolean'){
                  otherOption=otherOption && item1
                }
                else if(item1.noselect){
                  var rows = $('#'+item1.id).bootstrapTable('getSelections')
                  rows.forEach(function(row,rowindex,rowarray){
                    item1.noselect.forEach(function(list,number,array){
                      list.nolist.forEach(function(select,selectindex,selectarray){
                        if(row[list.title] == select){
                          otherOption=otherOption && false
                          return;
                        }
                      })
                    })
                  })
                }
              })
              $('#'+item.btnId).prop('disabled', !otherOption);
            }
          });
        }

        if(option.tableValue.onLoadSuccess){
          option.tableValue.onLoadSuccess()
        }
      },
      onCheck: function (row,boxel) {
        var altindex = $(boxel).attr('data-index')
        if(altindex!= undefined){
          if(_this.isAlt == true ){
            _this.alt.push(altindex);
            _this.alt.forEach(function(itme){
              $('#'+option.tableId).bootstrapTable('check',parseInt(itme))
            })
          }
          else {
            _this.alt[0] = $(boxel).attr('data-index');
          }
        }

        if($('#'+option.tableId).attr('nocheck') == 0 || $('#'+option.tableId).attr('nocheck') == undefined){
          if(_this.isShift == true){
            if($('#'+option.tableId).attr('firstselect')!= undefined ){
              var end = $(boxel).attr('data-index');
              var start = $('#'+option.tableId).attr('firstselect');
              if(end>start){
                $('#'+option.tableId).attr('nocheck',1)
                for(var i = start; i<end; i++){
                  $('#'+option.tableId).bootstrapTable('check',i)
                }
                $('#'+option.tableId).attr('nocheck',0)
              }
              $('#'+option.tableId).attr('firstselect',end);
              _this.isShift = false
            }
          }
          else{
            var indexsele = $(boxel).attr('data-index');
            $('#'+option.tableId).attr('firstselect',indexsele);
          }
          if(option.tableValue.onClickRow && _this.isShift == false){
            option.tableValue.onClickRow(row,boxel)
          }
          else{
            return false;
          }
        }
      },
      onUncheck:function(row, $element){
        if(option.tableValue.onUncheck){
          option.tableValue.onUncheck(row)
        }
      },
      queryParams:function queryParams(params) {   //设置查询参数
        var serachdata={};
        if(option.tableValue.searchParams){
           serachdata=_this.getObj(option.tableValue.searchParams,'field','idName');
        }
        var pageSize = option.tableValue.pagination == false? -1:params.limit
        var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
          pageSize: pageSize,   //页面大小
          pageIndex: (params.offset/params.limit)+1  //页码
        };
        var newTemp = $.extend({},serachdata,option.tableValue.queryParams(),temp)
        return newTemp;
      },//传递参数（*）
      onCheckAll:function(rows){
        rows.forEach(function(item, index, array){
          $('#'+option.tableId).bootstrapTable('check',index)
        })
      },
      onUncheckAll:function(rows){
        rows.forEach(function(item, index, array){
          $('#'+option.tableId).bootstrapTable('uncheck',index)
        })
      },
      sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
      pageNumber:1,                       //初始化加载第一页，默认第一页
      pageSize: 10,                       //每页的记录行数（*）
      pageList: [10, 25,100],        //可供选择的每页的行数（*）
      search: noSearch,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
      strictSearch: false,
      showColumns: noSearch,                  //是否显示所有的列
      //showRefresh: true,                  //是否显示刷新按钮
      minimumCountColumns: 2,             //最少允许的列数
      clickToSelect: true,
      singleSelect:singleclick,
      height:option.tableValue.height?option.tableValue.height: btnValues.length == 0 && !noSearch?430:480,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
      fixedColumns:true,
      fixedNumber:3,
      uniqueId: "",                     //每一行的唯一标识，一般为主键列
      showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
      cardView: false,                    //是否显示详细视图
      detailView: detailView,                   //是否显示父子表
      icons:{
        columns: 'glyphicon-list',//配置显示隐藏列图标
        refresh:'glyphicon-repeat',  //配置刷新按钮
        paginationSwitchDown: 'glyphicon-collapse-down icon-chevron-down',
        paginationSwitchUp: 'glyphicon-collapse-up icon-chevron-up',
        refresh: 'glyphicon-refresh icon-refresh',
        toggle: 'glyphicon-list-alt icon-list-alt',
        columns: 'glyphicon-th icon-th',
        detailOpen: 'glyphicon-plus icon-plus',
        detailClose: 'glyphicon-minus icon-minus'
      },
      onExpandRow: function (index, row, $detail) {
        if(option.tableValue.onExpandRow){
          option.tableValue.onExpandRow(index, row, $detail)
        }
      },
      responseHandler:function(res){
        var errcode = res.code;//在此做了错误代码的判断
        if(errcode != '10000'){
          if(option.tableValue.onErr){
            option.tableValue.onErr(res)
          }
          else{
            _this.layer.msg(res.message, {
              icon: 2,
              time: 1000
            });
          }
          return {
            total : 0, //总页数,前面的key必须为"total"
            data : [] //行数据，前面的key要与之前设置的dataField的值一致.
          };
        }
        //如果没有错误则返回数据，渲染表格
        return {
          total : res.count, //总页数,前面的key必须为"total"
          data : res.results //行数据，前面的key要与之前设置的dataField的值一致.
        };
      },
      columns:option.tableValue.columns
    });


    window.onresize = function(){
      for(var i = 0;i<_this.tableflag.length ; i++){
        $('#' + _this.tableflag[i]).bootstrapTable('resetHeader')
      };
      $("body").css("width", $(window).width());
    }
    if(btnValues) {
      $('#' + option.tableId).on('check.bs.table uncheck.bs.table ' +
        'check-all.bs.table uncheck-all.bs.table', function (item) {
        $.each(btnValues, function (index, item) {
          if (item.otherOption) {
            var otherOption = true;
            $.each(item.otherOption, function (index1, item1) {
               if(typeof item1 == 'boolean'){
                alert(item1)
                otherOption=otherOption && item1
              }
              else if (item1.selectNum) {
                otherOption = otherOption && ($('#' + item1.id).bootstrapTable('getSelections').length == item1.selectNum)
              }
              else if (item1.selMinNum) {
                otherOption = otherOption && ($('#' + item1.id).bootstrapTable('getSelections').length >= item1.selMinNum)
              }
              else if(item1.textId){
                otherOption=otherOption && ($('#'+item1.textId).val() != '')
              }
              else if(item1.noselect){
                var rows = $('#'+item1.id).bootstrapTable('getSelections')
                rows.forEach(function(row,rowindex,rowarray){
                  item1.noselect.forEach(function(list,number,array){
                    list.nolist.forEach(function(select,selectindex,selectarray){
                      if(row[list.title] == select){
                        otherOption=otherOption && false
                        return;
                      }
                    })
                  })
                })
              }
              $('#' + item.btnId).prop('disabled', !otherOption);
            })
          }
        });
      });

      $.each(btnValues, function (index, item) {
        if (item.otherOption) {
          var otherOption = true;
          $.each(item.otherOption, function (index1, item1) {
            if (item1.selectNum) {
              otherOption = otherOption && ($('#' + item1.id).bootstrapTable('getSelections').length == item1.selectNum)
            }
            else if (item1.selMinNum) {
              otherOption = otherOption && ($('#' + item1.id).bootstrapTable('getSelections').length >= item1.selMinNum)
            }
            else if(typeof item1 == 'boolean'){
              otherOption=otherOption && item1
            }
            else if(item1.textId){
              otherOption=otherOption && ($('#'+item1.textId).val() != '')
            }
            $('#' + item.btnId).prop('disabled', !otherOption);
          })
        }
      });
    }
  })
}


/*
*
* 弹出框
*el：为html标签
*
*option(参数设置)：
*@title为 弹出框标题
*@btnValues 为弹出框 最底下的按钮
*   btnId为按钮id
*   text为按钮名称
*       如果text为重置，会自动重置formid的表单
*       如果text为取消，自动关闭弹出框
*   formid 为点击时候需要验证form表单的 form的id
*   onClick 为点击事件 为函数function(data){}为form表单里的{field:value,... ...}
*
*@form 如果有form自动内部加载 form表单 form表单参数详见 Ew.form函数
* */

/*
 Ew.daliog('demoadd',
 {
 title:title,
 btnValues: [{
 btnId: 'aaaa', text: '保存',formid:'demoform', onClick: function (data) {
 console.log(data)
 }
 },
 {btnId: 'aca', text: '重置',formid:'demoform'},
 {btnId: 'bbbb', text: '取消'}
 ],
 form:{
 formId:'demoform',
 columnNum:2,
 formList:[
 {idName:'text11',text:'物料名称',field:'tmBasPlantId',valid:['notEmpty']},
 {idName:'combo53',text:'工厂',comboUrl:'/base/plant/queryPlantSelect',comboData:{parentiD:''},comboId:'tmBasPlantId',comboText:'plant',field:'partNo',valid:[]},
 {idName:'combo56',text:'下拉默认',comboData:[{id:1,text:'2222'}],field:'gfgfg',valid:['notEmpty']},
 {idName:'day22',text:'日期',field:'nameCn',valid:['notEmpty']},
 {idName:'text33',text:'物料编号',field:'code',valid:[{callback: {
 message: '对',
 callback: function(value, validator) {
 return value == 100 || value =='';
 }
 }}
 ]},
 {idName:'text44',text:'物料编号',field:'nameEn',valid:[]},
 {idName:'text88',text:'物料编号',field:'nameCnS',valid:['notEmpty']}
 ],
 defaultTable:defaultTable
 }
 })
*/
Ew.prototype.dialog=function(el,option,callback){
  var _this=this;
  var $el=$('#'+el);
  var width=!option.form?option.width:!option.form.listWidth?(250*option.form.columnNum+65):(option.form.listWidth*option.form.columnNum+65);
  var padding=!option.form? '20px':'15px 45px 25px 15px';
  $el.empty()
//弹出框html
  $el.append(
    '<div class="modal-dialog" style="width:'+width+'px;top:70px;height:auto;">'+
    '<div class="modal-content" style="float: left; width: 100%">'+
    '<div class="modal-header" style="border-bottom: 1px solid #F4F4F4; cursor: move">'+
    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times</button>'+
    '<h4 class="modal-title" id="titleId">'+option.title+'</h4>'+
    '</div>'+
    '<div class="modal-body" style="float: left; padding:'+padding+'">'+
    '</div>'+
    '<div class="modal-footer">'+
    '</div>'+
    '</div>'+
    '</div>');

  _this.drop(el)
  var formData={};
  if(option.form){
    _this.form('#'+el+' .modal-body',option.form);
    formData=option.form.formList
  }

  if(option.content){
    $el.find('.modal-body').append(option.content)
  }
  if(option.onLoadsucess){
    option.onLoadsucess()
  }
  $el.modal("show");
//遍历按钮
  $.each(option.btnValues,function(index,item){
    if(item.text=='取消'){
      item.attrValue={'data-dismiss':'modal'};
      item.classValue = 'btn-default btn-lg';
    }
    else{
      item.classValue = 'btn-lg';
    }

    _this.getBtnhl($el.find('.modal-footer'),item,formData)
  })
  if(callback){
      callback()
  }
}


/*
 *
 *表单form及验证
 *el：为html标签
 *
 *option(参数设置)：
 *@formid 为form表单id
 *@columnNum 为列数
 *@formList 表单条件参数
 *     text：为页面显示的条件名称，
 *     field：为当前条件的字段名称，取决后台需求，
 *     idName：为input的id，input的类型取决于id名包含字段，
 *         包含text，为输入文本框，
 *         包含combo，为下拉框，
 *           下拉数据调用后台方法
 *                comboUrl为接口地址，comboData为接口条件，comboId接口id字段，comboText接口text字段
 *           下拉数据调用本地方法，
 *                comboData：[{id: 1, text: '2222'}],内容为写死的json
 *         包含day为时间控件 年月日
 *      n:为占位的倍数，例如备注需要占2格，所以设为2
 *      valid 为验证条件， 如果有触发验证信息，为数组
 *        notEmpty为必填， 如果为对象直接验证 对象里的信息
 *        {callback: {
             message: '对',
             callback: function(value, validator) {
             return value == 100 || value =='';
            }
          }}
          callback为自定义 验证 message为验证 错误 文字显示 callback为函数 value为框里的值 return 返回条件为false 为错 true为对
          hidden:true 隐藏该行
          defaultValue 默认值
        更多详见 getInputhl
 *
 *
 * */

/*
 Ew.form('#demoadd .modal-body',
 {
 formId:'demoform',
 columnNum:2,
 formList:[
 {idName:'text11',text:'物料名称',field:'wain',valid:['notEmpty']},
 {idName:'combo53',text:'工厂',comboUrl:'/base/plant/queryPlantSelect',comboData:{parentiD:''},comboId:'tmBasPlantId',comboText:'plant',field:'ngng'},
 {idName:'combo56',text:'下拉默认',comboData:[{id:1,text:'2222'}],field:'gfgfg',valid:['notEmpty']},
 {idName:'day22',text:'日期',field:'ccc',valid:['notEmpty']},
 {idName:'text33',text:'物料编号',field:'ddd',valid:[{callback: {
 message: '对',
 callback: function(value, validator) {
 return value == 100 || value =='';
 }
 }}
 ]},
 {idName:'text44',text:'物料编号',field:'eee'},
 {idName:'text55',text:'物料编号',field:'fff'},
 {idName:'text66',text:'物料编号',field:'ggg'},
 {idName:'text77',text:'物料编号',field:'hhh'},
 {idName:'text88',text:'物料编号',field:'iii',valid:['notEmpty']}，
 {idName:'area88',text:'备注',field:'sss',valid:['notEmpty'],n:2}
 ]
 })
 defaultValue为默认值

*/
Ew.prototype.form=function(el,optiondata){
  var optionDefaut={
    listWidth:250,
    listInputWidth:150
  }
  var option=$.extend({},optionDefaut,optiondata);
  var _this=this;
  var $el=$(el);
  var el1 = el.replace(/[\.\#\s+]/g,'').toString();
  $el.append(
  '<form autocomplete="off" id="'+option.formId+'"  class="form-horizontal" style="float: left">' +
   '<ul></ul>'+
  '</form>'
  );
  var $elform=$('#'+option.formId);

  //验证信息汇总
  var validatorsData= {
//        live: 'disabled',
    message: 'This value is not valid',
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    }
  };
  var validatorsFiled={};
  $.each(option.formList,function(index,item){
    var isboth=item.clearBoth?'both':'none';
    var isBlock=$.inArray("notEmpty", item.valid)>=0?'block':'none';
    var liWidth=item.n?item.n*option.listWidth:option.listWidth;
    var inputWidth=item.n?((item.n-1)*option.listWidth+option.listInputWidth):option.listInputWidth;
    var ishidden = item.hidden? 'none': 'block';
    $elform.children('ul').append(
      '<li class="ew_form_list form-group" style="clear:'+isboth+'; width:'+liWidth+'px; display: '+ishidden+'">'+
      '<div class="'+el1+'formInput_'+index+'" style="float: right; width: '+inputWidth+'px; margin-left:10px">'+
       '</div>'+
      '<label class="control-label" style="float: right; line-height: 30px">'+item.text+'</label>' +
      '<i style="float:right;color: red; margin-right: 4px; display:'+isBlock+'">*</i>'+
      '</li>'
    );
    var defaultValue;
    if(item.defaultValue != undefined){
      defaultValue=item.defaultValue;
    }
    if(option.defaultTable && $('#'+option.defaultTable).bootstrapTable('getSelections')[0][item.field]!= undefined){
      if(item.isSearch){
        if(item.searchText){
          defaultValue=[$('#'+option.defaultTable).bootstrapTable('getSelections')[0][item.field],$('#'+option.defaultTable).bootstrapTable('getSelections')[0][item.searchText]]
        }
        else{
          defaultValue=[$('#'+option.defaultTable).bootstrapTable('getSelections')[0][item.field],$('#'+option.defaultTable).bootstrapTable('getSelections')[0][item.comboText]]
        }
      }
      else{
        defaultValue=$('#'+option.defaultTable).bootstrapTable('getSelections')[0][item.field];
      }
    }

    var InputValid=_this.getInputhl((el1+'formInput_'+index),item,option.formId,defaultValue,option.listInputWidth);
    if(InputValid){
      validatorsFiled[item.field]={validators:InputValid};
    }
  });
  $elform.children('ul').css('width',(option.listWidth*(option.columnNum))+'px');
  //验证
  validatorsData.fields=validatorsFiled
  $elform.bootstrapValidator(validatorsData);
};



 //滑动
 Ew.prototype.slide=function(nowBox,type){
 var next=$(nowBox).parent('div').next('div')

 if(type == 'down'){
   if (next.css('display')=='none') {
     next.slideDown(500);
     $(nowBox).css('background','url(../../../img/icons/down_btn.png) no-repeat')
   }else{
     next.slideUp(500);
     $(nowBox).css('background','url(../../../img/icons/up_btn.png) no-repeat');
   }
 }
 else if(type == 'right'){
   if ($(nowBox).parent('div').parent('div').css('margin-left') == '0px') {
     $(nowBox).parent('div').parent('div').animate({'margin-left':'-'+$(nowBox).parent('div').parent('div').width()},'fast',function(){
       $(this).next().css('display','flex')
     });
   }
 }
 else if(type == 'left'){
   if ($(nowBox).parent('div').parent('div').css('margin-right') == '0px') {
     $(nowBox).parent('div').parent('div').animate({'margin-right':'-'+$(nowBox).parent('div').parent('div').width()},'fast',function(){
       $(this).prev().css('display','flex')
     });
   }
 }
 }





/*
 *combo格式化
 *用途：key和value的值 改为id 和text
 *@array 为格式化数组
 *@id 为需要改为id的 字段
 *@text 为需要改为text 的字段
 */
Ew.prototype.getCombodata=function(array,id,text){
  var reslt=array.map(function(value){
    if(id.indexOf(',') > 0){
      return {id: (value[id.split(',')[0]]+','+value[id.split(',')[1]]),text:value[text]}

    }
    else{
      return {id:value[id],text:value[text]}
    }
  });
  return reslt
}
/*
 *ajax函数封装
 *
 *@url 为地址
 *@data 为传的值
 *@medth 类型 默认为post
 *@time 成功弹出框显示的时间 默认5000
 */

Ew.prototype.ewAjax=function(url,data,medth,contentType,showMassage,time){
  var _this=this;
  var def=$.Deferred();
  var isGet= medth==null||undefined||medth== ''|| medth=='POST'?'POST':'GET';
  var contentType=contentType?contentType:'json';
  $.ajax({
    type:isGet,
    data:data,
    //url:"http://10.99.1.222:7778/MES/SFC"+funallX[num].funport,
    url:_this.apiUrl+url,
    dataType:'json',//使用json方式请求
    contentType:"application/"+contentType+";charset=utf-8",
    json:"callback",//jsonp名
    beforeSend:function(XHR){
      if(!showMassage) {
        _this.loadingIn()
      }
    },
    success:function(result){
      if(!showMassage) {
        _this.loadingOut()
      }
      console.log(result);
      if(result.code=='10000'){
        if(!showMassage){
          var timeLayer =  time ? time : 2000;
          _this.layer.msg(result.message,{icon:1,time:timeLayer});
        }
        def.resolve(result.results);
      }
      else
      {
        // _this.layer.msg(result.message, {
        //   icon: 2,
        //   time: 2000
        // });
        _this.layer.alert(result.message, {icon: 2});
      }
    },
    error:function(result){
      alert("请求失败 error!");
      console.log(result);
    }
  });

  return def.promise()
}

/*
 * 数组中找出obj
 *
 *@array 数组
 *@key 想要key的值
 *@value 想要value的值
 * */
Ew.prototype.getObj=function(array,key,value){
  var newObj={};
  array.forEach(function(item,index){
    if(item[value].indexOf('radio')>-1){
      newObj[item[key]]=$('input:radio[name="'+item[key]+'"]:checked').val()
    }
    else if(item[value].indexOf('txt')>-1){
      newObj[item[key]] =  $('#'+item[value]).text()
    }
    else if(item[value].indexOf('checkbox')>-1){
      newObj[item[key]]=$('input:checkbox[name="'+item[key]+'"]').prop('checked') == true?1:0
    }
    else if(item[value].indexOf('iconshow')>-1){
      newObj[item[key]]=$('#' + item[value]).children('i').attr('class').split(' ')[1]
    }
    else if(item.otherValue){
      newObj[item[key]]=$('#'+item[value]).val().split(',')[0]
    }
    else if(item[value].indexOf('file')>-1){
      newObj[item[key]] =  new FormData($('#'+item[value]+'_form')[0])
    }
    else if(item[value].indexOf('combo')>-1){
      if($('#'+item[value]).val() == '请选择' || $('#'+item[value]).val() == ' ' || $('#'+item[value]).val() == ''){
        newObj[item[key]]= null
      }
      else{
        newObj[item[key]]=$('#'+item[value]).val()
      }
    }
    else{
      newObj[item[key]]=$('#'+item[value]).val()
    }
  })
  return newObj
}
/*
 *
 *
 * 获取验证框对象
 *@ 为需要验证的valid里的值 为数组[]
 *
 *   notEmpty: 必填
 *   {callback }为自定义
 *   {type:'string',min:1,max:5} 为字符串限制长度 为1-5个字符
 *   {type:'number',min:1,max:5} 为数字限制长度 为1-5之内
 *
 *
 * */

Ew.prototype.returnValidator=function(validators){
  var Validatordata={};
  $.each(validators,function(index,item){
    if(typeof item=='object'){
      if(item.callback){
        Validatordata=item;
      }
      else{
        if(item.type == 'string'){
          Validatordata['stringLength']={min:item.min};
          Validatordata['stringLength'].max=item.max;
          Validatordata['stringLength'].message='长度必须在'+item.min+'-'+item.max+'之间';
        }
        else if(item.type == 'number'){
          Validatordata['lessThan']={
            value: item.max,
            inclusive: true,
            message: '不能大于'+item.max
          }
          Validatordata['greaterThan']={
            value: item.min,
            inclusive: true,
            message: '不能小于'+item.min
          }
        }
      }
    }
    else{
      switch (item){
        case 'notEmpty': Validatordata.notEmpty={message:'请填写必填项'};
          break;
        case 'number': Validatordata.digits={message:'必须为数字'};
          break;
      }
    }
  })

  return Validatordata
}


/*
 *input的内容 显示
 *
 *@el 为html标签
 *@
 *@formid为 输入表单验证框 表单的id
 *@defaultValue 为默认值
 *@option 为参数值
 *
 *text：为页面显示的条件名称，
 *     field：为当前条件的字段名称，取决后台需求，
 *     idName：为input的id，input的类型取决于id名包含字段，
 *         包含text，为输入文本框，
 *         包含combo，为下拉框，
 *           下拉数据调用后台方法
 *                comboUrl为接口地址，comboData为接口条件，comboId接口id字段，comboText接口text字段 otherValue为需要传入除id和text外第三个参数 保存在id里用逗号隔开 searchText 智能下拉框传值Text与外面表格不一样 所以备用text字段 默认用comboText
 *                comboData: 接口传参数
 *                {
 *                id:['combo51'],//id为取input框的id 为数组 和field组合为 field：$(id).val()
 *               field:['tmBasPlantId'],//field为取传参数的字段 为数组 为数组 和id组合为 field：$(id).val()
 *                other:{} //为另外要传的参数对象
 *                }
 *           下拉数据调用本地方法，
 *                comboData：[{id: 1, text: '2222'}],内容为写死的json
 *         包含day为时间控件 年月日
 *         包含area为多行文本框
 *            format:'year' //年月日 year  年月日时分 fulldate 时分 time 默认year
 *            limit:{date:'day4',type:'setStartDate'} //限制日期比对 date：包含day为要比对input的id 如果没有为默认比对直接写入时间 type：setStartDate为设置开始时间 setEndDate为设置结束时间
 *         包含number 为整数 默认验证0-9999 type:decimals 为小数
 *         包含inputcom 为智能文本框 模糊查询text
 *            其条件和combo类似 不同在
 *            comboData: 接口传参数
 *                {
 *                id:['combo51'],//id为取input框的id 为数组 和field组合为 field：$(id).val()
 *               field:['tmBasPlantId'],//field为取传参数的字段 为数组 为数组 和id组合为 field：$(id).val()
 *                other:{} //为另外要传的参数对象
 *                }
 *         包含radio为单选框
                {idName: 'radio11',
                 text: '单选',
                 field: 'aaaa',
                 rodioData:[{text:'订单',value:'sd'}, //text为单选框名称 value为单选框传的字段
                            {text:'aaa',value:'ds',checked:true}], checked为默认选中
                 onChange:function(val){}, //点击按钮事件 val为他的value
                 valid:['notEmpty']},
           包含checkbox为复选框
               checkboxData:[{text:'订单',checked:true}], //text为单选框名称 checked为默认选中
               onChange:function(val){}, //点击按钮事件 val为他的true false
           包含txt为普通span
           包含iconshow为 图表选择器




 *
 *      valid 为验证条件， 如果有触发验证信息，为数组
 *        notEmpty为必填， 如果为对象直接验证 对象里的信息
 *        {callback: {
 message: '对',
 callback: function(value, validator) {
 return value == 100 || value =='';
 }
 }}
 callback为自定义 验证 message为验证 错误 文字显示 callback为函数 value为框里的值 return 返回条件为false 为错 true为对

 更多验证 详见 returnValidator
 *
 *
 *
 *
 *
 *
 *
 *
 */
/*
 {idName:'text11',text:'物料名称',field:'wain',valid:['notEmpty']},
 {idName:'combo53',text:'工厂',comboUrl:'/base/plant/queryPlantSelect',comboData:{parentiD:''},comboId:'tmBasPlantId',comboText:'plant',field:'ngng'},
 {idName:'combo56',text:'下拉默认',comboData:[{id:1,text:'2222'}],field:'gfgfg',valid:['notEmpty']},
 {idName:'day22',text:'日期',field:'ccc',valid:['notEmpty']},
 {idName:'text33',text:'物料编号',field:'ddd',valid:[{callback: {
 message: '对',
 callback: function(value, validator) {
 return value == 100 || value =='';
 }
 }}
 ]},
 {idName:'text88',text:'物料编号',field:'iii',valid:['notEmpty']}



 */
Ew.prototype.getInputhl=function(el,option,formid,defaultValue,widthInput){
  var defaultVal=defaultValue != undefined?defaultValue:'';
  var _this=this;
  var disabled=option.disabled?true:false;
  var readonly=option.readonly?true:false;
  if(option.idName.indexOf('text')>-1){
    $('.'+el).append(
      '<input id="'+option.idName+'" type="text" class="form-control"  name="'+option.field+'" value='+defaultVal+' >'
    )
    $('#'+option.idName).keyup(function(e){
      var theEvent = window.event || e;
      var code = theEvent.keyCode || theEvent.which;
      if(option.text.indexOf('编号')>-1 || option.text.indexOf('编码')>-1){
        if(!option.symbolLimit){
          this.value=this.value.replace(/[^a-zA-Z0-9\-\_\/\\]/g,'')
        }
      }
      if(option.symbolLimitYES){
        this.value=this.value.replace(/[^a-zA-Z0-9\-\_\/\\]/g,'')
      }
      if(option.keyTrue){
        if(code ==13){
          option.keyTrue(this.value)
        }
      }
    })
    $('#'+option.idName).click(function(){
      if(option.onClick){
        option.onClick()
      }
    })
    if(option.onLoadsuccess){
      option.onLoadsuccess()
    }

    if(disabled){
      $('#'+option.idName).attr('disabled','disabled')
    }
    if(readonly){
      $('#'+option.idName).attr('readonly','disabled')
    }
    if(option.valid){
      return _this.returnValidator(option.valid)
    }
  }
  else if(option.idName.indexOf('number')>-1){
    $('.'+el).append(
      '<input id="'+option.idName+'" class="form-control" name="'+option.field+'" value='+defaultVal+'>'
    )
    $('#'+option.idName).keydown(function(e){
      var theEvent = window.event || e;
      var code = theEvent.keyCode || theEvent.which;
      if(option.type == 'decimals'){
        if ( !(((code >= 48) && (code <= 57)) || code == 8 || code == 190 || code == 110 || (((code >= 96) && (code <= 105)))))
        {
          return false
        }
      }
      else{
        if ( !(((code >= 48) && (code <= 57)) || code == 8 || (((code >= 96) && (code <= 105)))))
        {
          return false
        }
      }
    })
    $('#'+option.idName).keyup(function(e){
      if(option.onKeyup){
        option.onKeyup(this.value)
      }
      this.value=this.value.replace(/[^\d\.]/g,'')
      var Validatordata= $("#"+formid).data('bootstrapValidator');
      Validatordata.updateStatus(option.field, 'NOT_VALIDATED').validateField(option.field)
    })
    $('#'+option.idName).change(function(e){
      this.value=this.value.replace(/[^\d\.]/g,'')
      var Validatordata= $("#"+formid).data('bootstrapValidator');
      Validatordata.updateStatus(option.field, 'NOT_VALIDATED').validateField(option.field)
    })
    if(disabled){
      $('#'+option.idName).prop('disabled',true)
    }
    if(option.valid){
      var isValnumber=0;
      $.each(option.valid,function(index111,item111){
        if(typeof item111 == 'object' && item111.type== 'number'){
          isValnumber=1
        }
      })
      if(isValnumber == 1){
        return _this.returnValidator(option.valid)
      }
      else if(isValnumber == 0){
        var optVal=option.valid
        optVal.push({type:'number',min:0,max:99999});
        return _this.returnValidator(optVal)
      }
    }
    else{
      return _this.returnValidator([{type:'number',min:0,max:99999}])
    }
  }
  else if(option.idName.indexOf('area')>-1){
    $('.'+el).append(
      '<textarea style="resize: none" id="'+option.idName+'"  class="form-control" name="'+option.field+'" rows="3" data-bv-stringlength data-bv-stringlength-max="100" data-bv-stringlength-message="不能超过100字"></textarea>'
    )
    $('#'+option.idName).val(defaultVal)
    if(disabled){
      $('#'+option.idName).attr('disabled','disabled')
    }
    if(option.valid){
      return _this.returnValidator(option.valid)
    }
  }
  else if(option.idName.indexOf('combo')>-1){
    var multiple = option.multiple ? true :false;
    $('.'+el).append(
      '<select id="'+option.idName+'" style="width: 100%" name="'+option.field+'">' +
       '<option value="">请选择</option>' +
      '</select>'
    );
    var minimumResultsForSearch=option.isSearch?0:-1;
    var methodCombo=option.method?option.method:'POST';
    if(option.comboUrl){
      if(minimumResultsForSearch==-1){
        var contentTypeX = option.contentType?'x-www-form-urlencoded':''
        var re = {};
        if(option.comboData){
          if(option.comboData.id){
            $.each(option.comboData.id,function(index11,item11){
              re[option.comboData.field[index11]] = $('#'+item11).val();
            })
          }
          else{
            re = option.comboData
          }
          if(option.comboData.other){
            re = $.extend({},re,option.comboData.other)
          }
        }

        $.when(_this.ewAjax(option.comboUrl,re,methodCombo,contentTypeX,true)).done(function(results){
          var comData = option.otherValue ? _this.getCombodata(results,option.comboId+ ',' +option.otherValue,option.comboText) : _this.getCombodata(results,option.comboId,option.comboText);
          $("#"+option.idName).select2({
            multiple: multiple,//是否多選
            minimumResultsForSearch: minimumResultsForSearch,//去掉搜索框
            data:comData,
            disabled:disabled
          });
          // comData.forEach(function(itCom){
          //   $("#"+option.idName).append('<option value="'+itCom.id+'">'+itCom.text+'</option>')
          // })
          if(defaultVal){
            $("#"+option.idName).select2('val',[defaultVal]);
          }
        })
      }
      else if(minimumResultsForSearch==0){
        var contentTypeX = option.contentType?'application/json':'application/x-www-form-urlencoded'
        $("#"+option.idName).select2({
          minimumInputLength:1,
          disabled:disabled,
          ajax: {
            url:_this.apiUrl+option.comboUrl ,
            type:methodCombo,
            dataType: 'json',
            contentType:contentTypeX,
            cache: true,
            quietMillis: 100,
            data: function (params) {
            	var re = {};
            	if(option.comboData){
            	  if(option.comboData.id){
                  $.each(option.comboData.id,function(index11,item11){
                    re[option.comboData.field[index11]] = $('#'+item11).val();
                  })
                }
                else{
                  re = option.comboData
                }
            		if(option.comboData.other){
                  re = $.extend({},re,option.comboData.other)
            		}
            	}
            	re['name']=params.term;
            	if(option.contentType){
            	  return JSON.stringify(re)
              }
              else{
                return re;
              }
            },
            processResults: function (data, page) { // parse the results into the format expected by Select2.1
              // since we are using custom formatting functions we do not need to alter the remote JSON data
              var resultsdata
              if(option.otherValue){
                resultsdata = _this.getCombodata(data.results,option.comboId+ ',' +option.otherValue,option.comboText);
                resultsdata.unshift({id:' ',text:'请选择'});
              }
              else{
                resultsdata = _this.getCombodata(data.results,option.comboId,option.comboText);
                resultsdata.unshift({id:' ',text:'请选择'});
              }

              return { results: resultsdata };
            },
            templateResult: formatRepoProvince, // omitted for brevity, see the source of this page
          }
        });
        if(defaultVal!= undefined && defaultVal != ''){
         $('#'+option.idName).empty();
         if(defaultVal[1]){
           $('#'+option.idName).append('<option value="'+defaultVal[0]+'">'+defaultVal[1]+'</option>');
           $('#'+option.idName).append('<option value="">请选择</option>')
         }
         else{
           $('#'+option.idName).append('<option value="">请选择</option>')
         }
        }
      }
    }
    else{
      $("#"+option.idName).select2({
        multiple: false,//是否多選
        minimumResultsForSearch: minimumResultsForSearch,//去掉搜索框
        data: option.comboData,
        disabled:disabled
      });
      $("#"+option.idName).select2('val',[defaultVal])
    }
    if(option.onClick){
      $("#"+option.idName).on("select2:select", function (e) {
        option.onClick($("#"+option.idName).select2("data")[0])
      });
    }
    if(option.valid){
      return _this.returnValidator(option.valid)
    }
  }
  else if(option.idName.indexOf('day')>-1){
    $('.'+el).append(
      '<input type="text" class="form-datapicker form-control" name="'+option.field+'" placeholder="请选择日期" style="width: 100%" id="'+option.idName+'" value="'+defaultVal+'" readonly>'
    );
    var minDate = option.minDate ? option.minDate :'1900-1-1'
    var typedate = option.format == "fulldate"? "YYYY-MM-DD hh:mm:ss":option.format == "time"? "hh:mm:ss" : 'YYYY-MM-DD';
    var vaild = option.valid?option.valid:[]

      $("#"+option.idName).jeDate({
        //festival:true,
        minDate: minDate,
        ishmsVal:true,
        format:typedate,
        zIndex:3000,
        choosefun:function(elem, val, date) {
          if(formid){
            var Validatordata= $("#"+formid).data('bootstrapValidator');
            Validatordata.updateStatus(option.field, 'NOT_VALIDATED').validateField(option.field);
            if(option.limit){
              Validatordata.updateStatus(option.limit.otherField, 'NOT_VALIDATED').validateField(option.limit.otherField);
            }
          }
          if(option.onClick){
            option.onClick(val)
          }
        },
        clearfun:function(elem, val) {
          if(formid){
            var Validatordata= $("#"+formid).data('bootstrapValidator');
            Validatordata.updateStatus(option.field, 'NOT_VALIDATED').validateField(option.field);
            if(option.limit){
              Validatordata.updateStatus(option.limit.otherField, 'NOT_VALIDATED').validateField(option.limit.otherField);
            }
          }
          if(option.onClick){
            option.onClick(val)
          }
        },
        okfun:function(elem, val, date) {
          if(formid){

            var Validatordata= $("#"+formid).data('bootstrapValidator');
            Validatordata.updateStatus(option.field, 'NOT_VALIDATED').validateField(option.field);
            if(option.limit){
              Validatordata.updateStatus(option.limit.otherField, 'NOT_VALIDATED').validateField(option.limit.otherField);
            }
          }
          if(option.onClick){
            option.onClick(val)
          }
        },
      })
    if(formid){
      if(option.limit){
        var masseage = option.limit.type == 'setStartDate'? '开始时间应该小于结束时间':'结束时间应该大于开始时间';
        vaild.unshift(
          {callback: {
            message: masseage,
            callback: function(value, validator) {
              var date2 = $("#" + option.idName).val();
              var date1 = $('#'+option.limit.date).val();
              if(option.limit.type == 'setStartDate'){
                if(option.format == 'time'){
                  return _this.checkData(date2,date1,true);
                }
                else{
                  return _this.checkData(date2,date1);
                }
              }
              else{
                if(option.format == 'time'){
                  return _this.checkData(date1,date2,true);
                }
                else{
                  return _this.checkData(date1,date2);
                }
              }
            }
          }}
        )
      }
    }
    if(vaild){
      console.log(vaild)
      return _this.returnValidator(vaild);
    }
  }
  else if(option.idName.indexOf('switch')>-1){
    var swValue=defaultVal === ''?true:defaultVal==1?true:false;
    var inputValue=defaultVal === ''?1:defaultVal;
    $('.'+el).append(
    '<input id="'+option.idName+'" name="'+option.field+'" type="checkbox" data-size="small">'
    );
    $('#'+option.idName).val(inputValue)
    $('#'+option.idName).bootstrapSwitch({
      onText:option.ontext,
      offText:option.offtext,
      onColor:"success",
      offColor:"info",
      state:swValue,
      onSwitchChange:function(event,state){
        if(state==true){
          $('#'+option.idName).val(1)
        }
        else{
          $('#'+option.idName).val(0)
        }
        if(option.onChange){
          option.onChange(state)
        }
      }
    });
    $('#'+option.idName).parents('.bootstrap-switch').css('margin-top','6px');
    $('#'+option.idName).bootstrapSwitch('disabled',disabled)
    if(option.valid){
      return _this.returnValidator(option.valid)
    }
  }
  else if (option.idName.indexOf('inputCom')>-1) {
    var contentTypeX = option.contentType?'json':'x-www-form-urlencoded'
    var methodCombo=option.method?option.method:'POST';
    $('.'+el).append(
      '<div class="inputCom" style="width: 100%; position: relative">' +
      '<input class="form-control" id="'+option.idName+'" name="'+option.field+'" />' +
      '<ul class="select2-dropdown select2-dropdown--below" style="left: 0; display: none; border-radius: 0 0 4px 4px; border-top:none; overflow: auto"></ul>' +
      '</div>'
    );
    $('#'+option.idName).on('keyup',function(e){
      var comboData = {};
      comboData.name = $(this).val();
      if(option.comboData){
        $.each(option.comboData.id,function(index6, item6){
          comboData[option.comboData.field[index6]] = $('#'+item6).val()
        })
        if(option.comboData.other){
          comboData = $.extend({},comboData,option.comboData.other)
        }
      }
      if(option.contentType){
        comboData = JSON.stringify(comboData)
      }
      $(this).css('border-radius','4px 4px 0 0')
      $(this).next('ul').css('display','block')
      $.when(_this.ewAjax(option.comboUrl,comboData,methodCombo,contentTypeX,true)).done(function(results){
        $('#'+option.idName).next('.select2-dropdown').empty();
        $.each(results,function(index5,item5){
          $('#'+option.idName).next('.select2-dropdown').append(
            '<li class="select2-results__option" style="cursor: pointer">'+item5[option.comboText]+'</li>'
          );
        });
        if(results.length>6){
          $('#'+option.idName).next('ul').css('height','200px')
        }
        else{
          $('#'+option.idName).next('ul').css('height','auto')
        }
        $('#'+option.idName).next('.select2-dropdown').children('li').mouseover(function(){
          $(this).addClass('highlighted');
          $(this).siblings('li').removeClass('highlighted')
        });
        $('#'+option.idName).next('.select2-dropdown').children('li').on('mousedown',function(){
          $(this).parent('ul').prev('input').val($(this).text());
          if(option.onClick){
            option.onClick($(this).text())
          }
        });
        if(option.onSuccess){
          option.onSuccess(results)
        }
      });
      if(option.onKeydown){
        option.onKeydown($('#'+option.idName).val())
      }
      if(option.keyTrue){
        var theEvent = window.event || e;
        var code = theEvent.keyCode || theEvent.which;
        if(code ==13){
          option.keyTrue(this.value)
        }
      }
    });
    $('#'+option.idName).on('blur',function(){
      $(this).next('ul').css('display','none')
      $(this).css('border-radius','4px')
    })
  }
  else if(option.idName.indexOf('radio')>-1){
    $('.'+el).append(
      '<div class="form-group"></div>'
    )
    $.each(option.rodioData,function(indexra,itemra){
      if(defaultVal == ''){
        if(itemra.checked){
          $('.'+el).children('.form-group').append(
            '<div class="radio radio-primary" style="float: left; margin-right:5px">' +
              '<input id="'+option.idName+indexra+'" type="radio" name="'+option.field+'" value="'+itemra.value+'" checked />'+
              '<label for="'+option.idName+indexra+'">'+itemra.text+'</label>'+
            '</div>'
          )
        }
        else{
          $('.'+el).children('.form-group').append(
            '<div class="radio radio-primary" style="float: left; margin-right:5px">' +
            '<input id="'+option.idName+indexra+'" type="radio" name="'+option.field+'" value="'+itemra.value+'" />'+
            '<label for="'+option.idName+indexra+'">'+itemra.text+'</label>'+
            '</div>'
          )
        }
      }
      else{
        if(defaultVal == itemra.value) {
          $('.' + el).children('.form-group').append(
            '<div class="radio radio-primary" style="float: left; margin-right:5px">' +
            '<input id="'+option.idName+indexra+'" type="radio" name="'+option.field+'" value="'+itemra.value+'" checked />'+
            '<label for="'+option.idName+indexra+'">'+itemra.text+'</label>'+
            '</div>'
            )
          }
          else{
            $('.'+el).children('.form-group').append(
              '<div class="radio radio-primary" style="float: left; margin-right:5px">' +
              '<input id="'+option.idName+indexra+'" type="radio" name="'+option.field+'" value="'+itemra.value+'" />'+
              '<label for="'+option.idName+indexra+'">'+itemra.text+'</label>'+
              '</div>'
            )
          }
        }
      $('input:radio[name="'+option.field+'"]').on('change',function(){
        if(option.onChange){
          option.onChange($(this).val())
        }
      })
    })
    if(option.valid){
      return _this.returnValidator(option.valid)
    }
  }
  else if(option.idName.indexOf('checkbox')>-1){
    $('.'+el).append(
      '<div class="form-group"></div>'
    )
    $.each(option.checkboxData,function(indexra,itemra){
      if(defaultVal === ''){
        if(itemra.checked){
          $('.'+el).children('.form-group').append(
            '<div class="checkbox checkbox-primary">'+
            '<input id="'+option.idName+indexra+'" type="checkbox" name="'+option.field+'"  checked />'+
            '<label for="'+option.idName+indexra+'">'+itemra.text+'</label>' +
            '</div>'
          )
        }
        else{
          $('.'+el).children('.form-group').append(
            '<div class="checkbox checkbox-primary">'+
            '<input id="'+option.idName+indexra+'" type="checkbox" name="'+option.field+'"   />'+
            '<label for="'+option.idName+indexra+'">'+itemra.text+'</label>' +
            '</div>'
          )
        }
      }
      else{
        if(defaultVal === 1) {
          $('.' + el).children('.form-group').append(
            '<div class="checkbox checkbox-primary">'+
            '<input id="'+option.idName+indexra+'" type="checkbox" name="'+option.field+'"  checked />'+
            '<label for="'+option.idName+indexra+'">'+itemra.text+'</label>' +
            '</div>'
          )
        }
        else if(defaultVal === 0){
          $('.'+el).children('.form-group').append(
            '<div class="checkbox checkbox-primary">'+
            '<input id="'+option.idName+indexra+'" type="checkbox" name="'+option.field+'"   />'+
            '<label for="'+option.idName+indexra+'">'+itemra.text+'</label>' +
            '</div>'
          )
        }
      }
      $('input:checkbox[name="'+option.field+'"]').on('change',function(){
        if(option.onChange){
          option.onChange($(this).prop('checked'),option.field,option.text)
        }
      })
    })
    if(option.valid){
      return _this.returnValidator(option.valid)
    }
  }
  else if(option.idName.indexOf('iconshow')>-1){
    $('.'+el).append(
      '<button style="width: 100%"  class="btn btn-default" role="iconpicker" data-iconset="fontawesome" data-icon="" name="resourceIco" id="'+option.idName+'"></button>'
    )
    $('#'+option.idName).iconpicker({
      align: 'center', // Only in div tag
      arrowClass: 'btn-danger',
      arrowPrevIconClass: 'glyphicon glyphicon-chevron-left',
      arrowNextIconClass: 'glyphicon glyphicon-chevron-right',
      cols: 5,
      footer: true,
      header: true,
      icon: defaultVal?defaultVal:'fa-adjust',
      iconset: 'fontawesome',
      labelHeader: '第{0}页 共{1}页',
      labelFooter: '第{0} - {1}个 共 {2} 个',
      placement: 'bottom', // Only in button tag
      rows: 5,
      search: true,
      searchText: 'Search',
      selectedClass: 'btn-success',
      unselectedClass: ''
    });
    if(option.valid){
      return _this.returnValidator(option.valid)
    }
  }
  else if(option.idName.indexOf('file')>-1){
    $('.'+el).append('<input id="'+option.idName+'_input" name="file" type="file" />');
    //<button id="'+option.idName+'_btn" class="btn btn-primary">浏览</button><span></span>
    if(option.valid){
      return _this.returnValidator(option.valid)
    }
  }
  else if(option.idName.indexOf('txt')>-1){
    $('.'+el).append('<span id="'+option.idName+'"  style="line-height:30px; width: 100%; height:30px;float: left"></span>');
    $('#'+option.idName).text(defaultVal)
  }
}

//开关按钮
Ew.prototype.switchHl=function(val,className,id, isdisabled){
  var swhtml='';
  var isdisabled = isdisabled? 'disabled':''
  if (val == 0) {
    swhtml='<div><input class="'+className+'"   type="checkbox" data-size="small" fieldValue="'+id+'"'+isdisabled+' ></div>'
  }
  else if (val ==1) {
    swhtml='<div><input class="'+className+'" checked  type="checkbox" data-size="small" fieldValue="'+id+'"'+isdisabled+'></div>'
  }
  return swhtml
}

//select2重置下拉框
Ew.prototype.comboData=function(idarray,dataarray){
  $.each(idarray,function(index,item){
      $('#'+item).empty();
      $('#'+item).append('<option value="">请选择</option>')
    if(index==0){
      $.each(dataarray,function(index1,item1){
        $('#'+item).append('<option value="'+item1.id+'">'+item1.text+'</option>')
      })
    }
  })
}

function formatRepoProvince(state){
  console.log(state);
  return '<div></div>'
}
//select联动点击事件

/*
*@method 为ajax传递类型 默认post
*@comboUrl 下拉框的ajax url
*@comboData 为下拉框ajax的参数
*@id 为数组 第一个值为下拉传入的联动数据的id 后面为自动清空的id
*@comboId 为id名
*@comboText 为text名
*
* */

/*
 Ew.selectLink({
 comboUrl:'',
 comboData:{},
 id:[],
 comboId:'',
 comboText:''
 })


*/
Ew.prototype.selectLink=function(option){
  var methodCombo=option.method?option.method:'POST';
  var _this=this;
  $.when(_this.ewAjax(option.comboUrl,option.comboData,methodCombo,'',true)).done(function(results){
    _this.comboData(option.id,_this.getCombodata(results,option.comboId,option.comboText));
    if(results.length == 1){
      $('#' + option.id).select2('val',[results[0][option.comboId]])
    }
    if(option.onSuccess){
      option.onSuccess(results)
    }
  })
}



/*
* 树加载 需要加载Z-TREE
*
*
*
*
*
*
*
*
*/
/*
Ew.tree({
    id:'treeMenu',//放入树的id
    data:{pageIndex:"-1"},//传ajax的值
    url:'/system/resource/query',//url
    type:'radio', //radio单选  checkbox为多选
    root:{ //为需要新增的根节点 不需要就没有root
     id:'0',
     pId:'-1',
     name:'菜单',
     open:true,
     level:0
     },
    treeField:['tsSysResourceId','parentId','name','level'],//tsSysResourceId为id名 parentId父节点id名 name名称 level等级

})
*/

Ew.prototype.tree = function(option){
  var _this = this;
  $.when(_this.ewAjax(option.url,JSON.stringify(option.data),'','',true)).done(function(results){
    var menus=[];
    if(option.root){
      menus.push(option.root)
    }
    $.each(results,function(index,item){
      menus.push({
        id:item[option.treeField[0]],
        pId:item[option.treeField[1]] ?item[option.treeField[1]]:'0',
        name:item[option.treeField[2]],
        level:item[option.treeField[3]]
      });
    });
    $.fn.zTree.init($("#"+option.id), {
      check: {
        enable: true,
        chkStyle:option.type,
        radioType: "all"
      },
      view: {
        dblClickExpand: false
      },
      data: {
        simpleData: {
          enable: true
        }
      },
      callback: {
        onClick: function (e, treeId, treeNode) {
          var zTree = $.fn.zTree.getZTreeObj(option.id);
          zTree.checkNode(treeNode, !treeNode.checked, null, true);
          return false;
        },
        onCheck: function (e, treeId, treeNode) {
          if(option.onCheck){
            option.onCheck(treeNode)
          }
        }
      }
    }, menus);
  })
}


/**
文件夹树
**/

var folders = [];//存放所有查询出来的文件原始数据
Ew.prototype.treefolders = function(option){
  var _this = this;
   $.when(_this.ewAjax(option.url,JSON.stringify(option.data),'','',true)).done(function(results){
     folders.push(results);
    var menus=[];
    if(option.root){
      menus.push(option.root)
    }
    $.each(results,function(index,item){
        if(item.dir==1){
         menus.push({
          id:item[option.treeField[0]],
          pId:item[option.treeField[1]] ?item[option.treeField[1]]:'0',
          name:item[option.treeField[2]],
          level:item[option.treeField[3]],
          catalog:item[option.treeField[4]]
        });
     }



    });
    $.fn.zTree.init($("#"+option.id), {
      check: {
        enable: true,
        chkStyle:option.type,
        radioType: "all"
      },
      view: {
        dblClickExpand: false
      },
      data: {
        simpleData: {
          enable: true
        }
      },
      callback: {
        onClick: function (e, treeId, treeNode) {
          var zTree = $.fn.zTree.getZTreeObj(option.id);
          zTree.checkNode(treeNode, !treeNode.checked, null, true);
          return false;
        },
        onCheck: function (e, treeId, treeNode) {
          if(option.onCheck){
            option.onCheck(treeNode)
          }
        }
      }
    }, menus);
  })
}



//获取当前时间 type 默认为空年月日 date1默认当前日期 add默认0小时 支持负数
Ew.prototype.getNowday=function(type,date1,add){
  var date = date1? new Date(date1):new Date();

  if(add){
    date = date.valueOf()
    date = date + add *  60 * 60 * 1000
    date = new Date(date);
  }

  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var strHour = date.getHours();
  if (strHour >= 0 && strHour <= 9) {
    strHour = "0" + strHour;
  }
  var strMint = date.getMinutes();
  if (strMint >= 0 && strMint <= 9) {
    strMint = "0" + strMint;
  }
  var send = date.getSeconds();
  if (send >= 0 && send <= 9) {
    send = "0" + send;
  }
  var currentdate
  if(!type){
     currentdate = year + seperator1 + month + seperator1 + strDate
  }
  if(type == 'fulldate'){
     currentdate = year + seperator1 + month + seperator1 + strDate +' '+strHour+':'+strMint+':'+send;
  }
  return currentdate;
}





//动态验证 state状态：true false formid：表单id array验证项[{field:字段，idName：id名称}]
Ew.prototype.dynvalid=function(state,formid,array){
  $.each(array,function(index, item){
    $('#'+formid).data('bootstrapValidator').enableFieldValidators(item.field, state);
    if(state == false){
      $('#'+item.idName).parent('div').siblings('i').css('display','none')
    }
    else{
      $('#'+item.idName).parent('div').siblings('i').css('display','block')
    }
  })
}

//拖拽
Ew.prototype.drop=function(el){
  var _this=this;
  var box=$('#'+el).children('.modal-dialog')
  var title=$('#'+el).find('.modal-header');
  title.mousedown(function(e,nowbox){
    var e=e||event;
    _this.dragDrop.disX = e.clientX - box.offset().left
    _this.dragDrop.disY = e.clientY - box.offset().top
    _this.dragDrop.isdragDrop = true;
  })
  $('body').mousemove(function(e){
    var e=e||event;
    if(_this.dragDrop.isdragDrop == true){
      var moveX=e.clientX-_this.dragDrop.disX
      var moveY=e.clientY-_this.dragDrop.disY-70
      if(moveX<=0){
        moveX=1
      }
      if(moveY<=-70){
        moveY=-70
      }
      if(moveX>=$('body').width()-box.width()){
        moveX = $('body').width()-box.width()-1
      }
      if(moveY>=$('#'+el).height()-box.find('.modal-content').height()-73){
        moveY = $('#'+el).height()-box.find('.modal-content').height()-73
      }
      box.css('marginLeft',(moveX+'px'));
      box.css('marginTop',(moveY+'px'));
    }
  })
  $('body').mouseup(function(e){
    _this.dragDrop.isdragDrop = false;
  })
}

//初始化加载
Ew.prototype.init = function(){
  var _this = this;
  window.onload = window.resize = function(){$("body").css("width", $(window).width()); };
  window.onresize = function(){$("body").css("width", $(window).width()); }
  $('body').append('<div id="setPage" style="position: absolute; right: 43px; top:-70px; padding: 10px">' +
                  '<ul>' +
                  '<li id="reload" >刷 新</li>' +
                  '<li id="setWeizhi" style="border-radius: 0 0 4px 4px"" >上 下</li>' +
                  '</ul>' +
                  '<div id="setPagebtn" style="margin:auto;width: 40px; height: 18px; text-align: center;background-color: #2f7bbc; color: #fff; border-radius: 0 0 4px 4px; font-size: 12px">设置</div>' +
                  '</div>')
  $('#reload').click(function(){
    window.location.reload([true])
  })

  $('#setWeizhi').click(function(){
    if($(this).text() == '左右'){
      $(this).text('上下');
      if(_this.settableId.length >= 2){
        var $el = $(_this.settableId[0])
        var $el1 = $(_this.settableId[1])
        $el1.find('.panel-heading').css('display','none')

        // $el.animate({'float':'left','width':'49.5%'},'fast',function(){
        //   $('#' + _this.tableflag[0]).bootstrapTable('resetHeader');
        // });
        // $el1.animate({'float':'rigth','width':'49.5%'},'fast',function(){
        //   $('#' + _this.tableflag[1]).bootstrapTable('resetHeader');
        // });
        $el.css({'float':'left','width':$el.attr('table_width')});
        $el1.css({'float':'right','width':$el1.attr('table_width')});
        $('#' + _this.tableflag[0]).bootstrapTable('resetHeader');
        $('#' + _this.tableflag[1]).bootstrapTable('resetHeader');
        if($el1.height() < 60){
          $el1.find('.closeBtn').click()
        }
      }
    }
    else{
      $(this).text('左右');
      if(_this.settableId.length >= 2){
        var $el = $( _this.settableId[0])
        var $el1 = $(_this.settableId[1])
        $el1.find('.panel-heading').css('display','block');
        // $el.animate({'width':'100%'},'fast',function(){
        //   $('#' + _this.tableflag[0]).bootstrapTable('resetHeader');
        // });
        // $el1.animate({'width':'100%'},'fast',function(){
        //   $('#' + _this.tableflag[1]).bootstrapTable('resetHeader');
        // });
        $elwidth = Math.round(parseInt($el.css('width'))/parseInt($el.parent().css('width'))*100);
        $el.attr('table_width',$elwidth + '%');
        $el1.attr('table_width',99 - $elwidth + '%');
        $el.css('width','100%');
        $el1.css('width','100%');
        $('#' + _this.tableflag[0]).bootstrapTable('resetHeader');
        $('#' + _this.tableflag[1]).bootstrapTable('resetHeader');
        //$el1.find('.closeBtn').click()
      }
    }
  })

  $('#setPage').mouseenter(function(){
    $(this).animate({'top':'-10px'},500)
  })
  $('#setPage').mouseleave(function(){
    $(this).animate({'top':'-70px'},'fast')
  })


  var child = '<div id="floatingBarsG">'+
    '<div id="loadingIcon">X</div>'+
    '<div class="blockG" id="rotateG_01"></div>'+
    '<div class="blockG" id="rotateG_02"></div>'+
    '<div class="blockG" id="rotateG_03"></div>'+
    '<div class="blockG" id="rotateG_04"></div>'+
    '<div class="blockG" id="rotateG_05"></div>'+
    '<div class="blockG" id="rotateG_06"></div>'+
    '<div class="blockG" id="rotateG_07"></div>'+
    '<div class="blockG" id="rotateG_08"></div>'+
    '<div id="loadingText">正在加载，请稍候...</div>'+
    '</div>'+
    '<div id="loadingBg"></div>';
     var parent = $('body');
     parent.append(child);//把child放到body标签中
    $("#loadingIcon").click(function () {
      $("#floatingBarsG").hide();
      $("#loadingBg").hide();
    })
}


//加载中 调用ajax出现
Ew.prototype.loadingIn = function() {
  this.ajaxTimes++;
  $("#floatingBarsG").show();
  $("#loadingBg").show();

}

//加载中 成功后 隐藏
Ew.prototype.loadingOut = function() {
  this.ajaxTimes--;
  if(this.ajaxTimes == 0){
    $("#floatingBarsG").hide();
    $("#loadingBg").hide();
  }
}

//获取权限按钮
/*
* callback(re)回调函数 re为按钮id 数组
*
* */
Ew.prototype.getBtnPower = function(callback){
  var path = window.document.location.pathname;
  var aaa = $.when(Ew.ewAjax('/system/user/getBtn', path.substring(path.lastIndexOf("/")+1),'','',true)).done(function (results) {
    var re = results.map(function(item){
      return item.url
    })
    if(callback){
      callback(re)
    }
  });
}


//判断时间大小
Ew.prototype.checkData = function(startDate,endDate,type){
  if(!type) {
    if(startDate == ''|| endDate == ''){
      return true
    }
    var tempStartDate = new Date(startDate.replace(/-/g, "/"));
    var tempEndDate = new Date(endDate.replace(/-/g, "/"));
    if ((tempStartDate > tempEndDate) == true) {
      return false
    }
  }
  else{
    if(startDate == ''|| endDate == ''){
      return true
    }

    var tempStartDate =new Date('2017/02/02 '+startDate);
    var tempEndDate = new Date('2017/02/02 '+endDate);
    if ((tempStartDate > tempEndDate) == true) {
      return false
    }
    // var tempStartDate=startDate.substr(0,2);
    // var tempEndDate =endDate.substr(0,2);
    // if(tempEndDate<tempStartDate){
    //   return false
    // }
    // else if(tempEndDate==tempStartDate){
    //   if(parseInt(endDate.substr(3))<parseInt(startDate.substr(3))){
    //     return false
    //   }
    // }
  }
  return true;
}

//获取数据字典内容
Ew.prototype.getDictVal = function(typeArr,callback){
  var _this = this;
  $.when(_this.ewAjax('/system/codeList/getTypeValus',JSON.stringify(typeArr),'','',true)).done(function(results){
    var re = {};
    for(var i in results){
      var nwre = {};
      results[i].forEach(function(item){
        nwre[item.no] =  item.no + "-" + item.name
      })
      re[i] = nwre
  }
    if(callback){
      callback(re)
    }
  })
}







var Ew= new Ew()

//根据日期返回星期
function DayToWeek(day){
	var array= new Array();
	array=day.split('-');     //日期为输入日期，格式为 2013-3-10
    var date=new Date(array[0],parseInt(array[1]-1),array[2]);
    var weekArray = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
    var week = weekArray[date.getDay()];
    return week;
}

//获取数据字典下拉列表
function getDictionary(type,sel) {
	var sel = $('#'+sel);
	$.ajax({
        type: 'POST',
        contentType: "application/json; charset=gbk",
        dataType: 'json',
        async: false,
        url:  apiUrl+'/system/codeList/getSelect',
        data: type,
        success: function (res) {
        	sel.empty();
        	sel.append("<option value=''></option>");//默认值
        	for(var i=0; i<res.results.length; i++){
        		sel.append("<option value='"+res.results[i].no +"'>"+res.results[i].name +"</option>");
        	}
        }
    });
}

(function($){

  function initialize($obj, support, title, text){

    var panel = "<span>"+ title +"</span>"
      + "<p> "+ text +"</p>"
      + "<div class='browser'>"
      + "<ul>"
      + "<li><a class='chrome' href='https://www.google.com/chrome/' target='_blank'></a></li>"
      + "<li><a class='firefox' href='http://www.mozilla.org/en-US/firefox/new/' target='_blank'></a></li>"
      + "<li><a class='ie9' href='http://windows.microsoft.com/en-US/internet-explorer/downloads/ie/' target='_blank'></a></li>"
      + "<li><a class='safari' href='http://www.apple.com/safari/download/' target='_blank'></a></li>"
      + "<li><a class='opera' href='http://www.opera.com/download/' target='_blank'></a></li>"
      + "<ul>"
      + "</div>";

    var overlay = $("<div id='ie-alert-overlay'></div>");
    var iepanel = $("<div id='ie-alert-panel'>"+ panel +"</div>");

    var docHeight = $(document).height();

    overlay.css("height", docHeight + "px");



    if (support === "ie8") { 			// shows the alert msg in IE8, IE7, IE6

      if ($.browser.msie  && parseInt($.browser.version, 10) < 9) {
        $obj.prepend(iepanel);
        $obj.prepend(overlay);

      }

      if ($.browser.msie  && parseInt($.browser.version, 10) === 6) {


        $("#ie-alert-panel").css("background-position","-626px -116px");
        $obj.css("margin","0");

      }


    } else if (support === "ie7") { 	// shows the alert msg in IE7, IE6

      if ($.browser.msie  && parseInt($.browser.version, 10) < 8) {

        $obj.prepend(iepanel);
        $obj.prepend(overlay);
      }

      if ($.browser.msie  && parseInt($.browser.version, 10) === 6) {

        $("#ie-alert-panel").css("background-position","-626px -116px");
        $obj.css("margin","0");

      }

    } else if (support === "ie6") { 	// shows the alert msg only in IE6

      if ($.browser.msie  && parseInt($.browser.version, 10) < 7) {

        $obj.prepend(iepanel);
        $obj.prepend(overlay);

        $("#ie-alert-panel").css("background-position","-626px -116px");
        $obj.css("margin","0");

      }
    }

  }; //end initialize function


  $.fn.iealert = function(options){
    var defaults = {
      support: "ie8",  // ie8 (ie6,ie7,ie8), ie7 (ie6,ie7), ie6 (ie6)
      title: "\u4F60\u77E5\u9053\u4F60\u7684Internet Explorer\u662F\u8FC7\u65F6\u4E86\u5417?", // title text
      text: "\u4E3A\u4E86\u5F97\u5230\u6211\u4EEC\u7F51\u7AD9\u6700\u597D\u7684\u4F53\u9A8C\u6548\u679C,\u6211\u4EEC\u5EFA\u8BAE\u60A8\u5347\u7EA7\u5230\u6700\u65B0\u7248\u672C\u7684Internet Explorer\u6216\u9009\u62E9\u53E6\u4E00\u4E2Aweb\u6D4F\u89C8\u5668.\u4E00\u4E2A\u5217\u8868\u6700\u6D41\u884C\u7684web\u6D4F\u89C8\u5668\u5728\u4E0B\u9762\u53EF\u4EE5\u627E\u5230.<br /><br />"
    };


    var option = $.extend(defaults, options);




    return this.each(function(){
      if ( $.browser.msie ) {
        var $this = $(this);
        initialize($this, option.support, option.title, option.text);
      } //if ie
    });

  };
})(jQuery);

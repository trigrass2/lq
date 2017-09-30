


$(function () {



  //搜索条件
  var mainSearchData = [
    // {idName: 'text1', text: '物料名称', field: 'wain'},
    {
      idName: 'combo55',
      text: '工厂',
      comboUrl: '/base/plant/queryPlantSelect',
      comboData: {parentiD: $('#combo5').val()},
      comboId: 'tmBasPlantId',
      comboText: 'plant',
      field: 'partNoaaaaaaaa',
      // otherValue:'nameCnS',
      contentType: true,
      //disabled:true,
      isSearch: true,
      onClick: function (data) {
        console.log(data.id)
      }

    },
    {
      idName: 'file1',
      text: '请选择',
      field: 'abv'
    },
    {
      idName: 'combo56',
      text: 'aa',
      comboUrl: '/base/plant/queryPlantSelect',
      comboData: {parentiD: $('#combo5').val()},
      comboId: 'tmBasPlantId',
      comboText: 'plant',
      field: 'partNo11',
      multiple: true,
      valid: ['notEmpty']
      //disabled:true,
      // isSearch:true
    },
    {
      idName: 'combo57',
      text: 'bb',
      comboUrl: '/base/plant/queryPlantSelect',
      comboData: {parentiD: $('#combo5').val()},
      comboId: 'tmBasPlantId',
      comboText: 'plant',
      field: 'partNo23',
      //disabled:true,
      // isSearch:true
    },
    {
      idName: 'combo5',
      field: 'tt',
      text: '下拉默认',
      comboData: [{id: 1, text: '2222'}, {id: 2, text: '333'}],
      onClick: function (data) {
        Ew.selectLink({
          comboUrl: '/base/plant/queryPlantSelect',
          comboData: {},
          id: ['combo5', 'combo56', 'combo57'],
          comboId: 'tmBasPlantId',
          comboText: 'plant'
        })
      }
    },
    {
      idName: 'day11',
      text: '年月日时分秒',
      field: 'code',
      format: 'fulldate',
      defaultValue: Ew.getNowday('') + ' 00:00:00',
      onClick: function (value) {
        alert(value)
      }
    },
    {idName: 'day12', text: '年月日', field: 'code', defaultValue: Ew.getNowday('') + ' 00:00:00'},
    {idName: 'txt111', text: '文本无框', defaultValue: '文本', field: 'code'},
    {idName: 'day13', text: '时分秒', field: 'code', format: 'time'},

    {
      idName: 'day3',
      text: '开始日期',
      field: 'code11',
      format: 'time',
      limit: {date: 'day4', type: 'setStartDate'},
      valid: ['notEmpty']
    },
    {idName: 'day4', text: '结束日期', format: 'time', field: 'abc', limit: {date: 'day3', type: 'setEndDate'}},
    {
      idName: 'number655', text: '物料编号', field: 'vv', valid: [{type: 'string', min: 1, max: 10}, 'notEmpty'],
      onKeyup: function (value) {
        $('#number1').val(value)
      }
    },
    {idName: 'number1', text: '物料编号硕', field: 'ss', type: 'decimals'},
    {
      idName: 'text8', text: '物料编号', field: 'ff', keyTrue: function (value) {
      alert(value)
    }
    },
    {idName: 'text9', text: '物料编号', field: 'dd', moreSearch: true},
    {idName: 'text00', text: '物料编号', field: 'ee', moreSearch: true}
  ];


  $('.aaaa').bootstrapSwitch({
    onText: "合格",
    offText: "不合格",
    onColor: "success",
    offColor: "info"
  });


  //搜索11


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
   *
   *
   *
   *
   *
   */

  Ew.search('.demoSearch',
    {
      title: '条件查询',
      textValues: mainSearchData,
      formId: 'abab',
      // titleNone:true,
      btnValues: [{
        btnId: 'search', text: '搜索', onClick: function (data) {
          console.log(data);
          $('#table1').bootstrapTable('refresh');
        }
      },
        {btnId: 'clear', text: '重置', tableid: ['table1']},
        {btnId: 'moreSearch', text: '更多搜索'},
      ]
    },
    function () {
      $('.demoSearch').attr('id', 'abc')
    }
  );


  // Ew.search('.aaaaa',
  //   {
  //     title: '条件查询',
  //     textValues: mainSearchData,
  //     formId:'abab',
  //     btnValues: [{
  //       btnId: 'search', text: '搜索', onClick: function (data) {
  //         console.log(data);
  //         $('#table1').bootstrapTable('refresh');
  //       }
  //     },
  //       {btnId: 'clear', text: '重置',tableid:['table1']},
  //       {btnId: 'moreSearch', text: '更多搜索'},
  //     ]
  //   }
  // );

  // Ew.search('.aaaaa',
  //   {
  //     title: '111111询',
  //     content:'111111111111111111111',
  //     onLoadsucess:function(){
  //     }
  //   }
  // );


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
   *
   *
   * */

  Ew.getDictVal(['MSG_STATUS', 'MSG_TSK_TYPE'], function (re) {


  //表格
  Ew.table('.demoTable',
    {
      btnValues: [{
        btnId: 'add', text: '新增', onClick: function () {
          daliogShow('add')
        }
      },
        {
          btnId: 'change', text: '修改', isTrue: true, otherOption: [true], onClick: function () {
          daliogShow('change')
        }
        },
        {
          btnId: 'dele', text: '删除', isTrue: true, selMinNum: 1, onClick: function () {
          Ew.dialog('bbbb',
            {
              title: '111111询',
              width: 1000,
              btnValues: [{
                btnId: 'aaaa', text: '保存', isTrue: true, onClick: function (data) {
                }
              },
                {btnId: 'bbbb', text: '取消'}
              ],
              content: '111111111111111111111',
              onLoadsuccess: function () {

              }
            }
          );
        }
        },
        {
          btnId: 'add1', otherBtn: true, selectOption: [{id: '#table1', selectNum: 3}, {id: '#table2', selectNum: 1}]
        },
        {
          btnId: 'change1', selectNum: 1, otherBtn: true
        },
        {
          btnId: 'export1', selectNum: 1, text: '导入', url: '/order/pporder/import', tableid: 'table1'
        }
      ],
      tableId: 'table1',
      tableValue: {
        pagination: false,
        nohidden: true,
        searchParams: mainSearchData,
        queryParams: function () {
          return {}
        },
        onClickRow: function (item) {

          //console.log(item)
        },
        onLoadSuccess: function () {
          $('.sw').bootstrapSwitch({
            onText: "启动",
            offText: "停止",
            onColor: "success",
            offColor: "info",
            onSwitchChange: function (event, state) {
              console.log(state)
              alert($(this).attr('fieldValue'));
              alert(state)
            }
          });
        },
        onUncheck: function (row) {
          //alert(row)
        },
        url: '/worktime/part/querylistByPage',
        columns: [{
          checkbox: true
        }, {
          field: 'tmBasPlantId',
          title: '工厂',
          align: 'center',
          sortable: true,
          width: '120px',
          formatter: function (value) {
            return re.MSG_STATUS[value]
            // Ew.getDictVal('MSG_STATUS第三代','E',function(name){
            //   return name
            // })
          }
        }, {
          field: 'partNo',
          title: '物料编号',
          align: 'center',
          sortable: true
        }, {
          field: 'nameCn',
          title: '物料名称',
          align: 'center',
          sortable: true
        }, {
          field: 'code',
          title: '3位简码',
          align: 'center',
          sortable: true
        }, {
          field: 'nameEn',
          title: '英文名称',
          align: 'center',
          sortable: true
        }, {
          field: 'nameCnS',
          title: '中文简称',
          align: 'center',
          sortable: true
        }, {
          field: 'nameEnS',
          title: '英文简称',
          align: 'center',
          sortable: true
        },
          {
            field: 'enabled',
            title: '启用',
            formatter: function (value, row, index) {
              return Ew.switchHl(value, 'sw', row.tmBasPlantId)
            },
            width: '120px'
          }]
      }
    }
  );
})


  Ew.dialog('demoadd',
    {
      title:'666',
      width:840,
      height:740,
      btnValues: [{
        btnId: 'aaaa', text: '保存',formid:'demoform', onClick: function (data) {
          console.log(data)
        }
      },
        {btnId: 'bbbb', text: '取消'}
      ],
      content:'<div class="panel panel-default demoSearch11" ></div><div class="demoTable22" style="float: left; width: 800px"></div>',
      onLoadsucess:function(){
        Ew.search('.demoSearch11',
          {
            title: '条件查询',
            textValues: [{idName: 'day12', text: '年月日', field: 'code', defaultValue: Ew.getNowday('') + ' 00:00:00'},
              {idName: 'txt111', text: '文本无框', defaultValue: '文本', field: 'code'}],
            btnValues: [{
              btnId: 'search', text: '搜索', onClick: function (data) {
              }
            },
              {btnId: 'clear', text: '重置', tableid: ['table1']}
            ]
          }
        );


        Ew.getDictVal(['MSG_STATUS', 'MSG_TSK_TYPE'], function (re) {
          //表格
          Ew.table('.demoTable22',
            {

              tableId: 'table11',
              tableValue: {
                noSearch:true,
                searchParams: mainSearchData,
                queryParams: function () {
                  return {}
                },
                onClickRow: function (item) {

                },
                onLoadSuccess: function () {
                  $('.sw').bootstrapSwitch({
                    onText: "启动",
                    offText: "停止",
                    onColor: "success",
                    offColor: "info",
                    onSwitchChange: function (event, state) {
                      console.log(state)
                      alert($(this).attr('fieldValue'));
                      alert(state)
                    }
                  });
                },
                onUncheck: function (row) {
                  //alert(row)
                },
                url: '/worktime/part/querylistByPage',
                columns: [{
                  checkbox: true
                }, {
                  field: 'tmBasPlantId',
                  title: '工厂',
                  align: 'center',
                  sortable: true,
                  width: '120px',
                  formatter: function (value) {
                    return re.MSG_STATUS[value]
                    // Ew.getDictVal('MSG_STATUS第三代','E',function(name){
                    //   return name
                    // })
                  }
                }, {
                  field: 'partNo',
                  title: '物料编号',
                  align: 'center',
                  sortable: true
                }, {
                  field: 'nameCn',
                  title: '物料名称',
                  align: 'center',
                  sortable: true
                }, {
                  field: 'code',
                  title: '3位简码',
                  align: 'center',
                  sortable: true
                }, {
                  field: 'nameEn',
                  title: '英文名称',
                  align: 'center',
                  sortable: true
                }, {
                  field: 'nameCnS',
                  title: '中文简称',
                  align: 'center',
                  sortable: true
                }, {
                  field: 'nameEnS',
                  title: '英文简称',
                  align: 'center',
                  sortable: true
                },
                  {
                    field: 'enabled',
                    title: '启用',
                    formatter: function (value, row, index) {
                      return Ew.switchHl(value, 'sw', row.tmBasPlantId)
                    },
                    width: '120px'
                  }]
              }
            }
          );
        })
      }
    })














  //表格
  Ew.table('.demoTable1',
    {
      btnValues: [
        {idName:'text666',text:'物料编号',field:'vv'},
        {btnId: 'add1', text: '确定',otherOption:[{id:'table2',selectNum: 1},{textId:'text666'},false], onClick: function () {
        console.log($('#table1').bootstrapTable('getData'))
          // $('#table1').bootstrapTable('getData').forEach(function(item,index){
          //   $('#table1').bootstrapTable('check',index)
          // })
        }
      }],
      tableId: 'table2',
      tableValue: {
        detailView:true,
        onExpandRow: function (index, row, $detail) {
          console.log(row)
          var cur_table = $detail.html('<div class="tableson"></div>').find('table');
          Ew.table('.tableson',{
            tableId: 'table3',
            tableValue: {
              noSearch:true,
              searchParams: mainSearchData,
              queryParams: function () {
                return {}
              },
              onLoadSuccess:function(){
                $('.sw').bootstrapSwitch({
                  onText:"启动",
                  offText:"停止",
                  onColor:"success",
                  offColor:"info",
                  onSwitchChange:function(event,state){
                    alert($(this).attr('fieldValue'));
                    alert(state)
                  }
                });
              },
              url: '/worktime/part/querylistByPage',
              columns: [ {
                field: 'tmBasPlantId',
                title: '工厂',
                align: 'center',
                sortable: true,
                formatter: function (value, row, index) {
                  return '<div style="word-break:break-all; width: 120px">撒打算打算大所大大所大所大所大大所大所</div>'
                },
                width:'50px'
              }, {
                field: 'partNo',
                title: '物料编号',
                align: 'center',
                sortable: true
              },{
                  field: 'enabled',
                  title: '启用',
                  formatter: function (value, row, index) {
                    return Ew.switchHl(value,'sw',row.tmBasPlantId)
                  },
                  width:'120px'
                }]
            }
          })
        },
        searchParams: mainSearchData,
        queryParams: function () {
          return {}
        },
        onClickRow: function (item, $element) {
          alert()
        },
        onLoadSuccess:function(){
          $('.sw').bootstrapSwitch({
            onText:"启动",
            offText:"停止",
            onColor:"success",
            offColor:"info",
            onSwitchChange:function(event,state){
            }
          });
        },
        url: '/worktime/part/querylistByPage',
        columns: [{
          checkbox: true
        }, {
          field: 'tmBasPlantId',
          title: '工厂',
          align: 'center',
          sortable: true
        }, {
          field: 'partNo',
          title: '物料编号',
          align: 'center',
          sortable: true
        }, {
          field: 'nameCn',
          title: '物料名称',
          align: 'center',
          sortable: true
        }, {
          field: 'code',
          title: '3位简码',
          align: 'center',
          sortable: true
        }, {
          field: 'nameEn',
          title: '英文名称',
          align: 'center',
          sortable: true
        }, {
          field: 'nameCnS',
          title: '中文简称',
          align: 'center',
          sortable: true
        }, {
          field: 'nameEnS',
          title: '英文简称',
          align: 'center',
          sortable: true
        },
          {
            field: 'enabled',
            title: '启用',
            width:120,
            formatter: function (value, row, index) {
              if (value == '1')
                return '<input class="sw"   type="checkbox" data-size="small">'
              else if (value == '0')
                return '<input class="sw" checked  type="checkbox" data-size="small">'
              else {
                return '';
              }
            }
          }]
      }
    }
  );
})



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

 更多详见 getInputhl
 *
 *
 * */






function daliogShow(type){
    var title=type=='add'?'新增':'修改';
    var defaultTable=type=='add'?'':'table1';
    Ew.dialog('demoadd',
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
          columnNum:3,
          formList:[
            {idName: 'radio11', text: '单选', field: 'aaaa',rodioData:[{text:'订单',value:'sd'},{text:'aaa',value:'ds',checked:true}],valid:['notEmpty'],n:1.5,hidden:true},
            {idName:'text11',text:'物料名称',field:'tmBasPlantId',valid:['notEmpty'],n:1.5},
            {idName:'combo53',text:'工厂',comboUrl:'/base/plant/queryPlantSelect',comboData:{parentiD:''},comboId:'tmBasPlantId',comboText:'plant',field:'ad',valid:[],n:1.5,clearBoth:true},
            {idName:'day22',text:'日期',field:'nameCn',valid:[],n:1},
            {idName:'text33',text:'物料编号',field:'code',valid:[{callback: {
              message: 'cuo',
              callback: function(value, validator) {
                return value == 100 || value =='';
              }
            }}
            ],n:1},
            {idName:'text44',text:'物料编号',field:'nameEn',valid:[{type:'number',min:6,max:10},
              'notEmpty'
            ],defaultValue:0},
            {idName:'text88',text:'物料编号',field:'nameCnS',valid:['notEmpty','number']},
            {idName:'checkbox1',text:'物料编号',field:'f',checkboxData:[{text:'周一',value:'ss'}],n:0.6},
            {idName:'checkbox3',text:'',field:'b',checkboxData:[{text:'周二',checked:true,value:1}],n:0.3},
            {idName:'checkbox4',text:'',field:'g',checkboxData:[{text:'周三'}],n:0.3},
            {idName:'checkbox5',text:'',field:'r',checkboxData:[{text:'周四'}],n:0.3},
            {idName:'checkbox6',text:'',field:'w',checkboxData:[{text:'周五'}],n:0.3},
            {idName:'checkbox7',text:'',field:'d',checkboxData:[{text:'周六'}],n:0.3},
            {idName:'checkbox2',text:'',field:'f',checkboxData:[{text:'周日'}],n:0.3},
            {idName:'area88',text:'备注',field:'sss',valid:['notEmpty'],n:3},
            {idName:'switch11',text:'物料编号',field:'asd',ontext:'启用',defaultValue:0,offtext:'停用',disabled:false,
            onChange:function(state){
              Ew.dynvalid(state,'demoform',[{field:'tmBasPlantId',idName:'text11'},{field:'nameEn',idName:'text44'}])
            }}
          ],
          defaultTable:''
        }
      })
}









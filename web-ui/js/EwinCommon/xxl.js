//---------------------------*****************************EMS开发遇到常用公共JS总结****************************--------------------------------
/*** author xuxuelei
/***这个属于公共JS，各位不要来这里面增加方法***/
//禁止本人以外的人来修改，不然会影响到个人开发的所有代码业务


//------------------------------------------------------异步请求 ajax------------------------------------------------------
/***
 ***
 ***url-请求路径，tableId-表格ID, formId - 表格ID
 ***说明： 例子： xxlDelete(url,'tb_xxl');
 ***参考第二种：通过层级选择器  表示table下第一行第二列的第一个input的value
 ***  alert(   $("table tr:eq(0) td:eq(1) input:eq(0)").val()   );
***/
function xxlAjax(url,xxlData,tableId,formId,modalId){
            $.ajax({
                      type: 'POST',
                      url: url,
                      data: xxlData,
                      contentType:"application/json",
                      dataType: 'JSON',
                      success: function (data) {
                        var errcode = data.code;//在此做了错误代码的判断
                        if(errcode != 10000){
                              layer.msg(data.message);
                              return;
                        }
                        if(data.results){
                                layer.msg(data.message);
                                $(modalId).modal("hide");
                                $(tableId).bootstrapTable('refresh');
                                $(formId).data('bootstrapValidator').resetForm();
                                xxlClear($(formId));
                         }

                      }
                  });
}

//------------------------------------------------------编辑 edit------------------------------------------------------
/***
 ***
 ***url-请求路径，tableId-表格ID
 ***说明： 例子： xxlDelete(url,'tb_xxl');
 ***参考第二种：通过层级选择器  表示table下第一行第二列的第一个input的value
 ***  alert(   $("table tr:eq(0) td:eq(1) input:eq(0)").val()   );
***/
function xxlEdit(tableId,formId,modalId){
           var rows = $(tableId).bootstrapTable("getSelections");
           var row = rows[0];
           if (rows.length < 1) {
        	      layer.msg("请选择要修改的数据！");
                return;
            }
            if (rows.length > 1) {
                  layer.msg("只能选择一条数据！")
                return;
            }

          //---doto start  加上面的一些附件条件
           if(row.orderStatus !='undefined'||row.orderSource !='undefined'){
               if (row.orderStatus !='10'||row.orderSource !='MES') {
                     layer.msg("只允许修改状态为未排产,来源为MES数据！")
                   return;
               }
           }


           //---doto end  加上面的一些附件条件
            $(formId+" "+"#titleId").html('编辑');
           /**	for (var p in row){
                    var rowTitle = formId+' #'+p;

                  	if($.type(rowTitle)=='checkbox'){
                  			if(row[p]==1 || row[p]=='1'){
                  				     $(rowTitle).prop('checked',true);
                  			}else{
                  				     $(rowTitle).prop('checked',false);
                  			}
                  		}else if($(rowTitle).prop("tagName")== 'SELECT'){

                              if(p=='plant'){
                                  $("#plant").find("option[value='"+row.tmBasPlantId+"']").attr("selected",true);
                              }else if(p=='workshop'){
                                  $("#workshop").find("option[value='"+row.tmBasWorkshopId+"']").attr("selected",true);
                              }else if(p=='line'){
                                  $("#line").find("option[value='"+row.tmBasLineId+"']").attr("selected",true);
                              }else if(p=='orderType'){
                                 $(rowTitle).val(row[p]);
                              }else{}

                      }else{
                  			       $(rowTitle).val(row[p]);
                  		}
            	   }

               xxlSelect('workshop','workshop','#formAddEdit');




              $(modalId).modal("show");
              **/
}



//------------------------------------------------------批量删除 delete------------------------------------------------------
/***
 ***
 ***url-请求路径，tableId-表格ID
 ***说明： 例子： xxlDelete(url,'tb_xxl');
 ***参考第二种：通过层级选择器  表示table下第一行第二列的第一个input的value
 ***  alert(   $("table tr:eq(0) td:eq(1) input:eq(0)").val()   );
***/
function xxlDelete(url, tableId){
					var rows = $("#"+tableId).bootstrapTable("getSelections");
						if (rows.length < 1) {
							layer.msg("没有选择的数据！")
								return;
						}
            var row = rows[0];
            //---doto start  加上面的一些附件条件
             if(row.orderStatus !='undefined'||row.orderSource !='undefined'){
                 if (row.orderStatus !='10'||row.orderSource !='MES'||row.orderQty!=0) {
                       layer.msg("只允许修改状态为未排产,来源为MES数据且上线数量为0的订单！")
                       return;
                 }
             }


             //---doto end  加上面的一些附件条件


						layer.confirm('是否确认删除？', {
								btn: ['删除','取消'], //按钮
							title: "提示",
								shade: false //不显示遮罩
						}, function(index){

              var sid = [];
              $("#"+tableId+" "+"tr").each(function(index,item){
                  if($(item).hasClass('selected')){
                      sid[index] = $("#"+tableId+" "+"tr:eq("+index+")").attr("data-uniqueid");
                  }
              })
							datas = JSON.stringify(sid);
							$.ajax({
												type: 'POST',
												url: url,
												data: datas,
												contentType:"application/json",
												dataType: 'JSON',
												traditional: true,
												success: function (data) {
													var errcode = data.code;//在此做了错误代码的判断
													if(errcode != 10000){
															layer.msg(data.message);
															return;
													}
													if(data.results){
															layer.msg(data.message);
															$("#"+tableId).bootstrapTable('refresh');
													}
												}
										});
								layer.close(index);
						});
}



//---------------------------------------------------- 验证表单 Validator--------------------------------------------------
/***
 ***formId-表单Id
 ***例子：  xxlValidation('#formAddEdit');
 ***/
 function xxlImport(url,tableId,formId,modalId){
           $.ajax({
               url:url ,
               type: 'POST',
               cache: false,
               data: new FormData($(formId)[0]),
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                success:function (data) {
                   layer.msg(data.message);
                   if(data.message=='导入成功！'){
                     $(modalId).modal("hide");
                       $(tableId).bootstrapTable('refresh');
                   }

                }
             });
             return false;
 }


//---------------------------------------------------- 验证表单 Validator--------------------------------------------------
/***
 ***formId-表单Id
 ***例子：  xxlValidation('#formAddEdit');
 ***/
function xxlValidation(formId){
         $(formId).data('bootstrapValidator').validate();
         if(!$(formId).data('bootstrapValidator').isValid()){
                 return ;
          }
}


//---------------------------------------------------- 清空表单 clear--------------------------------------------------
/***
 ***form-表单对象 如：$(‘#formAddEdit’)
 ***例子：  xxlValidation('#formAddEdit');
 ***/
function xxlClear(form) {
          /*input清空*/
          $(':input', form).each(function () {
                    var type = this.type;
                    var tag = this.tagName.toLowerCase(); // normalize case
                    if (type == 'text' || type == 'password' || tag == 'textarea'|| type=='email'){
                        this.value = "";
                    }else if (type == 'checkbox'){
                        this.checked = false;
                    }else if (tag == 'select'){
                        this.selectedIndex = -1;
                    }else if(tag == 'radio'){
                        //this.value="1";
                        //this.checked=true;
                        this.checked = false;
                    }else if(type=='number'){
                        this.value = "";
                    }
            });
};



//-------------------------------------------------下拉列表三级联动 select----------------------------------------------
/***
 ***id- 标记， type-类型，form-表单
 ***例子：xxlSelect('plant','plant',$("#formSearch,#formEdit,#formEditList"))
 ***说明：表单可以放一个，也可以放多个
 ***/
function xxlSelect(id,type,formId){
     $('#'+id,$(formId)).html('');
		 var str = "<option></option>";
     var url = '';
     var xxlData = '';
     var plant = '' ;
     var workshop = '';
     var line = '';

		 if(type=="plant"){
              url = apiUrl +'/base/plant/queryPlantSelect';
              xxlData ={ "parentiD": "" };
     }else if(type=="plantL"){
              url = apiUrl +'/base/plant/queryPlantSelect';
              xxlData ={ "parentiD": "" };
     }else if(type=="workshop"){
               url = apiUrl +'/base/workshop/queryWorkshopSelect';
               plant = $('#plant option:selected',$(formId)).val();//取对应表单对象下的固定字段
               xxlData ={ "pTmBasPlantId": plant };
     }else if(type=="workshopL"){
               url = apiUrl +'/base/workshop/queryWorkshopSelect';
               plant = $('#plantL option:selected',$(formId)).val();//取对应表单对象下的固定字段
               xxlData ={ "pTmBasPlantId": plant };
     }else if(type=="line"){
               url = apiUrl +'/base/line/queryLineSelect';
               workshop =  $('#workshop option:selected',$(formId)).val();
               xxlData ={ "wTmBasWorkshopId": workshop };
     }else if(type=="lineL"){
               url = apiUrl +'/base/line/queryLineSelect';
               workshop =  $('#workshopL option:selected',$(formId)).val();
               xxlData ={ "wTmBasWorkshopId": workshop };
     }else{}
			      /*** 工厂 ***/
						 $.ajax({
								 url:  url,
								 type: "POST",
								 data: xxlData,
								 dataType: "JSON",
								 async: false,
								 success: function (data) {
										 //从服务器获取数据进行绑定
										 $.each(data.results, function (i, item) {
                              /***  需要修改地方 start ***/
                               if(type=="plant"){
                                      str += "<option value=" + item.tmBasPlantId + ">" + item.plant + "</option>"
                                }else if(type=="plantL"){
                                      str += "<option value=" + item.tmBasPlantId + ">" + item.plant + "</option>"
                                }else if(type=="workshop"){
                                      str += "<option value=" + item.tmBasWorkshopId + ">" + item.workshop + "</option>";
                                }else if(type=="workshopL"){
                                      str += "<option value=" + item.tmBasWorkshopId + ">" + item.workshop + "</option>";
                                }else if(type=="line"){
						                           str += "<option value=" + item.tmBasLineId + ">" + item.line + "</option>";
                                }else if(type=="lineL"){
						                           str += "<option value=" + item.tmBasLineId + ">" + item.line + "</option>";
                                }else{}
                               /***  需要修改地方 end ***/
                     	 })
										 //将数据添加到省份这个下拉框里面
										 $('#'+id,$(formId)).append(str);
								 },
								 error: function () { alert("Error"); }
						 });

}





//-----------------------------------------------------智能文本框 suggest----------------------------------------------------
/***
***id- 标记， type-类型，form-表单
***例子：xxlSuggest('partgroup','partgroup',$("#formSearch,#formAddEdit"))
***
***/

		function xxlSuggest(id,type,form){

        $("#"+id,form).html("");
        if(type=="partgroup"){
					/*** 产品组 ***/
								  var plant = $('#plant option:selected',form).val();
						       $("#"+id).bsSuggest({
						       url: apiUrl +'/base/route/queryPartGroupSuggest?tmBasPlantId='+plant,
						       getDataMethod: "firstByUrl",//获取数据的方式，url：一直从url请求；data：从 options.data 获取；firstByUrl：第一次从Url获取全部数据，之后从options.data获取
						       idField: "id",//每组数据的哪个字段作为 data-id，优先级高于 indexId 设置（推荐）
						       keyField: "partgroup",//每组数据的哪个字段作为输入框内容，优先级高于 indexKey 设置（推荐）
						       /* 搜索相关 */
						       allowNoKeyword: false,//是否允许无关键字时请求数据
						       effectiveFields: ["partgroup"],//有效显示于列表中的字段，非有效字段都会过滤，默认全部。
						       // effectiveFieldsAlias: {"name":'名字',"address":"个人主页"},//有效字段的别名对象，用于 header 的显示
						       // searchFields: [],//有效搜索字段，从前端搜索过滤数据时使用，但不一定显示在列表中。effectiveFields 配置字段也会用于搜索过滤
						       twoWayMatch: false,// 是否双向匹配搜索。为 true 即输入关键字包含或包含于匹配字段均认为匹配成功，为 false 则输入关键字包含于匹配字段认为匹配成功
						       // multiWord: false,//以分隔符号分割的多关键字支持
						       // separator: ',',//多关键字支持时的分隔符，默认为半角逗号
						       // delay: 300,//搜索触发的延时时间间隔，单位毫秒
						       /* UI */
						       autoDropup: false,//选择菜单是否自动判断向上展开。设为 true，则当下拉菜单高度超过窗体，且向上方向不会被窗体覆盖，则选择菜单向上弹出
						       autoMinWidth: false,//是否自动最小宽度，设为 false 则最小宽度不小于输入框宽度
						       showHeader: false,//是否显示选择列表的 header。为 true 时，有效字段大于一列则显示表头
						       showBtn: false,//是否显示下拉按钮
						       inputWarnColor: "#f6f6f6", //输入框内容不是下拉列表选择时的警告色
						       listStyle: {
						           'overflow': 'auto',
						           'color':'#666',

						       },//列表的样式控制
						       listAlign: 'left',//提示列表对齐位置，left/right/auto
						       listHoverStyle: 'background: #07d; color:#fff', //提示框列表鼠标悬浮的样式
						       clearable: true,// 是否可清除已输入的内容
						       processData: function(dataJson){  // url 获取数据时，对数据的处理，作为 getData 的回调函数
						                      var i, len, data = {value: []};
						                      $.each(dataJson.results,function(index,xxl){
						                          data.value.push({
						                              id:xxl.tmBasPartgroupId,
						                              partgroup:xxl.partgroup

						                          });
						                      });

						                       return data;
						                  }
						      }) ;
				}else if(type=="part"){
					/*** 产品 ***/
										var partgroup =   $("#partgroup",form).attr("data-id");
										var plant = $('#plant option:selected',form).val();
										if (typeof(partgroup) == "undefined") {
											 partgroup='';
										}
									/*绑定文本框*/
										$("#"+id).bsSuggest({
										url: apiUrl +'/base/route/queryPartSuggest?tmBasPlantId='+plant+'&tmBasPartgroupId='+partgroup,
										getDataMethod: "firstByUrl",//获取数据的方式，url：一直从url请求；data：从 options.data 获取；firstByUrl：第一次从Url获取全部数据，之后从options.data获取
										idField: "id",//每组数据的哪个字段作为 data-id，优先级高于 indexId 设置（推荐）
										keyField: "part",//每组数据的哪个字段作为输入框内容，优先级高于 indexKey 设置（推荐）
										/* 搜索相关 */
										allowNoKeyword: false,//是否允许无关键字时请求数据
										effectiveFields: ["part"],//有效显示于列表中的字段，非有效字段都会过滤，默认全部。
										// effectiveFieldsAlias: {"name":'名字',"address":"个人主页"},//有效字段的别名对象，用于 header 的显示
										// searchFields: [],//有效搜索字段，从前端搜索过滤数据时使用，但不一定显示在列表中。effectiveFields 配置字段也会用于搜索过滤
										twoWayMatch: false,// 是否双向匹配搜索。为 true 即输入关键字包含或包含于匹配字段均认为匹配成功，为 false 则输入关键字包含于匹配字段认为匹配成功
										// multiWord: false,//以分隔符号分割的多关键字支持
										// separator: ',',//多关键字支持时的分隔符，默认为半角逗号
										// delay: 300,//搜索触发的延时时间间隔，单位毫秒
										/* UI */
										autoDropup: false,//选择菜单是否自动判断向上展开。设为 true，则当下拉菜单高度超过窗体，且向上方向不会被窗体覆盖，则选择菜单向上弹出
										autoMinWidth: false,//是否自动最小宽度，设为 false 则最小宽度不小于输入框宽度
										showHeader: false,//是否显示选择列表的 header。为 true 时，有效字段大于一列则显示表头
										showBtn: false,//是否显示下拉按钮
										inputWarnColor: "#f6f6f6", //输入框内容不是下拉列表选择时的警告色
										listStyle: {


										},//列表的样式控制
										listAlign: 'left',//提示列表对齐位置，left/right/auto
										listHoverStyle: 'background: #07d; color:#fff', //提示框列表鼠标悬浮的样式
										clearable: true,// 是否可清除已输入的内容
										processData: function(dataJson){  // url 获取数据时，对数据的处理，作为 getData 的回调函数
																	 var i, len, data = {value: []};
																	 $.each(dataJson.results,function(index,xxl){
																			 data.value.push({
																				 id:xxl.tmBasPartId,
																				 part:xxl.part

																			 });
																	 });

																		return data;
															 }
									   }) ;

					}else if(type=="custom"){
						/*** 客户 ***/
											var part =   $("#part",form).attr("data-id");
								      var plant = $('#plant option:selected',form).val();
								      if (typeof(part) == "undefined") {
								         part='';
								      }
								    /*绑定文本框*/
								      $("#"+id).bsSuggest({
								      url: apiUrl +'/worktime/partCustom/queryCoustomSuggest?tmBasPlantId='+plant+'&tmBasPartId='+part,
								      getDataMethod: "firstByUrl",//获取数据的方式，url：一直从url请求；data：从 options.data 获取；firstByUrl：第一次从Url获取全部数据，之后从options.data获取
								      idField: "id",//每组数据的哪个字段作为 data-id，优先级高于 indexId 设置（推荐）
								      keyField: "custom",//每组数据的哪个字段作为输入框内容，优先级高于 indexKey 设置（推荐）
								      /* 搜索相关 */
								      allowNoKeyword: false,//是否允许无关键字时请求数据
								      effectiveFields: ["custom"],//有效显示于列表中的字段，非有效字段都会过滤，默认全部。
								      // effectiveFieldsAlias: {"name":'名字',"address":"个人主页"},//有效字段的别名对象，用于 header 的显示
								      // searchFields: [],//有效搜索字段，从前端搜索过滤数据时使用，但不一定显示在列表中。effectiveFields 配置字段也会用于搜索过滤
								      twoWayMatch: false,// 是否双向匹配搜索。为 true 即输入关键字包含或包含于匹配字段均认为匹配成功，为 false 则输入关键字包含于匹配字段认为匹配成功
								      // multiWord: false,//以分隔符号分割的多关键字支持
								      // separator: ',',//多关键字支持时的分隔符，默认为半角逗号
								      // delay: 300,//搜索触发的延时时间间隔，单位毫秒
								      /* UI */
								      autoDropup: false,//选择菜单是否自动判断向上展开。设为 true，则当下拉菜单高度超过窗体，且向上方向不会被窗体覆盖，则选择菜单向上弹出
								      autoMinWidth: false,//是否自动最小宽度，设为 false 则最小宽度不小于输入框宽度
								      showHeader: false,//是否显示选择列表的 header。为 true 时，有效字段大于一列则显示表头
								      showBtn: false,//是否显示下拉按钮
								      inputWarnColor: "#f6f6f6", //输入框内容不是下拉列表选择时的警告色
								      listStyle: {


								      },//列表的样式控制
								      listAlign: 'left',//提示列表对齐位置，left/right/auto
								      listHoverStyle: 'background: #07d; color:#fff', //提示框列表鼠标悬浮的样式
								      clearable: true,// 是否可清除已输入的内容
								      processData: function(dataJson){  // url 获取数据时，对数据的处理，作为 getData 的回调函数
								                     var i, len, data = {value: []};
								                     $.each(dataJson.results,function(index,xxl){
								                         data.value.push({
								                           id:xxl.cTmBasCustomId,
								                           custom:xxl.custom

								                         });
								                     });

								                      return data;
								                 }
								     }) ;
						}else if(type=="partL"){
					 					/*** 产品 ***/
					 										var partgroup =   $("#partgroup",form).attr("data-id");
					 										var plant = $('#plant option:selected',form).val();
					 										if (typeof(partgroup) == "undefined") {
					 											 partgroup='';
					 										}
					 									/*绑定文本框*/
					 										$("#"+id).bsSuggest({
					 										url: apiUrl +'/base/route/queryPartSuggest?tmBasPlantId='+plant+'&tmBasPartgroupId='+partgroup,
					 										getDataMethod: "firstByUrl",//获取数据的方式，url：一直从url请求；data：从 options.data 获取；firstByUrl：第一次从Url获取全部数据，之后从options.data获取
					 										idField: "id",//每组数据的哪个字段作为 data-id，优先级高于 indexId 设置（推荐）
					 										keyField: "partL",//每组数据的哪个字段作为输入框内容，优先级高于 indexKey 设置（推荐）
					 										/* 搜索相关 */
					 										allowNoKeyword: false,//是否允许无关键字时请求数据
					 										effectiveFields: ["partL"],//有效显示于列表中的字段，非有效字段都会过滤，默认全部。
					 										// effectiveFieldsAlias: {"name":'名字',"address":"个人主页"},//有效字段的别名对象，用于 header 的显示
					 										// searchFields: [],//有效搜索字段，从前端搜索过滤数据时使用，但不一定显示在列表中。effectiveFields 配置字段也会用于搜索过滤
					 										twoWayMatch: false,// 是否双向匹配搜索。为 true 即输入关键字包含或包含于匹配字段均认为匹配成功，为 false 则输入关键字包含于匹配字段认为匹配成功
					 										// multiWord: false,//以分隔符号分割的多关键字支持
					 										// separator: ',',//多关键字支持时的分隔符，默认为半角逗号
					 										// delay: 300,//搜索触发的延时时间间隔，单位毫秒
					 										/* UI */
					 										autoDropup: false,//选择菜单是否自动判断向上展开。设为 true，则当下拉菜单高度超过窗体，且向上方向不会被窗体覆盖，则选择菜单向上弹出
					 										autoMinWidth: false,//是否自动最小宽度，设为 false 则最小宽度不小于输入框宽度
					 										showHeader: false,//是否显示选择列表的 header。为 true 时，有效字段大于一列则显示表头
					 										showBtn: false,//是否显示下拉按钮
					 										inputWarnColor: "#f6f6f6", //输入框内容不是下拉列表选择时的警告色
					 										listStyle: {


					 										},//列表的样式控制
					 										listAlign: 'left',//提示列表对齐位置，left/right/auto
					 										listHoverStyle: 'background: #07d; color:#fff', //提示框列表鼠标悬浮的样式
					 										clearable: true,// 是否可清除已输入的内容
					 										processData: function(dataJson){  // url 获取数据时，对数据的处理，作为 getData 的回调函数
					 																	 var i, len, data = {value: []};
					 																	 $.each(dataJson.results,function(index,xxl){
					 																			 data.value.push({
					 																				 id:xxl.tmBasPartId,
					 																				 partL:xxl.part

					 																			 });
					 																	 });

					 																		return data;
					 															 }
					 									   }) ;
                  }else if(type=="bom"){
                     /*** BOM版本号 ***/
                               var part =   $("#part",form).attr("data-id");
                               var plant = $('#plant option:selected',form).val();
                               if (typeof(part) == "undefined") {
                                  part='';
                               }
                             /*绑定文本框*/
                               $("#"+id).bsSuggest({
                               url: apiUrl +'/base/bom/queryBomSuggest?tmBasPlantId='+plant+'&tmBasPartId='+part,
                               getDataMethod: "firstByUrl",//获取数据的方式，url：一直从url请求；data：从 options.data 获取；firstByUrl：第一次从Url获取全部数据，之后从options.data获取
                               idField: "id",//每组数据的哪个字段作为 data-id，优先级高于 indexId 设置（推荐）
                               keyField: "bomVersion",//每组数据的哪个字段作为输入框内容，优先级高于 indexKey 设置（推荐）
                               /* 搜索相关 */
                               allowNoKeyword: false,//是否允许无关键字时请求数据
                               effectiveFields: ["bomVersion"],//有效显示于列表中的字段，非有效字段都会过滤，默认全部。
                               // effectiveFieldsAlias: {"name":'名字',"address":"个人主页"},//有效字段的别名对象，用于 header 的显示
                               // searchFields: [],//有效搜索字段，从前端搜索过滤数据时使用，但不一定显示在列表中。effectiveFields 配置字段也会用于搜索过滤
                               twoWayMatch: false,// 是否双向匹配搜索。为 true 即输入关键字包含或包含于匹配字段均认为匹配成功，为 false 则输入关键字包含于匹配字段认为匹配成功
                               // multiWord: false,//以分隔符号分割的多关键字支持
                               // separator: ',',//多关键字支持时的分隔符，默认为半角逗号
                               // delay: 300,//搜索触发的延时时间间隔，单位毫秒
                               /* UI */
                               autoDropup: false,//选择菜单是否自动判断向上展开。设为 true，则当下拉菜单高度超过窗体，且向上方向不会被窗体覆盖，则选择菜单向上弹出
                               autoMinWidth: false,//是否自动最小宽度，设为 false 则最小宽度不小于输入框宽度
                               showHeader: false,//是否显示选择列表的 header。为 true 时，有效字段大于一列则显示表头
                               showBtn: false,//是否显示下拉按钮
                               inputWarnColor: "#f6f6f6", //输入框内容不是下拉列表选择时的警告色
                               listStyle: {


                               },//列表的样式控制
                               listAlign: 'left',//提示列表对齐位置，left/right/auto
                               listHoverStyle: 'background: #07d; color:#fff', //提示框列表鼠标悬浮的样式
                               clearable: true,// 是否可清除已输入的内容
                               processData: function(dataJson){  // url 获取数据时，对数据的处理，作为 getData 的回调函数
                                              var i, len, data = {value: []};
                                              $.each(dataJson.results,function(index,xxl){
                                                  data.value.push({
                                                    id:xxl.tmBasBomId,
                                                    bomVersion:xxl.bomVersion

                                                  });
                                              });

                                               return data;
                                          }
                                }) ;

					  }else{}

   }



//-----------------------------------------------------layui日期控件 date----------------------------------------------------
/***
***
***
***说明： 定义日期控件（开始日期和结束日期）,需要在layui.use方法里面使用
***/
function xxlDate(startDateId,endDateId,formId){
        var startParms = '#'+formId+ ' ' +'#' + startDateId;
				var endParms =  '#'+formId+ ' ' +'#' + endDateId;

	 	    var start = {
	 				istime : true,
	 				istoday : false,
	 				choose : function(datas) {
	 					end.min = datas; // 开始日选好后，重置结束日的最小日期
	 					end.start = datas // 将结束日的初始值设定为开始日
	 				},clear : function(){
	 					end.min = null;
	 					end.start = null;
	 				}
	 			};
	 			var end = {
	 				istime : true,
	 				istoday : false,
	 				choose : function(datas) {
	 					start.max = datas; // 结束日选好后，重置开始日的最大日期
	 				},clear : function(){
	 					start.max = null;
	 				}
	 			};

				$(startParms).change(function () {
					if (this.value == '') {
						end.min = null;
						end.start = null;
					}
				})
				$(endParms).change(function () {
					if (this.value == '') {
	 					start.max = null;
	 				}
				 })
				 $(startParms).click(function() {
 							var startVal = $(startParms).val();
 			 				start.elem = this;
 			 				laydate(start);
 			 				if(startVal == ''){
 			 					$(startParms).val("");
 			 				}
 				})
 				$(endParms).click(function() {
 							var endVal = $(endParms).val();
 			 				end.elem = this;
 			 				laydate(end);
 			 				if(endVal == ''){
 			 					$(endParms).val("");
 			 				}
 				})
	 }






//----------------------------------------------------------传值方法  url-----------------------------------------------------
/***
 ***
 ***请求：window.location.href = "../BasRouteUloc/basRouteUloc.html?plant="+plant+"&tmBasPlantId="+tmBasPlantId
 ***取值：var plant=xxlParam.parm("plant");  plant是url地址中传递时带的
 ***参考basRoute.js和basRouteUloc.js
***/
xxlParam = function() { // url参数
 var data, index;
 (function init() {
  data = [];
  index = {};
  var u = window.location.search.substr(1);
  if (u != '') {
   var parms = decodeURIComponent(u).split('&');
   for (var i = 0, len = parms.length; i < len; i++) {
    if (parms[i] != '') {
     var p = parms[i].split("=");
     if (p.length == 1 || (p.length == 2 && p[1] == '')) {// p | p=
      data.push(['']);
      index[p[0]] = data.length - 1;
     } else if (typeof(p[0]) == 'undefined' || p[0] == '') { // =c | =
      data[0] = [p[1]];
     } else if (typeof(index[p[0]]) == 'undefined') { // c=aaa
      data.push([p[1]]);
      index[p[0]] = data.length - 1;
     } else {// c=aaa
      data[index[p[0]]].push(p[1]);
     }
    }
   }
  }
 })();
 return {
  // 获得参数,类似request.getParameter()
  parm : function(o) { // o: 参数名或者参数次序
   try {
    return (typeof(o) == 'number' ? data[o][0] : data[index[o]][0]);
   } catch (e) {
   }
  },
  //获得参数组, 类似request.getParameterValues()
  parmValues : function(o) { // o: 参数名或者参数次序
   try {
    return (typeof(o) == 'number' ? data[o] : data[index[o]]);
   } catch (e) {}
  },
  //是否含有parmName参数
  hasParm : function(parmName) {
   return typeof(parmName) == 'string' ? typeof(index[parmName]) != 'undefined' : false;
  },
  // 获得参数Map ,类似request.getParameterMap()
  parmMap : function() {
   var map = {};
   try {
    for (var p in index) { map[p] = data[index[p]]; }
   } catch (e) {}
   return map;
  }
 }
}();

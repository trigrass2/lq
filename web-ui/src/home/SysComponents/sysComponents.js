var urlPlant=apiUrl + "/base/plant/queryPlantSelect";
var urlWorkshop=apiUrl + "/base/workshop/queryWorkshopSelect";
var urlLine=apiUrl + "/base/line/queryLineSelect";
var urlUlocForWorkshop=apiUrl +"/base/uloc/queryUlocSelectForInput";			
var urlUlocForLine=apiUrl +"/base/uloc/queryUlocSelectForInputWithLineId";			
var urlStorage=apiUrl + "/base/basStorage/getAllStorage/1";
var urlAread=apiUrl + "/base/basStorage/getAllStorage/2";
var urlAreadByParentId=apiUrl + "/base/basStorage/findByParentId";
var urlLoc=apiUrl + "/base/basStorage/getLocbyParentAndGrandId";
var urlDock=apiUrl+"/base/basDock/queryDockSelect";
var urlPackage=apiUrl+"/base/baspackage/queryPackageSelect";
var urlCustom=apiUrl+"/worktime/custom/queryCustomSelect";
var urlSuppl=apiUrl+"/worktime/suppl/querySupplSelect";
var urlDunit=apiUrl+"/worktime/dunit/queryDunitSelect";
var urlPart=apiUrl+"/worktime/part/queryPart";
var urlProduct=apiUrl+"/worktime/part/queryProduct";
var urlPartgroup=apiUrl+"/plantlayout/basPartgroup/queryPartgroupList";
var urlPartgroupPart=apiUrl+"/plantlayout/basPartgroupPart/queryPartgroupPartList";
var urlBom=apiUrl+"/base/bom/queryBomList";
var urlRoute=apiUrl+"/base/route/queryRouteList";
var urlCodeList=apiUrl + "/system/codeList/queryCodeListSelect";





				$(function () {
					
					
					   
				
				
/* 1、单一工厂 */      dropList('singleTmPlantId',urlPlant,"","tmBasPlantId","plantNo","nameCnS");





/* 2、工厂+车间 */     dropList('tmPlantIdOfPlantAndWorkShop',urlPlant,"","tmBasPlantId","plantNo","nameCnS");
/* 2、工厂+车间 */     dropList('tmWorkshopIdOfPlantAndWorkShop',urlWorkshop,'pTmBasPlantId:'+$("#tmPlantIdOfPlantAndWorkShop").val(),"tmBasWorkshopId","workshopNo","nameCn");


/* 3、工厂+车间+产线 */     dropList('tmPlantIdOfPlantAndWorkShopAndLine',urlPlant,"","tmBasPlantId","plantNo","nameCnS");
/* 3、工厂+车间+产线 */     dropList('tmWorkshopIdOfPlantAndWorkShopAndLine',urlWorkshop,'pTmBasPlantId:'+$("#tmPlantIdOfPlantAndWorkShopAndLine").val(),"tmBasWorkshopId","workshopNo","nameCn");
/* 3、工厂+车间+产线 */     dropList('tmLineIdOfPlantAndWorkShopAndLine',urlLine,'wTmBasWorkshopId:'+$("#tmWorkshopIdOfPlantAndWorkShopAndLine").val(),"tmBasLineId","lineNo","nameCn");



/* 4、工厂+车间+工位 */    dropList('tmPlantIdOfPlantAndWorkShopAndUloc',urlPlant,"","tmBasPlantId","plantNo","nameCnS");
/* 4、工厂+车间+工位 */    dropList('tmWorkshopIdOfPlantAndWorkShopAndUloc',urlWorkshop,'pTmBasPlantId:'+$("#tmPlantIdOfPlantAndWorkShopAndUloc").val(),"tmBasWorkshopId","workshopNo","nameCn");
/* 4、工厂+车间+工位 */	 var datas={"pTmBasPlantId":$("#tmPlantIdOfPlantAndWorkShopAndUloc").val(),
							"wTmBasWorkshopId":$("#tmWorkshopIdOfPlantAndWorkShopAndUloc").val()};
					 initAutoComplete('tmUlocIdOfPlantAndWorkShopAndUloc',urlUlocForWorkshop,datas,'tmBasUlocId','ulocNo','name');
					 
/* 5、工厂+车间+产线+工位 */    dropList('tmPlantIdOfPlantAndWorkShopAndLineAndUloc',urlPlant,"","tmBasPlantId","plantNo","nameCnS");
/* 5、工厂+车间+产线+工位 */    dropList('tmWorkshopIdOfPlantAndWorkShopAndLineAndUloc',urlWorkshop,'pTmBasPlantId:'+$("#tmPlantIdOfPlantAndWorkShopAndLineAndUloc").val(),"tmBasWorkshopId","workshopNo","nameCn");
/* 5、工厂+车间+产线+工位 */    dropList('tmLineIdOfPlantAndWorkShopAndLineAndUloc',urlLine,'wTmBasWorkshopId:'+$("#tmWorkshopIdOfPlantAndWorkShopAndLineAndUloc").val(),"tmBasLineId","lineNo","nameCn");
		
/* 5、工厂+车间+产线+工位 */	 var datas1={
							 		 "pTmBasPlantId":$("#tmPlantIdOfPlantAndWorkShopAndLineAndUloc").val(),
									 "wTmBasWorkshopId":$("#tmWorkshopIdOfPlantAndWorkShopAndLineAndUloc").val(),
									 "lTmBasLineId":$("#tmLineIdOfPlantAndWorkShopAndLineAndUloc").val()
					 					};
					 
 /* 5、工厂+车间+产线+工位 */    initAutoComplete('tmUlocIdOfPlantAndWorkShopAndLineAndUloc',urlUlocForLine,datas1,'tmBasUlocId','ulocNo','name');
					
 /* 6、单一仓库 */            dropList('singleTmStorageId',urlStorage,"","tmStorageId","storageNo","name"); 
 
 /* 7、仓库+库区 */     dropList('tmStorageIdOfStorageAndAread',urlStorage,"","tmBasStorageId","storageNo","name");
 /* 7、仓库+库区 */     dropList('tmAreadIdOfStorageAndAread',urlAread,null,"tmBasStorageId","storageNo","name");
 
 
 /* 8、仓库+库区+库位 */     dropList('tmStorageIdOfStorageAndAreadAndLoc',urlStorage,"","tmBasStorageId","storageNo","name");
 /* 8、仓库+库区 +库位*/     dropList('tmAreadIdOfStorageAndAreadAndLoc',urlAread,null,"tmBasStorageId","storageNo","name");
					 var datas2={
					 		 "storage":$("#tmStorageIdOfStorageAndAreadAndLoc").val(),
							 "area":$("#tmAreadIdOfStorageAndAreadAndLoc").val()
									};
 /* 8、仓库+库区 +库位*/    initAutoComplete('tmLocIdOfStorageAndAreadAndLoc',urlLoc,datas2,'tmBasStorageId','storageNo','name');
 
 /* 9、单一道口 */   	initAutoComplete('singleTmDockId',urlDock,null,"tmBasDockId","dockNo","name");
 
 /* 10、单一包装 */  	initAutoComplete('singleTmPackageId',urlPackage,null,"tmBasPackageId","packageNo","name");
 
 /* 11、工厂+包装 */    dropList('tmPlantIdOfPlantAndPackage',urlPlant,"","tmBasPlantId","plantNo","nameCnS");
 /* 11、工厂+包装 */			var datas3={
 							"tmPlantId":$("#tmPlantIdOfPlantAndPackage").val()
 							};
 					initAutoComplete('tmPackageIdOfPlantAndPackage',urlPackage,datas3,"tmBasPackageId","packageNo","name");
 
 /* 12、客户 */   	initAutoComplete('custom',urlCustom,null,"tmBasCustomId","customNo","nameCnS");
 /* 13、供应商 */   initAutoComplete('suppl',urlSuppl,null,"tmBasSupplId","supplNo","nameCnS");
 /* 14、承运商 */   initAutoComplete('dunit',urlDunit,null,"tmBasDunitId","dunitNo","nameCnS");

 
 /* 15、工厂+物料 */    dropList('tmPlantIdOfPlantAndPart',urlPlant,"","tmBasPlantId","plantNo","nameCnS");
 /* 15、工厂+物料 */			var datas4={
 							"tmPlantId":$("#tmPlantIdOfPlantAndPart").val()
 							};
 					initAutoComplete('part',urlPart,datas4,"tmBasPartId","partNo","nameCn");
 					 
 /* 16、工厂+产品*/    dropList('tmPlantIdOfPlantAndProduct',urlPlant,"","tmBasPlantId","plantNo","nameCnS");
  /* 16、工厂+产品 */			var datas5={
 					 				"tmPlantId":$("#tmPlantIdOfPlantAndProduct").val()
 					 				};
 					 initAutoComplete('product',urlProduct,datas5,"tmBasPartId","partNo","nameCn"); 
/* 17、工厂+产品组*/   	 dropList('tmPlantIdOfPlantAndPartgroup',urlPlant,"","tmBasPlantId","plantNo","nameCnS");
/* 17、工厂+产品 组*/			var datas6={
 							 "tmBasPlantId":$("#tmPlantIdOfPlantAndPartgroup").val()
 						};
 					 initAutoComplete('partgroup',urlPartgroup,datas6,"tmBasPartgroupId","partgroupNo","name"); 
 
/* 18、工厂+产品组+工产品 */    dropList('tmPlantIdOfPlantAndPartgroupAndPart',urlPlant,"","tmBasPlantId","plantNo","nameCnS");

/* 18、工厂+产品组+工产品 */    dropList('tmPartgroupIdOfPlantAndPartgroupAndPart',urlPartgroup,'tmBasPlantId:'+$("#tmPlantIdOfPlantAndPartgroupAndPart").val(),"tmBasPartgroupId","partgroupNo","name");
/* 18、工厂+产品组+工产品 */	 var datas7={"tmBasPlantId":$("#tmPlantIdOfPlantAndPartgroupAndPart").val(),
 									"tmBasPartgroupId":$("#tmPartgroupIdOfPlantAndPartgroupAndPart").val()};
 					 initAutoComplete('tmPartIdOfPlantAndPartgroupAndPart',urlPartgroupPart,datas7,'tmBasPartgtoupPartId','partNo','nameCn');
 					 
 /* 19、工厂+Bom*/    dropList('tmPlantIdOfPlantAndBOM',urlPlant,"","tmBasPlantId","plantNo","nameCnS");
 /* 19、工厂+Bom*/			var datas8={
 					 					 				"tmBasPlantId":$("#tmPlantIdOfPlantAndBOM").val()
 					 					 				};
 					 					 initAutoComplete('tmBOMOfPlantAndBOM',urlBom,datas8,"tmBasBomId","partNo","nameCn"); 					 
 					 
 					 					 
 /* 20、工厂+工艺路径*/    dropList('tmPlantIdOfPlantAndRoute',urlPlant,"","tmBasPlantId","plantNo","nameCnS");
/* 20、工厂+工艺路径*/			var datas9={
 					 							 "tmBasPlantId":$("#tmPlantIdOfPlantAndRoute").val()
 					 					 };
 					 	 initAutoComplete('route',urlRoute,datas9,"tmBasRouteId","routeNo","name"); 					 
 					 					 
 	
/*21、数据词典*/     dropList('codeList',urlCodeList,"no:"+"PACKAGE_TYPE","tsSysCodeListId","no","name");					 					 
 					 					 
						});
			

				
				
				
				
				
/* 2、工厂+车间 */		$("#tmPlantIdOfPlantAndWorkShop").change(function(){
						$("#tmWorkshopIdOfPlantAndWorkShop").val("");
						dropList('tmWorkshopIdOfPlantAndWorkShop',urlWorkshop,'pTmBasPlantId:'+$("#tmPlantIdOfPlantAndWorkShop").val(),"tmBasWorkshopId","workshopNo","nameCn");
					});



/* 3、工厂+车间+产线 */	$("#tmPlantIdOfPlantAndWorkShopAndLine").change(function(){
					$("#tmWorkshopIdOfPlantAndWorkShopAndLine").val("");
					$("#tmLineIdOfPlantAndWorkShopAndLine").val("");
					dropList('tmWorkshopIdOfPlantAndWorkShopAndLine',urlWorkshop,'pTmBasPlantId:'+$("#tmPlantIdOfPlantAndWorkShopAndLine").val(),"tmBasWorkshopId","workshopNo","nameCn");
					dropList('tmLineIdOfPlantAndWorkShopAndLine',apiUrl + "/base/line/queryLineSelectByPlantId",'pTmBasPlantId:'+$("#tmPlantIdOfPlantAndWorkShopAndLine").val(),"tmBasLineId","lineNo","nameCn");
						
					});

/* 3、工厂+车间+产线 */	$("#tmWorkshopIdOfPlantAndWorkShopAndLine").change(function(){
					$("#tmLineIdOfPlantAndWorkShopAndLine").val("");
					if($("#tmWorkshopIdOfPlantAndWorkShopAndLine").val()==""||$("#tmWorkshopIdOfPlantAndWorkShopAndLine").val()==null){
						dropList('tmLineIdOfPlantAndWorkShopAndLine',apiUrl + "/base/line/queryLineSelectByPlantId",'pTmBasPlantId:'+$("#tmPlantIdOfPlantAndWorkShopAndLine").val(),"tmBasLineId","lineNo","nameCn");
						
					}else{
						dropList('tmLineIdOfPlantAndWorkShopAndLine',urlLine,'wTmBasWorkshopId:'+$("#tmWorkshopIdOfPlantAndWorkShopAndLine").val(),"tmBasLineId","lineNo","nameCn");
					}
					});
/* 4、工厂+车间+工位 */	$("#tmPlantIdOfPlantAndWorkShopAndUloc").change(function(){
					$("#tmWorkshopIdOfPlantAndWorkShopAndUloc").val("");
					$("#tmUlocIdOfPlantAndWorkShopAndUloc").val("");
					dropList('tmWorkshopIdOfPlantAndWorkShopAndUloc',urlWorkshop,'pTmBasPlantId:'+$("#tmPlantIdOfPlantAndWorkShopAndUloc").val(),"tmBasWorkshopId","workshopNo","nameCn");
					$('#tmUlocIdOfPlantAndWorkShopAndUloc').autocomplete( "destroy" );
					var datas={"pTmBasPlantId":$("#tmPlantIdOfPlantAndWorkShopAndUloc").val(),
							"wTmBasWorkshopId":$("#tmWorkshopIdOfPlantAndWorkShopAndUloc").val()};
					initAutoComplete('tmUlocIdOfPlantAndWorkShopAndUloc',urlUlocForWorkshop,datas,'tmBasUlocId','ulocNo','name');
					});
		

/* 4、工厂+车间+工位 */	$("#tmWorkshopIdOfPlantAndWorkShopAndUloc").change(function(){
	
						$("#tmUlocIdOfPlantAndWorkShopAndUloc").val("");
						$('#tmUlocIdOfPlantAndWorkShopAndUloc').autocomplete( "destroy" );
						var datas={"pTmBasPlantId":$("#tmPlantIdOfPlantAndWorkShopAndUloc").val(),
								"wTmBasWorkshopId":$("#tmWorkshopIdOfPlantAndWorkShopAndUloc").val()};
							initAutoComplete('tmUlocIdOfPlantAndWorkShopAndUloc',urlUlocForWorkshop,datas,'tmBasUlocId','ulocNo','name');
					});



/* 4、工厂+车间+工位 */
					$('#tmUlocIdOfPlantAndWorkShopAndUloc').keyup(event,function () {
						if(event.keyCode>=48&&event.keyCode<=105){
						var datas={"pTmBasPlantId":$("#tmPlantIdOfPlantAndWorkShopAndUloc").val(),
								"wTmBasWorkshopId":$("#tmWorkshopIdOfPlantAndWorkShopAndUloc").val()};
						initAutoComplete('tmUlocIdOfPlantAndWorkShopAndUloc',urlUlocForWorkshop,datas,'tmBasUlocId','ulocNo','name');
						}else if ((event.keyCode == 13||event.keyCode == 8||event.keyCode == 108||event.keyCode ==32)&& $('#tmUlocIdOfPlantAndWorkShopAndUloc').val()!=null ){
							var datas={"pTmBasPlantId":$("#tmPlantIdOfPlantAndWorkShopAndUloc").val(),
									"wTmBasWorkshopId":$("#tmWorkshopIdOfPlantAndWorkShopAndUloc").val()};
							initAutoComplete('tmUlocIdOfPlantAndWorkShopAndUloc',urlUlocForWorkshop,datas,'tmBasUlocId','ulocNo','name');
						}
						});
					
					
					
/* 5、工厂+车间+产线+工位 */ 	$("#tmPlantIdOfPlantAndWorkShopAndLineAndUloc").change(function(){
						$("#tmWorkshopIdOfPlantAndWorkShopAndLineAndUloc").val("");
						$("#tmLineIdOfPlantAndWorkShopAndLineAndUloc").val("");
						$("#tmUlocIdOfPlantAndWorkShopAndLineAndUloc").val("");
						dropList('tmWorkshopIdOfPlantAndWorkShopAndLineAndUloc',urlWorkshop,'pTmBasPlantId:'+$("#tmPlantIdOfPlantAndWorkShopAndLineAndUloc").val(),"tmBasWorkshopId","workshopNo","nameCn");
						dropList('tmLineIdOfPlantAndWorkShopAndLineAndUloc',urlLine,'wTmBasWorkshopId:'+$("#tmWorkshopIdOfPlantAndWorkShopAndLineAndUloc").val(),"tmBasLineId","lineNo","nameCn");
						
						$('#tmUlocIdOfPlantAndWorkShopAndLineAndUloc').autocomplete( "destroy" );
						var datas={"pTmBasPlantId":$("#tmPlantIdOfPlantAndWorkShopAndLineAndUloc").val(),
								"wTmBasWorkshopId":$("#tmWorkshopIdOfPlantAndWorkShopAndLineAndUloc").val(),
								"lTmBasLineId":$("#tmLineIdOfPlantAndWorkShopAndLineAndUloc").val()};
						initAutoComplete('tmUlocIdOfPlantAndWorkShopAndLineAndUloc',urlUlocForLine,datas,'tmBasUlocId','ulocNo','name');
					});
					
					
/* 5、工厂+车间+产线+工位 */	$("#tmWorkshopIdOfPlantAndWorkShopAndLineAndUloc").change(function(){
						$("#tmLineIdOfPlantAndWorkShopAndLineAndUloc").val("");
						$("#tmUlocIdOfPlantAndWorkShopAndLineAndUloc").val("");
						dropList('tmLineIdOfPlantAndWorkShopAndLineAndUloc',urlLine,'wTmBasWorkshopId:'+$("#tmWorkshopIdOfPlantAndWorkShopAndLineAndUloc").val(),"tmBasLineId","lineNo","nameCn");
						
						$('#tmUlocIdOfPlantAndWorkShopAndLineAndUloc').autocomplete( "destroy" );
						var datas={"pTmBasPlantId":$("#tmPlantIdOfPlantAndWorkShopAndLineAndUloc").val(),
								"wTmBasWorkshopId":$("#tmWorkshopIdOfPlantAndWorkShopAndLineAndUloc").val(),
								"lTmBasLineId":$("#tmLineIdOfPlantAndWorkShopAndLineAndUloc").val()};
						initAutoComplete('tmUlocIdOfPlantAndWorkShopAndLineAndUloc',urlUlocForLine,datas,'tmBasUlocId','ulocNo','name');
					});
/* 5、工厂+车间+产线+工位 */	$("#tmLineIdOfPlantAndWorkShopAndLineAndUloc").change(function(){
	
						$("#tmUlocIdOfPlantAndWorkShopAndLineAndUloc").val("");
						$('#tmUlocIdOfPlantAndWorkShopAndLineAndUloc').autocomplete( "destroy" );
						var datas={"pTmBasPlantId":$("#tmPlantIdOfPlantAndWorkShopAndLineAndUloc").val(),
								"wTmBasWorkshopId":$("#tmWorkshopIdOfPlantAndWorkShopAndLineAndUloc").val(),
								"lTmBasLineId":$("#tmLineIdOfPlantAndWorkShopAndLineAndUloc").val()};
						initAutoComplete('tmUlocIdOfPlantAndWorkShopAndLineAndUloc',urlUlocForLine,datas,'tmBasUlocId','ulocNo','name');
});
					
					
					

/* 5、工厂+车间+产线+工位 */  $('#tmUlocIdOfPlantAndWorkShopAndLineAndUloc').keyup(event,function () {
						if(event.keyCode>=48&&event.keyCode<=105){
							var datas={"pTmBasPlantId":$("#tmPlantIdOfPlantAndWorkShopAndLineAndUloc").val(),
									"wTmBasWorkshopId":$("#tmWorkshopIdOfPlantAndWorkShopAndLineAndUloc").val(),
									"lTmBasLineId":$("#tmLineIdOfPlantAndWorkShopAndLineAndUloc").val()};
							initAutoComplete('tmUlocIdOfPlantAndWorkShopAndLineAndUloc',urlUlocForLine,datas,'tmBasUlocId','ulocNo','name');
						}else if ((event.keyCode == 13||event.keyCode == 8||event.keyCode == 108||event.keyCode ==32)&& $('#tmUlocIdOfPlantAndWorkShopAndLineAndUloc').val()!=null ){
							var datas={"pTmBasPlantId":$("#tmPlantIdOfPlantAndWorkShopAndLineAndUloc").val(),
									"wTmBasWorkshopId":$("#tmWorkshopIdOfPlantAndWorkShopAndLineAndUloc").val(),
									"lTmBasLineId":$("#tmLineIdOfPlantAndWorkShopAndLineAndUloc").val()};
							initAutoComplete('tmUlocIdOfPlantAndWorkShopAndLineAndUloc',urlUlocForLine,datas,'tmBasUlocId','ulocNo','name');
						}
					});


/* 7、仓库+库区 */		$("#tmStorageIdOfStorageAndAread").change(function(){
					if($("#tmStorageIdOfStorageAndAread").val()!=null){
						$("#tmAreadIdOfStorageAndAread").val("");
		                dropList('tmAreadIdOfStorageAndAread',urlAreadByParentId+"/"+$("#tmStorageIdOfStorageAndAread").val(),null,"tmBasStorageId","storageNo","name");
					}else{
						$("#tmAreadIdOfStorageAndAread").val("");
		                dropList('tmAreadIdOfStorageAndAread',urlAread,null,"tmBasStorageId","storageNo","name");
					}
					});
/* 8、仓库+库区+库位 */		$("#tmStorageIdOfStorageAndAreadAndLoc").change(function(){
						if($("#tmStorageIdOfStorageAndAreadAndLoc").val()!=null){
							$("#tmAreadIdOfStorageAndAreadAndLoc").val("");
							dropList('tmAreadIdOfStorageAndAreadAndLoc',urlAreadByParentId+"/"+$("#tmStorageIdOfStorageAndAreadAndLoc").val(),null,"tmBasStorageId","storageNo","name");
							$('#tmLocIdOfStorageAndAreadAndLoc').val('');
							$('#tmLocIdOfStorageAndAreadAndLoc').autocomplete( "destroy" );
							var datas={
							 		 "storage":$("#tmStorageIdOfStorageAndAreadAndLoc").val(),
									 "area":$("#tmAreadIdOfStorageAndAreadAndLoc").val()
											};
							initAutoComplete('tmLocIdOfStorageAndAreadAndLoc',urlLoc,datas,'tmBasStorageId','storageNo','name');
						}else{
							$("#tmAreadIdOfStorageAndAread").val("");
							$('#tmLocIdOfStorageAndAreadAndLoc').val('');
							dropList('tmAreadIdOfStorageAndAreadAndLoc',urlAread,null,"tmBasStorageId","storageNo","name");
							$('#tmLocIdOfStorageAndAreadAndLoc').autocomplete( "destroy" );
							var datas={
							 		 "storage":$("#tmStorageIdOfStorageAndAreadAndLoc").val(),
									 "area":$("#tmAreadIdOfStorageAndAreadAndLoc").val()
											};
							initAutoComplete('tmLocIdOfStorageAndAreadAndLoc',urlLoc,datas,'tmBasStorageId','storageNo','name');
						}
					});

/* 8、仓库+库区+库位 */			$("#tmAreadIdOfStorageAndAreadAndLoc").change(function(){
							$('#tmLocIdOfStorageAndAreadAndLoc').val('');
							$('#tmLocIdOfStorageAndAreadAndLoc').autocomplete( "destroy" );
							var datas={
							 		 "storage":$("#tmStorageIdOfStorageAndAreadAndLoc").val(),
									 "area":$("#tmAreadIdOfStorageAndAreadAndLoc").val()
											};
							initAutoComplete('tmLocIdOfStorageAndAreadAndLoc',urlLoc,datas,'tmBasStorageId','storageNo','name');
						
							});

/* 8、仓库+库区 +库位*/  $('#tmLocIdOfStorageAndAreadAndLoc').keyup(event,function () {
					if(event.keyCode>=48&&event.keyCode<=105){
						var datas={
						 		 "storage":$("#tmStorageIdOfStorageAndAreadAndLoc").val(),
								 "area":$("#tmAreadIdOfStorageAndAreadAndLoc").val()
										};
						initAutoComplete('tmLocIdOfStorageAndAreadAndLoc',urlLoc,datas,'tmBasStorageId','storageNo','name');
					}else if ((event.keyCode == 13||event.keyCode == 8||event.keyCode == 108||event.keyCode ==32)&& $('#tmLocIdOfStorageAndAreadAndLoc').val()!=null ){
						var datas={
						 		 "storage":$("#tmStorageIdOfStorageAndAreadAndLoc").val(),
								 "area":$("#tmAreadIdOfStorageAndAreadAndLoc").val()
										};
						initAutoComplete('tmLocIdOfStorageAndAreadAndLoc',urlLoc,datas,'tmBasStorageId','storageNo','name');
					}
					});

/* 9、单独道口*/      $('#singleTmDockId').keyup(event,function () {
						if(event.keyCode>=48&&event.keyCode<=105){
							initAutoComplete('singleTmDockId',urlDock,null,"tmBasDockId","dockNo","name");
						}else if ((event.keyCode == 13||event.keyCode == 8||event.keyCode == 108||event.keyCode ==32)&& $('#tmLocIdOfStorageAndAreadAndLoc').val()!=null ){
							initAutoComplete('singleTmDockId',urlDock,null,"tmBasDockId","dockNo","name");
						}
					});
/* 10、单独包装*/      $('#singleTmPackageId').keyup(event,function () {
						if(event.keyCode>=48&&event.keyCode<=105){
							initAutoComplete('singleTmPackageId',urlPackage,null,"tmBasPackageId","packageNo","name");
						}else if ((event.keyCode == 13||event.keyCode == 8||event.keyCode == 108||event.keyCode ==32)&& $('#tmLocIdOfStorageAndAreadAndLoc').val()!=null ){
							initAutoComplete('singleTmPackageId',urlPackage,null,"tmBasPackageId","packageNo","name");
						}
					});


/* 11、工厂+包装*/	$("#tmPlantIdOfPlantAndPackage").change(function(){
						$('#tmPackageIdOfPlantAndPackage').val("");
						$('#tmPackageIdOfPlantAndPackage').autocomplete( "destroy" );
						var datas3={
	 							"tmPlantId":$("#tmPlantIdOfPlantAndPackage").val()
	 							};
						initAutoComplete('tmPackageIdOfPlantAndPackage',urlPackage,datas3,"tmBasPackageId","packageNo","name");
					});

/* 11、工厂+包装*/      $('#tmPackageIdOfPlantAndPackage').keyup(event,function () {
					if(event.keyCode>=48&&event.keyCode<=105){
						var datas3={
	 							"tmPlantId":$("#tmPlantIdOfPlantAndPackage").val()
	 							};
						initAutoComplete('tmPackageIdOfPlantAndPackage',urlPackage,datas3,"tmBasPackageId","packageNo","name");
					}else if ((event.keyCode == 13||event.keyCode == 8||event.keyCode == 108||event.keyCode ==32)&& $('#tmLocIdOfStorageAndAreadAndLoc').val()!=null ){
						var datas3={
	 							"tmPlantId":$("#tmPlantIdOfPlantAndPackage").val()
	 							};
						initAutoComplete('tmPackageIdOfPlantAndPackage',urlPackage,datas3,"tmBasPackageId","packageNo","name");
					}
					});

/* 12、客户*/      $('#custom').keyup(event,function () {
						if(event.keyCode>=48&&event.keyCode<=105){
							initAutoComplete('custom',urlCustom,null,"tmBasCustomId","customNo","nameCnS");
						}else if ((event.keyCode == 13||event.keyCode == 8||event.keyCode == 108||event.keyCode ==32)&& $('#tmLocIdOfStorageAndAreadAndLoc').val()!=null ){
							initAutoComplete('custom',urlCustom,null,"tmBasCustomId","customNo","nameCnS");
						}
										});
/* 13、供应商*/      $('#suppl').keyup(event,function () {
						if(event.keyCode>=48&&event.keyCode<=105){
							 initAutoComplete('suppl',urlSuppl,null,"tmBasSupplId","supplNo","nameCnS");
						}else if ((event.keyCode == 13||event.keyCode == 8||event.keyCode == 108||event.keyCode ==32)&& $('#tmLocIdOfStorageAndAreadAndLoc').val()!=null ){
							 initAutoComplete('suppl',urlSuppl,null,"tmBasSupplId","supplNo","nameCnS");
						}
					});
/* 14、承运商*/      $('#dunit').keyup(event,function () {
						if(event.keyCode>=48&&event.keyCode<=105){
							initAutoComplete('dunit',urlDunit,null,"tmBasDunitId","dunitNo","nameCnS");
						}else if ((event.keyCode == 13||event.keyCode == 8||event.keyCode == 108||event.keyCode ==32)&& $('#tmLocIdOfStorageAndAreadAndLoc').val()!=null ){
							initAutoComplete('dunit',urlDunit,null,"tmBasDunitId","dunitNo","nameCnS");
						}
					});


					
/* 15、工厂+物料*/	$("#tmPlantIdOfPlantAndPart").change(function(){
						$('#part').val("");
						$('#part').autocomplete( "destroy" );
						var datas4={
	 							"tmPlantId":$("#tmPlantIdOfPlantAndPart").val()
	 							};
	 					initAutoComplete('part',urlPart,datas4,"tmBasPartId","partNo","nameCn");
					});
					
/* 15、工厂+物料*/      $('#part').keyup(event,function () {
					if(event.keyCode>=48&&event.keyCode<=105){
						var datas4={
	 							"tmPlantId":$("#tmPlantIdOfPlantAndPart").val()
	 							};
	 					initAutoComplete('part',urlPart,datas4,"tmBasPartId","partNo","nameCn");
					}else if ((event.keyCode == 13||event.keyCode == 8||event.keyCode == 108||event.keyCode ==32)&& $('#part').val()!=null ){
						var datas4={
	 							"tmPlantId":$("#tmPlantIdOfPlantAndPart").val()
	 							};
	 					initAutoComplete('part',urlPart,datas4,"tmBasPartId","partNo","nameCn");
					}
					});



/* 16、工厂+产品*/	$("#tmPlantIdOfPlantAndProduct").change(function(){
					$('#product').val('');
					$('#product').autocomplete( "destroy" );
					var datas5={
				 				"tmPlantId":$("#tmPlantIdOfPlantAndProduct").val()
				 				};
				 initAutoComplete('product',urlProduct,datas5,"tmBasPartId","partNo","nameCn"); 
				});
				
/* 16、工厂+产品*/      $('#product').keyup(event,function () {
				if(event.keyCode>=48&&event.keyCode<=105){
					var datas5={
				 				"tmPlantId":$("#tmPlantIdOfPlantAndProduct").val()
				 				};
				 initAutoComplete('product',urlProduct,datas5,"tmBasPartId","partNo","nameCn"); 
				}else if ((event.keyCode == 13||event.keyCode == 8||event.keyCode == 108||event.keyCode ==32)&& $('#product').val()!=null ){
					var datas5={
				 				"tmPlantId":$("#tmPlantIdOfPlantAndProduct").val()
				 				};
				 initAutoComplete('product',urlProduct,datas5,"tmBasPartId","partNo","nameCn"); 
				}
				});



/* 17、工厂+产品组*/	$("#tmPlantIdOfPlantAndPartgroup").change(function(){
				$('#partgroup').val('');
				$('#partgroup').autocomplete( "destroy" );
				var datas5={
						"tmBasPlantId":$("#tmPlantIdOfPlantAndPartgroup").val()
				};
				 initAutoComplete('partgroup',urlPartgroup,datas5,"tmBasPartgroupId","partgroupNo","name"); 
				});
			
/* 17、工厂+产品组*/      $('#partgroup').keyup(event,function () {
				if(event.keyCode>=48&&event.keyCode<=105){
					var datas5={
							"tmBasPlantId":$("#tmPlantIdOfPlantAndPartgroup").val()
					};
					 initAutoComplete('partgroup',urlPartgroup,datas5,"tmBasPartgroupId","partgroupNo","name"); 
				}else if ((event.keyCode == 13||event.keyCode == 8||event.keyCode == 108||event.keyCode ==32)&& $('#partgroup').val()!=null ){
					var datas5={
							"tmBasPlantId":$("#tmPlantIdOfPlantAndPartgroup").val()
					};
					 initAutoComplete('partgroup',urlPartgroup,datas5,"tmBasPartgroupId","partgroupNo","name"); 
				}
			});



/* 18、工厂+产品组+产品 */	$("#tmPlantIdOfPlantAndPartgroupAndPart").change(function(){
					$("#tmPartgroupIdOfPlantAndPartgroupAndPart").val("");
					$("#tmPartIdOfPlantAndPartgroupAndPart").val("");
					 dropList('tmPartgroupIdOfPlantAndPartgroupAndPart',urlPartgroup,'tmBasPlantId:'+$("#tmPlantIdOfPlantAndPartgroupAndPart").val(),"tmBasPartgroupId","partgroupNo","name");
					 var datas7={"tmBasPlantId":$("#tmPlantIdOfPlantAndPartgroupAndPart").val(),
								"tmBasPartgroupId":$("#tmPartgroupIdOfPlantAndPartgroupAndPart").val()};
				 initAutoComplete('tmPartIdOfPlantAndPartgroupAndPart',urlPartgroupPart,datas7,'tmBasPartgtoupPartId','partNo','nameCn');
				 });
				
				
/* 18、工厂+产品组+产品 */	$("#tmPartgroupIdOfPlantAndPartgroupAndPart").change(function(){
				
						$("#tmPartIdOfPlantAndPartgroupAndPart").val("");
						$('#tmPartIdOfPlantAndPartgroupAndPart').autocomplete( "destroy" );
						 var datas7={"tmBasPlantId":$("#tmPlantIdOfPlantAndPartgroupAndPart").val(),
									"tmBasPartgroupId":$("#tmPartgroupIdOfPlantAndPartgroupAndPart").val()};
					 initAutoComplete('tmPartIdOfPlantAndPartgroupAndPart',urlPartgroupPart,datas7,'tmBasPartgtoupPartId','partNo','nameCn');
					 });
				
				
				
/* 18、工厂+产品组+产品 */
					$('#tmPartIdOfPlantAndPartgroupAndPart').keyup(event,function () {
						if(event.keyCode>=48&&event.keyCode<=105){
							 var datas7={"tmBasPlantId":$("#tmPlantIdOfPlantAndPartgroupAndPart").val(),
	 									"tmBasPartgroupId":$("#tmPartgroupIdOfPlantAndPartgroupAndPart").val()};
	 					 initAutoComplete('tmPartIdOfPlantAndPartgroupAndPart',urlPartgroupPart,datas7,'tmBasPartgtoupPartId','partNo','nameCn');
	 					 }else if ((event.keyCode == 13||event.keyCode == 8||event.keyCode == 108||event.keyCode ==32)&& $('#tmPartIdOfPlantAndPartgroupAndPart').val()!=null ){
	 						 var datas7={"tmBasPlantId":$("#tmPlantIdOfPlantAndPartgroupAndPart").val(),
	 									"tmBasPartgroupId":$("#tmPartgroupIdOfPlantAndPartgroupAndPart").val()};
	 					 initAutoComplete('tmPartIdOfPlantAndPartgroupAndPart',urlPartgroupPart,datas7,'tmBasPartgtoupPartId','partNo','nameCn');
	 					 }
						});

/* 19、工厂+BOM*/ 	$("#tmPlantIdOfPlantAndBOM").change(function(){
						$('#tmBOMOfPlantAndBOM').val('');
						$('#tmBOMOfPlantAndBOM').autocomplete( "destroy" );
						var datas8={
					 				"tmBasPlantId":$("#tmPlantIdOfPlantAndBOM").val()
					 				};
					 initAutoComplete('tmBOMOfPlantAndBOM',urlBom,datas8,"tmBasBomId","partNo","nameCn"); 					 

					
						});
					
/* 19、工厂+BOM*/      $('#tmBOMOfPlantAndBOM').keyup(event,function () {
						if(event.keyCode>=48&&event.keyCode<=105){
							var datas8={
					 				"tmBasPlantId":$("#tmPlantIdOfPlantAndBOM").val()
					 				};
					 initAutoComplete('tmBOMOfPlantAndBOM',urlBom,datas8,"tmBasBomId","partNo","nameCn"); 					 
							}else if ((event.keyCode == 13||event.keyCode == 8||event.keyCode == 108||event.keyCode ==32)&& $('#partgroup').val()!=null ){
								var datas8={
						 				"tmBasPlantId":$("#tmPlantIdOfPlantAndBOM").val()
						 				};
						 initAutoComplete('tmBOMOfPlantAndBOM',urlBom,datas8,"tmBasBomId","partNo","nameCn"); 					 
								}
					});

		
/* 20、工厂+工艺路径*/	 $("#tmPlantIdOfPlantAndRoute").change(function(){
							$('#route').val('');
							$('#route').autocomplete( "destroy" );
							var datas9={
										 "tmBasPlantId":$("#tmPlantIdOfPlantAndRoute").val()
								 };
				initAutoComplete('route',urlRoute,datas9,"tmBasRouteId","routeNo","name"); 
							});
		
/* 20、工厂+工艺路径*/      $('#route').keyup(event,function () {
							if(event.keyCode>=48&&event.keyCode<=105){
								var datas9={
											 "tmBasPlantId":$("#tmPlantIdOfPlantAndRoute").val()
									 };
					 initAutoComplete('route',urlRoute,datas9,"tmBasRouteId","routeNo","name"); 
							}else if ((event.keyCode == 13||event.keyCode == 8||event.keyCode == 108||event.keyCode ==32)&& $('#partgroup').val()!=null ){
								var datas9={
											 "tmBasPlantId":$("#tmPlantIdOfPlantAndRoute").val()
									 };
					 initAutoComplete('route',urlRoute,datas9,"tmBasRouteId","routeNo","name"); 
							}
						});
		
































					// 初始化下拉框
					function dropList(selectId,url,where,resultId,no,name){
						var datas=null;
						if(where && where != null){
							// datas=JSON.stringify(where);
						 datas=where;
						var	strs=where.split(":");
						var	param=strs[0];
						var value=strs[1];	
						if(value!=""&&value!=null){
							datas={[param]:value};
							}
						
						}
						$.ajax({  
							type: "POST",
							url: url,  
					        data: datas,
					        dataType: "json",
					        contentType: "application/x-www-form-urlencoded",
					        beforeSend: function(request) {
					        	request.setRequestHeader("token", sessionStorage.token);
					        },
					        success: function (data) {
					        	$("#" + selectId).empty();
					        	$("#" + selectId).append("<option value=''>请选择</option>");
					            $.each(data.results,function (index, row) { 
					            	
					                $("#" + selectId).append("<option value="+row[resultId]+">" +row[no]+"-"+row[name] + "</option>");  
					            });  
					        }
					    });  
					}
					
					
				// 智能文本框
					 function initAutoComplete(id,url,datas,resultId,no,name){
						 	// id
							// 输入框#id，resultId为保存结果id值得隐藏输入框id，和entity属性id值保持一致;
						 if(datas!=null){
							 datas.name=$("#"+id).val().trim();
						 }else{
							 var datas={name:$("#"+id).val().trim()};
						 }
						 
						 $("#"+id).autocomplete({
						                source: function(request, response) {
						                    $.ajax({
						                    	type: "POST",
						                        url: url,
						                        dataType: "json",
						                        data:datas,
						                        success: function(data) {
						                            response($.map(data.results, function(item) {
						                                return { label: item[no]+"-"+item[name], value:item[no]+"-"+item[name],id: item[resultId] }
						                            }));
						                        }
						                    });
						                },
						　　　　　　　　　 select: function(event, ui) {
							 $("#"+resultId).val(ui.item.id);
						                },
						                minLength: 0, 
						                autoFocus: false, 
						                scrollHeight: 300, 
						                delay: 500 ,
						                matchContains: true
						            });
	}
		
					 
						/* 屏蔽本页面输入框enter键的页面刷新bug */         
						 $('input').keydown(event ,function(){
								if (event.keyCode == 13) {
							        return false;
							    }
							});		 
					 				
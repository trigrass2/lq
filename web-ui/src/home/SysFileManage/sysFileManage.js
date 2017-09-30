$(function () {
  $('#Resource_tree').height($(window).height() - 80);

  Ew.treefolders({
      id:'treeMenu',//放入树的id
      data:{},//传ajax的值
      url:'/system/file/queryFile',//url
      type:'radio', //radio单选  checkbox为多选
      treeField:['cid','pid','name','level','catalog'],//tsSysResourceId为id名 parentId父节点id名 name名称 level等级
      onCheck:function(data){
      //  console.log(data);

        $("#ewFileList").empty();
        //var treeObj = $.fn.zTree.getZTreeObj("tree");
        //var nodes = treeObj.getCheckedNodes(true);
        var treeObj = $.fn.zTree.getZTreeObj("treeMenu");
        var nodes = treeObj.getCheckedNodes(true);
      //  $("#address").val(this.catalog);
         $.each(nodes, function(indexs,items){
           var nodeChildrens = this.children;
           console.log(items);
           var cid = this.id;
          // if(nodeChildrens){
          //      $.each(nodeChildrens, function(index,item){
          //            $('#ewFileList').append(
          //              '<li  id="ewli" class="list-group-item">' +item.name+'</li>'
          //            )
          //    })
          //  }
          $("#address").html(this.catalog);
               $.each(folders, function(indexf,itemf){
                    $.each(itemf, function(indexff,itemff){
                        catalogAll = indexff.catalog;
                        if(cid==itemff.pid){
                              var fileShow;
                              var catalogData = itemff.catalog;
                              var dirPath = catalogData.toString().split('\\').join('/');
                               //---文件属性判断
                              if(itemff.dir==1){
                                    /*文件夹*/
                                    fileShow =   '<li id="ewli" class="list-group-item glyphicon  glyphicon-folder-open"  onclick="processDG(\''+itemff.cid+'\',\''+dirPath+ '\');">' +itemff.name+'</li>';
                              }else{
                                    /*文件(包括图片，html，js,jsp,rar,等各种格式)加入逻辑处理*/
                                    var str = itemff.name;
                                    var index = str .lastIndexOf(".");
                                    str  = str .substring(index + 1, str .length);
                                   if(str=='xls'||str=='doc'||str=='docx'||str=='ppt'){
                                      fileShow =   '<li   id="ewli" class="list-group-item glyphicon   glyphicon glyphicon-paperclip" onclick="btn_open(\''+itemff.name+'\',\''+dirPath+ '\');">' +itemff.name+'</li>';
                                    }else if(str=='rar'){
                                       fileShow =   '<li   id="ewli" class="list-group-item glyphicon    glyphicon glyphicon-tasks">' +itemff.name+'</li>';
                                    }else if(str=='html'){
                                        fileShow =   '<li   id="ewli" class="list-group-item glyphicon    glyphicon  glyphicon-cutlery">' +itemff.name+'</li>';
                                    }else if(str=='js'){
                                         fileShow =   '<li   id="ewli" class="list-group-item glyphicon    glyphicon glyphicon-record">' +itemff.name+'</li>';
                                    }else if(str=='txt'||str=='jpg'||str=='jpeg'||str=='png'||str=='gif'||str=='bmp'||str=='tiff'||str=='psd'||str=='tga'||str=='eps'){
                                            fileShow =   '<li   id="ewli" class="list-group-item glyphicon    glyphicon glyphicon-thumbs-up" onclick="btn_open(\''+itemff.name+'\',\''+dirPath+ '\');">' +itemff.name+'</li>';
                                    }else if(str=='sql'){
                                             fileShow =   '<li   id="ewli" class="list-group-item glyphicon    glyphicon glyphicon glyphicon-fire">' +itemff.name+'</li>';
                                    }else{
                                       fileShow =   '<li   id="ewli" class="list-group-item glyphicon   glyphicon glyphicon-camera">' +itemff.name+'</li>';
                                    }

                              }
                              //---文件展示
                              $('#ewFileList').append(fileShow);


                        }
                   })
             })




         });

        //console.log(nodes);

      }
  })

});


/**
*递归取文件，子文件，文件位置逻辑算法
*@param currentdate 当前文件位置数据，
*@param data 查询出所有树数据
*返回子文件---包括子文件夹，子文件
**/
function processDG(cid,dirPath){
          $("#ewFileList").empty();
          $("#address").html( dirPath);
        $.each(folders, function(indexf,itemf){
            $.each(itemf, function(indexff,itemff){
                catalogAll = indexff.catalog;
                if(cid==itemff.pid){
                  var fileShow;
                  var catalogData = itemff.catalog;
                  var dirCh = catalogData.toString().split('\\').join('/');
                   //---文件属性判断
                  if(itemff.dir==1){
                    /*文件夹*/
                     fileShow =   '<li id="ewli" class="list-group-item glyphicon  glyphicon-folder-open"  onclick="processDG(\''+itemff.cid+'\',\''+dirCh+ '\');">' +itemff.name+'</li>';
                  }else{
                    /*文件(包括图片，html，js,jsp,rar,等各种格式)加入逻辑处理*/
                    var str = itemff.name;
                    var index = str .lastIndexOf(".");
                    str  = str .substring(index + 1, str .length);
                    if(str=='xls'||str=='doc'||str=='docx'||str=='ppt'){
                      fileShow =   '<li   id="ewli" class="list-group-item glyphicon   glyphicon glyphicon-paperclip"  onclick="btn_open(\''+itemff.name+'\',\''+dirCh+ '\');">' +itemff.name+'</li>';
                    }else if(str=='rar'){
                       fileShow =   '<li   id="ewli" class="list-group-item glyphicon    glyphicon glyphicon-tasks" onclick="btn_open(\''+itemff.name+'\',\''+dirCh+ '\');">' +itemff.name+'</li>';
                    }else if(str=='pdf'){
                        fileShow =   '<li   id="pdf" class="list-group-item glyphicon    glyphicon  glyphicon-cutlery"  onclick="btn_open(\''+itemff.name+'\',\''+dirCh+ '\');">' +itemff.name+'</li>';
                    }else if(str=='js'){
                         fileShow =   '<li   id="ewli" class="list-group-item glyphicon    glyphicon glyphicon-record">' +itemff.name+'</li>';
                    }else if(str=='txt'||str=='jpg'||str=='jpeg'||str=='png'||str=='gif'||str=='bmp'||str=='tiff'||str=='psd'||str=='tga'||str=='eps'){
                            fileShow =   '<li   id="ewli" class="list-group-item glyphicon    glyphicon glyphicon glyphicon-thumbs-up" onclick="btn_open(\''+itemff.name+'\',\''+dirCh+ '\');">' +itemff.name+'</li>';
                    }else if(str=='sql'){
                             fileShow =   '<li   id="ewli" class="list-group-item glyphicon    glyphicon glyphicon glyphicon-fire">' +itemff.name+'</li>';
                    }else{
                       fileShow =   '<li   id="ewli" class="list-group-item glyphicon   glyphicon glyphicon glyphicon-camera">' +itemff.name+'</li>';
                    }

                  }
                  //---文件展示
                  $('#ewFileList').append(fileShow);


                }
           })
     })
}



/**
*前进按键
**/
function FilePro(){

}


//后退按键
function FileBack(){

}

//上传
function btn_down(){

}

//下载
function btn_down(catalog){

}

//打开
function btn_open(name,dirCh){
  var index = name.lastIndexOf(".");
  var str  = name.substring(index + 1, name.length);
    if(str=='txt'||str=='jpg'||str=='jpeg'||str=='png'||str=='gif'||str=='bmp'||str=='tiff'||str=='psd'||str=='tga'||str=='eps'){
       /**txt,图片预览**/
       window.location.href= apiUrl +'/system/file/showTxtAndImage?catalog='+dirCh;
   }else if(str=='xls'||str=='doc'||str=='ppt'){
    var data= {
           			catalog:dirCh,
                fileType:str,
                name:name
             };
     datas = JSON.stringify(data);
     $.ajax({
         url:  apiUrl +'/system/file/showDXP',
         type: 'POST',
         data: datas,
         contentType:"application/json",
         dataType: 'JSON',
         success:function (data) {
              console.log(data.results);
              console.log(apiUrl+"反转地址");
              window.location.href="http://10.188.2.43:8080/" +"ewfile/" + data.results;
          }


     });

   }else if(str=='pdf'){
          var pos = name.lastIndexOf(".");
          var lastname = name.substring(pos+1,name.length);
          var namepdf = name.substring(0,pos);
          $('#ewFileList').append("<li id="+namepdf+"></li>");
          var  success=new PDFObject({ url:apiUrl+"/system/file/showPdf?catalog="+dirCh+"&fileName="+name,pdfOpenParams: {zoom:'100',view: 'FitV', page: '1' }}).embed(namepdf);

   }else{

   }

}

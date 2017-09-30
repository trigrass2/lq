$(function(){
  //下拉
  $('#combo1').select2({minimumResultsForSearch:-1});
  $("#combo1").on("select2:select", function (e) {
    if($(this).val()=='1'){
      $("#treeDemo").css('display','block');
      $("#table").css('display','none');
      $(".content1").css('display','none');
      $(".content2").css('display','block');
    }
    else if($(this).val()=='2'){
      $("#treeDemo").css('display','none');
      $("#table").css('display','block');
      $(".content1").css('display','block');
      $(".content2").css('display','none');
    }
  });

  //tree
    $.fn.zTree.init($("#treeDemo"), {
      check: {
        enable: true
      },
      data: {
        simpleData: {
          enable: true
        }
      }
    }, [
      { id:1, pId:0, name:"随意勾选 1", open:true},
      { id:11, pId:1, name:"随意勾选 1-1", open:true},
      { id:111, pId:11, name:"随意勾选 1-1-1"},
      { id:112, pId:11, name:"随意勾选 1-1-2"},
      { id:12, pId:1, name:"随意勾选 1-2", open:true},
      { id:121, pId:12, name:"随意勾选 1-2-1"},
      { id:122, pId:12, name:"随意勾选 1-2-2"},
      { id:2, pId:0, name:"随意勾选 2", checked:true, open:true},
      { id:21, pId:2, name:"随意勾选 2-1"},
      { id:22, pId:2, name:"随意勾选 2-2", open:true},
      { id:221, pId:22, name:"随意勾选 2-2-1", checked:true},
      { id:222, pId:22, name:"随意勾选 2-2-2"},
      { id:23, pId:2, name:"随意勾选 2-3"}
    ]);

  //表格
  //表格
  Ew.table('#table',
    {
      btnValues: [],
      tableId: 'table1',
      tableValue: {
        queryParams: function () {
          return {}
        },
        onClickRow: function (item) {
          console.log(item)
        },
        url: '/worktime/part/querylistByPage',
        columns: [{
          checkbox: true
        }, {
          field: 'tmBasPlantId',
          title: '仓库编号',
          align: 'center',
          sortable: true
        }, {
          field: 'partNo',
          title: '仓库名称',
          align: 'center',
          sortable: true
        }]
      }
    }
  );

//产线
  Ew.form('.content2',
    {
      formId:'demoform',
      columnNum:1,
      formList:[
        {idName:'combo10',text:'工厂',field:'wain',comboData: [{id: 1, text: '2222'},{id: 2, text: '333'}]},
        {idName:'combo11',text:'车间',comboData: [{id: 1, text: '2222'},{id: 2, text: '333'}],field:'ngng'}
  ]
})


//拖拽
  var index,maxLeft;
  $(function(){
    //range值提示
    // $(".f-hk").mouseenter(function(){
    //   $(this).find(".f-range-tips").css("display","block");
    // });
    // $(".f-hk").mouseleave(function(){
    //   $(this).find(".f-range-tips").css("display","none");
    // });

    //拖动开始X值
    var startX,preLeft,minLeft;
    var handle = false;
    var avge=2880/$(".f-hk").parent('div').width();//总时间/总长
    $(".f-hk").mousedown(function(e){
      //拖动开始的X坐标
      startX = e.pageX;
      //判断是否拖动的变量
      handle = true;
      index = $(".f-hk").index(this);
      //获取滑块下标
      preLeft = parseInt($(".f-hk").eq(index).css("left"));
      //获取滑块最左的值
      minLeft = parseInt($(".f-hk").eq(index-1).css("left"))
    })

    $(document).mousemove(function(e){
      e.stopPropagation();
      //是否点击滑块
      if(handle){
        //显示提示值
        $(".f-hk").eq(index).find(".f-range-tips").css("display","block");
        //是否第一个
        if(index==0){
          //是否最后一个
          if(index != $(".f-hk").length-1){
            maxLeft = parseInt(  $(".f-hk").eq(index+1).css("left")  )
          }else{
            maxLeft = $(".f-hk").parent('div').width();
          }

          var newLeft =e.pageX-startX+preLeft;
          //设置边界
          if(newLeft>maxLeft){
            newLeft = maxLeft;
          }
          if(newLeft<0){
            newLeft=0;
          }


          //执行拖动
          $(".f-hk").eq(index).css("left",newLeft);
          //动态改变提示的值
          //var myVal = parseInt( (1- (parseFloat($(".f-hk").eq(index).css("left"))-8*(index) ) /(500-8*(index+($(".f-hk ").length-index-1) ) ))*100 ) +"%" ;
          $(".f-hk").eq(index).find(".f-range-tips").html(setdate(newLeft*avge));
          //改变 信息表最小值
          $(".f-range-msg").eq(index).find(".f-valMin").html(newLeft);
          //改变信息表最大值
          if(index != $(".f-hk ").length-1){
            var max = $(".f-range-msg").eq(index+1).find(".f-valMax").html(newLeft) ;
          }
        }else{
          //是否最后一个
          if(index != $(".f-hk").length-1){
            maxLeft = parseFloat(  $(".f-hk").eq(index+1).css("left")  )
          }else{
            maxLeft = $(".f-hk").parent('div').width();
          }

          var newLeft =e.pageX-startX+preLeft;
          //设置边界
          if(newLeft>maxLeft){
            newLeft = maxLeft;
          }
          if(newLeft<minLeft){
            newLeft=minLeft;
          }

          //执行拖动
          $(".f-hk").eq(index).css("left",newLeft);
          //动态改变提示的值
          //var myVal = parseInt( (1- (parseFloat($(".f-hk").eq(index).css("left"))-8*(index) ) /(500-8*(index+($(".f-hk ").length-index-1) ) ))*100 ) +"%" ;
          $(".f-hk").eq(index).find(".f-range-tips").html(setdate(newLeft*avge));
          //改变信息表最小值
          $(".f-range-msg").eq(index).find(".f-valMin").html(newLeft );
          //改变信息表最大值
          if(index != $(".f-hk ").length-1){
            var max = $(".f-range-msg").eq(index+1).find(".f-valMax").html(newLeft) ;
          }
        }

        if(index%2==0){
          $('.content'+(index)).css({
            left:(newLeft+8)+'px',
            width:(parseInt($(".f-hk").eq(index+1).css("left"))-newLeft-8)+'px'
          });
          // if($('.content'+(index)).width()<30){
          //   $('.content'+(index)).find('span').css('display','none')
          // }
          // else{
          //   $('.content'+(index)).find('span').css('display','block')
          // }
        }
        else{
          $('.content'+Number(index-1)).css({
            left:(parseInt($(".f-hk").eq(index-1).css("left"))+8)+'px',
            width:(newLeft-parseInt($(".f-hk").eq(index-1).css("left"))-8)+'px'
          })
          // if($('.content'+Number(index-1)).width()<30){
          //   $('.content'+Number(index-1)).find('span').css('display','none')
          // }
          // else{
          //   $('.content'+Number(index-1)).find('span').css('display','block')
          // }
        }
      }
    })
    $(document).mouseup(function(){
      handle = false;
      //隐藏值
      // $(".f-range-tips").css("display","none");
    })

    //初始化
    for(i=0;i<$(".f-hk").length;i++){
      var avge=2880/$(".f-hk").parent('div').width();//总时间/总长
      //获取百分比
      var getVal = parseInt($(".f-hk").eq(i).find(".f-range-tips").html());
      // var totalWidth =  500-8*(i+4-1-i);
      // var setLeft = parseInt ((1-getVal/100) * (totalWidth))+8*(i);
      //初始化left值
      $(".f-hk").eq(i).css("left",getVal);
      //初始化最小值
      $(".f-range-msg").eq(i).find(".f-valMin").html(getVal+"%");
      //初始化最大值
      if(i != $(".f-hk").length-1){
        $(".f-range-msg").eq(i+1).find(".f-valMin").html(getVal+"%");
      }
      if(i%2==1){
        $('.content'+(i-1)).css({
          left:(parseInt($(".f-hk").eq(i-1).css("left"))+8)+'px',
          width:(parseInt($(".f-hk").eq(i).css("left"))-parseInt($(".f-hk").eq(i-1).css("left"))-8)+'px'
        })
      }
    }
  })


})

function setdate(date){
  var mintu=parseInt(date%60);
  var scend=Math.floor(date/60);
  return scend+':'+mintu
}

function setleft(date){


  var mintu=parseInt(date%60);
  var scend=Math.floor(date/60);
  return scend+':'+mintu

}
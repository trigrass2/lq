 var mainSearchData=[{
	  idName:'comboPlant',
	  text:'工厂',
	  comboUrl:'/base/ulocSiteContent/queryPlantSelect',
	  comboId:'tmBasPlantId',
	  comboText:'plant',
	  field:'tmBasPlantId',
      valid:['notEmpty'],
	  onClick:function(data){
		  $('#comboUloc').select2('val',['']);
	  }
  },
	  {
	  idName:'comboUloc',
	  text:'工位',

	 field:'tmBasUlocId',
	  comboUrl:'/andon/mmAndonCall/queryUlocSelectForInputWithLineId',
		comboData:{
			id:['comboPlant'],
			field:['pTmBasPlantId'],
			other:{ulocType:['P']}
		},
		comboId:'ulocNo',
		comboText:'ulocNo',

	  valid:['notEmpty'],
	  isSearch:true
  }];

// 所有参数
  var results,searchData;
$(function() {
  //搜索条件
    var init;
  Ew.search('.demoSearch', {
    title: '查询',
    textValues: mainSearchData,
	btnValues: [{
        btnId:'btnSearch',
        text:'搜索',
        onClick:function(data){
            searchData = data;
            searchAjax(searchData);
            function setRefresh() {
                init = setInterval(function () {
                    searchAjax(searchData);
                    clearInterval(init);
                    setRefresh();
                },15000)
            };
            setRefresh();
        }
    },{
        btnId:'btnClear',
        text:'重置',
        tableid:['lampContent'],
        onclick: function (data) {
            
        }
    }]
  });

    $('body').on('click','#btnClear',function () {
        $('#lampContent').html('');
        clearInterval(init);
    });

  Ew.panel('.lamp_bg',
    {
      title:'物料',
      panelType:'none',
      content:'<div  class="lamp" style="width: 100%; margin-top: -10px"><ul id="lampContent"></ul></div>',
      onLoadsucess:function() {

      }
    })
  window.onresize = function(){
    $('.lamp_list').css('height',($('.lamp_bg').height()-40)/3 + 'px')
  }
})


  function searchAjax(data) {
      $.ajax({
          type: 'POST',
          url: apiUrl + '/andon/mmAndonCall/querylistByPage',
          data: JSON.stringify(data),
          contentType:"application/json",
          dataType: 'JSON',
          success: function (data) {
              if (data.code === '10000') {
                  $('#lampContent').html('');
                  results = data.results;
                  for(var i = 0, j = results.length; i < j; i++){
                      var status = results[i].andonStatus;
                      status = status.replace(/^\s+|\s+$/g, "");
                      var libackground = '';
                      if (status === '') {
                          libackground = 'rgba(0, 0, 0,0.4)';
                      } else if (status === 'N') {
                          libackground = 'rgba(255,52,52,0.8)';
                      } else if (status === 'R') {
                          libackground = 'rgba(255, 180, 0,0.8)';
                      }
                      var ulHtml = '';
                      if (results[i].partNo === undefined) {
                          ulHtml += '<li id="lampLi'+i+'" class="lamp_list" style="width: 20%; float: left; box-sizing: border-box;border: 1px solid #555; height: '+ ($('.lamp_bg').height()-40)/3 +'px;background-image: url('+results[i].pictureAddr2+');background-repeat: no-repeat;background-size:cover;">' +
                              '<a style="display:block;height: '+ ($('.lamp_bg').height()-40)/3 +'px;background:'+libackground+';">' +
                              '<span class="lampSpan">'+results[i].partgroupNo+'</span><span>'+results[i].partgroupName+'</span>' +
                              '<span class="smallNum">'+ results[i].thumbQty +'</span>'+
                              '</a>'+
                              '</li>';
                          $('#lampContent').append(ulHtml);
                      } else {
                          ulHtml += '<li id="lampLi'+i+'" class="lamp_list" style="width: 20%; float: left; box-sizing: border-box;border: 1px solid #555; height: '+ ($('.lamp_bg').height()-40)/3 +'px;background-image: url('+results[i].pictureAddr+');background-repeat: no-repeat;background-size:cover;">' +
                              '<a style="display:block;height: '+ ($('.lamp_bg').height()-40)/3 +'px;background:'+libackground+';">' +
                              '<span class="lampSpan">'+results[i].partNo+'</span><span>'+results[i].partName+'</span>' +
                              '<span class="smallNum">'+ results[i].thumbQty +'</span>'+
                              '</a>'+
                              '</li>';
                          $('#lampContent').append(ulHtml);
                      }
                  }
                  var spanHei =  (($(".lamp_bg").height() - 40) / 3) / 3;
                  $('.lampSpan').css('padding-top',spanHei+'px');
              } else {
                  layer.msg(data.message,{icon:2,time:1000});
                  return;
              }
          }
      })
  }

  // 点击表格
$('body').on('click','#lampContent li',function (e) {
    var allResultsNum = parseInt((this.id).replace(/[^0-9]/ig,""));
    var $this = this;
    var $color = $('#' + $this.id + ' a').css('background-color');
    if ($color === 'rgba(0, 0, 0, 0.4)') {
        results[allResultsNum].andonStatus = 'N';
        dataVal = results[allResultsNum];
        $.ajax({
            type: 'POST',
            url: apiUrl + '/andon/mmAndonCall/andonHandle',
            data: JSON.stringify(dataVal),
            contentType:"application/json",
            dataType: 'JSON',
            success: function (data) {
                if (data.results) {
                    $('#' + $this.id + ' a').css('background-color','rgba(255,52,52,0.8)');
                    searchAjax(searchData);
                } else {
                    layer.msg(data.message,{icon:2,time:1000});
                    $('#' + $this.id + ' a').css('background-color','rgba(0, 0, 0, 0.4)');
                }
            }
        })
    } else if ($color === 'rgba(255, 52, 52, 0.8)') {
        layer.confirm('是否确认取消此暗灯需求？', {
            btn: ['确定','取消'], //按钮
            title: "提示",
            icon:7,
            skin: 'layer-ext-moon',
            area: ['287px'],
            btnAlign: 'c'
        },function () {
            results[allResultsNum].andonStatus = 'CA';
            dataVal = results[allResultsNum];
            $.ajax({
                type: 'POST',
                url: apiUrl + '/andon/mmAndonCall/andonHandle',
                data: JSON.stringify(dataVal),
                contentType:"application/json",
                dataType: 'JSON',
                success: function (data) {
                    if (data.results) {
                        layer.msg(data.message,{icon:1,time:1000});
                        $('#' + $this.id + ' a').css('background-color','rgba(0, 0, 0, 0.4)');
                        searchAjax(searchData);
                    } else {
                        layer.msg(data.message,{icon:2,time:1000});
                    }
                }
            })
        });
    } else if ($color === 'rgba(255, 180, 0, 0.8)') {
        layer.msg('该状态不允许操作！',{icon:2});
    }
})
  

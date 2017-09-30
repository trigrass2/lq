/**
 * Created by Administrator on 2017/9/7.
 */
var layer = layui.layer
$(function(){
    $(".divMenuBtn").hover(function(){
        $(this).addClass('divMenuHover').addClass('font-size-16');
        $(this).find('i').addClass('divMenuHover');
    },function(){
        $(this).removeClass('divMenuHover').removeClass('font-size-16');
        $(this).find('i').removeClass('divMenuHover');
    });
    //搜索条件
    var mainSearchData=[{
        idName:'inputCom52',
        text:'产品组',
        comboUrl:'/worktime/part/queryPartGroupSuggest',
        comboId:'tmBasPartgroupId',
        comboText:'partgroup',
        field:'partgroup',
        comboData:{
            id:['combo51'],
            field:['tmBasPlantId']
        },
        onClick:function(data){
            $('#inputCom53').val('');
        }
    },{

        idName:'inputCom53',
        text:'产品',
        comboUrl:'/worktime/part/queryPartPartGroupSuggest',
        comboData:
            {
                id:['combo51','inputCom52'],
                field:['tmBasPlantId','partgroup'],
                other:{}
            },
        comboId:'tmBasPartId',
        comboText:'part',
        field:'part',
        onClick:function(data){
            $('#inputCom54').val('');
        },
        onSuccess:function(data){
            console.log(data)
        }


    },{
        idName:'inputCom54',
        text:'工艺路径',
        comboUrl:'/base/route/queryBasRouteSuggest',
        comboData:
            {
                id:['combo51','inputCom53'],
                field:['tmBasPlantId','part'],
                other:{}
            },
        comboId:'tmBasRouteId',
        comboText:'route',
        field:'route',
        onSuccess:function(data){
            console.log(data)
        }

    },{
        idName:'combo55',
        field:'routeStatus',
        text:'状态',
        comboData:[{
            id:'N', text:'新建'
        },{
            id:'M', text:'维护中'
        },{
            id:'P', text:'发布'
        },{
            id:"S", text:'失效'
        }]
    }];

    //搜索
    Ew.search('.demoSearch',{
        title:'查询',
        listWidth:'300px',
        textValues:mainSearchData,
        btnValues:[{
            btnId:'search',
            text:'搜索',
            onClick:function(data){
                console.log(data)
                $('#table1').bootstrapTable('refresh');
            }
        },{
            btnId:'clear',
            text:'重置',
            tableid:['table1']
        }]
    });

});


(function ($) {
    window.Ewin = function () {
        var html = '<div id="[Id]" class="modal fade" role="dialog" aria-labelledby="modalLabel">' +
            '<div class="modal-dialog modal-sm">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
            '<h4 class="modal-title" id="modalLabel">[Title]</h4>' +
            '</div>' +
            '<div class="modal-body">' +
            '<p>[Message]</p>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<button type="button" class="btn btn-default cancel" data-dismiss="modal">[BtnCancel]</button>' +
            '<button type="button" class="btn btn-primary ok" data-dismiss="modal">[BtnOk]</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
        // var dialogdHtml = '<div id="[Id]" class="modal fade" role="dialog" aria-labelledby="modalLabel">' +
        //     '<div class="modal-dialog">' +
        //     '<div class="modal-content">' +
        //     '<div class="modal-header">' +
        //     '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
        //     '<h4 class="modal-title" id="modalLabel">[Title]</h4>' +
        //     '</div>' +
        //     '<div class="modal-body">' +
        //     '</div>' +
        //     '</div>' +
        //     '</div>' +
        //     '</div>';
        var reg = new RegExp("\\[([^\\[\\]]*?)\\]", 'igm');
        var generateId = function () {
            var date = new Date();
            return 'mdl' + date.valueOf();
        }
        var init = function (options) {
            options = $.extend({}, {
                title: "操作提示",
                message: "提示内容",
                btnok: "确定",
                btncl: "取消",
                width: 200,
                auto: false
            }, options || {});
            var modalId = generateId();
            var content = html.replace(reg, function (node, key) {
                return {
                    Id: modalId,
                    Title: options.title,
                    Message: options.message,
                    BtnOk: options.btnok,
                    BtnCancel: options.btncl
                }[key];
            });
            $('body').append(content);
            $('#' + modalId).modal({
                width: options.width,
                backdrop: 'static'
            });
            $('#' + modalId).on('hide.bs.modal', function (e) {
                $('body').find('#' + modalId).remove();
            });
            return modalId;
        }

        return {
            // alert: function (options) {
            //     if (typeof options == 'string') {
            //         options = {
            //             message: options
            //         };
            //     }
            //     var id = init(options);
            //     var modal = $('#' + id);
            //     modal.find('.ok').removeClass('btn-success').addClass('btn-primary');
            //     modal.find('.cancel').hide();
            //
            //     return {
            //         id: id,
            //         on: function (callback) {
            //             if (callback && callback instanceof Function) {
            //                 modal.find('.ok').click(function () { callback(true); });
            //             }
            //         },
            //         hide: function (callback) {
            //             if (callback && callback instanceof Function) {
            //                 modal.on('hide.bs.modal', function (e) {
            //                     callback(e);
            //                 });
            //             }
            //         }
            //     };
            // },
            confirm: function (options) {
                var id = init(options);
                var modal = $('#' + id);
                modal.find('.ok').removeClass('btn-primary').addClass('btn-success');
                modal.find('.cancel').show();
                return {
                    id: id,
                    on: function (callback) {
                        if (callback && callback instanceof Function) {
                            modal.find('.ok').click(function () { callback(true); });
                            modal.find('.cancel').click(function () { callback(false); });
                        }
                    },
                    hide: function (callback) {
                        if (callback && callback instanceof Function) {
                            modal.on('hide.bs.modal', function (e) {
                                callback(e);
                            });
                        }
                    }
                };
            }
            // dialog: function (options) {
            //     options = $.extend({}, {
            //         title: 'title',
            //         url: '',
            //         width: 800,
            //         height: 550,
            //         onReady: function () { },
            //         onShown: function (e) { }
            //     }, options || {});
            //     var modalId = generateId();
            //
            //     var content = dialogdHtml.replace(reg, function (node, key) {
            //         return {
            //             Id: modalId,
            //             Title: options.title
            //         }[key];
            //     });
            //     $('body').append(content);
            //     var target = $('#' + modalId);
            //     target.find('.modal-body').load(options.url);
            //     if (options.onReady())
            //         options.onReady.call(target);
            //     target.modal();
            //     target.on('shown.bs.modal', function (e) {
            //         if (options.onReady(e))
            //             options.onReady.call(target, e);
            //     });
            //     target.on('hide.bs.modal', function (e) {
            //         $('body').find(target).remove();
            //     });
            // }
        }
    }();
})(jQuery);

var graphicalData = {
    ProcessPathID:'eb2afa897f1645af8b4b43e5837c1e6c',
    ProcessName:'A4L工艺路径',
    Ticket:'ADECBBD2255859F7C9F2F2E6E7E92041FE80DD75081F074C7A934AFDC538673289A6E8BA188680A56CF70779FC413DE748D1B1E14E5D3DF9425AAF298A145F7CC9C8D30C9516BFDDEBAA28DD83E5BF8C9C675FA0C4C5BDBA514C661179A4E121F05CDCC858A8BED70F98C2BB732F097BDFCAA81F94C100DFD223F4AA58E0DC49268013886D6B17030925A2A844612DE7C5A3CAB09940B91B4E1B9990327221904C627B806619446707AF61871477082B14D9E7E04FBB55E53E54EA11FA5FDA4644AC692FD5C0273BC2AB3DDDC130F26B9A83659C093FB7A28816E88C4AFFEE595440144EEB328FAE43837D46CB23320C3C4C6604396DD98FEE03C77527CF282953084C34D4A2D32B5BC6BB17C4931DE07B0F9DDFA638277DC10306F4359215DC685D7FD4F578B5AF06F9DFD46EEB1054C5107ED2FD473598706438981A45FB6149120CA44634276F289F9FB7776499A4B4A4FD911B0EF998227402E62B6A556EF2EA46E0E1469A63C700515D425D8862A94FAE0928E60DBAAB41F939C823E47FFED5271A242DA60EFC5803882832C02F5027111312AAFD34DA0AE164BF8F6ECF2ACB74481E370A6A5A3CD8BF5C99AF2B77F38622F9BA346F5C87BC8080035CA2407FF2556ED7DB483AECEF96F9CF51ED4FFF2365B2607574BB4732D4061FF5D78D5DD7F9D53345A0856FF946A35087B6C429FCC9F4ED6D784B436C4D0143A3D0E53DF5E9846FF726B9ADC7BC2A1EC35D2EC40D537CA66F647127022E133530E7584E8AE3D251B26DA7CAA069C9ABB3C5939C6E2A50C3FBE434DB73293454E9EF4E6F9828BDFCA3A3EF2ED9F58593537452D3983310A60DDEB5066FC958BD79837A1F22468A3BE88448812B29E5851AE40998C68745E5144A71704B14D3B2C9FCA6BEDD1137EE2ABA3F3A58CBFD8BD37A0C9A1DFB7483DAFF6AE9E90FC828260AEE046B02BB3BB2FB377F8D52ACB1D52F5E03DBCB8E15D1E2CB6379C15F4D48C6FC53467C9D3F3307F6A2023CA81A59E3D5F73B5BF1B85B91C42875D442E1A7AE'
}
jQuery.support.cors = true;
var processPathID = graphicalData.ProcessPathID // '@ViewBag.ProcessPathID';
if (processPathID == '') {
    processPathID = -1;
}
var processName = graphicalData.ProcessName // '@ViewBag.ProcessName';
var ApiUrl = '10.0.0.1';
toastr.options.positionClass = 'toast-bottom-right';
var Ticket = graphicalData.Ticket // '@ViewBag.Ticket';
//全局变量
//选择器容器
var oRegionSelect;
//生成节点ID所需序号
var nodei = 0;
//保存状态
var logicStatus = -1;
//选择的线
var selConnect = null;
//所有连线的Tag属性集合
var lstConnectTag = [];
var strConnectType1,strConnectType2,strConnectType3,strConnectType4,strConnectType5,strConnectType6;
var Circle1, Circle2, Circle3, Circle4, Circle5, Circle6;
var $selectLine = $("#selectLine"); // 选择连线
var lineColor = '#1e8151'; // 连线颜色
var connInfoLine = {}; // 选择连线
var oneEndPoint = true;// 是否是第一次进入链接终点
var pointLineWidth = 25;
//页面初始化开始加载
$(function () {
    // $('._jsPlumb_overlay').removeClass('select-border');
    $('body').on('click','._jsPlumb_overlay',function () {
        var $svg = $(this).prev('svg');
        $svg.trigger('click');
    });

    // $('._jsPlumb_overlay').contextmenu({
    //     target: '#connect-menu',
    //     before: function (e) {
    //         e.preventDefault();
    //
    //     }
    // });

    $selectLine.on('change',function () {
        var $option = $(this).find('option:selected').text();
        var $i = $('#choiceLine i');
        var $divID = $('div[id^="divprocess"]');
        if ($option === '主线起始线') {
            console.log(11223344550066);
            lineColor = '#9A32CD';
            $i.css('color','#9A32CD');
        } else if ($option === '主线普通线') {
            lineColor = '#1e8151';
            $i.css('color','#1e8151');
        } else if ($option === '主线终点线') {
            lineColor = '#8B7500';
            $i.css('color','#8B7500');
        } else if ($option === '支线触发线') {
            lineColor = '#8B1A1A';
            $i.css('color','#8B1A1A');
        } else if ($option === '支线普通线') {
            lineColor = '#7A378B';
            $i.css('color','#7A378B');
        } else if ($option === '支线合装线') {
            lineColor = '#556B2F';
            $i.css('color','#556B2F');
        }
        changeEndPoint($divID,'RightMiddle');
        changeEndPoint($divID,'LeftMiddle');
        changeEndPoint($divID,'TopCenter');
        changeEndPoint($divID,'BottomCenter');
    });
    // 初始化删除连线下拉框
    selectLineInit();


    oSelect();
    //自适应屏幕
    $("#divContent").height($(window).height() - $("#divHead").height() - $("#divBottom").height() - 20);
    $(window).resize(function () {
        $("#divContent").height($(window).height() - $("#divHead").height() - $("#divBottom").height() - 20);
    });

    $("#dialog_open_submit").click(function () {
        var processPathIDSelect = $("#processpathselect  option:selected").attr("processPathID");
        var processName = $("#processpathselect  option:selected").html();
        if (processPathIDSelect != undefined) {
            //$("#processPathSpan").attr("processPathID", processPathIDSelect);
            //$("#processPathSpan").html(processName);
            $(document.body).append("<div class='ui-widget-overlay ui-front' style='z-index: 1000;'></div>");
            window.location.href = "/Factory/path/DragProcessPath?processPathID=" + processPathIDSelect + "&processName=" + processName;
        }
    });
    $("#dialog_connect_submit").click(function () {
        var selectconnectType = $("#SELconnectType  option:selected").attr("connecttype");
        var seqValue = $("#processSEQText").val();
        var processSourceId = $("#" + selConnect.sourceId).attr("processId");
        var processTargetId = $("#" + selConnect.targetId).attr("processId");
        var PointType1;
        if (selConnect.sourceEndpoint != undefined) {
            PointType1 = selConnect.sourceEndpoint.anchor.type;
        }
        else {
            PointType1 = selConnect.endpoints[0].anchor.type;
        }
        var PointType2;
        if (selConnect.targetEndpoint != undefined) {
            PointType2 = selConnect.targetEndpoint.anchor.type;
        }
        else {
            PointType2 = selConnect.endpoints[1].anchor.type;
        }
        var id = processSourceId + "_" + processTargetId + "_" + PointType1 + "_" + PointType2;
        AddConnnectTag(id, selectconnectType, seqValue);
        //删除当前线
        jsPlumb.detach(selConnect);
        //重新画一条线
        jsPlumb.connect({
            source: $("div[processId='" + processSourceId + "']").attr("id"),
            target: $("div[processId='" + processTargetId + "']").attr("id"),
            anchors: [PointType1, PointType2]
        }, GetCircle(selectconnectType));
    });
    $("#dialog_connect_Delete").click(function () {
        Ewin.confirm({ message: "是否删除当前从" + selConnect.source.innerText + "到" + selConnect.target.innerText + "的连接?" }).on(function (e) {
            if (!e) {
                return;
            }
            jsPlumb.detach(selConnect);
            $("#dialog-connect").modal('hide');
        })
    });

    $("body").on('resize','.process',function () {
        var width = $(this).width() - 2;
        var height = $(this).height() - 2;
        $(this).find('img').css({width:width + 'px',height:height + 'px'});
        $(this).find('label').css({top:-(height + 20)/2 + 'px'});
    });

    setTimeout(function () {
        var $jsPlumb_endpoint = $('#divCenter > ._jsPlumb_endpoint._jsPlumb_endpoint_anchor');
        $.each($jsPlumb_endpoint,function (i,v) {
            var width = parseInt($(v).css('width').replace("px", ""));
            var height = parseInt($(v).css('height').replace("px", ""));
            if(width > 5 && height > 5) {
                $(v).attr('title','点击连线！');

                $(v).bind({
                    mouseenter:function(e){
                        oneEndPoint = true;
                        if (e.which !== 1){
                            layer.tips('点击连线！', $(this),{
                                tips: [2, '#78BA32',],
                                time: 0
                            });
                        } else {
                            // var isEndPoint = $(v).hasClass('endpointDrag');
                            // var isEndPoint = $(v).hasClass('_jsPlumb_endpoint_connected');
                            // var isEndPoint = $(v).hasClass('ui-draggable-dragging');
                        }
                    },
                    mouseleave:function(){
                        oneEndPoint = true;
                        layer.closeAll('tips');
                    },mousedown:function(){
                        oneEndPoint = true;
                        layer.closeAll('tips');
                        // $(v).unbind('mouseenter');
                    },
                    mouseup:function(){
                        oneEndPoint = true;
                        layer.closeAll('tips');
                    },
                    mousemove:function(e){
                        if (e.which === 1){
                            if (oneEndPoint) {
                                var thisPoint = $('._jsPlumb_endpoint_drop_allowed');
                                layer.tips('松开连线！', thisPoint,{
                                    tips: [2, '#82c43b',],
                                    time: 0,
                                    success:function () {
                                        oneEndPoint = false;
                                        setTimeout(function () {
                                            oneEndPoint = true;
                                        }, 300)
                                    }
                                });
                            }
                        }
                    }
                });


            }
        });
    },
    0);
});

/*初始化选择连线下拉框*/
function selectLineInit () {
    var selectData=[
        { id: 1, text: '主线起始线'},
        { id: 2, text: '主线普通线' },
        { id: 3, text: '主线终点线' },
        { id: 4, text: '支线触发线' },
        { id: 5, text: '支线普通线' },
        { id: 5, text: '支线合装线' }
        ];
    $selectLine.select2({
        multiple: false,//是否多選
        data: selectData
    });
    $selectLine.select2("destroy").select2();
    $selectLine.select2('val','2');
};

/*选择连线方式执行事件*/
function changeEndPoint(id,position) {
    jsPlumb.addEndpoint(id, { anchors: position }, {
        DragOptions: { cursor: 'pointer', zIndex: 2000 },
        endpoint: ["Dot", { radius: 2 }],  //端点的形状
        connectorStyle: {
            strokeStyle: lineColor,
            fillStyle: "transparent",
            radius: 3,
            lineWidth: 2
        },//连接线的颜色，大小样式
        connectorHoverStyle: connectorHoverStyle,
        paintStyle: {
            strokeStyle: "transparent",
            fillStyle: "1e8151",
            radius: 5,
            lineWidth: pointLineWidth
        },		//端点的颜色样式
        //anchor: "AutoDefault",
        isSource: true,	//是否可以拖动（作为连线起点）
        connector: ["Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true }],  //连接线的样式种类有[Bezier],[Flowchart],[StateMachine ],[Straight ]
        isTarget: true,	//是否可以放置（连线终点）
        maxConnections: -1,	// 设置连接点最多可以连接几条线
        connectorOverlays: [
            ["Arrow", { width: 10, length: 10, location: 1 }],
            ['Label', { location: 0.5, label: "新建连线", id: 'label1', cssClass: 'aLabel' }]
        ]
    });
}

function AddConnnectTag(tID, t1, t2) {
    var isHad = false;
    for (var i = 0; i < lstConnectTag.length; i++) {
        if (tID == lstConnectTag[i].tID) {
            isHad = true;
            lstConnectTag[i].t1 = t1;
            lstConnectTag[i].t2 = t2;
        }
    }
    if (isHad == false) {
        lstConnectTag.push({
            tID: tID,
            t1: t1,
            t2: t2,
        });
    }
}
//页面初始化完成加载
$(document).ready(function () {
    $('#divContentLeftMenu').BootSideMenu({ side: "left", autoClose: false });

    $("#divCenter").droppable({
        scope: "progressnode",
        drop: function (event, ui) {
            // debugger
            //获取拖拽工艺节点的显示名称
            var processname = $(ui.helper).children("span").html();
            var progressnodeid = $(ui.helper).children("span").attr("progressnodeid");
            $("#" + progressnodeid).removeClass("progressnode");
            $("#" + progressnodeid).addClass("usedprogressnode");
            $("#" + progressnodeid).draggable({ scope: "progressnodenone"});
            var processId = $(ui.helper).children("span").attr("tag");
            //获取拖拽工艺节点的显示名称
            var left = parseInt(ui.offset.left - $("#divCenter").offset().left);
            var top = parseInt(ui.offset.top - $("#divCenter").offset().top);
            nodei = nodei + 1;
            var divID = "divprocess" + nodei;
            var processDiv = "<div class='process' id = " + divID + " processId='" + processId + "' progressnodeid='" + progressnodeid + "' style='position:absolute;left:" + left + "px;top:" + top + "px;width:120px;height: 120px;line-height: 36px;'>" +
                "<img style='width:116px;height: 116px;' src='../../../img/default1.png'><label style='position: relative;top: -70px;'>" + processname + "</label></div>";
            $(this).append(processDiv);
            // $(this).append("<div class='process' id = " + divID + " processId='" + processId + "' progressnodeid='" + progressnodeid + "' style='position:absolute;left:" + left + "px;top:" + top + "px;width:120px;height:36px;line-height: 36px;'><i class='fa fa-star'></i><label>" + processname + "</label></div>");
            //添加连接点
            var opointright = jsPlumb.addEndpoint(divID, { anchors: "RightMiddle" }, hollowCircle);
            var opointleft = jsPlumb.addEndpoint(divID, { anchors: "LeftMiddle" }, hollowCircle);
            var opointTop = jsPlumb.addEndpoint(divID, { anchors: "TopCenter" }, hollowCircle);
            var opointBottom = jsPlumb.addEndpoint(divID, { anchors: "BottomCenter" }, hollowCircle);
            //设置当前div可以被拖拽
            jsPlumb.draggable(divID);
            InitDivMenu(divID);
            $("#" + divID).draggable({
                containment: "parent",
                start: function () {
                    startMove();
                },
                drag: function (event, ui) {
                    MoveSelectDiv(event, ui, divID);
                    jsPlumb.repaintEverything();
                },
                stop: function () {
                    jsPlumb.repaintEverything();
                }
            });
            //设置当前div可以被改变大小
            $("#" + divID).resizable({
                resize: function () {
                    jsPlumb.repaintEverything();
                },
                stop: function () {
                    jsPlumb.repaintEverything();
                }
            });
            //设置当前div可以被选中
            oRegionSelect.InitRegions();
            //设置当前div可以被删除
            $("#" + progressnodeid).removeAttr("style");
            $("#" + progressnodeid).draggable({ disabled: true});
        }
    });

    //1.2 注册连点样式
    jsPlumb.importDefaults({
        EndpointStyles: [{ fillStyle: '#1e8151' }, { fillStyle: '#1e8151' }],//起点和终点的颜色
        Endpoints: [['Dot', { radius: -1 }], ['Dot', { radius: -1 }]]
    });
    //连线事件
    jsPlumb.bind("connection", function (connInfo, originalEvent) {
        if (connInfo.connection.sourceId == connInfo.connection.targetId) {
            jsPlumb.detach(connInfo);
            Ewin.alert('不能连接自己！');
        }
        else {
            InitConnectMenu(connInfo);
            $(connInfo.connection.canvas).on('click',function () {
                console.log(connInfo);
                connInfoLine = connInfo;
                $('._jsPlumb_overlay').removeClass('select-border');
                $(this).next('._jsPlumb_overlay').addClass('select-border');
            });
        }
    });
    oRegionSelect = new RegionSelect({
        region: '#divCenter div.process',
        selectedClass: 'seled',
        parentId: "divCenter"
    });
    oRegionSelect.select();

    //如果是打开已经保存的工艺路径
    if (processPathID != "-1") {
        var data3 = {
            "lstBlocks": [{
                "BlockId": "divprocess1",
                "BlockContent": "订单",
                "BlockX": "280",
                "BlockY": "95",
                "BlockWidth": "216",
                "BlockHeight": "150",
                "imgPath": "default1.png",
                "BlockTag": "00000000000000000000000000000000"
            },
                {
                    "BlockId": "divprocess2",
                    "BlockContent": "ZH01",
                    "BlockX": "395",
                    "BlockY": "420",
                    "BlockWidth": "150",
                    "BlockHeight": "180",
                    "imgPath": "default2.png",
                    "BlockTag": "f0a9010f2e8f4621bac3f2c750c1f5ba"
                },
                {
                    "BlockId": "divprocess3",
                    "BlockContent": "DY1",
                    "BlockX": "630",
                    "BlockY": "110",
                    "BlockWidth": "210",
                    "BlockHeight": "140",
                    "imgPath": "default3.png",
                    "BlockTag": "f2a63ac8f8d747d08a564d183f314a0f"
                },
                {
                    "BlockId": "divprocess4",
                    "BlockContent": "NS1",
                    "BlockX": "985",
                    "BlockY": "120",
                    "BlockWidth": "160",
                    "BlockHeight": "190",
                    "imgPath": "default4.png",
                    "BlockTag": "a9863a2d47034034a158b672867b0f9c"
                },
                {
                    "BlockId": "divprocess5",
                    "BlockContent": "HZ2",
                    "BlockX": "1375",
                    "BlockY": "120",
                    "BlockWidth": "300",
                    "BlockHeight": "140",
                    "imgPath": "default5.png",
                    "BlockTag": "76122da1c606412da7593c40d69b8579"
                },
                {
                    "BlockId": "divprocess6",
                    "BlockContent": "DP1",
                    "BlockX": "800",
                    "BlockY": "500",
                    "BlockWidth": "150",
                    "BlockHeight": "230",
                    "imgPath": "default6.png",
                    "BlockTag": "438e8d3d01184b80b81d9d991691ab21"
                },
                {
                    "BlockId": "divprocess7",
                    "BlockContent": "HZ1",
                    "BlockX": "1100",
                    "BlockY": "430",
                    "BlockWidth": "290",
                    "BlockHeight": "220",
                    "imgPath": "default7.png",
                    "BlockTag": "114c816a0a3e44a092f03a114cd58244"
                }],
            "lstConnect": [{
                "ConnectionId": "con_97",
                "PageSourceId": "00000000000000000000000000000000",
                "PageTargetId": "f0a9010f2e8f4621bac3f2c750c1f5ba",
                "SourcePointType": "RightMiddle",
                "TargetPointType": "LeftMiddle",
                "connectType": "1",
                "connectSEQ": "",
                "SourceText": "订单",
                "TargetText": "ZH01"
            },
                {
                    "ConnectionId": "con_103",
                    "PageSourceId": "f0a9010f2e8f4621bac3f2c750c1f5ba",
                    "PageTargetId": "f2a63ac8f8d747d08a564d183f314a0f",
                    "SourcePointType": "RightMiddle",
                    "TargetPointType": "LeftMiddle",
                    "connectType": "2",
                    "connectSEQ": "",
                    "SourceText": "ZH01",
                    "TargetText": "DY1"
                },
                {
                    "ConnectionId": "con_109",
                    "PageSourceId": "f2a63ac8f8d747d08a564d183f314a0f",
                    "PageTargetId": "438e8d3d01184b80b81d9d991691ab21",
                    "SourcePointType": "BottomCenter",
                    "TargetPointType": "LeftMiddle",
                    "connectType": "4",
                    "connectSEQ": "",
                    "SourceText": "DY1",
                    "TargetText": "DP1"
                },
                {
                    "ConnectionId": "con_115",
                    "PageSourceId": "f2a63ac8f8d747d08a564d183f314a0f",
                    "PageTargetId": "a9863a2d47034034a158b672867b0f9c",
                    "SourcePointType": "RightMiddle",
                    "TargetPointType": "LeftMiddle",
                    "connectType": "2",
                    "connectSEQ": "",
                    "SourceText": "DY1",
                    "TargetText": "NS1"
                },
                {
                    "ConnectionId": "con_121",
                    "PageSourceId": "438e8d3d01184b80b81d9d991691ab21",
                    "PageTargetId": "114c816a0a3e44a092f03a114cd58244",
                    "SourcePointType": "RightMiddle",
                    "TargetPointType": "BottomCenter",
                    "connectType": "6",
                    "connectSEQ": "",
                    "SourceText": "DP1",
                    "TargetText": "HZ1"
                },
                {
                    "ConnectionId": "con_127",
                    "PageSourceId": "a9863a2d47034034a158b672867b0f9c",
                    "PageTargetId": "114c816a0a3e44a092f03a114cd58244",
                    "SourcePointType": "RightMiddle",
                    "TargetPointType": "LeftMiddle",
                    "connectType": "2",
                    "connectSEQ": "",
                    "SourceText": "NS1",
                    "TargetText": "HZ1"
                },
                {
                    "ConnectionId": "con_133",
                    "PageSourceId": "114c816a0a3e44a092f03a114cd58244",
                    "PageTargetId": "76122da1c606412da7593c40d69b8579",
                    "SourcePointType": "RightMiddle",
                    "TargetPointType": "LeftMiddle",
                    "connectType": "3",
                    "connectSEQ": "",
                    "SourceText": "HZ1",
                    "TargetText": "HZ2"
                }]
        };

        var lstBlocks = data3.lstBlocks;
        var lstConnect = data3.lstConnect;
        //添加已经存在工艺节点到界面
        for (var i = 0; i < lstBlocks.length; i++) {
            //获取拖拽工艺节点的显示名称
            var progressnodeid = $("span[tag='" + lstBlocks[i].BlockTag + "']").attr("progressnodeid");
            // $("#" + progressnodeid).removeClass("progressnode").draggable({ scope: "progressnodenone" });
            $("#" + progressnodeid).removeClass("progressnode");
            $("#" + progressnodeid).addClass("usedprogressnode");
            var processId = lstBlocks[i].BlockTag;
            //获取拖拽工艺节点的显示名称
            nodei = nodei + 1;
            var divID = "divprocess" + nodei;
            var processDiv = "<div class='process' id = " + divID + " processId='" + processId + "' progressnodeid='" + progressnodeid + "' style='position:absolute;left:" + lstBlocks[i].BlockX + "px;top:" + lstBlocks[i].BlockY + "px;width:" + lstBlocks[i].BlockWidth + "px;height:" + lstBlocks[i].BlockHeight + "px;line-height: 36px;'>" +
                "<img style='width: "+ (lstBlocks[i].BlockWidth - 2) + "px;height: "+ (lstBlocks[i].BlockHeight - 2) +"px;' src='../../../img/"+lstBlocks[i].imgPath+"'><label style='position: relative;top: -70px;'>" + lstBlocks[i].BlockContent + "</label></div>";
            $("#divCenter").append(processDiv);
            // $("#divCenter").append("<div class='process' id = " + divID + " processId='" + processId + "' progressnodeid='" + progressnodeid + "' style='position:absolute;left:" + lstBlocks[i].BlockX + "px;top:" + lstBlocks[i].BlockY + "px;width:" + lstBlocks[i].BlockWidth + ";height:" + lstBlocks[i].BlockHeight + ";line-height: 36px;'><i class='fa fa-star'></i><label>" + lstBlocks[i].BlockContent + "</label></div>");
            //添加连接点
            var opointright = jsPlumb.addEndpoint(divID, { anchors: "RightMiddle" }, hollowCircle);
            var opointleft = jsPlumb.addEndpoint(divID, { anchors: "LeftMiddle" }, hollowCircle);
            var opointTop = jsPlumb.addEndpoint(divID, { anchors: "TopCenter" }, hollowCircle);
            var opointBottom = jsPlumb.addEndpoint(divID, { anchors: "BottomCenter" }, hollowCircle);
            //设置当前div可以被拖拽
            jsPlumb.draggable(divID);
            InitDivMenu(divID);
            $("#" + divID).draggable({
                containment: "parent",
                start: function () {
                    startMove();
                },
                drag: function (event, ui) {
                    MoveSelectDiv(event, ui, divID);
                    jsPlumb.repaintEverything();
                },
                stop: function () {
                    jsPlumb.repaintEverything();
                }
            });

            //设置当前div可以被改变大小
            $("#" + divID).resizable({
                resize: function () {
                    console.log(divID)
                    jsPlumb.repaintEverything();
                },
                stop: function () {
                    console.log(divID)
                    jsPlumb.repaintEverything();
                }
            });
            //设置当前div可以被选中
            oRegionSelect.InitRegions();
            //设置当前div可以被删除
        }
        $(".progressnode").draggable({ scope: "progressnode" });
        //添加已经存在连线到界面
        for (var i = 0; i < lstConnect.length; i++) {
            //var v2 = lstConnect[i].connectSEQ;
            var selectconnectType = lstConnect[i].connectType;
            var seqValue = lstConnect[i].connectSEQ;
            var id = lstConnect[i].PageSourceId + "_" + lstConnect[i].PageTargetId + "_" + lstConnect[i].SourcePointType + "_" + lstConnect[i].TargetPointType;
            AddConnnectTag(id, selectconnectType, seqValue);
            jsPlumb.connect({
                source: $("div[processId='" + lstConnect[i].PageSourceId + "']").attr("id"),
                target: $("div[processId='" + lstConnect[i].PageTargetId + "']").attr("id"),
                anchors: [lstConnect[i].SourcePointType, lstConnect[i].TargetPointType]
            }, GetCircle(selectconnectType));//
        }
    }
});

var dragInit = function () {
    // console.log($("#main-nav").html());
    // console.log(1199886677);
    //初始化拖拽
    $(".progressnode").draggable({
        scope: "progressnode",
        helper: "clone",
        start: function () { },
        drag: function (event, ui) { },
        stop: function () { }
    });
}

//初始化select
var oSelect = function () {
    var data2 = "<span id='processPathSpan' processPathID='eb2afa897f1645af8b4b43e5837c1e6c' plantID='bc07abb6308c4c34806fc8ac8b8417a9'>A4L工艺路径</span>";
    $("#processPathSpanDiv").html(data2);

    // var data1= "<li class='progressnode' id='f263633cf30e42109ae25c5cd99cc2d8'>\r\n                                    <i class='glyphicon glyphicon-th-list'></i>\r\n                                    <span tag='00000000000000000000000000000000' progressnodeid='f263633cf30e42109ae25c5cd99cc2d8'>订单</span>\r\n                           </li>\r\n\r\n                    <li>\r\n                        <a href='#bc07abb6308c4c34806fc8ac8b8417a9PID' class='nav-header collapsed' data-toggle='collapse'>\r\n                            <i class='glyphicon glyphicon-credit-card'></i>\r\n                            易往智能工厂4\r\n                        <span class='pull-right glyphicon glyphicon-chevron-down'></span>\r\n                        </a>\r\n                        <ul id='bc07abb6308c4c34806fc8ac8b8417a9PID' class='nav nav-list collapse secondmenu' style='height: 0px;'>\r\n<li>\r\n                            <a href='#5add12b50a714845a7f9ee7747fd4ba6WID' class='nav-header collapsed' data-toggle='collapse'>\r\n                                <i class='glyphicon glyphicon-th-list'></i>\r\n                                总装车间\r\n                                <span class='pull-right glyphicon glyphicon-chevron-down'></span>\r\n                            </a>\r\n                            <ul id='5add12b50a714845a7f9ee7747fd4ba6WID' class='nav nav-list collapse thirdmenu' style='height: 0px;'>\r\n<li class='progressnode' id='60eec32a66384d5b9501f66f212aa3d3'>\r\n                                    <i class='glyphicon glyphicon-th-list'></i>\r\n                                    <span tag='5c55c5e1cd814f8f906472bb6898aff7' progressnodeid='60eec32a66384d5b9501f66f212aa3d3'>XXKP</span>\r\n                                </li>\r\n<li class='progressnode' id='2a68550493ce43dca2267df2d3b59603'>\r\n                                    <i class='glyphicon glyphicon-th-list'></i>\r\n                                    <span tag='37ee60e5ea704f71bd0ddaaf3b91072a' progressnodeid='2a68550493ce43dca2267df2d3b59603'>ZL01</span>\r\n                                </li>\r\n<li class='progressnode' id='5d7437b5c7e3433f86d5415c6cbf675c'>\r\n                                    <i class='glyphicon glyphicon-th-list'></i>\r\n                                    <span tag='a9863a2d47034034a158b672867b0f9c' progressnodeid='5d7437b5c7e3433f86d5415c6cbf675c'>NS1</span>\r\n                                </li>\r\n<li class='progressnode' id='264205cf9080430097e9084dd4f545e9'>\r\n                                    <i class='glyphicon glyphicon-th-list'></i>\r\n                                    <span tag='76122da1c606412da7593c40d69b8579' progressnodeid='264205cf9080430097e9084dd4f545e9'>HZ2</span>\r\n                                </li>\r\n<li class='progressnode' id='0efd2e581eba4517aa8a601b242ab236'>\r\n                                    <i class='glyphicon glyphicon-th-list'></i>\r\n                                    <span tag='438e8d3d01184b80b81d9d991691ab21' progressnodeid='0efd2e581eba4517aa8a601b242ab236'>DP1</span>\r\n                                </li>\r\n<li class='progressnode' id='e064557773204327ba64649d0d060066'>\r\n                                    <i class='glyphicon glyphicon-th-list'></i>\r\n                                    <span tag='114c816a0a3e44a092f03a114cd58244' progressnodeid='e064557773204327ba64649d0d060066'>HZ1</span>\r\n                                </li>\r\n</ul></li>\r\n<li>\r\n                            <a href='#bc7958248a0548769c5b6123856ea391WID' class='nav-header collapsed' data-toggle='collapse'>\r\n                                <i class='glyphicon glyphicon-th-list'></i>\r\n                                焊装车间\r\n                                <span class='pull-right glyphicon glyphicon-chevron-down'></span>\r\n                            </a>\r\n                            <ul id='bc7958248a0548769c5b6123856ea391WID' class='nav nav-list collapse thirdmenu' style='height: 0px;'>\r\n<li class='progressnode' id='ba8cc0f008aa48ad9a821abb9425a182'>\r\n                                    <i class='glyphicon glyphicon-th-list'></i>\r\n                                    <span tag='f0a9010f2e8f4621bac3f2c750c1f5ba' progressnodeid='ba8cc0f008aa48ad9a821abb9425a182'>ZH01</span>\r\n                                </li>\r\n</ul></li>\r\n<li>\r\n                            <a href='#d26c660119104aaba969d0bcc87295ddWID' class='nav-header collapsed' data-toggle='collapse'>\r\n                                <i class='glyphicon glyphicon-th-list'></i>\r\n                                涂装车间\r\n                                <span class='pull-right glyphicon glyphicon-chevron-down'></span>\r\n                            </a>\r\n                            <ul id='d26c660119104aaba969d0bcc87295ddWID' class='nav nav-list collapse thirdmenu' style='height: 0px;'>\r\n<li class='progressnode' id='061db53654014b0e846cc79b96813fce'>\r\n                                    <i class='glyphicon glyphicon-th-list'></i>\r\n                                    <span tag='f2a63ac8f8d747d08a564d183f314a0f' progressnodeid='061db53654014b0e846cc79b96813fce'>DY1</span>\r\n                                </li>\r\n</ul></li>\r\n</ul></li>\r\n";
    // var data1= "";
    var data1= "<li class='progressnode' id='f263633cf30e42109ae25c5cd99cc2d8'>\r\n                                    <i class='fa fa-star'></i>\r\n                                    <span tag='00000000000000000000000000000000' progressnodeid='f263633cf30e42109ae25c5cd99cc2d8'>订单</span>\r\n                           </li>\r\n\r\n                    <li>\r\n                        <a href='#bc07abb6308c4c34806fc8ac8b8417a9PID' class='nav-header collapsed' data-toggle='collapse'>\r\n                            <i class='glyphicon glyphicon-credit-card'></i>\r\n                            易往智能工厂4\r\n                        <span class='pull-right glyphicon glyphicon-chevron-down'></span>\r\n                        </a>\r\n                        <ul id='bc07abb6308c4c34806fc8ac8b8417a9PID' class='nav nav-list collapse secondmenu' style='height: 0px;'>\r\n<li>\r\n                            <a href='#5add12b50a714845a7f9ee7747fd4ba6WID' class='nav-header collapsed' data-toggle='collapse'>\r\n                                <i class='fa fa-star'></i>\r\n                                总装车间\r\n                                <span class='pull-right glyphicon glyphicon-chevron-down'></span>\r\n                            </a>\r\n                            <ul id='5add12b50a714845a7f9ee7747fd4ba6WID' class='nav nav-list collapse thirdmenu' style='height: 0px;'>\r\n<li class='progressnode' id='60eec32a66384d5b9501f66f212aa3d3'>\r\n                                    <i class='fa fa-star'></i>\r\n                                    <span tag='5c55c5e1cd814f8f906472bb6898aff7' progressnodeid='60eec32a66384d5b9501f66f212aa3d3'>XXKP</span>\r\n                                </li>\r\n<li class='progressnode' id='2a68550493ce43dca2267df2d3b59603'>\r\n                                    <i class='fa fa-star'></i>\r\n                                    <span tag='37ee60e5ea704f71bd0ddaaf3b91072a' progressnodeid='2a68550493ce43dca2267df2d3b59603'>ZL01</span>\r\n                                </li>\r\n<li class='progressnode' id='5d7437b5c7e3433f86d5415c6cbf675c'>\r\n                                    <i class='fa fa-star'></i>\r\n                                    <span tag='a9863a2d47034034a158b672867b0f9c' progressnodeid='5d7437b5c7e3433f86d5415c6cbf675c'>NS1</span>\r\n                                </li>\r\n<li class='progressnode' id='264205cf9080430097e9084dd4f545e9'>\r\n                                    <i class='fa fa-star'></i>\r\n                                    <span tag='76122da1c606412da7593c40d69b8579' progressnodeid='264205cf9080430097e9084dd4f545e9'>HZ2</span>\r\n                                </li>\r\n<li class='progressnode' id='0efd2e581eba4517aa8a601b242ab236'>\r\n                                    <i class='fa fa-star'></i>\r\n                                    <span tag='438e8d3d01184b80b81d9d991691ab21' progressnodeid='0efd2e581eba4517aa8a601b242ab236'>DP1</span>\r\n                                </li>\r\n<li class='progressnode' id='e064557773204327ba64649d0d060066'>\r\n                                    <i class='fa fa-star'></i>\r\n                                    <span tag='114c816a0a3e44a092f03a114cd58244' progressnodeid='e064557773204327ba64649d0d060066'>HZ1</span>\r\n                                </li>\r\n</ul></li>\r\n<li>\r\n                            <a href='#bc7958248a0548769c5b6123856ea391WID' class='nav-header collapsed' data-toggle='collapse'>\r\n                                <i class='fa fa-star'></i>\r\n                                焊装车间\r\n                                <span class='pull-right glyphicon glyphicon-chevron-down'></span>\r\n                            </a>\r\n                            <ul id='bc7958248a0548769c5b6123856ea391WID' class='nav nav-list collapse thirdmenu' style='height: 0px;'>\r\n<li class='progressnode' id='ba8cc0f008aa48ad9a821abb9425a182'>\r\n                                    <i class='fa fa-star'></i>\r\n                                    <span tag='f0a9010f2e8f4621bac3f2c750c1f5ba' progressnodeid='ba8cc0f008aa48ad9a821abb9425a182'>ZH01</span>\r\n                                </li>\r\n</ul></li>\r\n<li>\r\n                            <a href='#d26c660119104aaba969d0bcc87295ddWID' class='nav-header collapsed' data-toggle='collapse'>\r\n                                <i class='fa fa-star'></i>\r\n                                涂装车间\r\n                                <span class='pull-right glyphicon glyphicon-chevron-down'></span>\r\n                            </a>\r\n                            <ul id='d26c660119104aaba969d0bcc87295ddWID' class='nav nav-list collapse thirdmenu' style='height: 0px;'>\r\n<li class='progressnode' id='061db53654014b0e846cc79b96813fce'>\r\n                                    <i class='fa fa-star'></i>\r\n                                    <span tag='f2a63ac8f8d747d08a564d183f314a0f' progressnodeid='061db53654014b0e846cc79b96813fce'>DY1</span>\r\n                                </li>\r\n</ul></li>\r\n</ul></li>\r\n";
    $("#main-nav").html(data1);
    dragInit();

    var data5 = [{
        "Name": "主线起始线",
        "Seq": 1,
        "CreateBy": null,
        "CreateDate": null,
        "UpdateBy": null,
        "UpdateDate": null,
        "Des": null,
        "ID": "b7b429aa87fe4705a0e1005e7b0ccba2",
        "TypeID": "04dc8c145ff74cd085321588409333b4",
        "Value": "1",
        "TypeName": "ULOC_CONNECT_TYPE",
        "IsSelected": false
    },
        {
            "Name": "主线普通线",
            "Seq": 2,
            "CreateBy": null,
            "CreateDate": null,
            "UpdateBy": null,
            "UpdateDate": null,
            "Des": null,
            "ID": "2c486028a4ce4b568b66f3e69dc879d5",
            "TypeID": "04dc8c145ff74cd085321588409333b4",
            "Value": "2",
            "TypeName": "ULOC_CONNECT_TYPE",
            "IsSelected": false
        },
        {
            "Name": "主线终点线",
            "Seq": 3,
            "CreateBy": null,
            "CreateDate": null,
            "UpdateBy": null,
            "UpdateDate": null,
            "Des": null,
            "ID": "14328651b89847138897780664d746a7",
            "TypeID": "04dc8c145ff74cd085321588409333b4",
            "Value": "3",
            "TypeName": "ULOC_CONNECT_TYPE",
            "IsSelected": false
        },
        {
            "Name": "支线触发线",
            "Seq": 4,
            "CreateBy": null,
            "CreateDate": null,
            "UpdateBy": null,
            "UpdateDate": null,
            "Des": null,
            "ID": "e39f5006fd4348cead9eebaa1f41efaf",
            "TypeID": "04dc8c145ff74cd085321588409333b4",
            "Value": "4",
            "TypeName": "ULOC_CONNECT_TYPE",
            "IsSelected": false
        },
        {
            "Name": "支线普通线",
            "Seq": 5,
            "CreateBy": null,
            "CreateDate": null,
            "UpdateBy": null,
            "UpdateDate": null,
            "Des": null,
            "ID": "367bd521014042969f171267f310bb6b",
            "TypeID": "04dc8c145ff74cd085321588409333b4",
            "Value": "5",
            "TypeName": "ULOC_CONNECT_TYPE",
            "IsSelected": false
        },
        {
            "Name": "支线合装线",
            "Seq": 6,
            "CreateBy": null,
            "CreateDate": null,
            "UpdateBy": null,
            "UpdateDate": null,
            "Des": null,
            "ID": "d4e1b5f66ee24d6db66694280aecb0b4",
            "TypeID": "04dc8c145ff74cd085321588409333b4",
            "Value": "6",
            "TypeName": "ULOC_CONNECT_TYPE",
            "IsSelected": false
        }];

    $.each(data5, function (i, item) {
        $("#SELconnectType").append("<option style='width:200px' connecttype='" + item.Value + "'>" + item.Name + "</option>");
        $("#connect-menu .dropdown-menu").append("<li><a tabindex='-1' href='#' operator='update" + item.Value + "'>修改为" + item.Name + "</a></li>");
        if(item.Value == "1") strConnectType1 = item.Name;
        if (item.Value == "2") strConnectType2 = item.Name;
        if (item.Value == "3") strConnectType3 = item.Name;
        if (item.Value == "4") strConnectType4 = item.Name;
        if (item.Value == "5") strConnectType5 = item.Name;
        if (item.Value == "6") strConnectType6 = item.Name;
    });
    //主线起始线1
    Circle1 = {
        paintStyle: {
            strokeStyle: "#9A32CD",
            fillStyle: "transparent",
            radius: 3,
            lineWidth: 2
        },		//端点的颜色样式
        connector: ["Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true }],  //连接线的样式种类有[Bezier],[Flowchart],[StateMachine ],[Straight ]
        overlays: [
            ['Arrow', { location: 1 }],//设置箭头和终点的距离
            ['Label', { location: 0.5, label: strConnectType1, id: 'label', cssClass: 'aLabel' }]
        ]
    };
    //主线普通线2
    Circle2 = {
        paintStyle: {
            strokeStyle: "#1e8151",
            fillStyle: "transparent",
            radius: 3,
            lineWidth: 2
        },		//端点的颜色样式
        connector: ["Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true }],  //连接线的样式种类有[Bezier],[Flowchart],[StateMachine ],[Straight ]
        overlays: [
            ['Arrow', { location: 1 }],//设置箭头和终点的距离
            ['Label', { location: 0.5, label: strConnectType2, id: 'label', cssClass: 'aLabel' }]
        ]
    };
    //主线终点线3
    Circle3 = {
        paintStyle: {
            strokeStyle: "#8B7500",
            fillStyle: "transparent",
            radius: 3,
            lineWidth: 2
        },		//端点的颜色样式
        connector: ["Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true }],  //连接线的样式种类有[Bezier],[Flowchart],[StateMachine ],[Straight ]
        overlays: [
            ['Arrow', { location: 1 }],//设置箭头和终点的距离
            ['Label', { location: 0.5, label: strConnectType3, id: 'label', cssClass: 'aLabel' }]
        ]
    };
    //支线触发线4
    Circle4 = {
        paintStyle: {
            strokeStyle: "#8B1A1A",
            fillStyle: "transparent",
            radius: 3,
            lineWidth: 2
        },		//端点的颜色样式
        connector: ["Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true }],  //连接线的样式种类有[Bezier],[Flowchart],[StateMachine ],[Straight ]
        overlays: [
            ['Arrow', { location: 1 }],//设置箭头和终点的距离
            ['Label', { location: 0.5, label: strConnectType4, id: 'label', cssClass: 'aLabel' }]
        ]
    };
    //支线普通线5
    Circle5 = {
        paintStyle: {
            strokeStyle: "#7A378B",
            fillStyle: "transparent",
            radius: 3,
            lineWidth: 2
        },		//端点的颜色样式
        connector: ["Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true }],  //连接线的样式种类有[Bezier],[Flowchart],[StateMachine ],[Straight ]
        overlays: [
            ['Arrow', { location: 1 }],//设置箭头和终点的距离
            ['Label', { location: 0.5, label: strConnectType5, id: 'label', cssClass: 'aLabel' }]
        ]
    };
    //支线合装线6
    Circle6 = {
        paintStyle: {
            strokeStyle: "#556B2F",
            fillStyle: "transparent",
            radius: 3,
            lineWidth: 2
        },		//端点的颜色样式
        connector: ["Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true }],  //连接线的样式种类有[Bezier],[Flowchart],[StateMachine ],[Straight ]
        overlays: [
            ['Arrow', { location: 1 }],//设置箭头和终点的距离
            ['Label', { location: 0.5, label: strConnectType6, id: 'label', cssClass: 'aLabel' }]
        ]
    };
};


//根据不同的线类型，显示不同样式的线
function GetCircle(connectType) {
    switch (connectType) {
        case "1"://主线起始线
            return Circle1;
        case "2"://主线普通线
            return Circle2;
        case "3"://主线终点线
            return Circle3;
        case "4"://支线触发线
            return Circle4;
        case "5"://支线普通线
            return Circle5;
        case "6"://支线合装线
            return Circle6;
        default:
            return Circle;
    }
}
function GetSelectCircle() {
    var $option = $(this).find('option:selected').text();
    switch ($option) {
        case "1"://主线起始线
            return Circle1;
        case "2"://主线普通线
            return Circle2;
        case "3"://主线终点线
            return Circle3;
        case "4"://支线触发线
            return Circle4;
        case "5"://支线普通线
            return Circle5;
        case "6"://支线合装线
            return Circle6;
        default:
            return Circle;
    }
}

//获取选中连线的类型
function GetConnectType(conn) {
    var processSourceId = $("#" + conn.sourceId).attr("processId");
    var processTargetId = $("#" + conn.targetId).attr("processId");
    var PointType1;
    if (conn.sourceEndpoint != undefined) {
        PointType1 = conn.sourceEndpoint.anchor.type;
    }
    else {
        PointType1 = conn.endpoints[0].anchor.type;
    }
    var PointType2;
    if (conn.targetEndpoint != undefined) {
        PointType2 = conn.targetEndpoint.anchor.type;
    }
    else {
        PointType2 = conn.endpoints[1].anchor.type;
    }
    var id = processSourceId + "_" + processTargetId + "_" + PointType1 + "_" + PointType2;
    var result1 = "";
    for (var i = 0; i < lstConnectTag.length; i++) {
        if (lstConnectTag[i].tID == id) {
            result1 = lstConnectTag[i].t1;
        }
    }
    return result1;
}

//获取选中连线的SEQ
function GetConnectSEQ(conn) {
    var processSourceId = $("#" + conn.sourceId).attr("processId");
    var processTargetId = $("#" + conn.targetId).attr("processId");
    var PointType1;
    if (conn.sourceEndpoint != undefined) {
        PointType1 = conn.sourceEndpoint.anchor.type;
    }
    else {
        PointType1 = conn.endpoints[0].anchor.type;
    }
    var PointType2;
    if (conn.targetEndpoint != undefined) {
        PointType2 = conn.targetEndpoint.anchor.type;
    }
    else {
        PointType2 = conn.endpoints[1].anchor.type;
    }
    var id = processSourceId + "_" + processTargetId + "_" + PointType1 + "_" + PointType2;
    var result2 = "";
    for (var i = 0; i < lstConnectTag.length; i++) {
        if (lstConnectTag[i].tID == id) {
            result2 = lstConnectTag[i].t2;
        }
    }
    return result2;
}

//保存工艺路径
function SaveProcessPath() {
    //指示此次操作为保存
    logicStatus = 0;
    SaveData();
}

//保存数据的具体方法
function SaveData() {
    //工厂ID
    var plantID = $("#plantselect option:selected").attr("plantID");
    //工艺路径名称
    var processPathName;
    if (processPathID == "-1")
        processPathName = $("#processPathText").val();
    else if (logicStatus == 1)
        processPathName = $("#processPathText").val();
    else
        processPathName = $("#processPathSpan").html();
    if (processPathName == undefined || processPathName.replace(/(^\s*)|(\s*$)/g, '') == "") {
        Ewin.alert('请输入工艺路径名称');
        return;
    }
    //取得所有的连线
    var connects = [];
    $.each(jsPlumb.getAllConnections(), function (idx, connection) {
        var processSourceId = $("#" + connection.sourceId).attr("processId");
        var processTargetId = $("#" + connection.targetId).attr("processId");
        var selectconnectType = GetConnectType(connection);
        var seqValue = GetConnectSEQ(connection);
        var sd = $("#" + connection.id).html;
        var PointType1;
        if (connection.sourceEndpoint != undefined) {
            PointType1 = connection.sourceEndpoint.anchor.type;
        }
        else {
            PointType1 = connection.endpoints[0].anchor.type;
        }
        var PointType2;
        if (connection.targetEndpoint != undefined) {
            PointType2 = connection.targetEndpoint.anchor.type;
        }
        else {
            PointType2 = connection.endpoints[1].anchor.type;
        }

        connects.push({
            ConnectionId: connection.id,
            PageSourceId: processSourceId,
            PageTargetId: processTargetId,
            SourcePointType: PointType1,
            TargetPointType: PointType2,
            SourceText: connection.source.innerText,
            TargetText: connection.target.innerText,
            connectType: selectconnectType,
            connectSEQ: seqValue,
        });
    });
    //2.取得所有的节点
    var blocks = [];
    $("#divCenter .process").each(function (idx, elem) {
        var $elem = $(elem);
        blocks.push({
            BlockId: $elem.attr('id'),
            BlockContent: $elem.find("label")[0].innerHTML,
            BlockX: parseInt($elem.css("left"), 10),
            BlockY: parseInt($elem.css("top"), 10),
            BlockWidth: $elem.css("width"),
            BlockHeight: $elem.css("height"),
            BlockTag: $elem.attr("processId")
        });
    });

    //转换为Json，发送到Ajax请求
    var serlizaConnects = JSON.stringify(connects);
    var serlizaBlocks = JSON.stringify(blocks);


    $.ajax({
        type: "post",
        url: ApiUrl + "/ActionApi/ProcessPath/SaveProcessPath",
        data: {
            strConnectsJson: escape(serlizaConnects),
            strBlocksJson: escape(serlizaBlocks),
            plantID: plantID,
            processPathName: processPathName,
            processPathID: processPathID,
            saveStatus: logicStatus
        },
        success: function (data, status) {
            processPathID = data.processPathID;
            $("#processPathSpan").attr("processPathID", processPathID);
            $("#processPathSpan").html(processPathName);
            Ewin.alert('保存成功');
        },
        error: function (e) {
            Ewin.alert(e);
        },
        complete: function () {
            //alert("complete");
        }
    });

}

function InitConnectMenu(connInfo) {
    $('._jsPlumb_overlay').contextmenu({
        target: '#connect-menu',
        onItem: function (context, e) {
            var stroperator = $(e.target).attr("operator");
            var selectconnectType = GetConnectType(connInfo);
            var seqValue = GetConnectSEQ(connInfo);
            var processSourceId = $("#" + connInfo.sourceId).attr("processId");
            var processTargetId = $("#" + connInfo.targetId).attr("processId");
            var PointType1;
            if (connInfo.sourceEndpoint != undefined) {
                PointType1 = connInfo.sourceEndpoint.anchor.type;
            }
            else {
                PointType1 = connInfo.endpoints[0].anchor.type;
            }
            var PointType2;
            if (connInfo.targetEndpoint != undefined) {
                PointType2 = connInfo.targetEndpoint.anchor.type;
            }
            else {
                PointType2 = connInfo.endpoints[1].anchor.type;
            }
            var id = processSourceId + "_" + processTargetId + "_" + PointType1 + "_" + PointType2;

            if (stroperator == "delete") {
                Ewin.confirm({ message: "是否删除当前从" + connInfo.source.innerText + "到" + connInfo.target.innerText + "的连接?" }).on(function (e) {
                    if (!e) {
                        return;
                    }
                    jsPlumb.detach(connInfo);
                });
            }
            else if (stroperator == "edit") {
                selConnect = connInfo;
                $("#SELconnectType option[connecttype='" + selectconnectType + "']").attr("selected", true);
                $("#processSEQText").val(seqValue);
                $("#dialog-connect").modal();
            }
            else if (stroperator.substr(0, 6) == "update") {
                selectconnectType = stroperator.substr(6, 1);
                AddConnnectTag(id, selectconnectType, seqValue);
                //删除当前线
                jsPlumb.detach(connInfo);
                //重新画一条线
                jsPlumb.connect({
                    source: $("div[processId='" + processSourceId + "']").attr("id"),
                    target: $("div[processId='" + processTargetId + "']").attr("id"),
                    anchors: [PointType1, PointType2]
                }, GetCircle(selectconnectType));
            }
            $("#connect-menu").css("display", "none");
        }
    });
    $(connInfo.connection.canvas).contextmenu({
        target: '#connect-menu',
        onItem: function (context, e) {
            var stroperator = $(e.target).attr("operator");
            var selectconnectType = GetConnectType(connInfo);
            var seqValue = GetConnectSEQ(connInfo);
            var processSourceId = $("#" + connInfo.sourceId).attr("processId");
            var processTargetId = $("#" + connInfo.targetId).attr("processId");
            var PointType1;
            if (connInfo.sourceEndpoint != undefined) {
                PointType1 = connInfo.sourceEndpoint.anchor.type;
            }
            else {
                PointType1 = connInfo.endpoints[0].anchor.type;
            }
            var PointType2;
            if (connInfo.targetEndpoint != undefined) {
                PointType2 = connInfo.targetEndpoint.anchor.type;
            }
            else {
                PointType2 = connInfo.endpoints[1].anchor.type;
            }
            var id = processSourceId + "_" + processTargetId + "_" + PointType1 + "_" + PointType2;

            if (stroperator == "delete") {
                Ewin.confirm({ message: "是否删除当前从" + connInfo.source.innerText + "到" + connInfo.target.innerText + "的连接?" }).on(function (e) {
                    if (!e) {
                        return;
                    }
                    jsPlumb.detach(connInfo);
                });
            }
            else if (stroperator == "edit") {
                selConnect = connInfo;
                $("#SELconnectType option[connecttype='" + selectconnectType + "']").attr("selected", true);
                $("#processSEQText").val(seqValue);
                $("#dialog-connect").modal();
            }
            else if (stroperator.substr(0, 6) == "update") {
                selectconnectType = stroperator.substr(6, 1);
                AddConnnectTag(id, selectconnectType, seqValue);
                //删除当前线
                jsPlumb.detach(connInfo);
                //重新画一条线
                jsPlumb.connect({
                    source: $("div[processId='" + processSourceId + "']").attr("id"),
                    target: $("div[processId='" + processTargetId + "']").attr("id"),
                    anchors: [PointType1, PointType2]
                }, GetCircle(selectconnectType));
            }
            //else if (stroperator == "update1") {
            //    selectconnectType = "1";
            //    AddConnnectTag(id, selectconnectType, seqValue);
            //    //删除当前线
            //    jsPlumb.detach(connInfo);
            //    //重新画一条线
            //    jsPlumb.connect({
            //        source: $("div[processId='" + processSourceId + "']").attr("id"),
            //        target: $("div[processId='" + processTargetId + "']").attr("id"),
            //        anchors: [PointType1, PointType2]
            //    }, GetCircle(selectconnectType));
            //}
            //else if (stroperator == "update2") {
            //    selectconnectType = "2";
            //    AddConnnectTag(id, selectconnectType, seqValue);
            //    //删除当前线
            //    jsPlumb.detach(connInfo);
            //    //重新画一条线
            //    jsPlumb.connect({
            //        source: $("div[processId='" + processSourceId + "']").attr("id"),
            //        target: $("div[processId='" + processTargetId + "']").attr("id"),
            //        anchors: [PointType1, PointType2]
            //    }, GetCircle(selectconnectType));
            //}
            //else if (stroperator == "update3") {
            //    selectconnectType = "3";
            //    AddConnnectTag(id, selectconnectType, seqValue);
            //    //删除当前线
            //    jsPlumb.detach(connInfo);
            //    //重新画一条线
            //    jsPlumb.connect({
            //        source: $("div[processId='" + processSourceId + "']").attr("id"),
            //        target: $("div[processId='" + processTargetId + "']").attr("id"),
            //        anchors: [PointType1, PointType2]
            //    }, GetCircle(selectconnectType));
            //}
            //else if (stroperator == "update4") {
            //    selectconnectType = "4";
            //    AddConnnectTag(id, selectconnectType, seqValue);
            //    //删除当前线
            //    jsPlumb.detach(connInfo);
            //    //重新画一条线
            //    jsPlumb.connect({
            //        source: $("div[processId='" + processSourceId + "']").attr("id"),
            //        target: $("div[processId='" + processTargetId + "']").attr("id"),
            //        anchors: [PointType1, PointType2]
            //    }, GetCircle(selectconnectType));
            //}
            //else if (stroperator == "update5") {
            //    selectconnectType = "5";
            //    AddConnnectTag(id, selectconnectType, seqValue);
            //    //删除当前线
            //    jsPlumb.detach(connInfo);
            //    //重新画一条线
            //    jsPlumb.connect({
            //        source: $("div[processId='" + processSourceId + "']").attr("id"),
            //        target: $("div[processId='" + processTargetId + "']").attr("id"),
            //        anchors: [PointType1, PointType2]
            //    }, GetCircle(selectconnectType));
            //}
            //else if (stroperator == "update6") {
            //    selectconnectType = "6";
            //    AddConnnectTag(id, selectconnectType, seqValue);
            //    //删除当前线
            //    jsPlumb.detach(connInfo);
            //    //重新画一条线
            //    jsPlumb.connect({
            //        source: $("div[processId='" + processSourceId + "']").attr("id"),
            //        target: $("div[processId='" + processTargetId + "']").attr("id"),
            //        anchors: [PointType1, PointType2]
            //    }, GetCircle(selectconnectType));
            //}
            $("#connect-menu").css("display", "none");
        }
    });
}

function InitDivMenu(divID)
{
    $("#" + divID).contextmenu({
        target: '#div-menu',
        onItem: function (div, e) {
            var stroperator = $(e.target).attr("operator");
            if (stroperator == "delete") {
                var progressnodeid = $("#" + div.context.id).attr("progressnodeid");
                jsPlumb.remove(div.context, true);
                $("#" + progressnodeid).removeClass("usedprogressnode");
                $("#" + progressnodeid).addClass("progressnode");
                $("#" + progressnodeid).draggable({ scope: "progressnode" });
                jsPlumb.repaintEverything();
                $("#div-menu").css("display", "none");
                $("#" + progressnodeid).draggable({ disabled: false});
            }
            else if (stroperator == "deleteAll") {
                DeleteProcess();
                $("#div-menu").css("display", "none");
            }
        }
    });
}

/*删除当前*/
function delProcessOne() {
    var divId = $('.process.seled');
    var progressnodeid = $("#" + divId.attr('id')).attr("progressnodeid");
    console.log(progressnodeid)
    jsPlumb.remove(divId, true);
    $("#" + progressnodeid).removeClass("usedprogressnode");
    $("#" + progressnodeid).addClass("progressnode");
    $("#" + progressnodeid).draggable({ scope: "progressnode" });
    jsPlumb.repaintEverything();
    $("#" + progressnodeid).draggable({ disabled: false});
}

/*删除所有*/
function delProcessAll() {
    DeleteProcess();
}

/*删除连线*/
function delLine() {
    Ewin.confirm({ message: "是否删除当前从" + connInfoLine.source.innerText + "到" + connInfoLine.target.innerText + "的连接?" }).on(function (e) {
        if (!e) {
            return;
        }
        jsPlumb.detach(connInfoLine);
    });
}

/*清空*/
function delAll() {
    var $processId = $('.process');
    $.each($processId,function (i,v) {
        var progressnodeid = $(v).attr("progressnodeid");
        jsPlumb.remove($(v), true);
        $("#" + progressnodeid).removeClass("usedprogressnode");
        $("#" + progressnodeid).addClass("progressnode");
        $("#" + progressnodeid).draggable({ scope: "progressnode" });
        jsPlumb.repaintEverything();
        $("#" + progressnodeid).draggable({ disabled: false});
    });
}

//删除工艺节点
function DeleteProcess() {
    var arr = getSelectedRegions();
    for (var i = 0; i < arr.length; i++) {
        var progressnodeid = $("#" + arr[i].id).attr("progressnodeid");
        jsPlumb.remove(arr[i], true);
        $("#" + progressnodeid).removeClass("usedprogressnode");
        $("#" + progressnodeid).addClass("progressnode");
        //初始化拖拽
        $("#" + progressnodeid).draggable({ scope: "progressnode" });
        $("#" + progressnodeid).draggable({ disabled: false});
    }
    jsPlumb.repaintEverything();
}

// 鼠标悬浮在连接线上的样式
var connectorHoverStyle = {
    lineWidth: 3,
    strokeStyle: "#216477",
    outlineWidth: 2,
    outlineColor: "white"
};
var endpointHoverStyle = {
    fillStyle: "#216477",
    strokeStyle: "#216477"
};
//空心圆端点样式设置
// paintStyle: {
//  strokeStyle: "#9A32CD",
//  fillStyle: "transparent",
//  radius: 3,
//  lineWidth: 2
//  },		//端点的颜色样式
//  connector: ["Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true }],  //连接线的样式种类有[Bezier],[Flowchart],[StateMachine ],[Straight ]
//  overlays: [
//  ['Arrow', { location: 1 }],//设置箭头和终点的距离
//  ['Label', { location: 0.5, label: strConnectType1, id: 'label', cssClass: 'aLabel' }]
//  ]
var hollowCircle = {
    DragOptions: { cursor: 'pointer', zIndex: 2000 },
    endpoint: ["Dot", { radius: 2 }],  //端点的形状
    // endpoint: ["Dot", { radius: 2, cssClass: 'dotPoint' }],  //端点的形状
    // endpoint: ["image", { url: '../../../img/jsPoint.png' }],  //端点的形状
    connectorStyle: {
        strokeStyle: lineColor,
        fillStyle: "transparent",
        radius: 3,
        lineWidth: 2
    },//连接线的颜色，大小样式
    connectorHoverStyle: connectorHoverStyle,
    paintStyle: {
        // strokeStyle: "#1e8151",
        strokeStyle: "transparent",
        fillStyle: "#1e8151",
        radius: 5,
        lineWidth: pointLineWidth
    },		//端点的颜色样式
    //anchor: "AutoDefault",
    isSource: true,	//是否可以拖动（作为连线起点）
    connector: ["Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true }],  //连接线的样式种类有[Bezier],[Flowchart],[StateMachine ],[Straight ]
    isTarget: true,	//是否可以放置（连线终点）
    maxConnections: -1,	// 设置连接点最多可以连接几条线
    connectorOverlays: [
        ["Arrow", { width: 10, length: 10, location: 1 }],
        ['Label', { location: 0.5, label: "新建连线", id: 'label1', cssClass: 'aLabel' }]
    ]
};




//实心圆样式
var solidCircle = {
    endpoint: ["Dot", { radius: 8 }],  //端点的形状
    paintStyle: { fillStyle: "rgb(122, 176, 44)" },	//端点的颜色样式
    connectorStyle: { strokeStyle: "rgb(97, 183, 207)", lineWidth: 4 },	  //连接线的颜色，大小样式
    isSource: true,	//是否可以拖动（作为连线起点）
    connector: ["Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true }], //连接线的样式种类有[Bezier],[Flowchart],[StateMachine ],[Straight ]
    isTarget: true,		//是否可以放置（连线终点）
    //anchor: "AutoDefault",
    maxConnections: 3,	// 设置连接点最多可以连接几条线
    connectorOverlays: [["Arrow", { width: 10, length: 10, location: 1 }]]
};

//连线默认样式
var Circle = {
    paintStyle: {
        strokeStyle: "#FF0000",
        fillStyle: "transparent",
        radius: 3,
        lineWidth: 2
    },		//端点的颜色样式
    connector: ["Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true }],  //连接线的样式种类有[Bezier],[Flowchart],[StateMachine ],[Straight ]
    overlays: [
        ['Arrow', { location: 1 }],//设置箭头和终点的距离
        ['Label', { location: 0.5, label: "未标明连线", id: 'label', cssClass: 'aLabel' }]
    ]
};

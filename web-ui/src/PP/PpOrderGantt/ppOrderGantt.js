/**
 * Created by Administrator on 2017/8/24.
 */
var urlGanTT = apiUrl + "/base/pporderseq/queryGantt"; //查询页面信息
var ge; // 甘特图全局变量
var mesCom=new mesComMethod(); // 公共方法
$(function () {
    // 加载模板
    $("#ganttemplates").loadTemplates();

    // 初始化甘特图
    ge = new GanttMaster();
    // 是否自动显示bar
    ge.isBrowserTaskBar = true;
    // 设置code是否自动编码
    ge.isLevelCode = true;
    var workSpace = $("#workSpace");
    workSpace.css({
        width: $(window).width() - 20,
        height: $(window).height() - 100
    });
    ge.init(workSpace);

    // 注入一些按钮
    $(".ganttButtonBar div").append("<button onclick='clearGantt();' class='button'>清空</button>")
        .append("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")
        .append("<button onclick='getFile();' class='button'>导出</button>");
    /*$(".ganttButtonBar h1").html("<a href='http://twproject.com' title='Twproject the friendly project and work management tool' target='_blank'><img width='80%' src='res/twBanner.jpg'></a>");*/
    $(".ganttButtonBar div").addClass('buttons');
    // 使用本地化的重写
    loadI18n();

    // 模拟从服务器加载数据。
    loadGanttFromServer();

    $(window).resize(function () {
        workSpace.css({
            width: $(window).width() - 1,
            height: $(window).height() - workSpace.position().top
        });
        workSpace.trigger("resize.gantt");
    }).oneTime(150, "resize", function () {
        $(this).trigger("resize")
    });

});

function loadGanttFromServer(taskId, callback) {
    // 从本地取数据
    loadFromLocalStorage();
}

function saveGanttOnServer() {
    if (!ge.canWrite)
        return;
    // 将模拟的数据保存到本地存储或文本
    saveInLocalStorage();
}

function clearGantt() {
    ge.reset();
}

function loadI18n() {
    GanttMaster.messages = {
        "CANNOT_WRITE": "不能编辑",
        "CHANGE_OUT_OF_SCOPE": "没有超出编辑范围更新父级的权限",
        "START_IS_MILESTONE": "开始是里程碑",
        "END_IS_MILESTONE": "结束时里程碑",
        "TASK_HAS_CONSTRAINTS": "任务包含约束",
        "GANTT_ERROR_DEPENDS_ON_OPEN_TASK": "错误：特定于开放的任务",
        "GANTT_ERROR_DESCENDANT_OF_CLOSED_TASK": "错误：衍生于关闭的任务",
        "TASK_HAS_EXTERNAL_DEPS": "任务包含外部依赖",
        "GANTT_ERROR_LOADING_DATA_TASK_REMOVED": "错误：加载被删除的任务",
        "ERROR_SETTING_DATES": "日期时间设置错误（依赖时间关系或父级任务工期）",
        "CIRCULAR_REFERENCE": "有无限循环参照",
        "CANNOT_DEPENDS_ON_ANCESTORS": "不能依赖父级任务",
        "CANNOT_DEPENDS_ON_DESCENDANTS": "不能依赖子级任务",
        "INVALID_DATE_FORMAT": "无效日期格式",
        "TASK_MOVE_INCONSISTENT_LEVEL": "任务移动非连续级别",

        "GANTT_QUARTER_SHORT": "季度",
        "GANTT_SEMESTER_SHORT": "半年"
    };
}

//-------------------------------------------  Get project file as JSON (used for migrate project from gantt to Teamwork) ------------------------------------------------------
function getFile() {
    $("#gimBaPrj").val(JSON.stringify(ge.saveProject()));
    $("#gimmeBack").submit();
    $("#gimBaPrj").val("");
}

//-------------------------------------------  LOCAL STORAGE MANAGEMENT (for this demo only) ------------------------------------------------------
Storage.prototype.setObject = function (key, value) {
    this.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = function (key) {
    return this.getItem(key) && JSON.parse(this.getItem(key));
};

function loadFromLocalStorage() {
    var ret;
    $.ajax({
        type: "POST",
        url: urlGanTT,
        data:JSON.stringify({}),
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        beforeSend: function(request) {
            request.setRequestHeader("token", sessionStorage.token);
            request.setRequestHeader("AUTHORIZATION", sessionStorage.token);
        },
        success: function (data) {
            if(data.code === '10000') {
                var dataList = data.results;
                if (dataList.tasks.length > 0) {
                    ret = dataList;
                } else {
                    $("#taZone").show();
                }
                if (!ret || !ret.tasks || ret.tasks.length == 0) {
                    // 数据
                    var offset = new Date().getTime() - ret.tasks[0].start;
                    for (var i = 0; i < ret.tasks.length; i++)
                        ret.tasks[i].start = ret.tasks[i].start + offset;
                    //debugger;
                }
                ge.loadProject(ret);
                ge.checkpoint(); // 清空
                ge.levelCode();
                mesCom.msgSuccess('查询成功！');
            } else {
                mesCom.msgSuccess(data.message);
            }
        }
    });
    // var ret;
    // if (localStorage) {
    //     if (localStorage.getObject("teamworkGantDemo")) {
    //         ret = localStorage.getObject("teamworkGantDemo");
    //     }
    // } else {
    //     $("#taZone").show();
    // }
    // if (!ret || !ret.tasks || ret.tasks.length == 0) {
    //     ret = JSON.parse($("#ta").val());
    //     // 数据
    //     var offset = new Date().getTime() - ret.tasks[0].start;
    //     for (var i = 0; i < ret.tasks.length; i++)
    //         ret.tasks[i].start = ret.tasks[i].start + offset;
    //     //debugger;
    // }
    // ge.loadProject(ret);
    // ge.checkpoint(); // 清空
    // ge.levelCode();
}

function saveInLocalStorage() {
    var prj = ge.saveProject();
    console.log(prj)
    console.log(119988)
    if (localStorage) {
        localStorage.setObject("teamworkGantDemo", prj);
    } else {
        $("#ta").val(JSON.stringify(prj));
    }
}
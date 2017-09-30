/**
 * Created by Administrator on 2017/8/9.
 */
$(function () {
    var configVisualLayout= JSON.parse(localStorage.getItem('configVisualLayout'));
    console.log(configVisualLayout);
    for (var i = 0, j = configVisualLayout.length; i < j; i++){
        var mouleval = configVisualLayout[i].mouleval;
        var left = configVisualLayout[i].left;
        var top = configVisualLayout[i].top;
        var width = configVisualLayout[i].width;
        var height = configVisualLayout[i].height;
        $('#visualContent' + mouleval).css('display','block');
        /*显示配置布局*/
        $('#visualContent' + mouleval).wrap("<div class='visualContentPanel' style='left:"+left+"%;top:"+top+"%;width:"+width+"%;height:"+height+"%;'></div>");
        $('#visualContent' + mouleval).wrap("<div style='padding: 5px;overflow: auto;width: 100%;height: calc(100% - 5px);box-shadow: 1px 1px 8px gray;'></div>");
        getOption('可视化配置面板'+mouleval,'visualContent'+mouleval); // 加载图表数据
    }
});
function getOption(title,id) {
    option = {
        title : {
            text: title,
            subtext: '纯属虚构'
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:['最高气温','最低气温']
        },
        toolbox: {
            show : true,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable : true,
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : ['周一','周二','周三','周四','周五','周六','周日']
            }
        ],
        yAxis : [
            {
                type : 'value',
                axisLabel : {
                    formatter: '{value} °C'
                }
            }
        ],
        series : [
            {
                name:'最高气温',
                type:'line',
                data:[11, 11, 15, 13, 12, 13, 10],
                markPoint : {
                    data : [
                        {type : 'max', name: '最大值'},
                        {type : 'min', name: '最小值'}
                    ]
                },
                markLine : {
                    data : [
                        {type : 'average', name: '平均值'}
                    ]
                }
            },
            {
                name:'最低气温',
                type:'line',
                data:[1, -2, 2, 5, 3, 2, 0],
                markPoint : {
                    data : [
                        {name : '周最低', value : -2, xAxis: 1, yAxis: -1.5}
                    ]
                },
                markLine : {
                    data : [
                        {type : 'average', name : '平均值'}
                    ]
                }
            }
        ]
    };
    var lineChart = echarts.init(document.getElementById(id));
    lineChart.setOption(option);
    $(window).resize(lineChart.resize);
}

/*******************************************
 * 
 * Plug-in:�Ѻõ�ҳ�����Ч��
 * Author:sqinyang (sqinyang@sina.com)
 * Time:2015/04/20
 * Explanation:����HTML5�����У�ҳ��Ч��Խ��Խ�ţ�ͬʱҲ��Ҫ���ش����Ĳ�����زģ��������٣��ر���ڹ��ڹ������������վ��һ��һ���زĻ������أ�λ�ô��Ҳ��룬�ʱ�д�˷�����������ʹ��
 *
*********************************************/

jQuery.bootstrapLoading = {
    start: function (options) {
        var defaults = {
            opacity: 1,
            //loadingҳ��͸����
            backgroundColor: "#fff",
            //loadingҳ�汳��ɫ
            borderColor: "#bbb",
            //��ʾ�߿���ɫ
            borderWidth: 1,
            //��ʾ�߿���
            borderStyle: "solid",
            //��ʾ�߿���ʽ
            loadingTips: "Loading, please wait...",
            //��ʾ�ı�
            TipsColor: "#666",
            //��ʾ��ɫ
            delayTime: 1000,
            //ҳ�������ɺ󣬼���ҳ�潥���ٶ�
            zindex: 999,
            //loadingҳ����
            sleep: 0
            //���ù���,����0ʱ���������

        }
        var options = $.extend(defaults, options);

        //��ȡҳ����
        var _PageHeight = document.documentElement.clientHeight,
        _PageWidth = document.documentElement.clientWidth;

        //��ҳ��δ�������֮ǰ��ʾ��loading Html�Զ�������
        var _LoadingHtml = '<div id="loadingPage" style="position:fixed;left:0;top:0;_position: absolute;width:100%;height:' + _PageHeight + 'px;background:' + options.backgroundColor + ';opacity:' + options.opacity + ';filter:alpha(opacity=' + options.opacity * 100 + ');z-index:' + options.zindex + ';"><div id="loadingTips" style="position: absolute; cursor1: wait; width: auto;border-color:' + options.borderColor + ';border-style:' + options.borderStyle + ';border-width:' + options.borderWidth + 'px; height:80px; line-height:80px; padding-left:80px; padding-right: 5px;border-radius:10px;  background: ' + options.backgroundColor + ' url(/dep/bootstrap-loading/images/loading.gif) no-repeat 5px center; color:' + options.TipsColor + ';font-size:20px;">' + options.loadingTips + '</div></div>';

        //����loadingЧ��
        $("body").append(_LoadingHtml);

        //��ȡloading��ʾ����
        var _LoadingTipsH = document.getElementById("loadingTips").clientHeight,
        _LoadingTipsW = document.getElementById("loadingTips").clientWidth;

        //������룬��loading��ʾ�򱣳�����Ļ�������Ҿ���
        var _LoadingTop = _PageHeight > _LoadingTipsH ? (_PageHeight - _LoadingTipsH) / 2 : 0,
        _LoadingLeft = _PageWidth > _LoadingTipsW ? (_PageWidth - _LoadingTipsW) / 2 : 0;

        $("#loadingTips").css({
            "left": _LoadingLeft + "px",
            "top": _LoadingTop + "px"
        });

        //����ҳ�����״̬
        document.onreadystatechange = PageLoaded;

        //��ҳ�������ɺ�ִ��
        function PageLoaded() {
            if (document.readyState == "complete") {
                var loadingMask = $('#loadingPage');

                setTimeout(function () {
                    loadingMask.animate({
                        "opacity": 0
                    },
                    options.delayTime,
                    function () {
                        $(this).hide();

                    });

                },
                options.sleep);

            }
        }
    },
    end: function () {
        $("#loadingPage").remove();
    }
}
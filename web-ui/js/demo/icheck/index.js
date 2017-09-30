/**
 * Created by Administrator on 2017/6/22.
 */
    "use strict";
    $(document).ready(function () {
        /*单复选框初始化*/
        $('.i-checks').iCheck({
            checkboxClass: 'icheckbox_minimal-grey',
            radioClass: 'iradio_minimal-grey',
        });
        /*代码块高亮显示*/
        CodeMirror.fromTextArea(document.getElementById("CodeMirrortable"), {
            lineNumbers: true,
            keyMap: "vim",
            theme: "rubyblue"
        });
    });
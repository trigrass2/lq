/**
 * Created by Administrator on 2017/6/22.
 */
    "use strict";
    $(document).ready(function () {
        /*代码块高亮显示*/
        CodeMirror.fromTextArea(document.getElementById("CodeMirrortable"), {
            lineNumbers: true,
            keyMap: "vim",
            theme: "rubyblue"
        });
        CodeMirror.fromTextArea(document.getElementById("CodeMirrortable2"), {
            lineNumbers: true,
            keyMap: "vim",
            theme: "rubyblue"
        });
    });
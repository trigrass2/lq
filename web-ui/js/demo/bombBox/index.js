/**
 * Created by Administrator on 2017/7/4.
 */
$(function () {
    // 新增
    $('#btnAddList').click(function () {
        $('#addModal').modal({backdrop: 'static', keyboard: false});
        $( "#addModal" ).draggable();
    })
    // 没有选择数据的删除
    $('body').on('click','#noMsgBtn',function () {
        $.deleteMsg();
    })
    // 选择数据且删除
    $('body').on('click','#msgBtn',function () {
        $.deleteMsg('是否确认删除？');
    })
    // 保存成功
    $('body').on('click','#saveBtn',function () {
        $.saveMsg();
        $('#addModal').modal('hide');
    })
    // 删除不成功
    $('body').on('click','#deleteBtn',function () {
        $.noDelete();
    })

    /*代码块高亮显示*/
    CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
        keyMap: "vim",
        theme: "rubyblue"
    });
})


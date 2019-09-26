excsrCore = {};

excsrCore.init = function () {
    if($('[data-toggle="hidden"]').length > 0) {
        $('[data-toggle="hidden"]').css('display', 'none');
    }
}

excsrCore.getDayByAjax = function (url, type, dataType) {
    $.ajax({
        url: url,
        type: type,
        dataType: dataType,
        success: function (data) {
            return data;
        }
    });
}
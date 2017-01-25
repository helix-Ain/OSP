setTimeout(function() {
    $('.searchForm1').keydown(function(e) {
        if (e.keyCode == 13) {
            try {
                searchData();
            } catch (ex) { }
        }
    });
}, 1000);

function getDetailButton(ci_iID, ci_strFunName, ci_strTitle) {
    ci_strFunName = ci_strFunName || 'editData';
    ci_strTitle = ci_strTitle || '查看';
    var m_strFun = 'setTimeout(\'' + ci_strFunName + '();\', 10);';
    if (ci_iID != undefined) {
        m_strFun = ci_strFunName + '(' + ci_iID + ');';
    }
    var m_iWidth = 20 + ci_strTitle.length * 15;
    return '<a href="javascript:void(0)" onclick="' + m_strFun + '" style="width:' + m_iWidth + 'px;display:block;color:Gray;" title="查看详情"><img src="' + _strSysUrl + 'image/06_8.png" style="vertical-align:middle;">' + ci_strTitle + '</a>';
}

function getYesOrNo(ci_bValue) {
    return (ci_bValue ? '是' : '否');
}

function getYes(ci_bValue) {
    return (ci_bValue ? '<img src="' + _strSysUrl + 'JS/EsayUI/themes/icons/ok.png" style="vertical-align:middle;">' : '');
}

function clearText(ci_obj, ci_fun) {
    var m_obj = $(ci_obj);
    if (m_obj.length > 0) {
        if (typeof (m_obj.attr("name")) == "undefined") {
            if (m_obj.hasClass('easyui-combobox')) {
                m_obj.combobox('setValue', '');
                m_obj.combobox('setText', '');
            }
            else {
                m_obj.combo("setValue", '');
                m_obj.combo("setText", '');
            }
        }
        else {
            switch (m_obj[0].type) {
                case 'text':
                case 'textarea':
                    m_obj.val('');
                    m_obj.parent('td').find('input[type=hidden]').val('');
                    break;
            }
        }
    }
    if (ci_fun != undefined) {
        ci_fun();
    }
}
function setUserComboGrid(ci_obj, ci_objParams) {
    var m_objCombo = $(ci_obj);
    ci_objParams.Action = 'Query';
    if (m_objCombo.length > 0) {
        var m_strID = m_objCombo.attr('id');
        $('.easyui-combogrid[id!="' + m_strID + '"]').combogrid('hidePanel');

        var m_div = $('#div_' + m_strID);
        if (m_div.length == 0) {
            m_div = $('<div id="div_' + m_strID + '"><input id="txt_' + m_strID + '" class="easyui-searchbox"></input> 单击可选择记录<div>').insertAfter(m_objCombo);

            m_objCombo.combogrid({
                editable: false,
                panelWidth: 450,
                idField: 'iUserID',
                textField: 'cUserChiName',
                value: m_objCombo.combogrid('getValue')
            });
            setDataGrid(m_objCombo.combogrid('grid'), "div_" + m_strID, 'DcCdUserManage', ci_objParams, 'iUserID', 'cUserChiName', '', {
                pageSize: 5,
                onLoadSuccess: function(data) {
                    if (m_objCombo.combogrid('getValue') != '') {
                        m_objCombo.combogrid('grid').datagrid('selectRecord', m_objCombo.combogrid('getValue'));
                    }
                    m_objCombo.next().find('input').focus();
                    m_objCombo.combogrid('setText', m_objCombo.combogrid('getText'));
                },
                columns: [[
                    { field: 'cLoginName', title: '登录ID', width: 100, sortable: true },
                    { field: 'cUserChiName', title: '姓名', width: 100, sortable: true }
                ]]
            }, true);
        }
        else {
            searchUser(m_strID, '', ci_objParams);
        }
        $("#txt_" + m_strID).searchbox({
            searcher: function(ci_strValue) {
                searchUser(m_strID, ci_strValue, ci_objParams);
            },
            prompt: "请输入姓名",
            width: 155,
            value: ""
        });
    }
}

function searchUser(ci_strID, ci_strValue, ci_objParams) {
    var m_objParams = cloneJson(ci_objParams);
    var m_grid = $("#" + ci_strID).combogrid('grid');
    if (m_grid.length > 0) {
        if (ci_strValue != undefined && ci_strValue != "") {
            m_objParams.cUserChiName = ci_strValue;
        }
        m_grid.datagrid('load', m_objParams);
    }
}
function setOrgComboGrid(ci_obj) {
    var m_objCombo = $(ci_obj);
    if (m_objCombo.length > 0) {
        var m_strID = m_objCombo.attr('id');
        $('.easyui-combogrid[id!="' + m_strID + '"]').combogrid('hidePanel');

        var m_div = $('#div_' + m_strID);
        if (m_div.length == 0) {
            m_div = $('<div id="div_' + m_strID + '"><input id="txt_' + m_strID + '" class="easyui-searchbox"></input> 单击可选择记录<div>').insertAfter(m_objCombo);

            m_objCombo.combogrid({
                editable: false,
                panelWidth: 450,
                idField: 'iOrgID',
                textField: 'cName',
                value: m_objCombo.combogrid('getValue')
            });
            setDataGrid(m_objCombo.combogrid('grid'), "div_" + m_strID, 'DcCdOrganizationManage', { Action: "Query" }, 'iOrgID', 'cName', '', {
                pageSize: 5,
                onLoadSuccess: function(data) {
                    if (m_objCombo.combogrid('getValue') != '') {
                        m_objCombo.combogrid('grid').datagrid('selectRecord', m_objCombo.combogrid('getValue'));
                    }
                    m_objCombo.next().find('input').focus();
                    m_objCombo.combogrid('setText', m_objCombo.combogrid('getText'));
                },
                columns: [[
                    { field: 'cCode', title: '组织编号', width: 60, sortable: true },
                    { field: 'cName', title: '组织名', width: 100, sortable: true }
                ]]
            }, true);
        }
        else {
            searchOrg(m_strID);
        }
        $("#txt_" + m_strID).searchbox({
            searcher: function(ci_strValue) {
                searchOrg(m_strID, ci_strValue);
            },
            prompt: "请输入组织名",
            width: 155,
            value: ""
        });
    }
}

function searchOrg(ci_strID, ci_strValue) {
    var m_grid = $("#" + ci_strID).combogrid('grid');
    if (m_grid.length > 0) {
        var m_objParams = { Action: "Query" };
        if (ci_strValue != undefined && ci_strValue != "") {
            m_objParams.cName = ci_strValue;
        }
        m_grid.datagrid('load', m_objParams);
    }
}
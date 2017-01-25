function setUserGroupComboGrid(ci_strID, ci_strValue, ci_strText) {
    var m_combo = document.getElementById(ci_strID);
    if (m_combo) {
        var m_div = document.getElementById("div_" + ci_strID);
        if (!m_div) {
            m_div = document.createElement("div");
            m_div.setAttribute('id', "div_" + ci_strID);
            m_div.innerHTML = "<input id=\"txt_" + ci_strID + "\" class=\"easyui-searchbox\"></input> 单击可选择记录";
            m_combo.parentNode.appendChild(m_div);
        }
        else {

        }
        $("#txt_" + ci_strID).searchbox({
            searcher: function(ci_strValue, ci_strName) {
                searchUserGroup(ci_strID, ci_strValue);
            },
            prompt: "请输入用户组中文名",
            width: 155,
            value: ""
        });

        m_combo = $('#' + ci_strID);
        var m_grid = null;
        try {
            m_grid = $("#" + ci_strID).combogrid('grid');
        }
        catch (ex) { }
        if (m_grid == null || m_grid.datagrid("getData").total == 0) {
            m_combo.combogrid({
                editable: false,
                panelWidth: 450,
                idField: 'iUserGroupID',
                textField: 'cGroupChiName',
                toolbar: "#div_" + ci_strID,
                url: getInterfaceName("DcCdUserGroupManage"),
                queryParams: { "action": "query" },
                sortName: 'cGroupCode',
                remoteSort: true,
                loadMsg: '正在加载数据...',
                fit: true,
                fitColumns: true,
                nowrap: false,
                striped: true,
                singleSelect: true,
                rownumbers: true,
                pagination: true,
                pageNumber: 1,
                pageSize: 5,
                columns: [[
                    { field: 'cGroupCode', title: '用户组编号', width: 60, sortable: true },
                    { field: 'cGroupChiName', title: '中文名', width: 100, sortable: true }
                ]]
            });
        }
        else {
            searchUserGroup(ci_strID);
        }
        m_combo.combogrid("clear");
        if (ci_strValue != undefined && ci_strText != undefined) {
            m_combo.combogrid('setValue', ci_strValue);
            m_combo.combogrid('setText', ci_strText);
        }
    }
}

function searchUserGroup(ci_strID, ci_strValue) {
    var m_grid = $("#" + ci_strID).combogrid('grid');
    if (m_grid) {
        var m_objParams = { "action": "query" };
        if (ci_strValue != undefined && ci_strValue != "") {
            m_objParams.cGroupChiName = ci_strValue;
        }
        m_grid.datagrid('load', m_objParams);
    }
}
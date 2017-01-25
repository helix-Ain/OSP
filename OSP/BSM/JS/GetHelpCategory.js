function bindHelpCatData(ci_options) {
    if (ci_options != undefined && ci_options.controlID != undefined) {
        var m_objP = ci_options.params || { Action: '' };
        m_objP.Action = 'GetCList';
        postData({
            url: "DcCdHelpManage",
            params: m_objP,
            success: function(ci_result) {
                var m_strIDList = ci_options.controlID.split(",");
                for (var i = 0; i < m_strIDList.length; i++) {
                    var m_obj = $("#" + m_strIDList[i]);
                    if (m_obj.length > 0) {
                        var m_strValue = "";
                        try {
                            m_strValue = m_obj.combobox("getValue");
                        } catch (ex) { }
                        m_obj.combobox({
                            data: ci_result.rows,
                            valueField: 'iCategoryID',
                            textField: 'cName'
                        });
                        if (m_strValue != "") {
                            m_obj.combobox("setValue", m_strValue);
                        }
                    }
                }
                if (ci_options.success != undefined && typeof (ci_options.success) == 'function') {
                    ci_options.success();
                }
            }
        });
    }
}
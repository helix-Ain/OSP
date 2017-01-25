$.extend($.fn.combobox.methods, {
    validateEx: function(jq) {
        jq.each(function() {
            var m_objData = $(this).combobox('getData');
            if (m_objData.length > 0) {
                var m_strValue = $(this).combobox('getValue');
                for (var i = 0; i < m_objData.length; i++) {
                    if (m_objData[i][$(this).combobox('options').valueField] == m_strValue) {
                        return true;
                    }
                }
            }
            $(this).combobox('clear');
        });
    },
    selectEx: function(jq, value) {
        return jq.each(function() {
            $(this).combobox('select', value);
            $(this).combobox('validateEx');
        });
    },
    selectFirst: function(jq, value) {
        return jq.each(function() {
            var m_objData = $(this).combobox('getData');
            if (m_objData.length > 0) {
                $(this).combobox('select', m_objData[0][$(this).combobox('options').valueField]);
            }
        });
    },
    getSelectData: function(jq) {
        var m_objData = $(jq[0]).combobox('getData');
        if (m_objData != null && m_objData.length > 0) {
            var m_strValue = $(jq[0]).combobox('getValue');
            if (m_strValue != '') {
                for (var i = 0; i < m_objData.length; i++) {
                    if (m_objData[i][$(jq[0]).combobox('options').valueField] == m_strValue) {
                        return m_objData[i];
                    }
                }
            }
        }
        return null;
    }
});

$.extend($.fn.combogrid.methods, {
    validateEx: function(jq) {
        jq.each(function() {
            if ($(this).combogrid('grid').datagrid('getData').total > 0) {
                if ($(this).combogrid('grid').datagrid('getSelected') == null) {
                    $(this).combogrid('clear');
                }
            }
        });
    }
});

$.extend($.fn.form.methods, {
    validateEx: function(jq) {
        jq.find('.easyui-combobox').combobox('validateEx');
        //jq.find('.easyui-combogrid').combogrid('validateEx');
        return jq.form('validate');
    }
});

$.extend($.fn.tabs.methods, {
    setTabTitle: function(jq, opts) {
        return jq.each(function() {
            var tab = opts.tab;
            var options = tab.panel("options");
            var tab = options.tab;
            options.title = opts.title;
            var title = tab.find("span.tabs-title");
            title.html(opts.title);
        });
    }
});

$.extend($.fn.linkbutton.defaults, { selected: false });
$.extend($.fn.linkbutton.methods, {
    select: function(jq) {
        return $.each(jq, function() {
            $(this).linkbutton('options').selected = true;
            if (!$(this).hasClass('l-btn-selected')) {
                $(this).addClass('l-btn-selected');
            }
        });
    },
    unselect: function(jq) {
        return $.each(jq, function() {
            $(this).linkbutton('options').selected = false;
            if ($(this).hasClass('l-btn-selected')) {
                $(this).removeClass('l-btn-selected');
            }
        });
    }
});
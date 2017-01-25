$.extend($.fn.datagrid.defaults, { settingCode: '', isSys: false, selectSingle: true });

$.extend($.fn.datagrid.methods, {
    init: function(jq, ci_objOptions) {
        return jq.each(function() {
            var m_obj = $(this);
            var m_objOptoins = {
                loadMsg: '正在加载数据...',
                settingCode: '',
                checkOnSelect: true,
                selectOnCheck: true,
                singleSelect: false,
                selectSingle: true,
                remoteSort: true,
                fit: true,
                fitColumns: true,
                isSys: false,
                nowrap: false,
                striped: true,
                rownumbers: true,
                pagination: true,
                filterInit: false,
                filterHide: true,
                setColumns: true,
                pageNumber: 1,
                pageSize: 50
            };

            if (m_obj.attr("settingcode") != undefined && m_obj.attr("settingcode") != "") {
                m_objOptoins.settingCode = m_obj.attr("settingcode");
            }
            if (ci_objOptions.settingCode != undefined && ci_objOptions.settingCode != "") {
                m_objOptoins.settingCode = ci_objOptions.settingCode;
            }
            if (ci_objOptions.setColumns != undefined) {
                m_objOptoins.setColumns = ci_objOptions.setColumns;
            }

            if (m_objOptoins.settingCode != '' && m_objOptoins.setColumns) {
                postData({
                    url: "DcCdDataGridManage",
                    params: { "action": "getdatagridcolumns", "DataGridCode": m_objOptoins.settingCode },
                    isSys: true,
                    success: function(ci_result) {
                        _bindColumns(ci_result.DcMessage);
                    }
                });
            }
            else {
                _init();
            }

            function _bindColumns(ci_strData) {
                m_objOptoins.columns = [];
                m_objOptoins.columns.push(convertToJson(ci_strData));
                for (var i = 0; i < m_objOptoins.columns[0].length; i++) {
                    if (m_objOptoins.columns[0][i].formatter != undefined) {
                        m_objOptoins.columns[0][i].formatter = eval("(" + m_objOptoins.columns[0][i].formatter + ")");
                    }
                    if (m_objOptoins.columns[0][i].field != undefined && m_objOptoins.columns[0][i].field == 'btn') {
                        m_objOptoins.columns[0][i].resizable = false;
                        m_objOptoins.columns[0][i].fixed = true;
                        m_objOptoins.columns[0][i].width = undefined;
                        m_objOptoins.columns[0][i].expander = true;
                    }
                }
                _init();
            }

            function _init() {
                var m_divNoData = $('<div class="nodata">没有相关数据</div>');

                m_objOptoins.onLoadSuccess = function(data) {
                    if (data.rows == undefined) {
                        data.rows = [];
                    }
                    var p = m_obj.datagrid('getPager');
                    $(p).pagination('refresh', {
                        afterPageText: '页，共 {pages} 页',
                        displayMsg: '当前显示 {from} - {to} 条记录，共 {total} 条记录'
                    });

                    m_obj.datagrid("clearSelections");
                    if (data.rows.length == 0) {
                        var m_divList = m_obj.datagrid("getPanel").find('div .datagrid-body');
                        if (m_divList.length > 0) {
                            m_divNoData.removeClass('loaderror').html('没有相关数据').appendTo($(m_divList[m_divList.length - 1]));
                            m_divNoData.show();
                        }
                    }
                    else {
                        m_divNoData.hide();
                    }

                    if (ci_objOptions != undefined && ci_objOptions.onLoadSuccess != undefined) {
                        ci_objOptions.onLoadSuccess.call(m_obj, data);
                    }
                };
                m_objOptoins.onBeforeLoad = function(param) {
                    if (param.filterRules != undefined && eval(param.filterRules).length > 0) {
                        var m_objData = eval(param.filterRules);
                        var m_objQuery = [];
                        $.each(m_objData, function() {
                            var m_iLogic = 8;
                            switch (this.op) {
                                case 'contains':
                                    m_iLogic = 7;
                                    break;
                                case 'equal':
                                    m_iLogic = 1;
                                    break;
                                case 'notequal':
                                    m_iLogic = 6;
                                    break;
                                case 'less':
                                    m_iLogic = 4;
                                    break;
                                case 'lessorequal':
                                    m_iLogic = 5;
                                    break;
                                case 'greater':
                                    m_iLogic = 2;
                                    break;
                                case 'greaterorequal':
                                    m_iLogic = 3;
                                    break;
                            }
                            m_objQuery.push(this.field + getSeparativeSign() + m_iLogic + getSeparativeSign() + this.value);
                        });
                        param.searchQuery = m_objQuery.join(getSeparativeSign() + "," + getSeparativeSign());
                    }

                    if (ci_objOptions != undefined && ci_objOptions.onBeforeLoad != undefined) {
                        return ci_objOptions.onBeforeLoad.call(m_obj, param);
                    }
                    return true;
                };
                m_objOptoins.loadFilter = function(data) {
                    checkReturnJson(data);
                    if (data == undefined) {
                        data = [];
                    }
                    if (data.rows == undefined) {
                        data.rows = [];
                    }
                    if (data.total == undefined) {
                        data.total = data.rows.length;
                    }
                    if (ci_objOptions != undefined && ci_objOptions.loadFilter != undefined) {
                        return ci_objOptions.loadFilter.call(m_obj, data);
                    }
                    return data;
                };
                m_objOptoins.onLoadError = function() {
                    m_obj.datagrid('loadData', []);
                    var m_divList = m_obj.datagrid("getPanel").find('div .datagrid-body');
                    if (m_divList.length > 0) {
                        m_divNoData.addClass('loaderror').html('数据加载失败').appendTo($(m_divList[m_divList.length - 1]));
                        m_divNoData.show();
                    }
                    if (ci_objOptions != undefined && ci_objOptions.onLoadError != undefined) {
                        ci_objOptions.onLoadError.call(m_obj);
                    }
                };

                if (ci_objOptions != undefined) {
                    for (var i in ci_objOptions) {
                        if (i != "onLoadSuccess" && i != "loadFilter" && i != "onBeforeLoad" && i != "onLoadError" && i != "url" && i != "onClickRow") {
                            m_objOptoins[i] = ci_objOptions[i];
                        }
                    }
                }

                if (m_objOptoins.selectSingle) {
                    m_objOptoins.onClickRow = function(rowIndex, rowData) {
                        m_obj.datagrid("unselectAll").datagrid("selectRow", rowIndex);

                        if (ci_objOptions != undefined && ci_objOptions.onClickRow != undefined) {
                            ci_objOptions.onClickRow.call(m_obj, rowIndex, rowData);
                        }
                    }
                }
                else if (ci_objOptions != undefined && ci_objOptions.onClickRow != undefined) {
                    m_objOptoins.onClickRow = ci_objOptions.onClickRow;
                }

                if (m_objOptoins.pagination == false) {
                    m_objOptoins.remoteSort = false;
                }

                if (m_objOptoins.settingCode != '' && (ci_objOptions.url != undefined || ci_objOptions.url != '')) {
                    ci_objOptions.url = 'DcCdDataGridManage';
                    if (m_objOptoins.params == undefined) {
                        m_objOptoins.params = { Action: "GetData" };
                    }
                    m_objOptoins.params.Action = 'GetData';
                    m_objOptoins.params.SettingCode = m_objOptoins.settingCode;
                    m_objOptoins.isSys = true;
                }

                if (m_objOptoins.params != undefined) {
                    m_objOptoins.queryParams = m_objOptoins.params;
                }
                if (ci_objOptions.url != undefined && ci_objOptions.url != '') {
                    m_objOptoins.url = getInterfaceName(ci_objOptions.url, m_objOptoins.isSys);
                }
                m_obj.datagrid(m_objOptoins);
            }
        });
    },
    dcnLoad: function(jq, params) {
        return jq.each(function() {
            var opts = $.data(this, 'datagrid').options;
            var panel = $(this);
            if (panel && opts) {
                if (opts.settingCode != '') {
                    if (params == undefined) {
                        params = { Action: "GetData" };
                    }
                    params.Action = 'GetData';
                    params.SettingCode = opts.settingCode;
                }
                panel.datagrid('load', params);
            }
        });
    }
});
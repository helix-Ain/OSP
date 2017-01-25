function getScript() {
    var m_objScriptList = [];
    m_objScriptList.push(_strSysUrl + "js/EsayUI/themes/gray/easyui.css");
    m_objScriptList.push(_strSysUrl + "js/EsayUI/themes/icon.css");
    m_objScriptList.push(_strSysUrl + "CSS/Style.css");
    m_objScriptList.push(_strSysUrl + 'js/PreventBackspace.js');
    m_objScriptList.push(_strSysUrl + 'js/EsayUI/jquery.easyui.min.js');
    m_objScriptList.push(_strSysUrl + 'js/EsayUI/jquery.pagination.js');
    m_objScriptList.push(_strSysUrl + 'js/EsayUI/plugins/jquery.datagrid.filter.js');
    m_objScriptList.push(_strSysUrl + 'js/EsayUI/locale/easyui-lang-zh_CN.js');
    m_objScriptList.push(_strSysUrl + 'js/EsayUI/jquery.easyui.ex.js');
    m_objScriptList.push(_strSysUrl + 'plugins/dcn/js/jquery.dcn.datagrid.min.js');
    m_objScriptList.push(_strSysUrl + 'plugins/dcn/js/jquery.dcn.easyui.form.js');
    m_objScriptList.push(_strSysUrl + 'js/ControlSetting.js');
    m_objScriptList.push(_strSysUrl + 'js/DCInput.js');
    m_objScriptList.push(_strSysUrl + 'CurrScript.js');
    return m_objScriptList;
}

//取得项名称为offset的cookie值
function getCookie(ci_Name) {
    var m_strReturn = '';
    try {
        if (document.cookie.length > 0) {
            var _StartIndex = document.cookie.indexOf(ci_Name + "=");
            if (_StartIndex != -1) {
                _StartIndex = _StartIndex + ci_Name.length + 1;
                _EndIndex = document.cookie.indexOf(";", _StartIndex);
                if (_EndIndex == -1) {
                    _EndIndex = document.cookie.length;
                }
                m_strReturn = decodeURIComponent(document.cookie.substring(_StartIndex, _EndIndex));
            }
        }
    }
    catch (ex) { }
    finally {
        return m_strReturn;
    }
}

//设置名称为name,值为value的Cookie 
function setCookie(ci_Name, ci_Value) {
    var _Length = setCookie.arguments.length;
    var _Argu = setCookie.arguments;
    var _Path = (_Length > 3) ? _Argu[3] : null;
    var _Domain = (_Length > 4) ? _Argu[4] : null;
    var _Secure = (_Length > 5) ? _Argu[5] : false;

    var _Date = new Date();
    _Date.setTime(_Date.getTime() + (1000 * 60 * 60 * 24 * 365));

    document.cookie = ci_Name + "=" + escape(ci_Value) + //";expires=" + _Date.toGMTString();
    ((_Path == null) ? "" : ("; path=" + _Path)) +
    ((_Domain == null) ? "" : ("; domain=" + _Domain)) +
    ((_Secure == true) ? "; secure" : "") + ";expires=" + _Date.toGMTString();
}

function getInterfaceName(ci_Name, ci_bIsSys) {
    var m_strUrl = _strLocalUrl;
    if (ci_bIsSys != undefined && ci_bIsSys) {
        m_strUrl = _strSysUrl;
    }
    else {
        var m_strName = ci_Name.split(",");
        if (m_strName.length > 1) {
            m_strUrl = m_strName[0];
            ci_Name = m_strName[1];
        }
    }
    return m_strUrl + "Ajax/" + ci_Name + ".ashx";
}

function getSearchParameters(ci_obj, ci_objData) {
    if (ci_objData == undefined) {
        ci_objData = [];
    }
    var m_objReturn = { searchQuery: '' };
    var m_objParameters = [];
    var m_strReturn = "";
    var m_strSign = getSeparativeSign();

    for (var i in ci_objData) {
        m_objReturn[i] = ci_objData[i];
    }

    $(ci_obj).find(".dc-search").each(function() {
        var m_obj = $(this);
        var m_strValue = '';
        var m_strName = '';
        if (m_obj.hasClass('easyui-combo') || m_obj.hasClass('easyui-combobox') || m_obj.hasClass('easyui-datebox') || m_obj.hasClass('spinner-text')) {
            var m_strP = 'comboname';
            if (m_obj.hasClass('easyui-combobox')) {
                m_strValue = m_obj.combobox("getValue");
            }
            else if (m_obj.hasClass('spinner-text')) {
                m_strValue = m_obj.numberspinner("getValue");
                m_strP = 'numberboxname';
            }
            else {
                m_strValue = m_obj.combo("getValue");
            }
            m_strName = m_obj.attr(m_strP);
            if (m_strName != undefined && m_strValue != "") {
                var m_objParam = [m_strName, m_obj.attr("logic"), m_strValue];
                if (m_objParam[1] == undefined) {
                    m_objParam[1] = 1;
                }
                m_objParameters.push(m_objParam.join(m_strSign));
            }
        }
        else {
            m_strValue = m_obj.val();
            m_strName = m_obj.attr("name");
            switch (m_obj[0].type) {
                case 'text':
                case 'textarea':
                    if (m_strName != undefined && m_strValue != "") {
                        var m_objParam = [m_strName, m_obj.attr("logic"), m_strValue];
                        if (m_objParam[1] == undefined) {
                            m_objParam[1] = 7;
                        }
                        m_objParameters.push(m_objParam.join(m_strSign));
                    }
                    break;
                case 'checkbox':
                case 'radio':
                    if (m_strName != undefined && m_strValue != "" && this.checked) {
                        var m_objParam = [m_strName, m_obj.attr("logic"), m_strValue];
                        if (m_objParam[1] == undefined) {
                            m_objParam[1] = 1;
                        }
                        m_objParameters.push(m_objParam.join(m_strSign));
                    }
                    break;
            }
        }
    });
    if (m_objReturn.searchQuery == undefined || m_objReturn.searchQuery == '') {
        m_objReturn.searchQuery = m_objParameters.join(m_strSign + "," + m_strSign);
    }
    else {
        m_objReturn.searchQuery += m_strSign + "," + m_strSign + m_objParameters.join(m_strSign + "," + m_strSign);
    }
    return m_objReturn;
}

function convertToJson(ci_String) {
    if (typeof ci_String == "string") {
        try {
            return eval("(" + ci_String + ")");
        }
        catch (ex) {
            return "";
        }
    }
    return ci_String;
}

function checkReturnJson(ci_Json) {
    if (ci_Json != "") {
        if (ci_Json.DcCode >= 0) {
            return true;
        }
        else {
            hiddInitMask();
            switch (ci_Json.DcCode) {
                case -1:
                    if (!top._bShowError) {
                        top._bShowError = true;
                        top.$.messager.alert('提示', ci_Json.DcMessage, 'error', function() {
                            top._bShowError = false;
                            top.openLoginWindow(window);
                        });
                    }
                    break;
                case -2:
                    //showMask();
                    if (!top._bShowError) {
                        top._bShowError = true;
                        top.$.messager.alert('提示', ci_Json.DcMessage, 'error', function() {
                            top._bShowError = false;
                            location.href = "Blank.html";
                        });
                    }
                    break;
            }
        }
    }
    return false;
}


function initReady(ci_fn) {
    if (!_objFileLoader.isReady) {
        var m_objFn = [];
        m_objFn.push(function() { initReady(ci_fn); });
        for (var i = 0; i < _objFileLoader.readyFunction.length; i++) {
            m_objFn.push(_objFileLoader.readyFunction[i]);
        }
        _objFileLoader.readyFunction = m_objFn;
        return;
    }
    if (ci_fn != undefined) {
        if (typeof (ci_fn) == 'function') {
            ci_fn();
        }
        else {
            for (var i = 0; i < ci_fn.length; i++) {
                ci_fn[i]();
            }
        }
    }
}

function checkPagePower(ci_options) {
    ci_options.showMask = (ci_options.showMask == undefined ? true : ci_options.showMask);
    ci_options.check = (ci_options.check == undefined ? true : ci_options.check);
    ci_options.parse = (ci_options.parse == undefined ? true : ci_options.parse);
    ci_options.hiddenMask = (ci_options.hiddenMask == undefined ? false : ci_options.hiddenMask);

    if (ci_options.showMask == false) {
        hiddInitMask();
        _objFileLoader.isHideMask = false;
    }
    if (!_objFileLoader.isReady) {
        if (ci_options.check) {
            _objFileLoader.isHideMask = false;
        }
        _objFileLoader.lastFunction.push(function() { checkPagePower(ci_options) });
        return;
    }
    if (ci_options.check) {
        postData({
            url: 'DcCdGetUserPageFunPower',
            params: {},
            isSys: true,
            showMask: false,
            success: function(ci_result) {
                if (existData(ci_result)) {
                    setControl(ci_result.rows);
                }
                if (ci_options.parse) {
                    $.parser.parse();
                }
                _complete();
            }
        });
    }
    else {
        _complete();
    }

    function _complete() {
        $('body,html').css('display', '');
        if (ci_options.onload != undefined) {
            ci_options.onload.call(this);
        }
        $('span.combo,span.spinner').addClass('text-radius');
        $('.dc-input').dcinput();
        if (!_objFileLoader.isHideMask && !ci_options.hiddenMask) {
            hiddInitMask();
            _objFileLoader.isHideMask = true;
        }
    }
}

function checkPagePower_Complete() {
    hiddInitMask();
    _objFileLoader.isHideMask = true;
}

function getQueryStringValue(ci_strKey) {
    return getParameter(location.search, ci_strKey);
}

function getQueryString() {
    var args = {};
    var query = location.search.substring(1);
    var pairs = query.split("&");
    for (var i = 0; i < pairs.length; i++) {
        var pos = pairs[i].indexOf('=');
        if (pos == -1) continue;
        args[pairs[i].substring(0, pos)] = unescape(pairs[i].substring(pos + 1));
    }
    return args;
}

function getHashValue(ci_strKey) {
    return getParameter(location.hash, ci_strKey);
}

function setDataGrid(ci_strID, ci_strToolbarID, ci_strUrl, ci_strQueryParams, ci_strIDField, ci_strSortName, ci_strSortOrder, ci_objEvents, ci_bIsSys) {
    if (ci_strSortOrder == undefined) {
        ci_strSortOrder = "asc";
    }
    if (ci_bIsSys == undefined) {
        ci_bIsSys = false;
    }
    var m_obj = $(ci_strID);
    if (m_obj.length == 0) {
        m_obj = $("#" + ci_strID);
    }
    if (m_obj.length > 0) {
        if (m_obj.attr("settingcode") != undefined && m_obj.attr("settingcode") != "") {
            postData({
                url: "DcCdDataGridManage",
                params: { "action": "getdatagridcolumns", "DataGridCode": m_obj.attr("settingcode") },
                isSys: true,
                success: function(ci_result) {
                    _bindData(ci_result.DcMessage);
                }
            });
        }
        else if (m_obj.attr("syssettingcode") != undefined && m_obj.attr("syssettingcode") != "") {
            postData({
                url: "DcCdDataGridManage",
                params: { "action": "getdatagridsyscolumns", "DataGridCode": m_obj.attr("syssettingcode") },
                isSys: true,
                success: function(ci_result) {
                    _bindData(ci_result.DcMessage);
                }
            });
        }
        else {
            setDataGridDetail();
        }

        function _bindData(ci_strData) {
            if (ci_objEvents == undefined) {
                ci_objEvents = "";
            }
            ci_objEvents.columns = [];
            ci_objEvents.columns.push(convertToJson(ci_strData));
            for (var i = 0; i < ci_objEvents.columns[0].length; i++) {
                if (ci_objEvents.columns[0][i].formatter != undefined) {
                    ci_objEvents.columns[0][i].formatter = eval("(" + ci_objEvents.columns[0][i].formatter + ")");
                }
            }
            setDataGridDetail();
        }
    }

    function setDataGridDetail() {
        if (m_obj.length > 0) {
            var m_strID = m_obj.attr('id');
            var m_jsonOptions = {
                //title: '记录列表',
                queryParams: ci_strQueryParams,
                idField: ci_strIDField,
                sortName: ci_strSortName,
                sortOrder: ci_strSortOrder,
                remoteSort: true,
                loadMsg: '正在加载数据...',
                fit: true,
                fitColumns: true,
                nowrap: false,
                striped: true,
                singleSelect: true,
                checkOnSelect: false,
                selectOnCheck: false,
                toolbar: "#" + ci_strToolbarID,
                rownumbers: true,
                pagination: true,
                pageNumber: 1,
                pageSize: 50,
                onLoadSuccess: function(data) {
                    m_obj.datagrid("clearSelections");
                    if (data.rows.length == 0) {
                        var m_divList = m_obj.datagrid("getPanel").find('div .datagrid-body');
                        if (m_divList.length > 0) {
                            $('<div id="div_' + m_strID + '_NoData" class="nodata">没有相关数据</div>').appendTo($(m_divList[m_divList.length - 1]));
                        }
                    }
                    else {
                        $('#div_' + m_strID + '_NoData').remove();
                    }
                    if (ci_objEvents != undefined && ci_objEvents.onLoadSuccess != undefined) {
                        ci_objEvents.onLoadSuccess(data);
                    }
                },
                loadFilter: function(data) {
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
                    if (ci_objEvents != undefined && ci_objEvents.loadFilter != undefined) {
                        return ci_objEvents.loadFilter(data);
                    }
                    return data;
                },
                onLoadError: function() {
                    m_obj.datagrid('loadData', []);
                    $('#div_' + m_strID + '_NoData').remove();
                    var m_divList = m_obj.datagrid("getPanel").find('div .datagrid-body');
                    if (m_divList.length > 0) {
                        $('<div id="div_' + m_strID + '_NoData" class="nodata loaderror">数据加载失败</div>').appendTo($(m_divList[m_divList.length - 1]));
                    }
                    if (ci_objEvents != undefined && ci_objEvents.onLoadError != undefined) {
                        ci_objEvents.onLoadError();
                    }
                }
            };
            if (ci_strUrl != "") {
                m_jsonOptions.url = getInterfaceName(ci_strUrl, ci_bIsSys);
            }
            if (ci_objEvents != undefined) {
                for (var i in ci_objEvents) {
                    if (i != "onLoadSuccess" && i != "loadFilter") {
                        m_jsonOptions[i] = ci_objEvents[i];
                    }
                }
            }
            if (m_jsonOptions.pagination == false) {
                m_jsonOptions.remoteSort = false;
            }
            try {
                m_obj.datagrid(m_jsonOptions);
            }
            catch (ex) { }
        }
    }
}

function myDateFormatter(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    return y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d);
}

function myDateParser(s) {
    if (!s) return new Date();
    var ss = (s.split('-'));
    var y = parseInt(ss[0], 10);
    var m = parseInt(ss[1], 10);
    var d = parseInt(ss[2], 10);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        return new Date(y, m - 1, d);
    } else {
        return new Date();
    }
}

function postData(ci_options) {
    if (ci_options != undefined && ci_options.url != undefined) {
        var m_bShowMask = true;
        if (ci_options.showMask != undefined) {
            m_bShowMask = ci_options.showMask;
        }
        if (m_bShowMask) {
            loadingMask('', '正在加载数据...');
        }
        var m_bIsSys = false;
        try {
            m_bIsSys = ci_options.isSys;
        }
        catch (ex) { }
        if (ci_options.validate != undefined && ci_options.validate && ci_options.form != undefined) {
            var m_objForm = $('#' + ci_options.form);
            if (!m_objForm.form('validateEx')) {
                closeInnerMask();
                return;
            } else {
                var m_objList = m_objForm.find('.combolist');
                for (var i = 0; i < m_objList.length; i++) {
                    if (!$($(m_objList[i]).parent()).combolist('isValid')) {
                        closeInnerMask();
                        return;
                    }
                }
                m_objList = m_objForm.find('.listbox');
                for (var i = 0; i < m_objList.length; i++) {
                    if (!$(m_objList[i]).listbox('isValid')) {
                        closeInnerMask();
                        return;
                    }
                }
            }
        }
        var m_params = {};
        try {
            m_params = ci_options.params;
        }
        catch (ex) { }
        if (ci_options.form != undefined) {
            var m_objForm = $('#' + ci_options.form);
            if (m_objForm.length > 0) {
                m_objForm.find('[name]').each(function() {
                    var m_obj = $(this);
                    if (m_obj[0].type == 'checkbox') {
                        m_params[m_obj.attr('name')] = (m_obj.attr('checked') == 'checked' ? true : false)
                    }
                    else {
                        m_params[m_obj.attr('name')] = m_obj.val();
                    }
                });
                m_objForm.find('[comboname]').each(function() {
                    var m_obj = $(this);
                    var m_strValue = '';
                    if (m_obj.hasClass('easyui-combobox')) {
                        m_strValue = m_obj.combobox("getValue");
                    }
                    else {
                        m_strValue = m_obj.combo("getValue");
                    }
                    m_params[m_obj.attr('comboname')] = m_strValue;
                });
                m_objForm.find('.combolist').each(function() {
                    var m_obj = $(this).parent();
                    if (m_obj.combolist('options').multiple) {
                        m_params[m_obj.attr('name')] = m_obj.combolist('getValues');
                    } else {
                        m_params[m_obj.attr('name')] = m_obj.combolist('getValue');
                    }
                });
                m_objForm.find('.listbox').each(function() {
                    var m_obj = $(this);
                    m_params[m_obj.attr('name')] = m_obj.listbox('getValues');
                });
            }
        }
        if (ci_options.onPost != undefined) {
            if (!ci_options.onPost()) {
                closeInnerMask();
                return;
            }
        }

        $.post(getInterfaceName(ci_options.url, m_bIsSys), m_params, function(ci_result) {
            closeInnerMask();
            ci_result = convertToJson(ci_result);
            if (checkReturnJson(ci_result)) {
                if (ci_options.success != undefined) {
                    ci_options.success(ci_result);
                }
            }
            else {
                if (ci_options.failure != undefined) {
                    ci_options.failure(ci_result);
                }
                else {
                    if (!top._bShowError) {
                        $.messager.alert('操作失败', ci_result.DcMessage, 'error');
                    }
                }
            }
        }).error(function(err) { closeInnerMask(); $.messager.alert('提示', '操作失败，请重试或通知管理员', 'error'); });

        function closeInnerMask() {
            if (m_bShowMask) {
                hiddMask();
            }
        }
    }
}

function bindCodeMasterData(ci_options) {
    try {
        if (ci_options != undefined && ci_options.controlID != undefined) {
            var m_objQuery = { cat: "", subCat: "" };
            for (var i in ci_options) {
                if (i != "valueField" && i != "textField" && i != "controlID" && i != "success") {
                    m_objQuery[i] = ci_options[i];
                }
            }
            if (ci_options.valueField == undefined) {
                ci_options.valueField = "iCodeID";
            }
            if (ci_options.textField == undefined) {
                ci_options.textField = "cDesc";
            }
            m_objQuery.Action = "combo";
            postData({
                url: "DcCdCodeMasterManage",
                params: m_objQuery,
                isSys: true,
                success: function(ci_result) {
                    if (existData(ci_result)) {
                        ci_result.rows.sort(function(a, b) { return a.iOrderBy - b.iOrderBy; });
                        $.each(ci_options.controlID.split(','), function() {
                            try {
                                bindComboboxData(this, ci_result.rows, ci_options);
                            }
                            catch (ex) { }
                        });
                    }
                    if (ci_options.success != undefined && typeof (ci_options.success) == 'function') {
                        ci_options.success();
                    }
                },
                failure: function(ci_result) {
                    var m_strIDList = ci_options.controlID.split(",");
                    for (var i = 0; i < m_strIDList.length; i++) {
                        var m_obj = $("#" + m_strIDList[i]);
                        if (m_obj.length > 0) {
                            m_obj.combobox("setValue", '').combobox("setText", '');
                        }
                    }
                }
            });
        }
    }
    catch (ex) { }
}

function showDataGridSetting(ci_strCode, ci_strReturnFun) {
    popupDialog(_strSysUrl + 'Platform/UserDataGridSetting.html#Code=' + ci_strCode + '&ReturnFun=' + ci_strReturnFun, '', '列表显示设置', false, 180, 300);
}

function getSeparativeSign() {
    return String.fromCharCode(31);
}

function cloneJson(para) {
    var rePara = null;
    var type = Object.prototype.toString.call(para);
    if (type.indexOf("Object") > -1) {
        rePara = jQuery.extend(true, {}, para);
    } else if (type.indexOf("Array") > 0) {
        rePara = [];
        jQuery.each(para, function(index, obj) {
            rePara.push(cloneJson(obj));
        });
    } else {
        rePara = para;
    }
    return rePara;
}

function popupDialog(ci_strSrc, ci_strFun, ci_strTitle, ci_bFit, ci_iWidth, ci_iHeight, ci_strIconCls, ci_strID, ci_fnClose) {
    var m_strUrl = ci_strSrc;
    if (ci_strFun != undefined && ci_strFun != "") {
        if (m_strUrl.split("#").length > 1) {
            m_strUrl += "&";
        }
        else {
            m_strUrl += "#";
        }
        m_strUrl += "Fun=" + ci_strFun;
    }
    if (m_strUrl.toString().lastIndexOf('#') >= 0) {
        m_strUrl = m_strUrl.replace(/.html#/, ".html?T=" + Math.random().toString().replace(/0./, '') + "#");
    }
    else {
        m_strUrl += "?T=" + Math.random().toString().replace(/0./, '');
    }
    if (ci_bFit == undefined) {
        ci_bFit = false;
    }
    if (ci_iHeight == undefined || ci_iHeight <= 0) {
        ci_iHeight = 480;
    }
    if (ci_iWidth == undefined || ci_iWidth <= 0) {
        ci_iWidth = 640;
    }
    if (ci_strIconCls == undefined) {
        ci_strIconCls = "";
    }
    ci_fnClose = ci_fnClose || function() { };
    var m_strID = "div_newDialog";
    if (ci_strID != undefined && ci_strID != "") {
        m_strID = ci_strID;
    }
    var m_div = $('<div id="' + m_strID + '" class="easyui-dialog" />').appendTo('body');
    m_div.dialog({
        title: ci_strTitle,
        fit: ci_bFit,
        closed: true,
        modal: true,
        draggable: false,
        width: ci_iWidth,
        height: ci_iHeight,
        iconCls: ci_strIconCls,
        onOpen: function() {
            m_div.html('<iframe id="ifr_' + m_strID + '" scrolling="yes" frameborder="0"  style="width:100%;height:100%;" src="' + m_strUrl + '"></iframe>');
        },
        onCollapse: function() {
            m_div.dialog("close", true);
        },
        onBeforeClose: function() {
            m_div.dialog("collapse", true);
            return false;
        },
        onClose: function() {
            ci_fnClose();
            m_div.find('iframe').remove();
            m_div.dialog('destroy');
        }
    }).dialog('open');
}

function closedPopupDialog(ci_strID) {
    var m_strID = "div_newDialog";
    if (ci_strID != undefined && ci_strID != "") {
        m_strID = ci_strID;
    }
    var m_div = $('#' + m_strID);
    if (m_div.length > 0) {
        m_div.dialog("collapse", true);
    }
}

function dialogSetTitle(ci_strValue, ci_strID) {
    var m_strID = "div_newDialog";
    if (ci_strID != undefined && ci_strID != "") {
        m_strID = ci_strID;
    }
    var m_div = $('#' + m_strID);
    if (m_div.length > 0) {
        m_div.dialog("setTitle", ci_strValue);
    }
}

function getDate() {
    return myDateFormatter(new Date());
}

function getSizeDesc(ci_iSize) {
    var m_iSize = parseInt(ci_iSize);
    var m_iSplit = 1;
    for (var i = 1; i < 6; i++) {
        if (m_iSize >= m_iSplit && m_iSize <= m_iSplit * 1024) {
            var m_strReturn = parseInt(m_iSize / m_iSplit);
            switch (i) {
                case 1:
                    return m_strReturn + 'B';
                case 2:
                    return m_strReturn + 'KB';
                case 3:
                    return m_strReturn + 'MB';
                case 4:
                    return m_strReturn + 'GB';
                case 5:
                    return m_strReturn + 'TB';
            }
        }
        m_iSplit = m_iSplit * 1024;
    }
}

function existData(ci_objData) {
    return (ci_objData.rows != undefined && ci_objData.rows.length > 0);
}

var str_in;
var str_out = "";
var num_in;
var num_out = "";
var e = "Enter Text!";
function stringToNo(ci_strValue) {
    var m_strReturn = '';
    if (ci_strValue != '') {
        var m_strTemp = escape(ci_strValue);
        for (i = 0; i < m_strTemp.length; i++) {
            m_strReturn += m_strTemp.charCodeAt(i) - 23;
        }
    }
    return m_strReturn;
}

function noToString(ci_iValue) {
    var m_strReturn = '';
    if (ci_iValue != '') {
        for (i = 0; i < ci_iValue.length; i += 2) {
            m_strReturn += unescape('%' + (parseInt(ci_iValue.substr(i, [2])) + 23).toString(16));
        }
    }
    return m_strReturn;
}

function bindComboboxData(ci_objCtr, ci_objData, ci_options) {
    var m_obj = $('#' + ci_objCtr);
    if (m_obj.length > 0) {
        var m_strValue = "";
        try {
            m_strValue = m_obj.combobox("getValue");
        } catch (ex) { }
        m_obj.combobox({
            data: ci_objData,
            valueField: ci_options.valueField,
            textField: ci_options.textField
        });
        if (m_strValue != "") {
            m_obj.combobox("selectEx", m_strValue);
        }
    }
}

Date.prototype.format = function(format) {
    var o = {
        "M+": this.getMonth() + 1, //month 
        "d+": this.getDate(), //day 
        "h+": this.getHours(), //hour 
        "m+": this.getMinutes(), //minute 
        "s+": this.getSeconds(), //second 
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter 
        "S": this.getMilliseconds() //millisecond 
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}

function getQueryString(ci_obj) {
    var m_objQuery = [];
    var m_strSign = getSeparativeSign();
    if (ci_obj && ci_obj.length > 0) {
        $.each(ci_obj, function() {
            m_objQuery.push(this[0] + m_strSign + this[1] + m_strSign + this[2]);
        });
    }
    return m_objQuery.join(m_strSign + "," + m_strSign);
}

String.prototype.replaceAll = function(s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2);
}
/*
var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
-1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57,
58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6,
7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1,
-1, -1);

function base64encode(str) {
var out, i, len;
var c1, c2, c3;
len = str.length;
i = 0;
out = "";

while (i < len) {
c1 = str.charCodeAt(i++) & 0xff;

if (i == len) {
out += base64EncodeChars.charAt(c1 >> 2);
out += base64EncodeChars.charAt((c1 & 0x3) << 4);
out += "==";
break
}

c2 = str.charCodeAt(i++);

if (i == len) {
out += base64EncodeChars.charAt(c1 >> 2);
out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
out += base64EncodeChars.charAt((c2 & 0xF) << 2);
out += "=";
break
}

c3 = str.charCodeAt(i++);
out += base64EncodeChars.charAt(c1 >> 2);
out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
out += base64EncodeChars.charAt(c3 & 0x3F)
}

return out
}

function base64decode(str) {
var c1, c2, c3, c4;
var i, len, out;
len = str.length;
i = 0;
out = "";

while (i < len) {
do {
c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
} while (i < len && c1 == -1);

if (c1 == -1)
break;

do {
c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
} while (i < len && c2 == -1);

if (c2 == -1)
break;

out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

do {
c3 = str.charCodeAt(i++) & 0xff;

if (c3 == 61)
return out;

c3 = base64DecodeChars[c3]
} while (i < len && c3 == -1);

if (c3 == -1)
break;

out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

do {
c4 = str.charCodeAt(i++) & 0xff;

if (c4 == 61)
return out;

c4 = base64DecodeChars[c4]
} while (i < len && c4 == -1);
if (c4 == -1)
break;
out += String.fromCharCode(((c3 & 0x03) << 6) | c4)
}
return out
}
*/
//将Ansi编码的字符串进行Base64编码
function base64encode(input) {
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3 = "";
    var enc1, enc2, enc3, enc4 = "";
    var i = 0;
    do {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }
        output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";
    } while (i < input.length);
    return output;
}

//将Base64编码字符串转换成Ansi编码的字符串
function base64decode(input) {
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3 = "";
    var enc1, enc2, enc3, enc4 = "";
    var i = 0;
    if (input.length % 4 != 0) {
        return "";
    }
    var base64test = /[^A-Za-z0-9\+\/\=]/g;
    if (base64test.exec(input)) {
        return "";
    }
    do {
        enc1 = keyStr.indexOf(input.charAt(i++));
        enc2 = keyStr.indexOf(input.charAt(i++));
        enc3 = keyStr.indexOf(input.charAt(i++));
        enc4 = keyStr.indexOf(input.charAt(i++));
        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;
        output = output + String.fromCharCode(chr1);
        if (enc3 != 64) {
            output += String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output += String.fromCharCode(chr3);
        }
        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";
    } while (i < input.length);
    return output;
}

function utf16to8(str) {
    var out, i, len, c;
    out = "";
    len = str.length;
    for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        }
    }
    return out;
}

function utf8to16(str) {
    var out, i, len, c;
    var char2, char3;
    out = "";
    len = str.length;
    i = 0;
    while (i < len) {
        c = str.charCodeAt(i++);
        switch (c >> 4) {
            case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                // 0xxxxxxx
                out += str.charAt(i - 1);
                break;
            case 12: case 13:
                // 110x xxxx 10xx xxxx
                char2 = str.charCodeAt(i++);
                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                break;
            case 14:
                // 1110 xxxx 10xx xxxx 10xx xxxx
                char2 = str.charCodeAt(i++);
                char3 = str.charCodeAt(i++);
                out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
                break;
        }
    }
    return out;
}
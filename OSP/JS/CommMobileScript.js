var _Error = 0;

function getParameter(ci_strSource, ci_strKey) {
    var m_strResult = ci_strSource.match(new RegExp("[\?\&\#]" + ci_strKey + "=([^\&]+)", "i"));
    if (m_strResult == null || m_strResult.length < 1) {
        return "";
    }
    return m_strResult[1];
}

function getQueryStringValue(ci_strKey) {
    return getParameter(location.search, ci_strKey);
}

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

function getUserID() {
    return getCookie("UserID");
}

function setTitle() {
    var m_strOrgName = getCookie("OrgName");
    if (m_strOrgName != undefined && m_strOrgName != "") {
        document.title = m_strOrgName;
    }
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
            switch (ci_Json.DcCode) {
                case -1:
                    if (_Error == 0) {
                        _Error = -1;
                        if (getQueryStringValue("app") == 1) {
                            window.android.clnLoginOver();
                        }
                        else {
                            alert(ci_Json.DcMessage);
                        }
                    }
                    break;

                case -2:
                    if (_Error == 0) {
                        _Error = -2;
                        alert(ci_Json.DcMessage);
                        $("body").empty();
                    }
                    break;
            }
        }
    }
    return false;
}

function showMask() {
    $.mobile.loading('show');
}

function hideMask() {
    $.mobile.loading('hide');
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

function checkPagePower(ci_options) {
    var m_bShowMask = true;
    if (ci_options.showMask != undefined) {
        m_bShowMask = ci_options.showMask;
    }
    if (m_bShowMask) {
        showMask();
    }
    var m_bIsCheck = true;
    if (ci_options.check != undefined) {
        m_bIsCheck = ci_options.check;
    }

    if (m_bIsCheck) {
        $.post(getInterfaceName("DcCdGetUserPageFunPower", true), { dcmenuid: this.menuID }, function(result) {
            result = convertToJson(result);
            if (checkReturnJson(result)) {
                if (ci_options.onload != undefined) {
                    ci_options.onload();
                }
            }
            else {
                if (ci_options.failure != undefined) {
                    ci_options.failure(result);
                }
            }
            hideMask();
        }).error(function(err) { alert('初始页面失败，请重试或通知管理员'); });
    }
    else {
        hideMask();
        if (ci_options.onload != undefined) {
            ci_options.onload();
        }
    }
}

function postData(ci_options) {
    var m_bShowMask = true;
    if (ci_options.showMask != undefined) {
        m_bShowMask = ci_options.showMask;
    }
    if (m_bShowMask) {
        showMask();
    }
    var m_bIsSys = false;
    try {
        m_bIsSys = ci_options.isSys;
    }
    catch (ex) { }

    if (ci_options.validate != undefined) {
        if (!ci_options.validate()) {
            hideMask();
            return;
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
        }
    }

    $.post(getInterfaceName(ci_options.url, m_bIsSys), m_params, function(ci_result) {
        hideMask();
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
                alert('操作失败');
            }
        }
    }).error(function(err) { hideMask(); alert('操作失败，请重试或通知管理员'); });
}

function loadData(ci_options) {
    var m_objForm = $('#' + ci_options.form);
    if (m_objForm.length > 0 && ci_options.data != undefined) {
        m_objForm.find('[name]').each(function() {
            var m_obj = $(this);
            var m_strName = m_obj.attr('name');
            if (ci_options.data[m_strName] != undefined) {
                if (m_obj[0].tagName == "LABEL") {
                    m_obj.html(ci_options.data[m_strName]);
                }
                else {
                    m_obj.val(ci_options.data[m_strName]);
                    if (m_obj[0].type == "select-one") {
                        m_obj.selectmenu().selectmenu("refresh");
                    }
                }
            }
        });
    }
}

function bindCodeMasterData(ci_options) {
    try {
        if (ci_options != undefined && ci_options.controlID != undefined) {
            var m_strIDs = ci_options.controlID.split(",");
            for (var i = 0; i < m_strIDs.length; i++) {
                var m_obj = $("#" + m_strIDs[i]);
                if (m_obj.length > 0) {
                    m_obj.empty();
                    if (ci_options.valueFirst != undefined && ci_options.textFirst != undefined) {
                        m_obj.append("<option value='" + ci_options.valueFirst + "'>" + ci_options.textFirst + "</option>");
                    }
                    m_obj.selectmenu().selectmenu("refresh");
                }
            }

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
                    ci_result.rows.sort(function(a, b) { return a.iOrderBy - b.iOrderBy; });
                    var m_strIDList = ci_options.controlID.split(",");
                    for (var i = 0; i < m_strIDList.length; i++) {
                        var m_obj = $("#" + m_strIDList[i]);
                        if (m_obj.length > 0) {
                            for (var j = 0; j < ci_result.rows.length; j++) {
                                m_obj.append("<option value='" + ci_result.rows[j][ci_options.valueField] + "'>" + ci_result.rows[j][ci_options.textField] + "</option>");
                            }

                            if (ci_options.values) {
                                m_obj.val(ci_options.values.toString().split(",")[i]);
                            }

                            m_obj.selectmenu().selectmenu("refresh");
                        }
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
                            m_obj.val('');
                        }
                    }
                }
            });
        }
    }
    catch (ex) { }
}

function bindIndustryData(ci_options) {
    var m_strIDs = ci_options.controlID.split(",");
    for (var i = 0; i < m_strIDs.length; i++) {
        var m_obj = $("#" + m_strIDs[i]);
        if (m_obj.length > 0) {
            m_obj.empty();
            if (ci_options.valueFirst != undefined && ci_options.textFirst != undefined) {
                m_obj.append("<option value='" + ci_options.valueFirst + "'>" + ci_options.textFirst + "</option>");
            }
            m_obj.selectmenu().selectmenu("refresh");
        }
    }

    if (ci_options.ParentID == undefined) {
        ci_options.ParentID = 0;
    }

    postData({
        url: "DcCdIndustryManage",
        params: { Action: "getlist", iParentID: ci_options.ParentID },
        isSys: true,
        success: function(ci_result) {
            var m_strIDList = ci_options.controlID.split(",");
            for (var i = 0; i < m_strIDList.length; i++) {
                var m_obj = $("#" + m_strIDList[i]);
                if (m_obj.length > 0) {
                    for (var j = 0; j < ci_result.rows.length; j++) {
                        m_obj.append("<option value='" + ci_result.rows[j].iID + "'>" + ci_result.rows[j].cName + "</option>");
                    }

                    if (ci_options.values) {
                        m_obj.val(ci_options.values.toString().split(",")[i]);
                    }
                    m_obj.selectmenu().selectmenu("refresh");
                }
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
                    m_obj.val('');
                }
            }
        }
    });
}

function bindPcdData(ci_options) {
    var m_strIDs = ci_options.controlID.split(",");
    for (var i = 0; i < m_strIDs.length; i++) {
        var m_obj = $("#" + m_strIDs[i]);
        if (m_obj.length > 0) {
            m_obj.empty();
            if (ci_options.valueFirst != undefined && ci_options.textFirst != undefined) {
                m_obj.append("<option value='" + ci_options.valueFirst + "'>" + ci_options.textFirst + "</option>");
            }
            m_obj.selectmenu().selectmenu("refresh");
        }
    }

    var m_objQuery = {};

    if (ci_options.ParentID == undefined) {
        ci_options.ParentID = 0;
    }

    if (ci_options.type == "c" || ci_options.type == "C") {
        m_objQuery = { Action: "getcitylist", iProvinceID: ci_options.ParentID };
    }
    else if (ci_options.type == "d" || ci_options.type == "D") {
        m_objQuery = { Action: "getdistrictlist", iCityID: ci_options.ParentID };
    }
    else {
        m_objQuery = { Action: "getprovincelist" };
    }

    if (ci_options.ParentID > 0 || (ci_options.type != "c" && ci_options.type != "C" && ci_options.type != "d" && ci_options.type != "D")) {
        postData({
            url: "DcCdCpcdManage",
            params: m_objQuery,
            isSys: true,
            success: function(ci_result) {
                var m_strIDList = ci_options.controlID.split(",");
                for (var i = 0; i < m_strIDList.length; i++) {
                    var m_obj = $("#" + m_strIDList[i]);
                    if (m_obj.length > 0) {
                        for (var j = 0; j < ci_result.rows.length; j++) {
                            if (ci_options.type == "c" || ci_options.type == "C") {
                                m_obj.append("<option value='" + ci_result.rows[j].iCityID + "'>" + ci_result.rows[j].cCityName + "</option>");
                            }
                            else if (ci_options.type == "d" || ci_options.type == "D") {
                                m_obj.append("<option value='" + ci_result.rows[j].iDistrictID + "'>" + ci_result.rows[j].cDistrictName + "</option>");
                            }
                            else {
                                m_obj.append("<option value='" + ci_result.rows[j].iProvinceID + "'>" + ci_result.rows[j].cProvinceName + "</option>");
                            }
                        }

                        if (ci_options.values) {
                            m_obj.val(ci_options.values.toString().split(",")[i]);
                        }
                        m_obj.selectmenu().selectmenu("refresh");
                    }
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
                        m_obj.val('');
                    }
                }
            }
        });
    }
    else {
        if (ci_options.success != undefined && typeof (ci_options.success) == 'function') {
            ci_options.success();
        }
    }
}

function setProvinceData(ci_options) {
    bindPcdData({
        type: "p",
        controlID: ci_options.controlID,
        valueFirst: "0",
        textFirst: "请选择省份",
        values: ci_options.values,
        success: function() {
            if (ci_options.success != undefined && typeof (ci_options.success) == 'function') {
                ci_options.success(ci_options.CityID, ci_options.DistrictID);
            }
        }
    });
}

function setCityData(ci_options) {
    var m_strFirst = "请选择省份，再选择城市";
    if (ci_options.ProvinceID > 0) {
        m_strFirst = "请选择城市";
    }
    bindPcdData({
        type: "c",
        ParentID: ci_options.ProvinceID,
        controlID: ci_options.controlID,
        valueFirst: "0",
        textFirst: m_strFirst,
        values: ci_options.values,
        success: function() {
            if (ci_options.success != undefined && typeof (ci_options.success) == 'function') {
                ci_options.success(ci_options.DistrictID);
            }
        }
    });
}

function setDistrictData(ci_options) {
    var m_strFirst = "请选择城市，再选择区域";
    if (ci_options.CityID > 0) {
        m_strFirst = "请选择区域";
    }
    bindPcdData({
        type: "d",
        ParentID: ci_options.CityID,
        controlID: ci_options.controlID,
        valueFirst: "0",
        textFirst: m_strFirst,
        values: ci_options.values,
        success: function() {
            if (ci_options.success != undefined && typeof (ci_options.success) == 'function') {
                ci_options.success();
            }
        }
    });
}

function bindUserData(ci_options) {
    var m_strIDs = ci_options.controlID.split(",");
    for (var i = 0; i < m_strIDs.length; i++) {
        var m_obj = $("#" + m_strIDs[i]);
        if (m_obj.length > 0) {
            m_obj.empty();
            if (ci_options.valueFirst != undefined && ci_options.textFirst != undefined) {
                m_obj.append("<option value='" + ci_options.valueFirst + "'>" + ci_options.textFirst + "</option>");
            }
            m_obj.selectmenu().selectmenu("refresh");
        }
    }

    var m_objP = ci_options.params || { Action: '' };
    m_objP.Action = 'query';
    if (m_objP.iOrgID == undefined && m_objP.Type == undefined) {
        m_objP.Type = 'C';
    }

    postData({
        url: "DcCdUserManage",
        params: m_objP,
        isSys: true,
        success: function(ci_result) {
            var m_strIDList = ci_options.controlID.split(",");
            for (var i = 0; i < m_strIDList.length; i++) {
                var m_obj = $("#" + m_strIDList[i]);
                if (m_obj.length > 0) {
                    for (var j = 0; j < ci_result.rows.length; j++) {
                        m_obj.append("<option value='" + ci_result.rows[j].iUserID + "'>" + ci_result.rows[j].cUserChiName + "</option>");
                    }

                    if (ci_options.values) {
                        m_obj.val(ci_options.values.toString().split(",")[i]);
                    }
                    m_obj.selectmenu().selectmenu("refresh");
                }
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
                    m_obj.val('');
                }
            }
        }
    });
}

Date.prototype.Format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份   
        "d+": this.getDate(),                    //日   
        "h+": this.getHours(),                   //小时   
        "m+": this.getMinutes(),                 //分   
        "s+": this.getSeconds(),                 //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

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
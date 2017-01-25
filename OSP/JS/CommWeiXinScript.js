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
    }
    return false;
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

function postData(ci_options) {
    var m_bIsSys = false;
    try {
        m_bIsSys = ci_options.isSys;
    }
    catch (ex) { }

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
    });
}
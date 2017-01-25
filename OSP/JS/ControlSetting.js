$(function() {
    $.each($('input[type=text]'), function(index, value) {
        if ($(this).attr('maxlength') == undefined) {
            $(this).attr('maxlength', 4000);
        }
    });
    setTimeout("$.each($('.easyui-numberbox'), function(index, value) { if ($(this).numberbox('options').max == null) { $(this).numberbox('options').max = 99999999999; } });", 200);
});

function setControlVisible(ci_ControlID, ci_IsVisible) {
    $("#" + ci_ControlID).css("display", (ci_IsVisible ? "" : "none"));
}

function setControlEnable(ci_ControlID, ci_IsEnable) {
    var m_ctr = document.getElementById(ci_ControlID);
    if (m_ctr) {
        var m_bIsSetReadOnly = true;
        switch (m_ctr.nodeName) {
            case "INPUT":
                if (m_ctr.type != "text") {
                    m_bIsSetReadOnly = false;
                }
                break;
            case "TEXTAREA":
                break;
            default:
                m_bIsSetReadOnly = false;
                break;
        }
        m_ctr = $("#" + ci_ControlID);
        if (m_bIsSetReadOnly) {
            m_ctr.removeClass("TextReadOnly");
            m_ctr.removeClass("TextEdit");
            m_ctr.addClass(ci_IsEnable ? "TextEdit" : "TextReadOnly");
            if (ci_IsEnable) {
                m_ctr.removeAttr("readonly");
            }
            else {
                m_ctr.attr("readonly", "readonly");
            }
        }
        else {
            if (!ci_IsEnable) {
                m_ctr.attr("disabled", "disabled");
                m_ctr.attr("unOnClick", m_ctr.attr("onclick"));
                m_ctr.attr("onclick", "");
            }
            else if (m_ctr.attr("unOnClick") != undefined) {
                m_ctr.removeAttr("disabled");
                m_ctr.attr("onclick", m_ctr.attr("unOnClick"));
            }
        }
    }
}

function setControl(ci_ControlList) {
    if (ci_ControlList != undefined) {
        for (var i = 0; i < ci_ControlList.length; i++) {
            try {
                setControlVisible(ci_ControlList[i].controlID, ci_ControlList[i].isVisibleAllow);
            }
            catch (ex) { }
            try {
                setControlEnable(ci_ControlList[i].controlID, (ci_ControlList[i].isEnableAllow));
            }
            catch (ex) { }
        }
    }
}
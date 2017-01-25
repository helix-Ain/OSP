var m_objScript = [];
var m_objLoader = new fileLoader();
m_objScript.push(_strSysUrl + 'css/diglogstyle.css');
m_objScript.push(_strSysUrl + 'osp/css/easyuiex.css');
m_objLoader.load(m_objScript);

function popupDialog(ci_strSrc, ci_strFun, ci_strTitle, ci_bFit, ci_iWidth, ci_iHeight, ci_strIconCls, ci_strID, ci_fnClose) {
    var m_strUrl = ci_strSrc;
    var m_objAnimate = null;
    var m_objOptions = { fit: (ci_bFit == undefined ? false : ci_bFit), onClose: function() { }, closed: false };
    if (ci_fnClose != undefined && typeof ci_fnClose == "function") {
        m_objOptions.onClose = ci_fnClose;
    }
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

    var m_strID = "div_newDialog";
    if (ci_strID != undefined && ci_strID != "") {
        m_strID = ci_strID;
    }

    var m_bAnimate = false;
    var m_div = $('#' + m_strID);
    if (m_div.length == 0) {
        m_bAnimate = true;
        m_div = $('<div id="' + m_strID + '" style="width:0px;height:0px;position:fixed;"/>').appendTo('body');
    }
    else {
        var m_opts = m_div.data('options');
        if (m_opts.closed) {
            setTimeout(function() {
                popupDialog(ci_strSrc, ci_strFun, ci_strTitle, ci_bFit, ci_iWidth, ci_iHeight, ci_strIconCls, ci_strID, ci_fnClose);
            }, 100);
            return;
        }
    }
    m_div.attr('class', 'shadow diglog');
    m_div.empty();
    if (m_objOptions.fit) {
        ci_iHeight = $(window).height();
        ci_iWidth = $(window).width();
    }
    if (ci_iHeight > $(window).height() || ci_iHeight == undefined) {
        ci_iHeight = $(window).height();
    }
    if (ci_iWidth > $(window).width() || ci_iWidth == undefined) {
        ci_iWidth = $(window).width();
    }
    m_objAnimate = { height: ci_iHeight + 'px' };

    var m_divMask = $('#div_PopLoadingMask');
    if (m_divMask.length == 0) {
        m_divMask = $('<div id="div_PopLoadingMask"></div>').appendTo('body');
    }
    m_divMask.attr('class', 'LoadingMask').css({ width: $(window).width(), height: $(window).height(), cursor: 'default' });

    var m_divTitle = $('<div class="title"><span class="titletext">' + ci_strTitle + '</span></div>').appendTo(m_div);
    var m_btnClose = $('<a href="javascript:void(0)" class="easyui-linkbutton" iconcls="dcn-icon-close" plain="true"></a>').appendTo(m_divTitle);
    m_btnClose.bind('click', function() { closedPopupDialog(ci_strID); });
    m_btnClose.css({ 'float': 'right', 'margin': '5px' });
    $.parser.parse(m_divTitle);

    m_div.css({
        left: (document.body.offsetWidth - parseInt(ci_iWidth)) / 2,
        top: ($(window).height() - parseInt(ci_iHeight)) / 2,
        width: ci_iWidth
    });
    $('<iframe scrolling="yes" frameborder="0"  style="width:100%;height:' + parseInt(ci_iHeight - m_divTitle.height()) + 'px;" src="' + m_strUrl + '"></iframe>').appendTo(m_div);
    if (m_bAnimate) {
        m_div.animate(m_objAnimate, { speed: 2000 });
    }

    m_div.data('options', m_objOptions);
}

function closedPopupDialog(ci_strID) {
    var m_strID = "div_newDialog";
    if (ci_strID != undefined && ci_strID != "") {
        m_strID = ci_strID;
    }
    var m_div = $('#' + m_strID);
    if (m_div.length > 0) {
        var m_objOptions = m_div.data('options');
        var m_objAnimate = { height: "0px" };
        if (m_objOptions == undefined || m_objOptions == null) {
            m_objOptions = { fit: false, onClose: function() { }, closed: false };
        }
        m_objOptions.closed = true;
        m_div.data('options', m_objOptions);
        m_div.animate(m_objAnimate, {
            done: function() {
                m_div.html('');
                m_objOptions.onClose.call(m_div);
                var m_divMask = $('#div_PopLoadingMask');
                if (m_divMask.length > 0) {
                    m_divMask.remove();
                }
                m_div.remove();
            }
        });
    }
}

function dialogSetTitle(ci_strValue, ci_strID) {
    var m_strID = "div_newDialog";
    if (ci_strID != undefined && ci_strID != "") {
        m_strID = ci_strID;
    }
    var m_div = $('#' + m_strID);
    if (m_div.length > 0) {
        m_div.find('div.title').find('span.titletext').html(ci_strValue);
    }
}
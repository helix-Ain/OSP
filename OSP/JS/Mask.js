var _bInitMask = false;
var _objMask = [];
var _objCheck = null;

function initMask() {
    $('body,html').css('display', '');
    _objCheck = setTimeout('checkInitMask();', 60000);
    try {
        var m_div = $('#div_LoadingMaskInit');
        var m_divMsg = $('#div_LoadingMsgInit');
        if (m_div.length == 0) {
            m_div = $('<div id="div_LoadingMaskInit" style="background-color:#ccc;position:fixed;display:block;z-index:90000;top:0px;left:0px;width:100%;height:100%;"></div>').appendTo('body');
        }
        if (m_divMsg.length == 0) {
            m_divMsg = $('<div id="div_LoadingMsgInit"></div>').appendTo($(m_div));
            m_divMsg.html('正在初始化页面...');
            m_divMsg.css({
                position: 'absolute',
                top: '50%',
                marginTop: '-20px',
                width: 'auto',
                height: '16px',
                left: (($('body').width() / 2) - 65) + 'px',
                padding: '12px 5px 10px 30px',
                background: '#fff url(' + _strSysUrl + 'image/loading.gif) no-repeat scroll 5px 10px',
                border: '2px solid #ccc',
                color: '#222',
                display: 'block',
                zIndex: 10000,
                fontSize: '12px'
            });
        }
        $('body,html').css('display', '');
        _bInitMask = true;
    }
    catch (ex) {
        setTimeout('initMask();', 10);
    }
}

function hiddInitMask() {
    _bInitMask = false;
    $('#div_LoadingMaskInit').remove();
    if (_objMask.length > 0) {
        var m_objMask = _objMask.shift();
        loadingMask(m_objMask.target, m_objMask.message);
    }
    if (_objCheck != null) {
        clearTimeout(_objCheck);
        _objCheck = null;
    }
}

function checkInitMask() {
    if (_bInitMask) {
        //location.href = location.href;
    }
}

function loadingMask(ci_objTarget, ci_strMessage) {
    var m_obj = $(ci_objTarget);
    if (m_obj.length == 0) {
        m_obj = $('body');
    }
    if (ci_strMessage == undefined) {
        ci_strMessage = "正在加载数据...";
    }
    _objMask.push({ target: m_obj, message: ci_strMessage });
    if (!_bInitMask) {
        var m_div = $('#div_LoadingMask');
        if (m_div.length == 0) {
            m_div = $('<div id="div_LoadingMask"></div>').appendTo(m_obj);
        }
        m_div.attr('class', 'LoadingMask').css({ width: $(window).width(), height: $(window).height() });

        var m_divMsg = $('#div_LoadingMsg');
        if (m_divMsg.length > 0) {
            m_divMsg.remove();
        }
        m_divMsg = $('<div id="div_LoadingMsg"></div>').appendTo(m_obj);
        m_divMsg.attr('class', 'LoadingMaskMsg').css({ left: ($(m_obj).width() / 2 - 65) + 'px' }).html(ci_strMessage);
    }
}

function hiddMask(ci_bIsWait) {
    if (_objMask.length > 0) {
        var m_objMask = _objMask.shift();
        if (_objMask.length > 0) {
            m_objMask = _objMask.shift();
            loadingMask(m_objMask.target, m_objMask.message);
            return;
        }
    }
    try {
        if (ci_bIsWait) {
            setTimeout("hiddMask()", 100);
            return;
        }
        $('#div_LoadingMsg').remove();
        $('#div_LoadingMask').remove();
    }
    catch (ex) { }
}
var _objFileLoader = new fileLoader();

initializationPage();

function fileLoader() {
    this.isReady = false;
    this.isParse = true;
    this.isShowMask = true;
    this.isHideMask = true;
    this.readyFunction = [];
    this.lastFunction = [];
    this.handlerError = function(e) { };
    this.addReadyFn = function(ci_fn) {
        if (ci_fn != undefined) {
            if (typeof (ci_fn) == 'function') {
                this.readyFunction.push(ci_fn);
            }
            else {
                for (var i = 0; i < ci_fn.length; i++) {
                    this.readyFunction.push(ci_fn[i]);
                }
            }
        }
    };
    this.load = function(ci_strUrl) {
        this.isReady = false;
        ci_strUrl = ci_strUrl || new Array();
        var m_funSelf = this;
        var m_iCount = 0;
        _ready();

        function _ready() {
            if (m_iCount < ci_strUrl.length) {
                var m_strParams = '?V=' + _strSysVer;
                if (/.[js|css][\?\#]/i.test(ci_strUrl[m_iCount])) {
                    m_strParams = '&V=' + _strSysVer;
                }
                _load(ci_strUrl[m_iCount], m_strParams);
            }
            else {
                m_funSelf.isReady = true;
                if (m_funSelf.isParse) {
                    try { $.parser.parse(); } catch (ex) { }
                }
                if (m_funSelf.readyFunction.length > 0) {
                    for (var i in m_funSelf.readyFunction) {
                        m_funSelf.readyFunction[i]();
                    }
                }
                if (m_funSelf.lastFunction.length > 0) {
                    for (var i in m_funSelf.lastFunction) {
                        m_funSelf.lastFunction[i]();
                    }
                }

                m_funSelf.lastFunction = [];
                m_funSelf.readyFunction = [];
            }
        }

        function _load(ci_strValue, ci_strParams) {
            if (/\.css/i.test(ci_strValue)) {
                $('<link>').attr({ rel: 'stylesheet',
                    type: 'text/css',
                    href: ci_strValue + ci_strParams
                }).appendTo("head");

                m_iCount++;
                _ready();
            }
            else {
                var m_strUrl = ci_strValue.split(',');
                var m_bIsAsync = true;
                if (m_strUrl.length == 2 && parseInt(m_strUrl[1]) == 0) {
                    m_bIsAsync = false;
                }
                $.ajax({
                    url: m_strUrl[0] + ci_strParams,
                    cache: true,
                    dataType: 'script',
                    async: m_bIsAsync,
                    complete: function() {
                        m_iCount++;
                        _ready();
                    }
                });
            }
        }
    }
}

function getParameter(ci_strSource, ci_strKey) {
    var m_strResult = ci_strSource.match(new RegExp("[\?\&\#]" + ci_strKey + "=([^\&]+)", "i"));
    if (m_strResult == null || m_strResult.length < 1) {
        return "";
    }
    return m_strResult[1];
}

function getScriptQuery(ci_strScriptName, ci_strKey) {
    if (ci_strScriptName != '') {
        if (ci_strScriptName.toString().toLowerCase().lastIndexOf('.js') < 0) {
            ci_strScriptName += '.js';
        }
        var m_objScript = document.getElementsByTagName('script');
        if (m_objScript.length > 0) {
            for (var i = 0; i < m_objScript.length; i++) {
                if (m_objScript[i].src.lastIndexOf('/' + ci_strScriptName) >= 0) {
                    return getParameter(m_objScript[i].src, ci_strKey);
                }
            }
        }
    }
    return '';
}

function initializationPage() {
    try {
        $.ajax({
            url: _strSysUrl + 'ver/ver.js?' + Math.random().toString().replace(/0./, ''),
            cache: false,
            dataType: 'script',
            async: false,
            success: function() {
                var m_objScript = [];
                var m_objLoader = new fileLoader();
                m_objScript.push(_strSysUrl + 'js/mask.js?' + Math.random().toString().replace(/0./, '') + ',0');
                m_objScript.push(_strSysUrl + 'js/Common.js,0');
                m_objLoader.isHideMask = false;
                m_objLoader.isParse = false;
                m_objLoader.addReadyFn(function() {

                    setTimeout(function() {
                        $('body,html').css('display', '');
                        var m_strShowMask = getScriptQuery('CommonScript', 'showmask');
                        if (m_strShowMask != '0') {
                            initMask();
                        }
                    }, 100);

                    var m_objScriptList = getScript();

                    try {
                        if (_objLocalScript.length > 0) {
                            for (var i = 0; i < _objLocalScript.length; i++) {
                                m_objScriptList.push(_objLocalScript[i]);
                            }
                        }
                    }
                    catch (ex) { }

                    var m_strScript = getScriptQuery('CommonScript', 'script');
                    if (m_strScript != '') {
                        var m_strScripts = m_strScript.split(',');
                        for (var i = 0; i < m_strScripts.length; i++) {
                            m_objScriptList.push(m_strScripts[i]);
                        }
                    }
                    _objFileLoader.addReadyFn(function() {
                        setTimeout(function() {
                            if (_objFileLoader.isHideMask) {
                                hiddInitMask();
                            }
                        }, 300);
                    });
                    _objFileLoader.load(m_objScriptList);
                });
                m_objLoader.load(m_objScript);
            }
        });
    }
    catch (ex) {
        location.href = location.href;
    }
}
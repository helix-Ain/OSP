(function() {
    var m_objModules = {
        Form: {
            js: 'jquery.dcn.form.js'
        },
        FieldEx: {
            js: 'jquery.dcn.fieldex.js'
        },
        Help: {
            js: 'jquery.dcn.help.js'
        },
        Clearbutton: {
            js: 'jquery.dcn.clearbutton.js'
        },
        ComboList: {
            js: 'jquery.dcn.combolist.min.js',
            css: 'dcncombolist.css'
        },
        ListBox: {
            js: 'jquery.dcn.listbox.min.js',
            css: 'dcnlistbox.css'
        },
        DCNDiv: {
            js: 'jquery.dcn.div.min.js'
        },
        Kindeditor: {
            exjs: ['plugins/kindeditor/kindeditor.js', 'plugins/kindeditor/lang/zh_CN.js'],
            js: 'jquery.dcn.kindeditor.js'
        },
        Uploadify: {
            exjs: ['plugins/uploadify/scripts/jquery.uploadify.min.js', 'plugins/uploadify/scripts/swfobject.js', 'plugins/uploadify/css/uploadify.css'],
            js: 'jquery.dcn.uploadify.js',
            css: 'dcnuploadify.css'
        },
        Chart: {
            exjs: ['plugins/Highcharts/highcharts.js', 'plugins/Highcharts/modules/exporting.js'],
            js: 'jquery.dcn.chart.js'
        }
    };

    function loadModule(ci_strName, callback) {
        var m_objM = [];

        if (typeof ci_strName == 'string') {
            _add(ci_strName);
        } else {
            for (var i = 0; i < ci_strName.length; i++) {
                _add(ci_strName[i]);
            }
        }
        _load();

        function _add(ci_strName) {
            if (typeof ci_strName == 'string') {
                if (m_objModules[ci_strName]) {
                    var d = m_objModules[ci_strName]['dependencies'];
                    if (d) {
                        for (var i = 0; i < d.length; i++) {
                            _add(d[i]);
                        }
                    }
                }
                m_objM.push(ci_strName);
            }
            else {
                $.each(ci_strName, function() {
                    m_objM.push(this);
                });
            }
        }

        function _load() {
            if (m_objM.length) {
                var m_objFiles = [];
                for (var i = 0; i < m_objM.length; i++) {
                    if (m_objModules[m_objM[i]] == undefined) {
                        try {
                            m_objFiles.push(m_objM[i]);
                        } catch (ex) { }
                    }
                    else {
                        if (m_objModules[m_objM[i]].excss) {
                            if (typeof m_objModules[m_objM[i]].excss == 'string') {
                                m_objFiles.push(_strSysUrl + m_objModules[m_objM[i]].excss);
                            }
                            else {
                                $.each(m_objModules[m_objM[i]].excss, function() {
                                    m_objFiles.push(_strSysUrl + this);
                                });
                            }
                        }
                        if (m_objModules[m_objM[i]].exjs) {
                            if (typeof m_objModules[m_objM[i]].exjs == 'string') {
                                m_objFiles.push(_strSysUrl + m_objModules[m_objM[i]].exjs);
                            }
                            else {
                                $.each(m_objModules[m_objM[i]].exjs, function() {
                                    m_objFiles.push(_strSysUrl + this);
                                });
                            }
                        }
                        if (m_objModules[m_objM[i]].css) {
                            if (typeof m_objModules[m_objM[i]].css == 'string') {
                                m_objFiles.push(_strSysUrl + 'plugins/DCN/css/' + m_objModules[m_objM[i]].css);
                            }
                            else {
                                $.each(m_objModules[m_objM[i]].css, function() {
                                    m_objFiles.push(_strSysUrl + 'plugins/DCN/css/' + this);
                                });
                            }
                        }
                        if (m_objModules[m_objM[i]].js) {
                            if (typeof m_objModules[m_objM[i]].js == 'string') {
                                m_objFiles.push(_strSysUrl + 'plugins/DCN/js/' + m_objModules[m_objM[i]].js);
                            }
                            else {
                                $.each(m_objModules[m_objM[i]].js, function() {
                                    m_objFiles.push(_strSysUrl + 'plugins/DCN/js/' + this);
                                });
                            }
                        }
                    }
                }
                if (m_objFiles.length > 0) {
                    var m_objFileLoader = new fileLoader();
                    m_objFileLoader.isParse = false;
                    m_objFileLoader.isHideMask = false;
                    m_objFileLoader.addReadyFn(function() {
                        _finish();
                    });
                    m_objFileLoader.load(m_objFiles);
                }
            } else {
                _finish();
            }
        }

        function _finish() {
            if (callback) {
                callback();
            }
        }
    }

    dcnloader = {
        modules: m_objModules,

        load: function(name, callback) {
            loadModule(name, callback);
        }
    };
})(jQuery);


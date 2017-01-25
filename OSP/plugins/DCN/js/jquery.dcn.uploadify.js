(function($) {
    function create(target) {
        var opts = $.data(target, 'dcnupload').options;
        var panel = $(target);

        panel.html('');
        panel.removeClass('dcn-upload');
        panel.addClass('dcn-upload');

        if (opts) {
            var m_divBtn = $('<div class="upload-btn-div"></div>').appendTo(panel);
            var m_btnUpload = $('<a href="javascript:void(0)" class="upload-btn-comment upload-btn-upload" title="上传文件"></a>').appendTo(m_divBtn);
            var m_btnDelete = $('<a href="javascript:void(0)" class="upload-btn-comment upload-btn-delete" title="删除文件"></a>').appendTo(m_divBtn);
            var m_inputFile = $('<input id="input_' + new Date().format('yyMMddhhmmssS') + '" type="file" style="display: none;" />').appendTo(m_btnUpload);
            var m_divOut = $('<div class="upload-middle-out"><div class="upload-middle-in"></div></div>').appendTo(panel);
            var m_img = $('<img title="点击打开" />').appendTo(panel.find('.upload-middle-in'));
            var m_divMsg = $('<div class="upload-msg"></div>').appendTo(panel.find('.upload-middle-in')).hide();

            if (parseInt(opts.size) < 90) {
                opts.size = 90;
            }
            panel.width(opts.size + 4).height(opts.size + 4);
            m_divOut.width(opts.size).height(opts.size);

            m_img.hide().bind('load', function() {
                $(this).css({ width: 'auto', height: 'auto' });
                var m_strSize = 'width';
                var m_iMax = $(this).width();

                if ($(this).width() < $(this).height()) {
                    m_strSize = 'height';
                    m_iMax = $(this).height();
                }
                if (m_iMax >= opts.size) {
                    $(this).css(m_strSize, opts.size + 'px');
                }
                m_divMsg.hide();
                $(this).show();
            });

            m_btnDelete.bind('click', function() {
                if (opts.deleteMessage != '') {
                    $.messager.confirm('提示', opts.deleteQuery, function(r) {
                        if (r) {
                            _delete();
                        }
                    });
                }
                else {
                    _delete();
                }
                function _delete() {
                    setFile(target);

                    opts.onAfterDelete.call(target);
                }
            });
            if (!opts.readOnly) {
                m_divBtn.show();
            }
            panel.hover(function() {
                m_divBtn.stop(true, true);
                m_divBtn.animate({ right: '0px' }, { speed: 200 });
            }, function() {
                m_divBtn.stop(true, true);
                m_divBtn.animate({ right: '-45px' }, { speed: 200 });
            });

            $.data(target, 'dcnupload').file = m_inputFile;
            $.data(target, 'dcnupload').image = m_img;

            setFile(target, opts.fileData);
        }
    }

    function uploadError(event, ID, fileObj, errorObj) {
        if (errorObj.type === "File Size") {
            $.messager.alert('提示', '超过文件上传大小限制！', 'info');
        }
        else {
            $.messager.alert('提示', '上传失败！', 'info');
        }
        $(this).uploadifyCancel(ID);
        $(this).dcnupload('setFile');
    }

    function uploadComplete(event, queueId, fileObj, response, data) {
        var m_result = convertToJson(response);
        if (m_result.DcCode != undefined && m_result.DcCode == 0) {
            if (existData(m_result)) {
                var m_objData = m_result.rows[0];
                $(this).dcnupload('setFile', m_objData);
            }
        }
        else {
            $(this).dcnupload('setFile');
            if (m_result.DcMessage != undefined && m_result.DcMessage != '') {
                $.messager.alert('提示', m_result.DcMessage, 'info');
            }
            else {
                $.messager.alert('提示', '上传失败！', 'info');
            }
        }
        return m_result;
    }

    function uploadProgress(event, queueId, fileObj, data) {
        var m_divMsg = $(this).find('.upload-msg');
        if (m_divMsg) {
            var m_strMsg = '正在上传';
            if (data && data.percentage != undefined && parseInt(data.percentage) != 100) {
                m_strMsg += '(' + data.percentage + ' %)';
                $(m_divMsg).removeClass('upload-msg-progress').addClass('upload-msg-progress').html(m_strMsg).show();
            }
            else {
                $(m_divMsg).hide();
            }
        }
    }

    function setFileData(target, fileData) {
        fileData = fileData || { iAttachmentID: 0, iServerID: 0, cFileName: '', cExtension: '', cFileUrl: '' }
        var opts = $.data(target, 'dcnupload').options;
        if (opts) {
            for (var i in opts.fileData) {
                if (fileData[i] != undefined) {
                    opts.fileData[i] = fileData[i];
                }
            }
            $.data(target, 'dcnupload').options = opts;
        }
    }

    function setFile(target, fileData) {
        var opts = $.data(target, 'dcnupload').options;
        var panel = $(target);

        if (opts && panel) {
            setFileData(target, fileData);
            fileData = panel.dcnupload('getFileData');

            if (parseInt(fileData.iAttachmentID) > 0 && fileData.cFileName == '') {
                postData({
                    url: 'DcCdAttachmentManage',
                    isSys: true,
                    params: { Action: 'GetFile', iAttachmentID: fileData.iAttachmentID },
                    success: function(ci_result) {
                        if (existData(ci_result)) {
                            setFileData(target, fileData);
                            fileData = panel.dcnupload('getFileData');
                        }
                        _setFile();
                    }
                });
            }
            else {
                _setFile();
            }

            function _setFile() {
                var m_div = panel.find('.upload-msg');
                if (m_div) {
                    m_div.attr('class', 'upload-msg').html('');

                    if (fileData.cFileUrl != '' && fileData.cFileName != '') {
                        m_div.addClass('upload-file-generic').addClass('upload-file-' + fileData.cExtension.toLowerCase());
                    }
                    else {
                        m_div.html(opts.noDataMessage);
                    }
                    m_div.show();
                }

                if (fileData.cFileUrl != '' && fileData.cFileName != '') {
                    panel.find('a.upload-btn-delete').show();

                    var m_strDefaultPixel = '';
                    try {
                        m_strDefaultPixel = _strDefaultPixel;
                    } catch (ex) { }
                    var m_strUrl = fileData.cFileUrl + m_strDefaultPixel + fileData.cFileName;
                    if (m_strUrl.indexOf('http') < 0) {
                        m_strUrl = _strSysUrl + m_strUrl;
                    }

                    setImage(target, m_strUrl, m_strUrl.replace(m_strDefaultPixel, ''));
                }
                else {
                    panel.find('a.upload-btn-delete').hide();

                    setImage(target, opts.defaultImage, opts.defaultImage);
                }
            }
        }
    }

    function setImage(target, ci_strSrc, ci_strClick) {
        var m_objImage = $.data(target, 'dcnupload').image;
        if (m_objImage) {
            m_objImage.hide();
            m_objImage.bind('click', function() {
                if (ci_strClick != '') {
                    try {
                        window.open(ci_strClick);
                    } catch (ex) { }
                }
            });
            m_objImage.attr('src', ci_strSrc);
            $.data(target, 'dcnupload').image = m_objImage;
        }
    }

    $.fn.dcnupload = function(options, param) {
        if (typeof options == 'string') {
            return $.fn.dcnupload.methods[options](this, param);
        }
        options = options || {};
        return this.each(function() {
            var state = $.data(this, "dcnupload");
            if (state) {
                for (var i in options) {
                    switch (i) {
                        case 'onError':
                            state.options[i] = function(event, ID, fileObj, errorObj) {
                                uploadError.call(target, event, ID, fileObj, errorObj);
                                options.onError.call(target, event, ID, fileObj, errorObj);
                            };
                            break;
                        case 'onComplete':
                            state.options[i] = function(event, queueId, fileObj, response, data) {
                                var m_result = uploadComplete.call(target, event, queueId, fileObj, response, data);
                                options.onComplete.call(target, event, queueId, fileObj, m_result, data);
                            };
                            break;
                        case 'onProgress':
                            state.options[i] = function(event, queueId, fileObj, data) {
                                uploadProgress.call(target, event, queueId, fileObj, data);
                                options.onComplete.call(target, event, queueId, fileObj, data);
                            };
                            break;
                        case 'serverType':
                            state.options.scriptData.iType = options.serverType;
                            break;
                        case 'op':
                            state.options.scriptData.cOP = options.op;
                            break;
                        case 'objectCode':
                            state.options.scriptData.cObjectCode = options.objectCode;
                            break;
                        case 'refID':
                            state.options.scriptData.iRefRecordID = options.refID;
                            break;
                        case 'scriptData':
                            break;
                        default:
                            state.options[i] = options[i];
                            break;
                    }
                }
                $.data(this, 'dcnupload', { options: state.options });
            }
            else {
                var target = this;
                var m_objOption = $.fn.dcnupload.defaults;
                m_objOption.onError = function(event, ID, fileObj, errorObj) {
                    uploadError.call(target, event, ID, fileObj, errorObj);
                    if (options != undefined && options.onError != undefined) {
                        options.onError.call(target, event, ID, fileObj, errorObj);
                    }
                }
                m_objOption.onComplete = function(event, queueId, fileObj, response, data) {
                    var m_result = uploadComplete.call(target, event, queueId, fileObj, response, data);
                    if (options != undefined && options.onComplete != undefined) {
                        options.onComplete.call(target, event, queueId, fileObj, m_result, data);
                    }
                }
                m_objOption.onProgress = function(event, queueId, fileObj, data) {
                    uploadProgress.call(target, event, queueId, fileObj, data);
                    if (options != undefined && options.onProgress != undefined) {
                        options.onProgress.call(target, event, queueId, fileObj, data);
                    }
                }

                for (var i in options) {
                    if (i != 'onError' && i != 'onComplete' && i != 'onProgress' && i != 'scriptData') {
                        m_objOption[i] = options[i];
                    }
                }

                m_objOption.scriptData = { Action: 'Upload', UserCertification: getCookie('UserCertification'), iType: m_objOption.serverType, cOP: m_objOption.op, cObjectCode: m_objOption.objectCode, iRefRecordID: m_objOption.refID }

                $.data(this, 'dcnupload', { options: m_objOption });
                create(target);
            }
            var m_objFile = $.data(this, 'dcnupload').file;
            if (m_objFile) {
                m_objFile.uploadify($.data(this, 'dcnupload').options);
                $.data(this, 'dcnupload').file = m_objFile;
            }
        });
    };

    $.fn.dcnupload.methods = {
        options: function(jq) {
            return $.data(jq[0], "dcnupload").options;
        },
        cancel: function(jq, queueID) {
            return jq.each(function() {
                $(this).uploadifyCancel(queueID);
            });
        },
        upload: function(jq) {
            return jq.each(function() {
                $(this).uploadifyUpload();
            });
        },
        clearQueue: function(jq) {
            return jq.each(function() {
                $(this).uploadifyClearQueue();
            });
        },
        getFileData: function(jq) {
            var opts = $.data(jq[0], 'dcnupload').options;
            if (opts) {
                return opts.fileData;
            }
            return '';
        },
        setFile: function(jq, value) {
            return jq.each(function() {
                setFile(this, value);
            });
        }
    };

    $.fn.dcnupload.parseOptions = function(target) {
        return $.extend({}, $.parser.parseOptions(target, ['uploader', 'script', 'checkScript', 'fileDataName', 'method', 'scriptAccess', 'folder', 'queueID', 'fileDesc', 'fileExt', 'sizeLimit', 'buttonText', 'buttonImg', 'wmode', 'cancelImg']), {
            queueSizeLimit: 999,
            simUploadLimit: 1,
            width: 60,
            height: 30,
            multi: false,
            auto: true,
            hideButton: false,
            rollover: false
        });
    };

    $.fn.dcnupload.defaults = {
        uploader: _strSysUrl + 'plugins/uploadify/scripts/uploadify.swf',
        script: getInterfaceName("DcCdAttachmentManage", true),
        serverType: 5,
        op: '',
        objectCode: '',
        refID: 0,
        checkScript: '',
        fileDataName: 'Filedata',
        method: 'Post',
        scriptAccess: 'sameDomain',
        folder: '',
        queueID: 'div_UploadQueue',
        queueSizeLimit: 999,
        multi: false,
        auto: true,
        fileDesc: '',
        fileExt: '',
        sizeLimit: '',
        simUploadLimit: 1,
        buttonText: '',
        buttonImg: _strSysUrl + 'plugins/DCN/icons/f1.png',
        hideButton: false,
        rollover: false,
        width: 17,
        height: 17,
        wmode: 'transparent',
        cancelImg: _strSysUrl + 'plugins/uploadify/css/cancel.png',
        deleteMessage: '',
        defaultImage: '',
        noDataMessage: '没有相关附件',
        size: 90,
        fileData: { iAttachmentID: 0, iServerID: 0, cFileName: '', cExtension: '', cFileUrl: '' },
        readOnly: false,
        onInit: function() { },
        onSelect: function(event, queueID, fileObj) { },
        onSelectOnce: function(event, data) { },
        onCancel: function(event, queueId, fileObj, data) { },
        onClearQueue: function(event, data) { },
        onQueueFull: function(event, queueSizeLimit) { },
        onError: function(event, ID, fileObj, errorObj) { },
        onOpen: function(event, queueId, fileObj) { },
        onProgress: function(event, queueId, fileObj, data) { },
        onComplete: function(event, queueId, fileObj, response, data) { },
        onAllComplete: function(event, data) { },
        onLoadSuccess: function() { },
        onAfterDelete: function() { }
    };

    //$('.dcn-upload').dcnupload();
})(jQuery);
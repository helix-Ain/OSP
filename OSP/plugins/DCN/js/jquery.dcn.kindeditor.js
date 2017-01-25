(function($, K) {
    if (!K)
        throw "KindEditor未定义!";

    function create(target) {
        var opts = $.data(target, 'kindeditor').options;
        var editor = K.create(target, opts);
        $.data(target, 'kindeditor').options.editor = editor;
    }

    $.fn.kindeditor = function(options, param) {
        if (typeof options == 'string') {
            var method = $.fn.kindeditor.methods[options];
            if (method) {
                return method(this, param);
            }
        }
        options = options || {};
        return this.each(function() {
            var state = $.data(this, 'kindeditor');
            if (state) {
                $.extend(state.options, options);
            } else {
                state = $.data(this, 'kindeditor', {
                    options: $.extend({}, $.fn.kindeditor.defaults, $.fn.kindeditor.parseOptions(this), options)
                });
            }
            create(this);
        });
    }

    $.fn.kindeditor.parseOptions = function(target) {
        return $.extend({}, $.parser.parseOptions(target, []));
    };

    $.fn.kindeditor.methods = {
        editor: function(jq) {
            return $.data(jq[0], 'kindeditor').options.editor;
        }
    };

    $.fn.kindeditor.defaults = {
        uploadJson: './Ajax/upload_json.ashx',
        basePath: _strSysUrl + 'plugins/kindeditor/',
        fileManagerJson: './Ajax/file_manager_json.ashx',
        allowFileManager: true,
        allowPreviewEmoticons: false,
        allowImageUpload: true,
        useContextmenu: true,
        resizeMode:2,
        minWidth: 200,
        items: [
            'undo', 'redo', '|',
            'bold', 'italic', 'underline', 'fontname', 'fontsize', 'forecolor', 'hilitecolor', '|',
             'insertorderedlist', 'insertunorderedlist', '|',
            'justifyleft', 'justifycenter', 'justifyright', 'justifyfull', 'indent', 'outdent', 'lineheight', '|',
            'emoticons', 'image', 'link', 'clearhtml', 'quickformat'
        ],
        afterChange: function() {
            this.sync(); //这个是必须的,如果你要覆盖afterChange事件的话,请记得最好把这句加上.
        },
        afterCreate: function() {
            this.sync();
        },
        afterBlur: function() {
            this.sync();
        }
    };
    $.parser.plugins.push("kindeditor");
})(jQuery, KindEditor);
(function($) {
    function createButton(target) {
        var opts = $.data(target, 'clearbutton').options;
        $(target).empty();
        if (opts) {
            $(target).linkbutton({
                //text: '清空',
                iconCls: 'icon-clear',
                plain: true
            });
            $(target).attr('title', '清空');
            target.onclick = function() { clearText(target, opts.targetID); };
            setDisabled(target, opts.disabled);
        }
    }

    function setDisabled(target, disabled) {
        var state = $.data(target, 'clearbutton');
        if (state) {
            if (disabled) {
                state.options.disabled = true;
                if (target.onclick) {
                    state.onclick = target.onclick;
                    target.onclick = null;
                }
                $(target).addClass('l-btn-disabled');
            } else {
                state.options.disabled = false;
                if (state.onclick) {
                    target.onclick = state.onclick;
                }
                $(target).removeClass('l-btn-disabled');
            }
        }
    }

    function clearText(target, ci_obj) {
        var m_obj = $(ci_obj);
        if (m_obj.length > 0) {
            if (m_obj.hasClass('dcn-div')) {
                m_obj.dcndiv('setValue', '');
                m_obj.dcndiv('setText', '');
            }
            else {
                if (typeof (m_obj.attr("name")) == "undefined") {
                    if (m_obj.hasClass('easyui-combobox')) {
                        m_obj.combobox('setValue', '');
                        m_obj.combobox('setText', '');
                    }
                    else {
                        m_obj.combo("setValue", '');
                        m_obj.combo("setText", '');
                    }
                }
                else {
                    switch (m_obj[0].type) {
                        case 'text':
                        case 'textarea':
                            m_obj.val('');
                            m_obj.parent('td').find('input[type=hidden]').val('');
                            break;
                    }
                }
            }
        }
        var opts = $.data(target, 'clearbutton').options;
        if (opts) {
            opts.onAfterClear.call(target);
        }
    }

    $.fn.clearbutton = function(options, param) {
        if (typeof options == 'string') {
            return $.fn.clearbutton.methods[options](this, param);
        }

        options = options || {};
        return this.each(function() {
            var state = $.data(this, 'clearbutton');
            if (state) {
                $.extend(state.options, options);
            } else {
                $.data(this, 'clearbutton', {
                    options: $.extend({}, $.fn.clearbutton.defaults, $.fn.clearbutton.parseOptions(this), options)
                });
                $(this).removeAttr('disabled');
            }

            createButton(this);
        });
    };

    $.fn.clearbutton.methods = {
        options: function(jq) {
            return $.data(jq[0], "clearbutton").options;
        },
        clear: function(jq) {
            return $.each(jq, function() {
                var opts = $.data(this, 'clearbutton').options;
                if (opts) {
                    clearText(this, opts.targetID);
                }
            });
        },
        enable: function(jq) {
            return jq.each(function() {
                setDisabled(this, false);
            });
        },
        disable: function(jq) {
            return jq.each(function() {
                setDisabled(this, true);
            });
        }
    };

    $.fn.clearbutton.parseOptions = function(target) {
        var t = $(target);
        return $.extend(
        {},
        $.parser.parseOptions(target, ['targetID']),
        {
            disabled: (t.attr("disabled") == undefined ? false : t.attr("disabled"))
        });
    };

    $.fn.clearbutton.defaults = {
        targetID: '',
        disabled: false,
        onAfterClear: function() { }
    };

    $('.dcn-clearbutton').clearbutton();
})(jQuery);
(function($) {

    function _createHtml(target) {
        var m_objHtml = $('<span class="dcn-div-html" style="display:none;"></span>').appendTo($(target));
        //$.data(target, 'dcndiv').html = m_objHtml;
        return m_objHtml;
    }

    function create(target) {
        var opts = $.data(target, 'dcndiv').options;
        var panel = $(target);
        if (opts) {
            var m_objText = $('<span class="dcn-div-text" style="margin-right:5px;"></span>');
            var m_objHtml = $('<span class="dcn-div-html" style="display:none;margin-right:5px;"></span>');
            var m_objBtnList = $('<span class="dcn-div-btn-edit" style="display:none;"></span>');

            panel.children().appendTo(m_objHtml);
            if (opts.text != '') {
                m_objText.html(opts.text);
            }

            panel.html('');
            m_objText.appendTo(panel);
            m_objHtml.appendTo(panel);
            m_objBtnList.appendTo(panel);

            setValue(target, opts.value);
            setText(target, opts.text);
            setEditButton(target);
            opts.onLoadSuccess.call(target);
        }
    }

    function setEditButton(target) {
        var opts = $.data(target, 'dcndiv').options;
        var panel = $(target);

        if (opts && panel) {
            var m_objBtnList = panel.find('span.dcn-div-btn-edit');
            if (m_objBtnList.length > 0) {
                m_objBtnList.empty();

                $.each(opts.editButtons, function() {
                    var m_iType = this.type || 1;
                    switch (parseInt(m_iType)) {
                        case 1:
                            var m_objBtn = $('<a href="javascript:void(0)"></a> ').appendTo(m_objBtnList);
                            m_objBtn.linkbutton(this);
                            if (this.onClick) {
                                m_objBtn.bind('click', this.onClick);
                            }
                            if (this.btnCls) {
                                m_objBtn.addClass(this.btnCls);
                            }
                            if (this.title) {
                                m_objBtn.attr('title', this.title);
                            }
                            break;
                        case 2:
                            var m_objBtn = $('<a href="javascript:void(0)" class="dcn-clearbutton"></a>').appendTo(m_objBtnList);
                            if (!this.targetID) {
                                this.targetID = panel;
                            }
                            m_objBtn.clearbutton(this);
                            break;
                        case 3:
                            var m_objBtn = $('<a href="javascript:void(0)" hcode="' + this.hcode + '"></a> ').appendTo(m_objBtnList);
                            m_objBtn.linkbutton({ plain: true });
                            m_objBtn.addClass('dc-help');
                            setHelp(m_objBtn);
                            break;
                    }
                });
                $.parser.parse(m_objBtnList);
            }
        }
    }

    function setText(target, value) {
        var opts = $.data(target, 'dcndiv').options;
        var panel = $(target);

        if (opts && panel) {
            opts.text = value;
            var m_objText = panel.find('span.dcn-div-text');

            if (m_objText.length == 0) {
                m_objText = $('<span class="dcn-div-text"></span>').appendTo($(target));
            }
            try {
                if ($(opts.text).length > 0 && $(opts.text).children().length > 0 && (/<(!|\/)?(.|\n)*?>/i.test(opts.text))) {
                    $(opts.formatter.call(target, opts.text)).appendTo(m_objText);
                }
                else {
                    m_objText.html(opts.formatter.call(target, opts.text));
                }
            } catch (ex) {
                m_objText.html(opts.formatter.call(target, opts.text));
            }

            $.data(target, 'dcndiv').options = opts;
        }
    }

    function setValue(target, value) {
        var opts = $.data(target, 'dcndiv').options;
        var panel = $(target);

        if (opts && panel) {
            opts.value = value;
            var m_objHidden = panel.find('input.dcn-div-value');
            if (m_objHidden.length == 0) {
                m_objHidden = $('<input type="hidden" class="dcn-div-value" />').appendTo(panel);
            }
            m_objHidden.attr('name', opts.valueField).val(value);
            $.data(target, 'dcndiv').options = opts;
        }
    }

    function beginEdit(target) {
        var opts = $.data(target, 'dcndiv').options;
        var panel = $(target);

        if (opts && panel) {
            if (opts.onBeforeEdit.call(target)) {
                var m_objText = panel.find('span.dcn-div-text');
                var m_objHtml = panel.find('span.dcn-div-html');
                var m_objBtn = panel.find('span.dcn-div-btn-edit');

                if (m_objText.length == 0) {
                    setText(target, opts.text);
                }
                if (m_objHtml.length == 0) {
                    m_objHtml = _createHtml(target);
                }
                if (m_objHtml.children().length > 0) {
                    m_objText.css('display', 'none');
                    m_objHtml.css('display', '');
                }
                if (m_objBtn.length > 0) {
                    m_objBtn.css('display', '');
                }

                opts.oldText = opts.text;
                opts.oldValue = opts.value;
                opts.onBeginEdit.call(target);
            }
        }
    }

    function endEdit(target, text) {
        cancelEdit(target);
        if (text != undefined) {
            setText(target, text);
        }
    }

    function cancelEdit(target) {
        var opts = $.data(target, 'dcndiv').options;
        var panel = $(target);

        if (opts && panel) {
            setValue(target, opts.oldValue);
            setText(target, opts.oldText);

            var m_objText = panel.find('span.dcn-div-text');
            var m_objHtml = panel.find('span.dcn-div-html');
            var m_objBtn = panel.find('span.dcn-div-btn-edit');

            if (m_objHtml.length == 0) {
                m_objHtml = _createHtml(target);
            }
            m_objText.css('display', '');
            m_objHtml.css('display', 'none');

            if (m_objBtn.length > 0) {
                m_objBtn.css('display', 'none');
            }

            opts.onCancelEdit.call(target);
            opts.onAfterEdit.call(target);
        }
    }

    $.fn.dcndiv = function(options, param) {
        if (typeof options == 'string') {
            return $.fn.dcndiv.methods[options](this, param);
        }
        options = options || {};
        return this.each(function() {
            var state = $.data(this, "dcndiv");
            if (state) {
                $.extend(state.options, options);
                setValue(this, state.options.value);
                setText(this, state.options.text);
                setEditButton(this);
            } else {
                $.data(this, 'dcndiv', {
                    options: $.extend({}, $.fn.dcndiv.defaults, $.fn.dcndiv.parseOptions(this), options)
                });
                create(this);
            }
        });
    };

    $.fn.dcndiv.methods = {
        options: function(jq) {
            return $.data(jq[0], "dcndiv").options;
        },
        beginEdit: function(jq) {
            return jq.each(function() {
                beginEdit(this);
            });
        },
        endEdit: function(jq, value) {
            return jq.each(function() {
                endEdit(this, value);
            });
        },
        cancelEdit: function(jq) {
            return jq.each(function() {
                cancelEdit(this);
            });
        },
        setHtml: function(jq, value) {
            return jq.each(function() {
                var m_obj = $(this).find('.dcn-div-html');
                if (m_obj.length > 0) {
                    m_obj.html(value);
                }
            });
        },
        getText: function(jq) {
            var opts = $.data(jq[0], 'dcndiv').options;
            if (opts) {
                return opts.text;
            }
            return '';
        },
        setText: function(jq, value) {
            return jq.each(function() {
                setText(this, value);
            });
        },
        getValue: function(jq) {
            var opts = $.data(jq[0], 'dcndiv').options;
            if (opts) {
                return opts.value;
            }
            return '';
        },
        setValue: function(jq, value) {
            return jq.each(function() {
                setValue(this, value);
            });
        },
        load: function(jq, data) {
            return jq.each(function() {
                setValue(this, '');
                setText(this, '');
                var opts = $.data(this, 'dcndiv').options;
                if (opts && data != undefined) {
                    if (opts.valueField && data[opts.valueField] != undefined) {
                        setValue(this, data[opts.valueField]);
                    }
                    if (opts.textField && data[opts.textField] != undefined) {
                        setText(this, data[opts.textField]);
                    }
                }
            });
        },
        editButtonsShow: function(jq) {
            return jq.each(function() {
                var m_objBtn = $(this).find('span.dcn-div-btn-edit');
                if (m_objBtn.length > 0) {
                    m_objBtn.show();
                }
            });
        },
        editButtonsHide: function(jq) {
            return jq.each(function() {
                var m_objBtn = $(this).find('span.dcn-div-btn-edit');
                if (m_objBtn.length > 0) {
                    m_objBtn.hide();
                }
            });
        }
    };

    $.fn.dcndiv.parseOptions = function(target) {
        var t = $(target);
        return $.extend(
        {},
        $.parser.parseOptions(target, ['text', 'value', 'textField', 'valueField']), { textField: (t.attr('textField') || t.attr('name')) });
    };

    $.fn.dcndiv.defaults = {
        text: '',
        value: '',
        textField: '',
        valueField: '',
        onLoadSuccess: function() { },
        onBeforeEdit: function() { return true; },
        onBeginEdit: function() { },
        onEndEdit: function() { },
        onCancelEdit: function() { },
        onAfterEdit: function() { },
        formatter: function(text) {
            return text;
        },
        editButtons: []
    };

    $('.dcn-div').dcndiv();
})(jQuery);
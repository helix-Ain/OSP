(function($) {
    var _bInit = true;

    function init(target) {
        return {
            listbox: $(target)
        };
    };

    function transformData(target) {
        var opts = $.data(target, 'listbox').options;
        var data = [];
        if (opts) {
            $('>span', target).each(function() {
                var item = {};
                item[opts.valueField] = $(this).attr('value') != undefined ? $(this).attr('value') : $(this).html();
                item[opts.textField] = $(this).html();
                data.push(item);
            });
        }
        return data;
    };

    function loadData(target, data) {
        _bInit = true;
        var opts = $.data(target, 'listbox').options;
        var panel = $(target);

        $.data(target, 'listbox').data = [];
        panel.html('');
        panel.removeClass('listbox');
        panel.addClass('listbox');
        if (data && opts) {
            panel.css('width', opts.width + 'px');
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    addItem(target, data[i]);
                }
            }
        }
        opts.onLoadSuccess.call(target, data);
        _bInit = false;
    };

    function addItem(target, ci_objData, ci_bremoveable) {
        var opts = $.data(target, 'listbox').options;
        var data = $.data(target, 'listbox').data;
        var panel = $(target);
        if (opts && panel) {
            var v = ci_objData[opts.valueField];
            var s = ci_objData[opts.textField];
            if (data == undefined || data == null) {
                data = [];
            }
            if (opts.single) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i][opts.valueField] == v) {
                        return;
                    }
                }
            }

            ci_bremoveable = (ci_bremoveable ? true : opts.removeable);
            var item = $('<div class="listbox-item"></div>').appendTo(panel);
            item.hover(function() {
                $(this).addClass('listbox-item-hover');
            }, function() {
                $(this).removeClass('listbox-item-hover');
            });
            if (ci_bremoveable) {
                $('<a class="listbox-item-close" href="javascript:void(0);"></a>').appendTo(item).hover(function() {
                    $(this).addClass('listbox-item-close-hover');
                }, function() {
                    $(this).removeClass('listbox-item-close-hover');
                }).click(function() {
                    var m_objSelf = this;
                    $.each(panel.find('div.listbox-item'), function(index) {
                        if (this == $(m_objSelf).parent()[0]) {
                            removeItem(target, index);
                            return true;
                        }
                    });
                });
            }

            item = $('<span class="listbox-item-text"></span>').appendTo(item);
            item.attr('value', v);
            if (opts.formatter) {
                try {
                    var m_obj = $(opts.formatter.call(target, ci_objData));
                    if (m_obj.length > 0 && m_obj.children().length > 0) {
                        item.children().remove();
                        $(opts.formatter.call(target, ci_objData)).appendTo(item);
                    }
                    else {
                        item.html(opts.formatter.call(target, ci_objData));
                    }
                } catch (ex) {
                    item.html(opts.formatter.call(target, ci_objData));
                }
            } else {
                item.html(s);
            }
            data.push(ci_objData);
            $.data(target, 'listbox').data = data;

            if (opts.required) {
                validate(target, true);
            }

            opts.onAddItem.call(data.length - 1, ci_objData);
        }
    }

    function removeItem(target, index) {
        var data = $.data(target, 'listbox').data;
        var opts = $.data(target, "listbox").options;
        var panel = $(target);
        if (data && panel && opts) {
            var m_objItem = panel.find('div.listbox-item');
            if (m_objItem.length > index && data.length > index) {
                if (opts.onBeforeRemoveItem.call(target, index)) {
                    data.splice(index, 1);
                    $(m_objItem[index]).remove();

                    if (opts.required) {
                        validate(target, true);
                    }

                    opts.onRemoveItemSuccess.call(target, index);
                }
            }
        }
    }

    function reset(target) {
        $.data(target, 'listbox').data = [];
        var opts = $.data(target, "listbox").options;
        var panel = $(target);
        if (panel && opts) {
            panel.empty();
            validate(target, false);
        }
    }

    function getValues(target) {
        var values = [];
        var opts = $.data(target, 'listbox').options;
        var data = $.data(target, 'listbox').data;
        if (data && opts) {
            $.each(data, function() {
                values.push(this[opts.valueField]);
            });
        }
        return values;
    };

    function getTexts(target) {
        var values = [];
        var opts = $.data(target, 'listbox').options;
        var data = $.data(target, 'listbox').data;
        if (data && opts) {
            $.each(data, function() {
                values.push(this[opts.textField]);
            });
        }
        return values;
    };

    function validate(target, doit) {
        var opts = $.data(target, "listbox").options;
        if (opts) {
            var values = getValues(target);
            if (doit) {
                if (opts.required) {
                    if (!values.length > 0) {
                        $(target).addClass('listbox-required');
                        if (!_bInit) {
                            $(target).tooltip('destroy').tooltip({
                                content: opts.missingMessage
                            }).tooltip('show');
                            $.parser.parse($(target));
                        }
                        return false;
                    }
                }
            }
            $(target).removeClass('listbox-required').tooltip('destroy');
        }
        return true;
    };

    $.fn.listbox = function(options, param, param2) {
        if (typeof options == 'string') {
            return $.fn.listbox.methods[options](this, param, param2);
        }
        options = options || {};
        return this.each(function() {
            var state = $.data(this, "listbox");
            var m_objData = [];
            if (state) {
                $.extend(state.options, options);
                if (options.data != undefined) {
                    loadData(this, options.data);
                }
            } else {
                var r = init(this);
                state = $.data(
                this,
                "listbox",
                {
                    options: $.extend({}, $.fn.listbox.defaults, $.fn.listbox.parseOptions(this), options),
                    listbox: r.listbox,
                    previousValue: null
                });
                m_objData = transformData(this);
                if (state.options.data) {
                    m_objData = state.options.data;
                }
                loadData(this, m_objData);
            }
        });
    };

    $.fn.listbox.methods = {
        options: function(jq) {
            return $.data(jq[0], "listbox").options;
        },
        validate: function(jq) {
            return jq.each(function() {
                validate(this, true);
            });
        },
        isValid: function(jq) {
            return validate(jq[0], true);
        },
        getData: function(jq) {
            return $.data(jq[0], 'listbox').data;
        },
        getText: function(jq) {
            var values = getTexts(jq[0]);
            return values[0];
        },
        getTexts: function(jq) {
            return getTexts(jq[0]);
        },
        getValue: function(jq) {
            var values = getValues(jq[0]);
            return values[0];
        },
        getValues: function(jq) {
            return getValues(jq[0]);
        },
        addItem: function(jq, values, removeable) {
            return jq.each(function() {
                addItem(this, values, removeable);
            });
        },
        addItemList: function(jq, values, removeable) {
            return $.each(values, function() {
                addItem(jq[0], this, removeable);
            });
        },
        removeItem: function(jq, index) {
            return jq.each(function() {
                removeItem(this, index);
            });
        },
        removeAllItem: function(jq) {
            return jq.each(function() {
                var target = this;
                while ($(target).listbox('getData').length > 0) {
                    removeItem(target, 0);
                }
            });
        },
        reset: function(jq) {
            return jq.each(function() {
                reset(this);
            });
        }
    };

    $.fn.listbox.parseOptions = function(target) {
        var t = $(target);
        return $.extend(
        {},
        $.parser.parseOptions(target, ['valueField', 'textField', 'missingMessage']),
        {
            multiple: (t.attr("multiple") ? true : undefined),
            disabled: (t.attr("disabled") ? true : undefined),
            required: (t.attr("required") ? true : undefined),
            removeable: (t.attr("removeable") == undefined ? true : t.attr("removeable")),
            single: (t.attr("single") == undefined ? true : t.attr("single")),
            width: parseInt((t.attr("width") ? t.attr("width") : 550))
        });
    };

    $.fn.listbox.defaults = {
        width: 630,
        valueField: 'value',
        textField: 'text',
        disabled: false,
        required: false,
        removeable: true,
        single: true,
        missingMessage: "该输入项为必输项",
        data: null,
        formatter: function(row) {
            var opts = $(this).listbox('options');
            return row[opts.textField];
        },
        onLoadSuccess: function(data) { },
        onAddItem: function(index, row) { },
        onBeforeRemoveItem: function(index) { return true; },
        onRemoveItemSuccess: function(index) { }
    };
})(jQuery);
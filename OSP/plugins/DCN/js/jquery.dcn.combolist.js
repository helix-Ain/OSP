(function($) {
    var _bInit = true;

    function init(target) {
        return {
            combolist: $(target)
        };
    };

    function transformData(target) {
        var opts = $.data(target, 'combolist').options;
        var data = [];
        if (opts) {
            $('>li', target).each(function() {
                var item = {};
                item[opts.valueField] = $(this).attr('value') != undefined ? $(this).attr('value') : $(this).html();
                item[opts.textField] = $(this).html();
                item['selected'] = $(this).attr('selected');
                data.push(item);
            });
        }
        return data;
    };

    function loadData(target, data) {
        _bInit = true;
        var opts = $.data(target, 'combolist').options;
        var panel = $(target);
        var selected = $(target).combolist('getValues');

        $.data(target, 'combolist').data = data;
        panel.empty();

        if (data && opts) {
            if (data.length > 0) {
                var ul = $('<ul class="combolist"></ul>').appendTo(panel);
                if (opts.alignment == 2) {
                    ul.addClass('combolist-vertical');
                }
                if (opts.bodyCls != undefined) {
                    ul.addClass(opts.bodyCls);
                }
                if (opts.hoverCls == undefined) {
                    opts.hoverCls = 'combolist-item-hover';
                }
                if (opts.activeCls == undefined) {
                    opts.activeCls = 'combolist-item-active';
                }
                for (var i = 0; i < data.length; i++) {
                    var v = data[i][opts.valueField];
                    var s = data[i][opts.textField];
                    var item = $('<li></li>').appendTo(ul);
                    item = $('<div></div>').appendTo(item);
                    item.attr('value', v);
                    if (opts.formatter) {
                        item.html(opts.formatter.call(target, data[i]));
                    } else {
                        item.html(s);
                    }
                    item.addClass('combolist-item');
                    if (opts.alignment == 1) {
                        if (i == 0) {
                            item.addClass('combolist-item-first');
                        }
                        if (i == data.length - 1) {
                            item.addClass('combolist-item-last');
                        }
                    }
                    else if (opts.alignment == 2) {
                        item.addClass('combolist-item-vertical');
                    }
                    if (opts.itemCls != undefined) {
                        item.addClass(opts.itemCls);
                    }
                    if (data[i]['selected']) {
                        (function() {
                            for (var i = 0; i < selected.length; i++) {
                                if (v == selected[i]) return;
                            }
                            selected.push(v);
                        })();
                    }
                }

                if (opts.multiple) {
                    setValues(target, selected);
                } else {
                    if (selected.length) {
                        setValues(target, [selected[selected.length - 1]]);
                    } else {
                        setValues(target, []);
                    }
                }
                $('div.combolist-item', panel).click(function() {
                    if (!opts.disabled) {
                        var item = $(this);
                        if (opts.multiple) {
                            if (item.hasClass(opts.activeCls)) {
                                unselect(target, item.attr('value'));
                            } else {
                                select(target, item.attr('value'));
                            }
                        } else {
                            if (opts.required) {
                                select(target, item.attr('value'));
                            }
                            else {
                                if (item.hasClass(opts.activeCls)) {
                                    unselect(target, item.attr('value'));
                                } else {
                                    select(target, item.attr('value'));
                                }
                            }
                        }
                    }
                }).hover(function() {
                    if (!opts.disabled) {
                        $(this).addClass(opts.hoverCls);
                    }
                }, function() {
                    if (!opts.disabled) {
                        $(this).removeClass(opts.hoverCls);
                    }
                });
            }
            setDisabled(target, opts.disabled);
            _bInit = false;
            opts.onLoadSuccess.call(target, data);
        }
    };

    function setValues(target, values) {
        var opts = $.data(target, 'combolist').options;
        var data = $.data(target, 'combolist').data;
        var panel = $(target);
        if (opts && data && panel) {
            var oldValues = getValues(target);
            var vv = []

            panel.find('div.' + opts.activeCls).removeClass(opts.activeCls);

            for (var i = 0; i < values.length; i++) {
                var v = values[i];
                for (var j = 0; j < data.length; j++) {
                    if (data[j][opts.valueField] == v) {
                        break;
                    }
                }
                vv.push(v);
                panel.find('div[value="' + v + '"]').addClass(opts.activeCls);
            }
            var tmp = [];
            var aa = [];
            for (var i = 0; i < oldValues.length; i++) {
                tmp[i] = oldValues[i];
            }
            for (var i = 0; i < vv.length; i++) {
                for (var j = 0; j < tmp.length; j++) {
                    if (vv[i] == tmp[j]) {
                        aa.push(vv[i]);
                        tmp.splice(j, 1);
                        break;
                    }
                }
            }
            if (aa.length != vv.length || vv.length != oldValues.length) {
                if (opts.multiple) {
                    opts.onChange.call(target, vv, oldValues);
                } else {
                    opts.onChange.call(target, vv[0], oldValues[0]);
                }
            }
            if (opts.required) {
                validate(target, true);
            }
        }
    };

    function getValues(target) {
        var values = [];
        var combolist = $.data(target, "combolist").combolist;
        var opts = $.data(target, 'combolist').options;
        combolist.find("div." + opts.activeCls).each(function() {
            values.push($(this).attr('value'));
        });
        return values;
    };

    function getTexts(target) {
        var values = [];
        var combolist = $.data(target, "combolist").combolist;
        combolist.find("div." + opts.activeCls).each(function() {
            values.push($(this).html());
        });
        return values;
    };

    function select(target, value) {
        var opts = $.data(target, 'combolist').options;
        var data = $.data(target, 'combolist').data;
        if (opts && data) {
            if (opts.multiple) {
                var values = $(target).combolist('getValues');
                for (var i = 0; i < values.length; i++) {
                    if (values[i] == value) return;
                }
                values.push(value);
                setValues(target, values);
            } else {
                setValues(target, [value]);
            }

            for (var i = 0; i < data.length; i++) {
                if (data[i][opts.valueField] == value) {
                    data[i].selected = true;
                    opts.onSelect.call(target, data[i]);
                    return;
                }
            }
        }
    };

    function unselect(target, value) {
        var values = $(target).combolist('getValues');
        if (value) {
            for (var i = 0; i < values.length; i++) {
                if (values[i] == value) {
                    _unselect(i);
                    break;
                }
            }
        }
        else {
            for (var i = 0; i < values.length; ) {
                _unselect(i);
            }
        }
        function _unselect(index) {
            var delValue = values.splice(index, 1);
            setValues(target, values);
            var opts = $.data(target, 'combolist').options;
            var data = $.data(target, 'combolist').data;
            if (opts && data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i][opts.valueField] == delValue[0]) {
                        data[i].selected = false;
                        opts.onUnselect.call(target, data[i]);
                        return;
                    }
                }
            }
        }
    };

    function setDisabled(target, disabled) {
        var opts = $.data(target, "combolist").options;
        var combolist = $.data(target, "combolist").combolist;
        if (opts && combolist) {
            if (disabled) {
                opts.disabled = true;
                $(target).find('ul').attr("disabled", true).addClass('combolist-disabled');
                combolist.find(".combolist-item").attr("disabled", true);
                $.each(combolist.find(".combolist-item"), function() {
                    if (!$(this).hasClass(opts.activeCls)) {
                        $(this).addClass('combolist-disabled-hide');
                    }
                });
                if (opts.alignment == 1) {
                    var m_objSelectList = combolist.find("div." + opts.activeCls);
                    for (var i = 0; i < m_objSelectList.length; i++) {
                        if (i == 0) {
                            $(m_objSelectList[i]).addClass('combolist-item-first');
                        }
                        if (i + 1 == m_objSelectList.length) {
                            $(m_objSelectList[i]).addClass('combolist-item-last');
                        }
                    }
                }
            } else {
                opts.disabled = false;
                $(target).find('ul').removeAttr("disabled").removeClass('combolist-disabled');
                combolist.find(".combolist-item").removeAttr("disabled").removeClass('combolist-disabled-hide').removeClass('combolist-item-first').removeClass('combolist-item-last');

                if (opts.alignment == 1) {
                    var m_objSelectList = combolist.find("div.combolist-item");
                    for (var i = 0; i < m_objSelectList.length; i++) {
                        if (i == 0) {
                            $(m_objSelectList[i]).addClass('combolist-item-first');
                        }
                        if (i + 1 == m_objSelectList.length) {
                            $(m_objSelectList[i]).addClass('combolist-item-last');
                        }
                    }
                }
            }
        }
    };

    function validate(target, doit) {
        var opts = $.data(target, "combolist").options;
        if (opts) {
            var values = getValues(target);
            if (doit) {
                if (opts.required) {
                    if (!values.length > 0) {
                        $(target).find('ul').addClass('combolist-required');
                        if (!_bInit) {
                            $(target).find('ul').tooltip('destroy').tooltip({
                                content: opts.missingMessage
                            }).tooltip('show');
                            $.parser.parse($(target).find('ul'));
                        }
                        return false;
                    }
                }
            }
            $(target).find('ul').removeClass('combolist-required').tooltip('destroy');
        }
        return true;
    };

    function reset(target) {
        $.data(target, 'combolist').data = [];
        var opts = $.data(target, "combolist").options;
        var panel = $(target);
        if (panel && opts) {
            panel.empty();
            validate(target, false);
        }
    }

    $.fn.combolist = function(options, param) {
        if (typeof options == 'string') {
            return $.fn.combolist.methods[options](this, param);
        }
        options = options || {};
        return this.each(function() {
            var state = $.data(this, "combolist");
            if (state) {
                $.extend(state.options, options);
                if (options.data != undefined) {
                    loadData(this, options.data);
                }
            } else {
                var r = init(this);
                state = $.data(
                this,
                "combolist",
                {
                    options: $.extend({}, $.fn.combolist.defaults, $.fn.combolist.parseOptions(this), options),
                    combolist: r.combolist,
                    previousValue: null
                });
                var m_objData = transformData(this);
                if (state.options.data) {
                    m_objData = state.options.data;
                }
                loadData(this, m_objData);
            }
        });
    };

    $.fn.combolist.methods = {
        options: function(jq) {
            return $.data(jq[0], "combolist").options;
        },
        disable: function(jq) {
            return jq.each(function() {
                setDisabled(this, true);
            });
        },
        enable: function(jq) {
            return jq.each(function() {
                setDisabled(this, false);
            });
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
            return $.data(jq[0], 'combolist').data;
        },
        setData: function(jq, value) {
            return jq.each(function() {
                $.data(this, 'combolist').data = value;
            });
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
            try {
                return values[0];
            } catch (ex) {
                return null;
            }
        },
        getValues: function(jq) {
            return getValues(jq[0]);
        },
        setValues: function(jq, values) {
            return jq.each(function() {
                setValues(this, values);
            });
        },
        setValue: function(jq, value) {
            return jq.each(function() {
                setValues(this, [value]);
            });
        },
        select: function(jq, value) {
            return jq.each(function() {
                select(this, value);
            });
        },
        selectFirst: function(jq, value) {
            return jq.each(function() {
                try {
                    var m_objData = $.data(this, 'combolist').data;
                    var m_objOpts = $.data(this, "combolist").options;
                    if (m_objOpts && m_objData) {
                        if (m_objData.length > 0) {
                            select(this, m_objData[0][m_objOpts.valueField]);
                        }
                    }
                }
                catch (ex) { }
            });
        },
        unselect: function(jq, value) {
            return jq.each(function() {
                unselect(this, value);
            });
        },
        reset: function(jq) {
            return jq.each(function() {
                reset(this);
            });
        }
    };

    $.fn.combolist.parseOptions = function(target) {
        var t = $(target);
        return $.extend(
        {},
        $.parser.parseOptions(target, ['valueField', 'textField', 'missingMessage']),
        {
            alignment: (parseInt(t.attr("alignment")) > 0 ? parseInt(t.attr("alignment")) : 1),
            multiple: (t.attr("multiple") ? true : undefined),
            disabled: (t.attr("disabled") ? true : undefined),
            required: (t.attr("required") ? true : undefined),
            bodyCls: (t.attr("bodyCls") ? t.attr("bodyCls") : undefined),
            itemCls: (t.attr("itemCls") ? t.attr("itemCls") : undefined),
            hoverCls: (t.attr("hoverCls") ? t.attr("hoverCls") : undefined),
            activeCls: (t.attr("activeCls") ? t.attr("activeCls") : undefined)
        });
    };

    $.fn.combolist.defaults = {
        valueField: 'value',
        textField: 'text',
        multiple: false,
        disabled: false,
        required: false,
        missingMessage: "该输入项为必输项",
        alignment: 1,
        bodyCls: undefined,
        itemCls: undefined,
        hoverCls: undefined,
        activeCls: undefined,
        data: null,
        formatter: function(row) {
            var opts = $(this).combolist('options');
            return row[opts.textField];
        },
        loader: function(param, success, error) {
            var opts = $(this).combolist('options');
            if (!opts.url) return false;
            $.ajax({
                type: opts.method,
                url: opts.url,
                data: param,
                dataType: 'json',
                success: function(data) {
                    success(data);
                },
                error: function() {
                    error.apply(this, arguments);
                }
            });
        },
        onLoadSuccess: function(data) { },
        onChange: function(ci_strNewValue, ci_strOldValue) { },
        onSelect: function(record) { },
        onUnselect: function(record) { }
    };
})(jQuery);
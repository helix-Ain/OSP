/** 
* jQuery EasyUI 1.3.1 
* 
* Licensed under the GPL terms To use it on other terms please contact us 
* 
* Copyright(c) 2009-2012 stworthy [ stworthy@gmail.com ] 
* 注释由小雪完成，更多内容参见www.easyui.info
* 该源码完全由压缩码翻译而来，并非网络上放出的源码，请勿索要。
*/
(function($) {
    function setSize(target, width) {
        var opts = $.data(target, "combo").options;
        var combo = $.data(target, "combo").combo;
        var panel = $.data(target, "combo").panel;
        if (width) {
            opts.width = width;
        }
        combo.appendTo("body");
        if (isNaN(opts.width)) {
            opts.width = combo.find("input.combo-text").outerWidth();
        }
        var arrowWidth = 0;
        if (opts.hasDownArrow) {
            arrowWidth = combo.find(".combo-arrow").outerWidth();
        }
        combo.find("input.combo-text").width(0);
        combo._outerWidth(opts.width);
        combo.find("input.combo-text").width(combo.width() - arrowWidth);
        panel.panel("resize", {
            width: (opts.panelWidth ? opts.panelWidth : combo.outerWidth()),
            height: opts.panelHeight
        });
        combo.insertAfter(target);
    };
    /** 
    * 初始化下拉框按钮(设置其是否显示) 
    */
    function initArrow(target) {
        var opts = $.data(target, "combo").options;
        var combo = $.data(target, "combo").combo;
        if (opts.hasDownArrow) {
            combo.find(".combo-arrow").show();
        } else {
            combo.find(".combo-arrow").hide();
        }
    };
    /** 
    * 初始化函数，生成整个combo组件的DOM结构 
    */
    function init(target) {
        $(target).addClass("combo-f").hide();
        var span = $("<span class=\"combo\"></span>").insertAfter(target);
        var input = $("<input type=\"text\" class=\"combo-text\">").appendTo(span);
        $("<span><span class=\"combo-arrow\"></span></span>").appendTo(span);
        $("<input type=\"hidden\" class=\"combo-value\">").appendTo(span);
        var panel = $("<div class=\"combo-panel\"></div>").appendTo("body");
        panel.panel({
            doSize: false,
            closed: true,
            cls: "combo-p",
            style: {
                position: "absolute",
                zIndex: 10
            },
            onOpen: function() {
                $(this).panel("resize");
            }
        });
        var name = $(target).attr("name");
        if (name) {
            span.find("input.combo-value").attr("name", name);
            $(target).removeAttr("name").attr("comboName", name);
        }
        input.attr("autocomplete", "off");
        return {
            combo: span,
            panel: panel
        };
    };
    /** 
    * 销毁combo组件init方法构造出来的DOM，同时移除用户定义用于依附combo的DOM 
    */
    function destroy(target) {
        var input = $.data(target, "combo").combo.find("input.combo-text");
        //销毁校验
        input.validatebox("destroy");
        //销毁下拉面板 
        $.data(target, "combo").panel.panel("destroy");
        //移除combox构造的DOM 
        $.data(target, "combo").combo.remove();
        //移除用户定义用于依附combo的DOM 
        $(target).remove();
    };
    function bindEvents(target) {
        var data = $.data(target, "combo");
        var opts = data.options;
        var combo = $.data(target, "combo").combo;
        var panel = $.data(target, "combo").panel;
        var input = combo.find(".combo-text");
        var arrow = combo.find(".combo-arrow");
        //委托mousedown事件到document上,只要不是点击panel区域,就关闭所有下拉面板 
        //特别注意的是这地方用的事件委托,故如某个触发元素阻止了事件冒泡,这个委托在document上的事件是没机会执行的。 
        $(document).unbind(".combo").bind("mousedown.combo", function(e) {//① 
            var panels = $("body>div.combo-p>div.combo-panel");
            var p = $(e.target).closest("div.combo-panel", panels);
            if (p.length) {
                //如果mousedown事件发生在下拉面板内,则不做任何操作 
                return;
            }
            //关闭面板 
            panels.panel("close");
        });
        combo.unbind(".combo");
        panel.unbind(".combo");
        input.unbind(".combo");
        arrow.unbind(".combo");
        //未禁用才会绑定相应事件 
        if (!opts.disabled) {
            input.bind("mousedown.combo", function(e) {
                //看到了吧,入框的mousedown事件直接阻止事件冒泡了 
                //所以鼠标在输入框内按下时不会触发到①处委托的事件的 
                e.stopPropagation();
            }).bind("keydown.combo", function(e) {
                //绑定键盘事件,这地方基本上是预留了事件接口
                //开发者可以通过定义相关事件,在combo的基础上灵活其它功
                switch (e.keyCode) {
                    case 38: //向上预留事件接口 
                        opts.keyHandler.up.call(target);
                        break;
                    case 40: //向下预留事件接口 
                        opts.keyHandler.down.call(target);
                        break;
                    case 13: //回车,阻止默认行为预留事件接口 
                        e.preventDefault();
                        opts.keyHandler.enter.call(target);
                        return false;
                    case 9: //tab 隐藏下拉面板 
                    case 27: //esc 隐藏下拉面板 
                        hidePanel(target);
                        break;
                    default: //维护data.previousValue值;预留query事件接口;校验input
                        if (opts.editable) {
                            if (data.timer) {
                                clearTimeout(data.timer);
                            }
                            data.timer = setTimeout(function() {
                                var q = input.val();
                                if (data.previousValue != q) {
                                    data.previousValue = q;
                                    showPanel(target);
                                    //预留query事件接口 
                                    opts.keyHandler.query.call(target, input.val());
                                    //校验input 
                                    validate(target, true); //② 
                                }
                            }, opts.delay);
                        }
                }
            });
            //绑定下拉按?时? 
            arrow.bind("click.combo", function() {
                //??显示的?显示??的。 
                if (panel.is(":visible")) {
                    hidePanel(target);
                } else {
                    $("div.combo-panel").panel("close");
                    showPanel(target);
                }
                //焦点放到input上,这地方究竟是为了啥呢,知道validatebox实现原理的童鞋就知道原因了 
                //因为validatebox的实现是基于onfocus的,所以②处想触发校验,这地方就先focus到input上了。 
                //但是,我们再仔细想想的话,为什么不把㈠ 代码放到②处的validate方法内部呢?这样是不是更合理? 
                //不知到作者是出于什么目的,总之个人觉得放到②的validate方法内部更为合理. 
                input.focus(); //㈠ 
            }).bind("mouseenter.combo", function() {
                //只是处理样式,没什么好说的 
                $(this).addClass("combo-arrow-hover");
            }).bind("mouseleave.combo", function() {
                //只是处理样式,没什么好说的 
                $(this).removeClass("combo-arrow-hover");
            }).bind("mousedown.combo", function() {
                //为何返回false,止事件冒泡和默认行为。阻止冒泡不难理解是为了避免①处冲突
                //可是为何又阻止默认行为,百思不得其解,经测测使用e.stopPropagation();也就可以了。 
                return false; //㈡ 
            });
        }
    };
    /** 
    * 显示下拉面板 
    * @param {Object} target 
    */
    function showPanel(target) {
        var opts = $.data(target, "combo").options;
        var combo = $.data(target, "combo").combo;
        var panel = $.data(target, "combo").panel;
        if ($.fn.window) {
            //如果项目中使用了window组件,则跟window共同维护和使用$.fn.window.defaults.zIndex 
            panel.panel("panel").css("z-index", $.fn.window.defaults.zIndex++);
        }
        panel.panel("move", {
            //这地方为何不直接fixedLeft(),说实话没看出任何用途
            left: combo.offset().left,
            top: fixedTop()
        });
        panel.panel("open");
        opts.onShowPanel.call(target);
        /**
        * 搞了个匿名函数，只要下拉面板是可见的，我了个去，这个匿名函数会一直运行! 为什么要这样呢，岂不是很好资源?想来想去只有一个勉强的理由，
        * 那就是用户手工调整浏览器大小的时候，面板能自动调整位置，
        * 如果仅仅出于这个原因，我们使用$(window).resize方式监控会不会更好点呢?
        */
        (function() {//㈢
            if (panel.is(":visible")) {
                panel.panel("move", {
                    left: fixedLeft(),
                    top: fixedTop()
                });
                setTimeout(arguments.callee, 200);
            }
        })();
        /**
        * 纠正下拉面板left
        * 原理参照fixedTop的分析图
        */
        function fixedLeft() {
            var left = combo.offset().left;
            if (left + panel._outerWidth() > $(window)._outerWidth() + $(document).scrollLeft()) {
                left = $(window)._outerWidth() + $(document).scrollLeft() - panel._outerWidth();
            }
            if (left < 0) {
                left = 0;
            }
            return left;
        };
        /**
        * 纠正下拉面板top
        * 其原理在文章中我用图形说明名了③
        */
        function fixedTop() {
            var top = combo.offset().top + combo._outerHeight();
            if (top + panel._outerHeight() > $(window)._outerHeight() + $(document).scrollTop()) {
                top = combo.offset().top - panel._outerHeight();
            }
            if (top < $(document).scrollTop()) {
                top = combo.offset().top + combo._outerHeight();
            }
            return top;
        };
    };
    /**
    * 隐藏下拉面板，这个没什么可说的，预留了一个onHidePanel事件接口
    */
    function hidePanel(target) {
        var opts = $.data(target, "combo").options;
        var panel = $.data(target, "combo").panel;
        panel.panel("close");
        opts.onHidePanel.call(target);
    };
    /**
    * 做校验，没啥好说的，easyui理解
    */
    function validate(target, doit) {
        var opts = $.data(target, "combo").options;
        var input = $.data(target, "combo").combo.find("input.combo-text");
        input.validatebox(opts);
        if (doit) {
            input.validatebox("validate");
        }
    };
    /** 
    * 设置置combo控件输入框是否可编
    */
    function setDisabled(target, disabled) {
        var ops = $.data(target, "combo").options;
        var combo = $.data(target, "combo").combo;
        if (disabled) {
            ops.disabled = true;
            $(target).attr("disabled", true);
            combo.find(".combo-value").attr("disabled", true);
            combo.find(".combo-text").attr("disabled", true);
        } else {
            ops.disabled = false;
            $(target).removeAttr("disabled");
            combo.find(".combo-value").removeAttr("disabled");
            combo.find(".combo-text").removeAttr("disabled");
        }
    };
    /**
    * 清空值
    */
    function clear(target) {
        var ops = $.data(target, "combo").options;
        var combo = $.data(target, "combo").combo;
        if (ops.multiple) {
            combo.find("input.combo-value").remove();
        } else {
            combo.find("input.combo-value").val("");
        }
        combo.find("input.combo-text").val("");
    };
    /**
    * 获取Text
    */
    function getText(target) {
        var combo = $.data(target, "combo").combo;
        return combo.find("input.combo-text").val();
    };
    /**
    * 设置Text，同时维护$.data(target, "combo").previousValue变量
    */
    function setText(target, text) {
        var combo = $.data(target, "combo").combo;
        combo.find("input.combo-text").val(text);
        validate(target, true);
        $.data(target, "combo").previousValue = text;
    };
    /**
    * 获取Texts，注意多值模式的时候input.combo-value是有多个的
    */
    function getValues(target) {
        var values = [];
        var combo = $.data(target, "combo").combo;
        combo.find("input.combo-value").each(function() {
            values.push($(this).val());
        });
        return values;
    };
    /**
    * 设置Texts，也没什么难度，注意是多个隐藏的文本域对应多值就行了
    */
    function setValues(target, values) {
        var opts = $.data(target, "combo").options;
        var oldValues = getValues(target);
        var combo = $.data(target, "combo").combo;
        combo.find("input.combo-value").remove();
        var comboName = $(target).attr("comboName");
        for (var i = 0; i < values.length; i++) {
            var comboValue = $("<input type=\"hidden\" class=\"combo-value\">").appendTo(combo);
            if (comboName) {
                comboValue.attr("name", comboName);
            }
            comboValue.val(values[i]);
        }
        var tmp = [];
        for (var i = 0; i < oldValues.length; i++) {
            tmp[i] = oldValues[i];
        }
        var aa = [];
        for (var i = 0; i < values.length; i++) {
            for (var j = 0; j < tmp.length; j++) {
                if (values[i] == tmp[j]) {
                    aa.push(values[i]);
                    tmp.splice(j, 1);
                    break;
                }
            }
        }
        if (aa.length != values.length || values.length != oldValues.length) {
            if (opts.multiple) {
                opts.onChange.call(target, values, oldValues);
            } else {
                opts.onChange.call(target, values[0], oldValues[0]);
            }
        }
    };
    /**
    * 获取单值
    */
    function getValue(target) {
        var values = getValues(target);
        return values[0];
    };
    /**
    * 设置但值
    */
    function setValue(target, value) {
        setValues(target, [value]);
    };
    /**
    * 根据multiple初始化值
    */
    function initValue(target) {
        var opts = $.data(target, "combo").options;
        var fn = opts.onChange;
        opts.onChange = function() {
        };
        if (opts.multiple) {
            if (opts.value) {
                if (typeof opts.value == "object") {
                    setValues(target, opts.value);
                } else {
                    setValue(target, opts.value);
                }
            } else {
                setValues(target, []);
            }
        } else {
            setValue(target, opts.value);
        }
        opts.onChange = fn;
    };
    /**
    * 构造函数
    */
    $.fn.combo = function(options, param) {
        if (typeof options == "string") {//如果是字符串，调用函数
            return $.fn.combo.methods[options](this, param);
        }
        options = options || {};
        //初始化构造每个combo组件
        return this.each(function() {
            var state = $.data(this, "combo");
            if (state) {
                $.extend(state.options, options);
            } else {
                var r = init(this);
                state = $.data(
                this,
                "combo",
                {
                    options: $.extend({}, $.fn.combo.defaults, $.fn.combo.parseOptions(this), options),
                    combo: r.combo,
                    panel: r.panel,
                    previousValue: null
                });
                $(this).removeAttr("disabled");
            }
            $("input.combo-text", state.combo).attr("readonly", !state.options.editable);
            initArrow(this);
            setDisabled(this, state.options.disabled);
            setSize(this);
            bindEvents(this);
            validate(this);
            initValue(this);
        });
    };
    /**
    * 对外接口
    */
    $.fn.combo.methods = {
        options: function(jq) {
            return $.data(jq[0], "combo").options;
        },
        panel: function(jq) {
            return $.data(jq[0], "combo").panel;
        },
        textbox: function(jq) {
            return $.data(jq[0], "combo").combo.find("input.combo-text");
        },
        destroy: function(jq) {
            return jq.each(function() {
                destroy(this);
            });
        },
        resize: function(jq, width) {
            return jq.each(function() {
                setSize(this, width);
            });
        },
        showPanel: function(jq) {
            return jq.each(function() {
                showPanel(this);
            });
        },
        hidePanel: function(jq) {
            return jq.each(function() {
                hidePanel(this);
            });
        },
        disable: function(jq) {
            return jq.each(function() {
                setDisabled(this, true);
                bindEvents(this);
            });
        },
        enable: function(jq) {
            return jq.each(function() {
                setDisabled(this, false);
                bindEvents(this);
            });
        },
        validate: function(jq) {
            return jq.each(function() {
                validate(this, true);
            });
        },
        isValid: function(jq) {
            var input = $.data(jq[0], "combo").combo.find("input.combo-text");
            return input.validatebox("isValid");
        },
        clear: function(jq) {
            return jq.each(function() {
                clear(this);
            });
        },
        getText: function(jq) {
            return getText(jq[0]);
        },
        setText: function(jq, text) {
            return jq.each(function() {
                setText(this, text);
            });
        },
        getValues: function(jq) {
            return getValues(jq[0]);
        },
        setValues: function(jq, values) {
            return jq.each(function() {
                setValues(this, values);
            });
        },
        getValue: function(jq) {
            return getValue(jq[0]);
        },
        setValue: function(jq, value) {
            return jq.each(function() {
                setValue(this, value);
            });
        }
    };
    /**
    * 属性转换器
    */
    $.fn.combo.parseOptions = function(target) {
        var t = $(target);
        return $.extend(
        {},
        $.fn.validatebox.parseOptions(target),
        $.parser.parseOptions(target, ["width", "separator", { panelWidth: "number", editable: "boolean", hasDownArrow: "boolean", delay: "number"}]),
        {
            panelHeight: (t.attr("panelHeight") == "auto" ? "auto" : parseInt(t.attr("panelHeight")) || undefined),
            multiple: (t.attr("multiple") ? true : undefined),
            disabled: (t.attr("disabled") ? true : undefined),
            value: (t.val() || undefined)
        });
    };
    /**
    * 默认值
    */
    $.fn.combo.defaults = $.extend({}, $.fn.validatebox.defaults, {
        width: "auto",
        panelWidth: null,
        panelHeight: 200,
        multiple: false,
        separator: ",",
        editable: true,
        disabled: false,
        hasDownArrow: true,
        value: "",
        delay: 200,
        keyHandler: {
            up: function() { },
            down: function() { },
            enter: function() { },
            query: function(q) { }
        },
        onShowPanel: function() { },
        onHidePanel: function() { },
        onChange: function(_5d, _5e) { }
    });
})(jQuery);
/**  
* jQuery EasyUI 1.3.1  
* 源码基于1.3.1  
* Licensed under the GPL terms  
* To use it on other terms please contact us  
* Copyright(c) 2009-2012 stworthy [ stworthy@gmail.com ]  
* 注释由小雪完成，更多内容参见www.easyui.info  
*/
(function($) {
    function init(target) {
        $(target).addClass("validatebox-text");
    };
    /** 
    * 内部消毁接口  
    * @param {Object} target 组件对应的input  
    */

    function destroyBox(target) {
        var data = $.data(target, "validatebox");
        //设置validating为false，以阻止当前正在对target做校验的事件处理程序。    
        data.validating = false;
        var tip = data.tip;
        if (tip) {
            //如果有消息框，则移除消息框。   
            tip.remove();
        }
        //解除绑定在DOM上的事件处理程序。   
        $(target).unbind();
        //移除DOM。   
        $(target).remove();
    };
    /**
    * [bindEvents description]  
    * @param  {[type]} target [description]  
    * @return {[type]}  
    */
    function bindEvents(target) {
        var box = $(target);
        //获取绑定在target上的数据   
        var validatebox = $.data(target, "validatebox");
        //首先解除绑定在target上命名空间为validatebox所有事件处理程序，为什么要这么干呢？   
        //第一、为了避免重复绑定，您懂的，jQuery事件绑定机制会累加绑定，所以一般重新绑定前都会解绑定；   
        //第二、还有一个细节也要注意，这里解除的只是命名空间为validatebox的事件，也就是说用户自己用代码绑定的事件完全可以被兼容。   
        //解除绑定之后会挨过重新来绑定focus、blur、mouseenter、mouseleave事件，命名空间均为validatebox。   
        box.unbind(".validatebox").bind("focus.validatebox", function() {
            //focus事件是核心中的核心了   

            //首先设置validating属性，这个变量用于标示当前是否处于校验状态。   
            validatebox.validating = true;
            //设置value属性，该属性保存target里面的值，定义这个有啥用，且往后看。   
            validatebox.value = undefined;
            //定义一个立即运行的函数，为什么要这么定义呢，是蛋疼？还是有某种目的，我们且继续往下分析。   
            (function() {
                if (validatebox.validating) {//如果校验开关是打开的，则进行校验   
                    if (validatebox.value != box.val()) {//看到了吧将validatebox.value与target值想比较，不一样才进行校验，这样当然能提高性能。   
                        //将target的值赋给validatebox.value   
                        validatebox.value = box.val();
                        //对target进行校验，validate内部会显示校验失败的提示tip   
                        validate(target);
                    } else {
                        //尝试显示提示信息(这地方是否显示取决于validatebox.tip是否为空了，也就是取决于匿名函数第一次运行的结果)   
                        showTip(target);
                    }
                    /**
                    * 每隔200毫秒运行一下当前执行的函数  
                    * 当前执行的是什么函数？不正是前面定义的立即运行的匿名函数么？  
                    * 所以说前面定义匿名函数并不是因为蛋疼，而是有着这样一个递归调用的目的。  
                    */
                    setTimeout(arguments.callee, 200);
                }
            })();
        }).bind("blur.validatebox", function() {
            //失去焦点时关闭validatebox.validating，免得那自我递归的匿名函数跟苍蝇似的运行个没完没了。   
            validatebox.validating = false;
            //移除消息提示框，您懂的，要不然一堆tip在页面上不能及时释放，很蛋疼的。   
            removeTip(target);
        }).bind("mouseenter.validatebox", function() {
            //mouseenter事件，如果有validatebox-invalid的话(即target值其实是不符合规则的),则创建tip并显示tip。   
            if (box.hasClass("validatebox-invalid")) {
                createTipToShow(target);
            }
        }).bind("mouseleave.validatebox", function() {
            /**
            * 鼠标离开时，如果是validatebox.validating是关闭的，则移除tip  
            * 因为鼠标离开不代表失去焦点，所以这个地方并不强制停止校验  
            */
            if (!validatebox.validating) {
                removeTip(target);
            }
        });
    };
    /**
    * [createTipToShow 创建提示框tip，并尝试显示之,非常简单，不多说。]  
    * @param  {[type]} target [description]  
    * @return {[type]}  
    */
    function createTipToShow(target) {
        var message = $.data(target, "validatebox").message;
        var tip = $.data(target, "validatebox").tip;
        if (!tip) {
            tip = $("<div class=\"validatebox-tip\">" + "<span class=\"validatebox-tip-content\">" + "</span>" + "<span class=\"validatebox-tip-pointer\">" + "</span>" + "</div>").appendTo("body");
            $.data(target, "validatebox").tip = tip;
        }
        tip.find(".validatebox-tip-content").html(message);
        showTip(target);
    };
    /**
    * [showTip 尝试显示tip，非常简单，不多说。]  
    * @param  {[type]} target [description]  
    * @return {[type]}  
    */
    function showTip(target) {
        var box = $(target);
        var tip = $.data(target, "validatebox").tip;
        if (tip) {
            tip.css({
                display: "block",
                left: box.offset().left + box.outerWidth(),
                top: box.offset().top
            });
        }
    };
    /**
    * [removeTip 尝试移除tip，非常简单，不多说。]  
    * @param  {[type]} target [description]  
    * @return {[type]}  
    */
    function removeTip(target) {
        var tip = $.data(target, "validatebox").tip;
        if (tip) {
            tip.remove();
            $.data(target, "validatebox").tip = null;
        }
    };
    /**
    * [validate validate函数是实际完成校验的函数]  
    * @param  {[type]} target [description]  
    * @return {[type]}  
    */
    function validate(target) {
        var data = $.data(target, "validatebox");
        var options = $.data(target, "validatebox").options;
        var tip = $.data(target, "validatebox").tip;
        var box = $(target);
        var value = box.val();

        function setTipMessage(msg) {
            $.data(target, "validatebox").message = msg;
        };
        if (options.required) {//如果为必填项则做初步校验   
            if (value == "") {
                box.addClass("validatebox-invalid");
                setTipMessage(options.missingMessage);
                if (data.validating) {
                    createTipToShow(target);
                }
                return false;
            }
        }
        if (options.validType) {
            /**
            * [result 匹配出校验类型]  
            * result[1]为规则类型  
            * result[2]为规则入参，例如length规则都是写为length[1,10],1和10就是入参。  
            * @type {RegExp}  
            */
            var result = /([a-zA-Z_]+)(.*)/.exec(options.validType);
            var rule = options.rules[result[1]];
            if (value && rule) {
                var param = eval(result[2]);
                if (!rule["validator"](value, param)) {
                    box.addClass("validatebox-invalid");
                    var message = rule["message"];
                    /**
                    * 这个地方是不是蛋疼呢？  
                    * 我看是真的蛋疼了，如果规则有入参的话，则在规则外部重新设置规则的消息  
                    * 个人觉得某个规则的消息应该完全在规则内部定义，不可被外部改变。  
                    * 所以说这个地方有待改进，也很容易改进。  
                    */
                    if (param) {
                        for (var i = 0; i < param.length; i++) {
                            message = message.replace(new RegExp("\\{" + i + "\\}", "g"), param[i]);
                        }
                    }
                    //options.invalidMessage是用户自己设置的消息   
                    setTipMessage(options.invalidMessage || message);
                    if (data.validating) {
                        createTipToShow(target);
                    }
                    return false;
                }
            }
        }
        box.removeClass("validatebox-invalid");
        removeTip(target);
        return true;
    };
    /**
    * validatebox的构造函数  
    **/
    $.fn.validatebox = function(options, param) {
        //看到了吧，easyui是通过入参来判断是构造组建还是调用组建方法。   
        if (typeof options == "string") {
            //如果options是字符串型，则调用validatebox对用户提供的接口方法。   
            return $.fn.validatebox.methods[options](this, param);
        }
        //如果构造函数没有入参，则设置options为{}空对象。   
        options = options || {};

        //this指向jq选择器返回DOM对象列表，用each方法逐个初始化每个DOM。   
        return this.each(function() {
            //获取绑定在DOM上名为validatebox的全局对象。   
            var state = $.data(this, "validatebox");
            if (state) {
                //如果validatebox已被初始化过，则覆盖原有配置参数。   
                $.extend(state.options, options);
            } else {
                //如果validatebox未被初始化过，则初始化validatebox组建。   
                init(this);
                //绑定一个名为validatebox的对象到DOM上，   
                //该对象只包含options属性，options属性的获取优先级规则为：   
                //传入的options>属性转换器>默认值   
                $.data(this, "validatebox", {
                    options: $.extend({}, $.fn.validatebox.defaults, $.fn.validatebox.parseOptions(this), options)
                });
            }
            //绑定/重绑定事件   
            bindEvents(this);
        });
    };
    $.fn.validatebox.methods = {
        destroy: function(jq) {
            return jq.each(function() {
                destroyBox(this);
            });
        },
        validate: function(jq) {
            return jq.each(function() {
                validate(this);
            });
        },
        isValid: function(jq) {
            return validate(jq[0]);
        }
    };
    $.fn.validatebox.parseOptions = function(target) {
        var t = $(target);
        return $.extend({}, $.parser.parseOptions(target, ["validType", "missingMessage", "invalidMessage"]), {
            required: (t.attr("required") ? true : undefined)
        });
    };
    $.fn.validatebox.defaults = {
        required: false,
        validType: null,
        missingMessage: "This field is required.",
        invalidMessage: null,
        //定义默认规则   
        rules: {
            email: {
                validator: function(value) {
                    return /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/i.test(value);
                },
                message: "Please enter a valid email address."
            },
            url: {
                validator: function(value) {
                    return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
                },
                message: "Please enter a valid URL."
            },
            length: {
                validator: function(value, param) {
                    var len = $.trim(value).length;
                    return len >= param[0] && len <= param[1];
                },
                message: "Please enter a value between {0} and {1}."
            },
            remote: {
                /**
                * [validator 远端验证规则]  
                * @param  {[type]} value [description]  
                * @param  {[type]} param [param[0]为url,param[1]为要传给后台的属性名，其值为value]  
                * @return {[type]}  
                */
                validator: function(value, param) {
                    var data = {};
                    data[param[1]] = value;
                    var isValidate = $.ajax({
                        url: param[0],
                        dataType: "json",
                        data: data,
                        async: false,
                        cache: false,
                        type: "post"
                    }).responseText;
                    return isValidate == "true";
                },
                message: "Please fix this field."
            }
        }
    };
})(jQuery);  
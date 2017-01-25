/**
 * jQuery EasyUI 1.3.1
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2012 stworthy [ stworthy@gmail.com ] 
 * 
 */
(function($) {
function init(_3c5) {
$(_3c5).addClass("validatebox-text");
};
function _3c6(_3c7) {
var _3c8 = $.data(_3c7, "validatebox");
_3c8.validating = false;
$(_3c7).tooltip("destroy");
$(_3c7).unbind();
$(_3c7).remove();
};
function _3c9(_3ca) {
var box = $(_3ca);
var _3cb = $.data(_3ca, "validatebox");
box.unbind(".validatebox").bind("focus.validatebox", function() {
_3cb.validating = true;
_3cb.value = undefined;
(function() {
if (_3cb.validating) {
if (_3cb.value != box.val()) {
	_3cb.value = box.val();
	if (_3cb.timer) {
		clearTimeout(_3cb.timer);
	}
	_3cb.timer = setTimeout(function() {
		$(_3ca).validatebox("validate");
	}, _3cb.options.delay);
} else {
	_3d0(_3ca);
}
setTimeout(arguments.callee, 200);
}
})();
}).bind("blur.validatebox", function() {
if (_3cb.timer) {
clearTimeout(_3cb.timer);
_3cb.timer = undefined;
}
_3cb.validating = false;
_3cc(_3ca);
}).bind("mouseenter.validatebox", function() {
if (box.hasClass("validatebox-invalid")) {
_3cd(_3ca);
}
}).bind("mouseleave.validatebox", function() {
if (!_3cb.validating) {
_3cc(_3ca);
}
});
};
function _3cd(_3ce) {
var _3cf = $.data(_3ce, "validatebox");
var opts = _3cf.options;
$(_3ce).tooltip($.extend({}, opts.tipOptions, { content: _3cf.message, position: opts.tipPosition, deltaX: opts.deltaX })).tooltip("show");
_3cf.tip = true;
};
function _3d0(_3d1) {
var _3d2 = $.data(_3d1, "validatebox");
if (_3d2 && _3d2.tip) {
$(_3d1).tooltip("reposition");
}
};
function _3cc(_3d3) {
var _3d4 = $.data(_3d3, "validatebox");
_3d4.tip = false;
$(_3d3).tooltip("hide");
};
function _3d5(_3d6) {
var _3d7 = $.data(_3d6, "validatebox");
var opts = _3d7.options;
var box = $(_3d6);
var _3d8 = box.val();
function _3d9(msg) {
_3d7.message = msg;
};
function _3da(_3db) {
var _3dc = /([a-zA-Z_]+)(.*)/.exec(_3db);
var rule = opts.rules[_3dc[1]];
if (rule && _3d8) {
var _3dd = eval(_3dc[2]);
if (!rule["validator"](_3d8, _3dd)) {
box.addClass("validatebox-invalid");
var _3de = rule["message"];
if (_3dd) {
	for (var i = 0; i < _3dd.length; i++) {
		_3de = _3de.replace(new RegExp("\\{" + i + "\\}", "g"), _3dd[i]);
	}
}
_3d9(opts.invalidMessage || _3de);
if (_3d7.validating) {
	_3cd(_3d6);
}
return false;
}
}
return true;
};
if (opts.required) {
if (_3d8 == "") {
box.addClass("validatebox-invalid");
_3d9(opts.missingMessage);
if (_3d7.validating) {
_3cd(_3d6);
}
return false;
}
}
if (opts.validType) {
if (typeof opts.validType == "string") {
if (!_3da(opts.validType)) {
return false;
}
} else {
for (var i = 0; i < opts.validType.length; i++) {
if (!_3da(opts.validType[i])) {
	return false;
}
}
}
}
box.removeClass("validatebox-invalid");
_3cc(_3d6);
return true;
};
function _clear(target) {
var box = $(target);
box.removeClass("validatebox-invalid");
};
$.fn.validatebox = function(_3df, _3e0) {
if (typeof _3df == "string") {
return $.fn.validatebox.methods[_3df](this, _3e0);
}
_3df = _3df || {};
return this.each(function() {
var _3e1 = $.data(this, "validatebox");
if (_3e1) {
$.extend(_3e1.options, _3df);
} else {
init(this);
$.data(this, "validatebox", { options: $.extend({}, $.fn.validatebox.defaults, $.fn.validatebox.parseOptions(this), _3df) });
}
_3c9(this);
});
};
$.fn.validatebox.methods = { options: function(jq) {
return $.data(jq[0], "validatebox").options;
}, destroy: function(jq) {
return jq.each(function() {
_3c6(this);
});
}, validate: function(jq) {
return jq.each(function() {
_3d5(this);
});
}, clear: function(jq) {
return jq.each(function() {
_clear(this);
});
}, isValid: function(jq) {
return _3d5(jq[0]);
}
};
$.fn.validatebox.parseOptions = function(_3e2) {
var t = $(_3e2);
return $.extend({}, $.parser.parseOptions(_3e2, ["validType", "missingMessage", "invalidMessage", "tipPosition", { delay: "number", deltaX: "number"}]), { required: (t.attr("required") ? true : undefined) });
};
$.fn.validatebox.defaults = { required: false, validType: null, delay: 200, missingMessage: "This field is required.", invalidMessage: null, tipPosition: "bottom", deltaX: 0, tipOptions: { showEvent: "mouseenter", hideEvent: "mouseleave", showDelay: 0, hideDelay: 0, zIndex: "", onShow: function() {
$(this).tooltip("tip").css({ color: "#000", borderColor: "#95B8E7", backgroundColor: "#FFFFFF" });
}, onHide: function() {
$(this).tooltip("destroy");
}
}, rules: { email: { validator: function(_3e3) {
return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(_3e3);
}, message: "Please enter a valid email address."
}, url: { validator: function(_3e4) {
return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(_3e4);
}, message: "Please enter a valid URL."
}, length: { validator: function(_3e5, _3e6) {
var len = $.trim(_3e5).length;
return len >= _3e6[0] && len <= _3e6[1];
}, message: "Please enter a value between {0} and {1}."
}, remote: { validator: function(_3e7, _3e8) {
var data = {};
data[_3e8[1]] = _3e7;
var _3e9 = $.ajax({ url: _3e8[0], dataType: "json", data: data, async: false, cache: false, type: "post" }).responseText;
return _3e9 == "true";
}, message: "Please fix this field."
}
}
};
})(jQuery);


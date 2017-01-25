(function($) {
    function _create(target) {

    }

    $.fn.dcndialog = function(options, param) {
        if (typeof options == 'string') {
            return $.fn.dcndialog.methods[options](this, param);
        }
        options = options || {};
        return this.each(function() {
            var state = $.data(this, "dcndialog");
            if (state) {
                $.extend(state.options, options);
            } else {
                $.data(this, 'dcndialog', {
                    options: $.extend({}, $.fn.dcndialog.defaults, $.fn.dcndialog.parseOptions(this), options)
                });
                _create(this);
            }
        });
    };

    $.fn.dcndialog.methods = {
        options: function(jq) {
            return $.data(jq[0], "dcndialog").options;
        },
        open: function(jq) {
        },
        close: function(jq) {
        }
    };

    $.fn.dcndialog.parseOptions = function(target) {
        var t = $(target);
        return $.extend(
        {},
        $.parser.parseOptions(target, ['title', 'closable', 'fit', 'width', 'height']), { title: (t.attr('title') ? t.attr('title') : '') });
    };

    $.fn.dcndialog.defaults = {
        title: '',
        closable: true,
        fit: true,
        width: 'auto',
        height: 'auto',
        onBeforeOpen: function() { return true; },
        onBeforeClose: function() { return true; },
        onClose: function() { }
    };

    $('.dcn-dialog').dcndialog();
})(jQuery);
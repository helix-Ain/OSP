(function($) {
    function init(target) {
        $(target).find('[field]').each(function() {
            var m_obj = $(this);
            var m_div = $('<span></span>');
            m_obj.children().appendTo(m_div);
            m_div.appendTo(m_obj);
            m_div.hide();
            $('<span fieldname ="' + m_obj.attr('field') + '"></span>').appendTo(m_obj);
        });

    }

    function load(target, data) {
        $(target).form('load', data);
        $(target).find('[fieldname]').each(function() {
            var m_obj = $(this);
            m_obj.empty();
            if (data != undefined) {
                for (var m_strName in data) {
                    if (m_strName == m_obj.attr('fieldname')) {
                        m_obj.html(data[m_strName]);
                        break;
                    }
                }
            }
        });
    }

    function edit(target) {
        $(target).find('[field]').children().show();
        $(target).find('[fieldname]').hide();
    }

    function readonly(target) {
        $(target).find('[field]').children().hide();
        $(target).find('[fieldname]').show();
    }

    $.fn.dcnForm = function(options, param) {
        if (typeof options == 'string') {
            return $.fn.dcnForm.methods[options](this, param);
        }
        options = options || {};

        return this.each(function() {
            var state = $.data(this, 'dcnForm');
            if (state) {
                $.extend(state.options, options);
            } else {
                $.data(this, 'dcnForm', {
                    options: $.extend({}, $.fn.dcnForm.defaults, options)
                });

                init(this);
            }
        });
    }

    $.fn.dcnForm.methods = {
        options: function(jq) {
            return $.data(jq[0], 'dcnForm').options;
        },

        load: function(jq, data) {
            return jq.each(function() {
                load(this, data);
            });
        },

        edit: function(jq) {
            return jq.each(function() {
                edit(this);
            });
        },

        readonly: function(jq) {
            return jq.each(function() {
                readonly(this);
            });
        }
    }

    $.fn.dcnForm.defaults = {}
})(jQuery);
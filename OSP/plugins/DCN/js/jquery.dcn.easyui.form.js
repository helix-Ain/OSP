(function($) {
    $.extend($.fn.form.methods, {
        dcndivLoad: function(jq, ci_objData) {
            return $.each(jq, function() {
                var target = this;

                $(target).form('load', ci_objData);
                $.data(target, 'form').dcndata = ci_objData;

                $.each($(target).find('.dcn-div'), function() {
                    $(this).dcndiv('load', ci_objData);
                });

                $.each($(target).find('.combolist'), function() {
                    var m_obj = $(this).parent();
                    if (m_obj) {
                        if (m_obj.attr('name') != undefined && ci_objData[m_obj.attr('name')] != undefined) {
                            m_obj.combolist('setValue', ci_objData[m_obj.attr('name')]);
                        }
                    }
                });

                var opts = $.data(target, 'form').options;
                opts.onAfterdcndivLoad.call(target, ci_objData);
            });
        },
        dcndivEdit: function(jq, loadData) {
            return $.each(jq, function() {
                var target = this;
                if (!$.data(target, 'form')) {
                    $.data(target, 'form', {
                        options: $.extend({}, $.fn.form.defaults)
                    });
                }
                var opts = $.data(target, 'form').options;

                $.each($(target).find('.dcn-div'), function() {
                    $(this).dcndiv('beginEdit');
                });
                $.each($(target).find('.dcn-clearbutton'), function() {
                    $(this).clearbutton();
                });
                var m_objData = null;
                try {
                    m_objData = $.data(target, 'form').dcndata;
                }
                catch (ex) { }

                if (loadData == undefined) {
                    loadData = true;
                }
                if (m_objData != null && loadData) {
                    $(target).form('clear');
                    $(target).form('load', m_objData);
                }
                opts.onAfterdcndivEdit.call(target, m_objData);
            });
        },
        dcndivEndEdit: function(jq, ci_objData) {
            return $.each(jq, function() {
                $(this).form('dcndivLoad', ci_objData);
                $(this).form('dcndivCancelEdit');
            });
        },
        dcndivCancelEdit: function(jq) {
            return $.each(jq, function() {
                var target = this;
                var opts = $.data(target, 'form').options;
                if (opts && target) {
                    $.each($(target).find('.dcn-div'), function() {
                        $(this).dcndiv('cancelEdit');
                    });
                }
            });
        },
        getData: function(jq) {
            return $.data(jq[0], 'form').dcndata;
        }
    });

    $.extend($.fn.form.defaults, {
        onAfterdcndivEdit: function(data) { },
        onAfterdcndivLoad: function(data) { }
    });
})(jQuery);
(function($) {
    setHelp();
})(jQuery);

function setHelp() {
    var m_obj = $('.dc-help');
    if (m_obj.length > 0) {
        var m_objCode = [];
        $.each(m_obj, function() {
            if ($(this).attr('hcode') != '') {
                $(this).html('&nbsp;');
                m_objCode.push($(this).attr('hcode'));
            }
        });
        if (m_objCode.length > 0) {
            postData({
                url: 'DcCdHelpManage',
                params: { Action: "GetList", searchQuery: "cCode" + getSeparativeSign() + "8" + getSeparativeSign() + "'" + m_objCode.join("','") + "'" },
                isSys: true,
                success: function(ci_result) {
                    if (existData(ci_result)) {
                        $.each(ci_result.rows, function() {
                            for (var i = 0; i < m_obj.length; i++) {
                                if (this.cCode == $(m_obj[i]).attr('hcode')) {
                                    switch ($(m_obj[i]).attr('htype')) {
                                        case "2":
                                            $(m_obj[i]).html(this.cContent);
                                            break;
                                        default:
                                            $(m_obj[i]).attr('title', this.cContent).addClass('easyui-tooltip');
                                            $.parser.parse($(m_obj[i]));
                                            break;
                                    }
                                }
                            }
                        });
                    }
                }
            });
        }
    }
}
(function($) {
    var m_strColor = '#777';
    var m_strFocusColor = '#aaa';

    $.fn.dcinput = function() {
        return this.each(function() {
            if ($(this).attr('setTip') != 'true') {
                $(this).attr('setTip', 'true');
                var tiptext = "";

                if ($(this).attr("dc-tip")) {
                    tiptext = $(this).attr("dc-tip");
                }
                if (tiptext != "") {
                    var m_objInput = $(this);
                    var m_objLabel = $("<label class='dc-label'>" + tiptext + "</label>");
                    if (m_objInput.hasClass('easyui-combobox') || m_objInput.hasClass('easyui-combo') || m_objInput.hasClass('easyui-datebox') || m_objInput.hasClass('spinner-text')) {
                        if (m_objInput.next().length > 0) {
                            var m_strFun = "combo";
                            if (m_objInput.hasClass('easyui-combobox')) {
                                m_strFun += "box";
                                m_objInput = $(this).combobox('textbox');
                            }
                            else if (m_objInput.hasClass('easyui-datebox')) {
                                m_strFun = "datebox";
                                m_objInput = $(this).datebox('textbox');
                            }
                            else if (m_objInput.hasClass('spinner-text')) {
                                m_strFun = 'numberspinner';
                            }
                            else {
                                m_objInput = $(this).combo('textbox');
                            }

                            $(this)[m_strFun]('options').onChange = function(newValue, oldValue) {
                                if (newValue != "") {
                                    m_objLabel.css('display', 'none');
                                }
                                else {
                                    m_objLabel.css('display', '');
                                }
                                try {
                                    if ($(this)[m_strFun]('options').onMyChange != undefined) {
                                        $(this)[m_strFun]('options').onMyChange.call(this, newValue, oldValue);
                                    }
                                }
                                catch (ex) { }
                            };

                            m_objInput.parent().css('position', 'relative');
                            if (m_objInput.hasClass('spinner-text')) {
                                m_objInput.removeClass('dc-input');
                                m_objInput.parent().width(m_objInput.parent().width() - 5);
                            }
                            else {
                                m_objLabel.css('margin-left', m_objInput.parent().css('padding-left'));
                            }
                        }
                    }
                    else {
                        m_objInput.wrap("<div class='dc-input-box'></div>");
                        m_objLabel.css('marginTop', '2px');
                    }

                    if (m_objInput.css('fontSize') != undefined) {
                        m_objLabel.css('fontSize', m_objInput.css('fontSize'));
                    }

                    var m_iHeight = m_objInput.height();
                    if (m_iHeight <= 0) {
                        m_iHeight = 18;
                    }
                    m_objLabel.height(m_iHeight);

                    m_objLabel.width(m_objInput.width() - 5);
                    if (m_objLabel.width() >= m_objInput.width()) {
                        m_objLabel.width(m_objInput.width() - 10);
                    }

                    if (m_objInput.css('lineHeight') == 'normal') {
                        m_objLabel.css('lineHeight', m_objLabel.css('height'));
                    }
                    else {
                        m_objLabel.css('lineHeight', m_objInput.css('lineHeight'));
                    }

                    m_objLabel.insertAfter(m_objInput);
                    m_objLabel.click(function() {
                        m_objInput.focus();
                    });

                    if (m_objInput.val() != "") {
                        m_objLabel.css('display', 'none');
                    }

                    m_objInput.focus(function() {
                        m_objLabel.css('color', m_strFocusColor);
                    });

                    m_objInput.keydown(function() {
                        m_objLabel.css('display', 'none');
                    });

                    m_objInput.keyup(function() {
                        if (m_objInput.val() == "") {
                            m_objLabel.css('color', m_strFocusColor);
                            m_objLabel.css('display', '');
                        }
                    });

                    m_objInput.bind('change blur', function() { setLabel(this); });
                }
            }
        });
    }

    $.fn.dcreset = function() {
        return this.each(function() { setLabel(this); });
    }

    function setLabel(ci_objInput) {
        var m_objLabel = $(ci_objInput).parent().find(".dc-label");
        var m_objInput = $(ci_objInput);
        if (m_objLabel.length > 0) {
            var m_strValue = '';
            if (m_objInput.hasClass('easyui-combobox') || m_objInput.hasClass('easyui-combo') || m_objInput.hasClass('easyui-datebox') || m_objInput.hasClass('spinner-text')) {
                var m_strFun = "combo";
                if (m_objInput.hasClass('easyui-combobox')) {
                    m_strFun += "box";
                }
                else if (m_objInput.hasClass('easyui-datebox')) {
                    m_strFun = "datebox";
                }
                else if (m_objInput.hasClass('spinner-text')) {
                    m_strFun = 'numberspinner';
                }
                m_strValue = m_objInput[m_strFun]('getValue');
            }
            else {
                m_strValue = $(ci_objInput).val();
            }

            if (m_strValue == '') {
                m_objLabel.css('color', m_strColor);
                m_objLabel.css('display', '');
            } else {
                m_objLabel.css('display', 'none');
            }
        }
    }
})(jQuery);
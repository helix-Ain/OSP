(function($) {

    function init(target) {
        var maxsel = $.data(target, 'industrybox').options.maxsel;
        var init_html = '<div id="industry-info" class="industry-info">'
        + '<div class="menu1 menu-basic"><div id="company-industry-container1" class="menu1-sub"></div></div>'
        + '<div class="menu1 menu-basic"><div id="company-industry-container2" class="menu1-sub"></div></div>'
        + '<div class="menu1 menu-basic"><div id="company-industry-container3" class="menu1-sub"></div></div>'
        + '</div>'
        + '<div class="choosed-show" id="industry-choosed-show">'
        + '<div><span class="tips">您已选择：<b>（</b><em class="industry-maxlen" id="industry-maxlen">最多选择' + maxsel + '个</em><b>）</b></span><span><a href="javascript:void(0)" class="industry-box">清空选项</a></span></div>'
        + '<div id="choosed-show-div"><ul id="choosed-show-ul"></ul><div style="clear:both;"></div></div>'
        + '</div>';

        $(target).empty().append(init_html);

        genList(target);


    }

    $.fn.industrybox = function(options, param) {
        if (typeof options == 'string') {
            return $.fn.industrybox.methods[options](this, param);
        }
        options = options || {};
        return this.each(function() {
            var state = $.data(this, 'industrybox');
            if (state) {
                $.extend(state.options, options);
            } else {
                state = $.data(this, 'industrybox', {
                    options: $.extend({}, $.fn.industrybox.defaults, options)
                });
                init(this);
            }
        });

    }

    function addIndustry() {
        var m_html = "";
        m_html += "<ul class='item-list'>";
        $("#choosed-show-div>ul>li").each(function(index, e) {
            m_html += "<li class='item' catid='" + $(this).attr("catid") + "' title='" + $(this).find("span").text() + "'><span>" + $(this).find("span").text() + "</span><a href='javascript:void(0);' class='del-item' title='删除'>×</a></li>";
        });
        m_html += "</ul>";
        $("#addIndustry").html(m_html);

    }

    function genList(target) {
        var m_value = $.data(target, 'industrybox').options.value;
        var m_maxsel = $.data(target, 'industrybox').options.maxsel;
        var m_choseBox = $(target).find("em.industry-maxlen");

        $(target).find("a.industry-clear").click(function(e) { clearBox(target); });

        var m_valArr = new Array();
        if (m_value != "") {
            m_valArr = m_value.split(",");
        }
        else {
            m_valArr = [];
        }
        var m_cHtml = "";
        $.each(m_valArr, function(index, value) {
            var m_cData = getIndustryInfo(value);
            m_cHtml += '<li catid="' + m_cData.ID + '" id="industry-choosed-' + m_cData.ID + '"><span class="item">' + (m_cData.AncestorName == "" ? "" : m_cData.AncestorName + "/") + m_cData.ParentName + '/' + m_cData.Name + '</span><a class="del-item" title="删除" href="javascript: void(0)" target="_self">×</a></li>';
        })
        $("#choosed-show-ul").append(m_cHtml);

        $("#choosed-show-ul>li>a").bind("click", function(e) {
            var m_choID = $(this).parent().attr("catid");
            $("#industry-menu-" + m_choID + ">input[type=checkbox]").attr("checked", false);
            $(this).parent().remove();

        });

        var m_html = "";
        m_html += "<ul id='company-industry-ul1'>";
        var m_data = getIndustryList(0);
        for (var i = 0; i < m_data.length; i++) {
            if (m_data[i].ChildrenCount > 0) {
                m_html += "<li class='has-sub' id='industry-menu1-" + m_data[i].ID + "' catid='" + m_data[i].ID + "' hassub='true'><span class='suggest-key'>" + m_data[i].Name + "</span></li>";
            }
        }
        m_html += "</ul>";

        $("#company-industry-container1").html(m_html);

        $("#company-industry-ul1>li").each(function(index, e) {
            $(this).bind("click", function(e) {
                genSubList(this);
                $("#company-industry-container3>ul").hide();

            });
        });



        function genSubList(target2) {
            $("#company-industry-container1>ul>li").removeClass("industry-li-click");
            $(target2).addClass("industry-li-click");
            var m_catID = $(target2).attr("catid");
            var m_catHtml = "";
            var m_ulID = "induscry-menu-ul-" + m_catID;

            var m_catObj = $('#' + m_ulID);
            $('#company-industry-container2 > ul').hide();
            if (m_catObj.length > 0) {
                m_valArr = collectSel();
                $("#" + m_ulID + ">li>input[type=checkbox]").each(function(index, e) {
                    var m_liID = $(this).parent().attr("catid");
                    m_valArr = collectSel();
                    for (var i = 0; i < m_valArr.length; i++) {
                        if (m_liID == m_valArr[i]) {
                            $(this).attr("checked", "checked");
                        }
                    }
                });
                $("#" + m_ulID).show();
            }
            else {
                m_catHtml += "<ul id='" + m_ulID + "'>";
                var m_catData = getIndustryList(m_catID);
                for (var i = 0; i < m_catData.length; i++) {
                    if (m_catData[i].ChildrenCount > 0) {
                        m_catHtml += "<li class='has-sub' id='industry-menu-" + m_catData[i].ID + "' catid='" + m_catData[i].ID + "' hassub='true'><input type='checkbox' class='check-box'/><span class='suggest-key'>" + m_catData[i].Name + "</span></li>";
                    }
                    else {
                        m_catHtml += "<li id='industry-menu-" + m_catData[i].ID + "' catid='" + m_catData[i].ID + "' hassub='false'><input type='checkbox' class='check-box'/><span class='suggest-key'>" + m_catData[i].Name + "</span></li>";
                    }
                }
                m_catHtml += "</ul>";
                $('#company-industry-container2').append(m_catHtml);
                $("#" + m_ulID + ">li").each(function(index, e) {
                    $(this).bind("click", function(e) {
                        genThirdList(this);

                    });
                });

                $("#" + m_ulID + ">li>input[type=checkbox]").each(function(index, e) {
                    var m_liID = $(this).parent().attr("catid");
                    m_valArr = collectSel();
                    for (var i = 0; i < m_valArr.length; i++) {
                        if (m_liID == m_valArr[i]) {
                            $(this).attr("checked", "checked");
                        }
                    }
                    $(this).bind("change", function(e) {
                        m_maxsel = $(target).industrybox("options").maxsel;
                        var m_selected = $("#choosed-show-ul>li").length;
                        if ($(this).attr("checked") == "checked") {
                            if (m_selected < m_maxsel) {
                                var m_choosedHtml = "";
                                var m_Info = getIndustryInfo(m_liID);
                                m_choosedHtml += '<li catid="' + m_Info.ID + '" id="industry-choosed-' + m_Info.ID + '"><span class="item">' + m_Info.ParentName + '/' + m_Info.Name + '</span><a class="del-item" title="删除" href="javascript: void(0)" target="_self">×</a></li>';
                                $("#choosed-show-ul").append(m_choosedHtml);

                                $("#industry-choosed-" + m_Info.ID + ">a").bind("click", function(e) {
                                    if (m_selected == m_maxsel - 1) {
                                        $("#company-industry-container2>ul>li>input:not(:checked)").attr("disabled", false);
                                        $("#company-industry-container3>ul>li>input:not(:checked)").attr("disabled", false);
                                        m_choseBox.css("color", "#000000");
                                    }
                                    var m_choID = $(this).parent().attr("catid");
                                    $("#industry-menu-" + m_choID + ">input[type=checkbox]").attr("checked", false);
                                    $(this).parent().remove();

                                });
                                if (m_selected == m_maxsel - 1) {
                                    $("#company-industry-container2>ul>li>input:not(:checked)").attr("disabled", "disabled");
                                    $("#company-industry-container3>ul>li>input:not(:checked)").attr("disabled", "disabled");
                                    m_choseBox.css("color", "#FF0000");
                                }
                            }
                            else {
                                $(this).attr("checked", false);
                                $("#company-industry-container2>ul>li>input:not(:checked)").attr("disabled", "disabled");
                                $("#company-industry-container3>ul>li>input:not(:checked)").attr("disabled", "disabled");
                                m_choseBox.css("color", "#FF0000");
                            }
                        }
                        else {
                            if (m_selected == m_maxsel) {
                                $("#company-industry-container2>ul>li>input:not(:checked)").attr("disabled", false);
                                $("#company-industry-container3>ul>li>input:not(:checked)").attr("disabled", false);
                                m_choseBox.css("color", "#000000");
                            }
                            $("#industry-choosed-" + m_liID).remove();
                        }

                    });
                });

            }
        }

        function genThirdList(target3) {
            $("#company-industry-container2>ul>li").removeClass("industry-li-click");
            $(target3).addClass("industry-li-click");

            var m_thiID = $(target3).attr("catid");
            var m_thiHtml = "";
            var m_thiUlID = "induscry-menu-ul-" + m_thiID;

            var m_thiObj = $('#' + m_thiUlID);
            $('#company-industry-container3 > ul').hide();
            if (m_thiObj.length > 0) {
                m_valArr = collectSel();
                $("#" + m_thiUlID + ">li>input[type=checkbox]").each(function(index, e) {
                    var m_liID = $(this).parent().attr("catid");
                    m_valArr = collectSel();
                    for (var i = 0; i < m_valArr.length; i++) {
                        if (m_liID == m_valArr[i]) {
                            $(this).attr("checked", "checked");
                        }
                    }
                });
                $("#" + m_thiUlID).show();
            }
            else {
                m_thiHtml += "<ul id='" + m_thiUlID + "'>";
                var m_thiData = getIndustryList(m_thiID);
                for (var i = 0; i < m_thiData.length; i++) {
                    if (m_thiData[i].ChildrenCount > 0) {
                        m_thiHtml += "<li class='has-sub' id='industry-menu-" + m_thiData[i].ID + "' catid='" + m_thiData[i].ID + "' hassub='true'><input type='checkbox' class='check-box'/><span class='suggest-key'>" + m_thiData[i].Name + "</span></li>";
                    }
                    else {
                        m_thiHtml += "<li id='industry-menu-" + m_thiData[i].ID + "' catid='" + m_thiData[i].ID + "' hassub='false'><input type='checkbox' class='check-box'/><span class='suggest-key'>" + m_thiData[i].Name + "</span></li>";
                    }
                }
                m_thiHtml += "</ul>";
                $('#company-industry-container3').append(m_thiHtml);

                $("#" + m_thiUlID + ">li>input[type=checkbox]").each(function(index, e) {
                    var m_liID = $(this).parent().attr("catid");
                    m_valArr = collectSel();
                    for (var i = 0; i < m_valArr.length; i++) {
                        if (m_liID == m_valArr[i]) {
                            $(this).attr("checked", "checked");
                        }
                    }
                    $(this).bind("change", function(e) {
                        m_maxsel = $(target).industrybox("options").maxsel;
                        var m_selected = $("#choosed-show-ul>li").length;

                        if ($(this).attr("checked") == "checked") {
                            if (m_selected < m_maxsel) {
                                var m_choosedHtml = "";
                                var m_Info = getIndustryInfo(m_liID);
                                m_choosedHtml += '<li catid="' + m_Info.ID + '" id="industry-choosed-' + m_Info.ID + '"><span class="item">' + m_Info.AncestorName + '/' + m_Info.ParentName + '/' + m_Info.Name + '</span><a class="del-item" title="删除" href="javascript: void(0)" target="_self">×</a></li>';
                                $("#choosed-show-ul").append(m_choosedHtml);

                                $("#industry-choosed-" + m_Info.ID + ">a").bind("click", function(e) {
                                    if (m_selected == m_maxsel - 1) {
                                        $("#company-industry-container2>ul>li>input:not(:checked)").attr("disabled", false);
                                        $("#company-industry-container3>ul>li>input:not(:checked)").attr("disabled", false);
                                        m_choseBox.css("color", "#000000");
                                    }
                                    var m_choID = $(this).parent().attr("catid");
                                    $("#industry-menu-" + m_choID + ">input[type=checkbox]").attr("checked", false);
                                    $(this).parent().remove();

                                });
                                if (m_selected == m_maxsel - 1) {
                                    $("#company-industry-container2>ul>li>input:not(:checked)").attr("disabled", "disabled");
                                    $("#company-industry-container3>ul>li>input:not(:checked)").attr("disabled", "disabled");
                                    m_choseBox.css("color", "#FF0000");
                                }
                            }
                            else {
                                $(this).attr("checked", false);
                                $("#company-industry-container2>ul>li>input:not(:checked)").attr("disabled", "disabled");
                                $("#company-industry-container3>ul>li>input:not(:checked)").attr("disabled", "disabled");
                                m_choseBox.css("color", "#FF0000");
                            }
                        }
                        else {
                            if (m_selected == m_maxsel) {
                                $("#company-industry-container2>ul>li>input:not(:checked)").attr("disabled", false);
                                $("#company-industry-container3>ul>li>input:not(:checked)").attr("disabled", false);
                                m_choseBox.css("color", "#000000");
                            }
                            $("#industry-choosed-" + m_liID).remove();
                        }

                    });
                });
            }

        }

    }

    function collectSel() {
        var m_arr = [];
        $("#choosed-show-div>ul>li").each(function(index, e) {
            m_arr.push($(this).attr("catid"));
        });
        return m_arr;
    }

    function genIndustryBox(target, value) {
        var test_arr = new Array();
        if (value != "") {
            test_arr = value.split(",");
        }
        else {
            test_arr = [];
        }
        var m_html = "";
        m_html += "<ul class='item-list'>";
        $.each(test_arr, function(index, value) {
            var m_data = getIndustryInfo(value);
            m_html += "<li class='item' catid='" + m_data.ID + "' title='" + m_data.Name + "'><span>" + (m_data.AncestorName == "" ? "" : m_data.AncestorName + "/") + m_data.ParentName + "/" + m_data.Name + "</span><a href='javascript:void(0);' class='del-item' title='删除'>×</a></li>";
        })
        m_html += "</ul>";
        $("#addIndustry2").html(m_html);
        $("#addIndustry2>ul>li>a").bind("click", function(e) {
            var m_choID = $(this).parent().attr("catid");
            $(this).parent().remove();
            e.stopPropagation();

        });
    }

    function clearBox(target) {
        $("#choosed-show-ul").empty();
        $("#company-industry-container2>ul>li>input[type=checkbox]").attr("checked", false);
        $("#company-industry-container3>ul>li>input[type=checkbox]").attr("checked", false);
        $("#company-industry-container2>ul>li>input:not(:checked)").attr("disabled", false);
        $("#company-industry-container3>ul>li>input:not(:checked)").attr("disabled", false);
        $(target).find("em.industry-maxlen").css("color", "#000000");

    }

    function changeSel(target, value) {
        $("#choosed-show-ul").empty();
        $("#company-industry-container2>ul>li>input[type=checkbox]").attr("checked", false);
        $("#company-industry-container3>ul>li>input[type=checkbox]").attr("checked", false);
        $("#company-industry-container2>ul>li>input:not(:checked)").attr("disabled", false);
        $("#company-industry-container3>ul>li>input:not(:checked)").attr("disabled", false);
        $(target).industrybox({ maxsel: value });
        $(target).find(".industry-maxlen").text("最多选择" + value + "个");
        $(target).find("em.industry-maxlen").css("color", "#000000");
    }

    function setValue(target, ci_value) {
        $("#company-industry-container2>ul").hide();
        $("#company-industry-container3>ul").hide();
        $("#choosed-show-ul").empty();
        var m_valArr = new Array();
        if (ci_value != "") {
            m_valArr = ci_value.split(",");
        }
        else {
            m_valArr = [];
        }
        var m_cHtml = "";
        $.each(m_valArr, function(index, value) {
            var m_cData = getIndustryInfo(value);
            m_cHtml += '<li catid="' + m_cData.ID + '" id="industry-choosed-' + m_cData.ID + '"><span class="item">' + (m_cData.AncestorName == "" ? "" : m_cData.AncestorName + "/") + m_cData.ParentName + '/' + m_cData.Name + '</span><a class="del-item" title="删除" href="javascript: void(0)" target="_self">×</a></li>';
        })
        $(target).find("em.industry-maxlen").css("color", "#000000");
        $("#choosed-show-ul").append(m_cHtml);
        var m_maxsel = $(target).industrybox("options").maxsel;
        var m_selected = $("#choosed-show-ul>li").length;
        $("#choosed-show-ul>li>a").bind("click", function(e) {
            if (m_selected == m_maxsel) {
                $("#company-industry-container2>ul>li>input:not(:checked)").attr("disabled", false);
                $("#company-industry-container3>ul>li>input:not(:checked)").attr("disabled", false);
                $(target).find("em.industry-maxlen").css("color", "#000000");
            }
            var m_choID = $(this).parent().attr("catid");
            $("#industry-menu-" + m_choID + ">input[type=checkbox]").attr("checked", false);
            $(this).parent().remove();

        });
    }

    $.fn.industrybox.methods = {
        show: function(jq, value) {
            return jq.each(function() {
                genIndustryBox(this, value);
            });
        },
        getValue: function(jq) {
            return collectSel();
        },
        clear: function(jq) {
            clearBox(jq);
        },
        options: function(jq) {
            return $.data(jq[0], 'industrybox').options;
        },
        changeSel: function(jq, value) {
            changeSel(jq, value);
        },
        setValue: function(jq, value) {
            setValue(jq, value);
        }
    }

    $.fn.industrybox.defaults = {
        maxsel: 6,
        value: ""
    };

})(jQuery);

function genIndustryBox(value) {
    var test_str = value;
    industry_Data = test_str;
    var test_arr = test_str.split(",");
    var m_html = "";
    m_html += "<ul class='item-list'>";
    $.each(test_arr, function(index, value) {
        var m_data = getIndustryInfo(value);
        m_html += "<li class='item' catid='" + m_data.ID + "' title='" + m_data.Name + "'><span>" + (m_data.AncestorName == "" ? "" : m_data.AncestorName + "/") + m_data.ParentName + "/" + m_data.Name + "</span><a href='javascript:void(0);' class='del-item' title='删除'>×</a></li>";
    })
    m_html += "</ul>";
    $("#addIndustry2").html(m_html);
    $("#addIndustry2>ul>li>a").bind("click", function(e) {
        var m_choID = $(this).parent().attr("catid");
        $(this).parent().remove();
        e.stopPropagation();

    });
}

function addIndustry() {
    var m_html = "";
    var m_arr = [];
    m_html += "<ul class='item-list'>";
    $("#choosed-show-div>ul>li").each(function(index, e) {
        m_html += "<li class='item' catid='" + $(this).attr("catid") + "' title='" + $(this).find("span").text() + "'><span>" + $(this).find("span").text() + "</span><a href='javascript:void(0);' class='del-item' title='删除'>×</a></li>";
        m_arr.push($(this).attr("catid"));
    });
    m_html += "</ul>";

    industry_Data = m_arr.join(",");
    $("#addIndustry").html(m_html);

    $("#addIndustry>ul>li>a").bind("click", function(e) {
        var m_choID = $(this).parent().attr("catid");
        $(this).parent().remove();
        e.stopPropagation();

    });

}


(function($) {

    function init(target) {
        var input = $(target);
        $('<div class="search_suggest" id="indu_search_suggest"><ul></ul></div>').appendTo('body');
        var suggestWrap = $('.search_suggest');
        var key = "";
        var initBind = function() {
            input.bind('keyup', sendKeyWord);
            input.bind('keydown', onKeyDown);
            input.bind('blur', function() { setTimeout(hideSuggest, 200); })
        }
        var hideSuggest = function() {
            suggestWrap.hide();
        }

        var onKeyDown = function(event) {
            var current = suggestWrap.find('li.hover');
            if (event.keyCode == 38) {
                if (current.length > 0) {
                    var prevLi = current.removeClass('hover').prev();
                    if (prevLi.length > 0) {
                        prevLi.addClass('hover');
                        input.val(prevLi.find("span.indu-item").text());
                    }
                } else {
                    var last = suggestWrap.find('li:last');
                    last.addClass('hover');
                    input.val(last.find("span.indu-item").text());
                }

            } else if (event.keyCode == 40) {
                if (current.length > 0) {
                    var nextLi = current.removeClass('hover').next();
                    if (nextLi.length > 0) {
                        nextLi.addClass('hover');
                        input.val(nextLi.find("span.indu-item").text());
                    }
                } else {
                    var first = suggestWrap.find('li:first');
                    first.addClass('hover');
                    input.val(first.find("span.indu-item").text());
                }
            }

        }
        var sendKeyWord = function(event) {

            if (suggestWrap.css('display') == 'block' && event.keyCode == 38 || event.keyCode == 40) {
                return;

            } else {
                var valText = $.trim(input.val());
                if (valText == '' || valText == key) {
                    return;
                }
                var m_data = sendKeyWordToBack(valText);
                dataDisplay(this, m_data)
                key = valText;
            }

        }
        initBind();
        var m_position = $(".input_search_key").position();
        $(".search_suggest").css({ "top": m_position.top + $(".input_search_key").outerHeight(), "left": m_position.left });
    }

    function dataDisplay(target, data) {
        var suggestWrap = $('.search_suggest');
        if (data.length <= 0) {
            suggestWrap.hide();
            return;
        }

        var li;
        var tmpFrag = document.createDocumentFragment();
        suggestWrap.find('ul').html('');
        for (var i = 0; i < data.length; i++) {
            li = document.createElement('LI');
            li.innerHTML = data[i];
            tmpFrag.appendChild(li);
        }
        suggestWrap.find('ul').append(tmpFrag);
        suggestWrap.show();
        suggestWrap.find('li').hover(function() {
            suggestWrap.find('li').removeClass('hover');
            $(this).addClass('hover');

        }, function() {
            $(this).removeClass('hover');
        }).bind('click', function() {
            $(target).val($(this).find("span.indu-item").text());
            suggestWrap.hide();
        });
    }

    function sendKeyWordToBack(keyword) {

        var bind_data = getAutoCompleteList(keyword);
        var aData = [];
        $.each(bind_data, function(index, value) {
            var detail_data = getIndustryInfo(bind_data[index].ID);
            var m_str = "<span class='indu-item'>" + detail_data.Name + "</span>" + "<span style='color:#ccc;padding-left:10px;'>" + detail_data.ParentName + "</span>" + "<span style='color:#ccc;padding-left:10px;'>" + detail_data.AncestorName + "</span>";
            aData.push(m_str);
        })
        return aData;

    }

    $.fn.industryauto = function(options, param) {
        if (typeof options == 'string') {
            return $.fn.industryauto[options](this, param);
        }
        options = options || {};
        return this.each(function() {
            var state = $.data(this, 'industryauto');
            if (state) {
                $.extend(state.options, options);
            } else {
                state = $.data(this, 'industryauto', {
                    options: $.extend({}, $.fn.industryauto.defaults, options)
                });
                init(this);
            }
        });

    }

})(jQuery);

function oSearchSuggest(searchFuc) {
    var input = $('.input_search_key');
    var suggestWrap = $('.search_suggest');
    //$('<div class="search_suggest" id="indu_search_suggest"><ul></ul></div>').appendTo('body');

    var key = "";
    var init = function() {
        input.bind('keyup', sendKeyWord);
        input.bind('keydown', onKeyDown);
        input.bind('blur', function() { setTimeout(hideSuggest, 200); })
    }
    var hideSuggest = function() {
        suggestWrap.hide();
    }

    var onKeyDown = function(event) {
        var current = suggestWrap.find('li.hover');
        if (event.keyCode == 38) {
            if (current.length > 0) {
                var prevLi = current.removeClass('hover').prev();
                if (prevLi.length > 0) {
                    prevLi.addClass('hover');
                    input.val(prevLi.find("span.indu-item").text());
                }
            } else {
                var last = suggestWrap.find('li:last');
                last.addClass('hover');
                input.val(last.find("span.indu-item").text());
            }

        } else if (event.keyCode == 40) {
            if (current.length > 0) {
                var nextLi = current.removeClass('hover').next();
                if (nextLi.length > 0) {
                    nextLi.addClass('hover');
                    input.val(nextLi.find("span.indu-item").text());
                }
            } else {
                var first = suggestWrap.find('li:first');
                first.addClass('hover');
                input.val(first.find("span.indu-item").text());
            }
        }

    }
    var sendKeyWord = function(event) {

        if (suggestWrap.css('display') == 'block' && event.keyCode == 38 || event.keyCode == 40) {
            return;

        } else {
            var valText = $.trim(input.val());
            if (valText == '' || valText == key) {
                return;
            }
            searchFuc(valText);
            key = valText;
        }

    }

    this.dataDisplay = function(data) {
        if (data.length <= 0) {
            suggestWrap.hide();
            return;
        }

        var li;
        var tmpFrag = document.createDocumentFragment();
        suggestWrap.find('ul').html('');
        for (var i = 0; i < data.length; i++) {
            li = document.createElement('LI');
            li.innerHTML = data[i];
            tmpFrag.appendChild(li);
        }
        suggestWrap.find('ul').append(tmpFrag);
        suggestWrap.show();
        suggestWrap.find('li').hover(function() {
            suggestWrap.find('li').removeClass('hover');
            $(this).addClass('hover');

        }, function() {
            $(this).removeClass('hover');
        }).bind('click', function() {
            input.val($(this).find("span.indu-item").text());
            suggestWrap.hide();
        });
    }
    init();
};

function sendKeyWordToBack(keyword) {

    var bind_data = getAutoCompleteList(keyword);
    var aData = [];
    $.each(bind_data, function(index, value) {
        var detail_data = getIndustryInfo(bind_data[index].ID);
        var m_str = "<span class='indu-item'>" + detail_data.Name + "</span>" + "<span style='color:#ccc;padding-left:10px;'>" + detail_data.ParentName + "</span>" + "<span style='color:#ccc;padding-left:10px;'>" + detail_data.AncestorName + "</span>";
        aData.push(m_str);
    })
    searchSuggest.dataDisplay(aData);

}
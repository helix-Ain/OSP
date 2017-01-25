var _strMenuCode = '';

function openTab(ci_strMainMenuCode, ci_strMenuCode, ci_strTabName, ci_strOpenUrl, ci_strImg, ci_bClosable, ci_strParameter) {
    var m_objTab = [];
    m_objTab.OpenUrl = ci_strOpenUrl || '';
    if (m_objTab.OpenUrl == '') {
        return;
    }
    m_objTab.MainMenuCode = ci_strMainMenuCode || '';
    m_objTab.MenuCode = ci_strMenuCode || '';
    m_objTab.TabName = ci_strTabName || '';
    m_objTab.Img = ci_strImg || '';
    m_objTab.Parameter = ci_strParameter || '';
    m_objTab.TabID = 'tab_' + m_objTab.MenuCode;
    m_objTab.Closable = true;
    if (ci_bClosable != undefined) {
        m_objTab.Closable = ci_bClosable;
    }
    m_objTab.NewOpenUrl = m_objTab.OpenUrl;
    if (m_objTab.Parameter != '') {
        if (m_objTab.OpenUrl.toString().lastIndexOf('#') >= 0) {
            m_objTab.NewOpenUrl += '&' + m_objTab.Parameter;
        }
        else {
            m_objTab.NewOpenUrl += '#' + m_objTab.Parameter;
        }
    }
    if (m_objTab.NewOpenUrl.toString().lastIndexOf('#') >= 0) {
        m_objTab.NewOpenUrl = m_objTab.NewOpenUrl.replace(/.html#/, ".html?T=" + Math.random().toString().replace(/0./, '') + "#");
    }
    else {
        if (m_objTab.NewOpenUrl.toString().lastIndexOf('?') >= 0) {
            m_objTab.NewOpenUrl += "&";
        }
        else {
            m_objTab.NewOpenUrl += "?";
        }
        m_objTab.NewOpenUrl += "T=" + Math.random().toString().replace(/0./, '');
    }

    $('#lab_Title').html(m_objTab.TabName);
    $('#div_Content').empty().html('<iframe scrolling="yes" frameborder="0" style="width:100%;height:100%;" src="' + m_objTab.NewOpenUrl + '"></iframe>');
    _strMenuCode = ci_strMenuCode;
    var m_strT = '';
    if (_strMenuCode == "Desktop") {
        $('#div_MenuTree').find('.tree-node-selected').removeClass('tree-node-selected');
        m_strT = getSeparativeSign() + Math.random().toString().replace(/0./, '');
    }
    top.location.hash = 'p=' + base64encode(ci_strMainMenuCode + getSeparativeSign() + ci_strMenuCode + m_strT);

    showGuide(ci_strMenuCode);
}

function openTab2(ci_strTreeID, ci_strMenuID, ci_strParameter, ci_bClosable) {
    createMenuTree(ci_strTreeID, ci_strMenuID, ci_bClosable, ci_strParameter);
}

function createMenuTree(ci_strMainMenuCode, ci_strMenuCode, ci_bIsOpenTab, ci_strParameter, ci_callback) {
    var m_objMenuData = [];
    m_objMenuData.MainMenuCode = ci_strMainMenuCode || '';
    m_objMenuData.MenuCode = ci_strMenuCode || '';
    m_objMenuData.Parameter = ci_strParameter || '';
    m_objMenuData.TreeID = 'div_Menu_' + m_objMenuData.MainMenuCode;
    m_objMenuData.IsOpenTab = false;
    if (ci_bIsOpenTab != undefined) {
        m_objMenuData.IsOpenTab = ci_bIsOpenTab;
    }

    if (m_objMenuData.MainMenuCode == '_url') {
        openTab(m_objMenuData.MainMenuCode, m_objMenuData.MenuCode, '', m_objMenuData.MenuCode);
        return;
    }

    selectMainMenu(m_objMenuData.MainMenuCode);

    if (m_objMenuData.MainMenuCode != '') {
        $('#div_MenuTree > div').hide();
        var m_objMenu = $('#div_MenuTree').find('div[id=div_Menu_' + m_objMenuData.MainMenuCode + ']');
        if (m_objMenu.length > 0) {
            m_objMenu.show();
            m_objMenu.accordion('resize');
            openMenu();
            _callback();
        }
        else {
            m_objMenu = $('<div id="div_Menu_' + m_objMenuData.MainMenuCode + '" class="easyui-accordion"></div>').appendTo('#div_MenuTree');
            m_objMenu.accordion({ fit: true }).css('background', '#e1e1e1');
            postData({
                url: 'DcCdMenu',
                params: { Action: "usermenu", mainmenu: m_objMenuData.MainMenuCode },
                success: function(ci_result) {
                    if (ci_result.rows != undefined) {
                        if (ci_result.rows.length > 0) {
                            for (var i = 0; i < ci_result.rows.length; i++) {
                                var m_objData = ci_result.rows[i];
                                m_objMenu.accordion('add', {
                                    id: m_objData.id,
                                    title: m_objData.text,
                                    selected: false,
                                    attributes: m_objData.attributes
                                });
                                if (m_objData.children != undefined && m_objData.children.length > 0) {
                                    var m_objCMenu = $('<ul id="ul_' + m_objMenuData.MainMenuCode + '_' + m_objData.id + '" class="easyui-tree"></ul>');
                                    $.each(m_objData.children, function() {
                                        this.text = '<div class="menutext">' + this.attributes.title + '</div>';
                                    });
                                    m_objCMenu.tree({
                                        data: m_objData.children,
                                        animate: true,
                                        onLoadError: function() { $.messager.alert('提示', '读取失败', 'error'); },
                                        onBeforeSelect: function() {
                                            $('#div_MenuTree').find('.tree-node-selected').removeClass('tree-node-selected');
                                            return true;
                                        },
                                        onClick: function(node) {
                                            openTab(m_objMenuData.MainMenuCode, node.id, node.attributes.title, node.attributes.openUrl, node.attributes.iconUrl);
                                        }
                                    });
                                    m_objCMenu.appendTo($('<div class="treeChild"></div>').appendTo(m_objMenu.accordion('getPanel', i)));
                                    openMenu();
                                }
                            }
                            $('.treeParentText').css('background-position-x', '10px');
                            $('.accordion-header').css({
                                backgroundColor: '#c2a08f'
                            });
                            _callback();
                        }
                    }
                }
            });
        }

        function _callback() {
            if (ci_bIsOpenTab != undefined) {
                try {
                    ci_callback();
                }
                catch (ex) { }
            }
        }
    }

    function openMenu() {
        if (m_objMenuData.MenuCode != '') {
            var m_objPanel = $('#' + m_objMenuData.TreeID).accordion('panels');
            if (m_objPanel.length > 0) {
                for (var i = 0; i < m_objPanel.length; i++) {
                    var m_objTree = $(m_objPanel[i]).find('ul[id^=ul_' + m_objMenuData.MainMenuCode + '_]');
                    if (m_objTree.length > 0) {
                        var m_objData = $(m_objTree[0]).tree('getRoots');
                        for (var j = 0; j < m_objData.length; j++) {
                            if (m_objData[j].id == m_objMenuData.MenuCode) {
                                $('#' + m_objMenuData.TreeID).accordion('select', i);
                                $(m_objTree[0]).tree('select', m_objData[j].target);
                                openTab(m_objMenuData.MainMenuCode, m_objMenuData.MenuCode, m_objData[j].attributes.title, m_objData[j].attributes.openUrl, m_objData[j].attributes.iconUrl, true, m_objMenuData.Parameter);
                                m_objTree.parent().animate({ scrollTop: $(m_objData[j].target).height() * j }, 'normal');
                                return;
                            }
                        }
                    }
                }
            }
        }
    }
}

function createMenuTree2(ci_strMainMenuCode, ci_strMenuCode) {
    top.location.search = 'p=' + base64encode(ci_strMainMenuCode + getSeparativeSign() + ci_strMenuCode);
}

function selectMainMenu(ci_iItemID) {
    selectedMenu($('#mainMenu').find('#' + ci_iItemID));
    var m_objItem = $('#' + ci_iItemID);
    if (m_objItem.length > 0) {
        $('body').layout('panel', 'west').panel('setTitle', $('#mainMenu').menu('getItem', m_objItem[0]).text);
    }
}

function showGuide(ci_strMenuCode) {
    if (ci_strMenuCode == 'Desktop' && _bShowGuide) {
        postData({
            url: "DcCdUserSettingManage",
            params: { Action: "GetList", iUserID: _objUserData.iUserID, iType: (top._objUserData.iOrgType == 1 ? 2 : 1) },
            success: function(ci_result) {
                var m_objData = { id: 0, display: true };
                if (existData(ci_result)) {
                    m_objData.id = ci_result.rows[0].iSettingID
                    if (ci_result.rows[0].iValue1 > 0) {
                        m_objData.display = false;
                        _bShowGuide = false;
                    }
                }
                if (m_objData.display) {
                    openGuide(m_objData.id);
                }
            }
        });
    }
}

function openGuide(ci_iID) {
    var m_div = $('#div_Guide');
    if (m_div.length == 0) {
        m_div = $('<div id="div_Guide" style="background-color: #fff; position: absolute;z-index: 10000; top: 0px; left: 0px; width: 100%; height: 100%;"></div>').appendTo('#div_Content');
    }
    m_div.html('<iframe scrolling="yes" frameborder="0" style="width:100%;height:100%;" src="crm/Guide' + (top._objUserData.iOrgType == 1 ? 'Private' : '') + '.html' + (ci_iID == undefined ? '' : '#ID=' + ci_iID) + '"></iframe>');
}

function getHashList() {
    var args = [];
    var query = location.hash;
    var pairs = query.split("&");
    for (var i = 0; i < pairs.length; i++) {
        var pos = pairs[i].indexOf('=');
        if (pos == -1) continue;
        args.push([pairs[i].substring(0, pos), unescape(pairs[i].substring(pos + 1))]);
        //args[pairs[i].substring(0, pos)] = unescape(pairs[i].substring(pos + 1));
    }
    return args;
}
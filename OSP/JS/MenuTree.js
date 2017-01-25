var _iSelected = -1;
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

    var m_iIndex = getTabIndex(m_objTab.TabID);
    if (m_iIndex >= 0) {
        $('#div_Tab').tabs('select', m_iIndex);
        if (m_objTab.Parameter != '') {
            setTabHtml(m_objTab.MenuCode, m_objTab.NewOpenUrl);
        }
    }
    else {
        var m_strMenuText = "";
        if (m_objTab.Img != "") {
            m_strMenuText += '<img src="' + m_objTab.Img + '" class="itemimg" alt="" />';
        }
        else {
            m_strMenuText += '<img src="Image/c5.png" class="itemimg" alt="" />';
        }
        m_strMenuText += '<div class="itemtext" title="' + m_objTab.TabName + '">' + m_objTab.TabName + '</div>';
        if (m_objTab.Closable) {
            m_strMenuText += '<span class="itemclose" title="关闭页面" onclick="closethis(\'' + m_objTab.TabID + '\');"></span>';
        }
        $('#mm').menu('appendItem', {
            text: m_strMenuText,
            id: 'item_' + m_objTab.MenuCode,
            name: m_objTab.TabName
        });
        $('#div_Tab').tabs('add', {
            title: m_objTab.TabName,
            closable: m_objTab.Closable,
            id: m_objTab.TabID,
            content: '<iframe id="ifr_' + m_objTab.MenuCode + '" scrolling="yes" frameborder="0" style="width:100%;height:100%;"></iframe>',
            attributes: { treeID: m_objTab.MainMenuCode, menuID: m_objTab.MenuCode, openUrl: m_objTab.OpenUrl }
        });
        var m_iframe = $('#ifr_' + m_objTab.MenuCode);
        if (m_iframe.length > 0) {
            m_iframe.attr("src", m_objTab.NewOpenUrl);
        }
    }
}

function setTabHtml(ci_strMenuID, ci_strOpenUrl) {
    var m_tab = $('#tab_' + ci_strMenuID)
    if (m_tab.length > 0) {
        m_tab.html('<iframe id="ifr_' + ci_strMenuID + '" scrolling="yes" frameborder="0"  src="' + ci_strOpenUrl + '" style="width:100%;height:100%;"></iframe>');
    }
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
            m_objMenu.accordion({ fit: true, onSelect: function(title, index) { _iSelected = index; } }).css('minWidth', '200px').css('background', '#efefef');
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
                                    attributes: m_objData.attributes,
                                    onCollapse: function() { _iSelected = -1; }
                                });
                                if (m_objData.children != undefined && m_objData.children.length > 0) {
                                    var m_objCMenu = $('<ul id="ul_' + m_objMenuData.MainMenuCode + '_' + m_objData.id + '" class="easyui-tree"></ul>');
                                    m_objCMenu.tree({
                                        data: m_objData.children,
                                        animate: true,
                                        onLoadError: function() { $.messager.alert('提示', '读取失败', 'error'); },
                                        onClick: function(node) {
                                            openTab(m_objMenuData.MainMenuCode, node.id, node.attributes.title, node.attributes.openUrl, node.attributes.iconUrl);
                                        }
                                    });
                                    m_objCMenu.appendTo($('<div class="treeChild"></div>').appendTo(m_objMenu.accordion('getPanel', i)));
                                }
                            }
                            $('.accordion-header').css('height', 'auto');
                            $('.accordion-body').css('background', '#bfc6d0');
                            $('.tree-node').css('height', 'auto');
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
                        var m_objNode = $(m_objTree[0]).tree('find', m_objMenuData.MenuCode);
                        if (m_objNode != null && m_objNode.target != undefined) {
                            if (_iSelected != i) {
                                _iSelected = i;
                                $('#' + m_objMenuData.TreeID).accordion('select', i);
                            }
                            if ($(m_objTree[0]).tree('getSelected') == null || $(m_objTree[0]).tree('getSelected').id != m_objNode.id) {
                                $(m_objTree[0]).tree('select', m_objNode.target);
                            }
                            if (m_objMenuData.IsOpenTab) {
                                openTab(m_objMenuData.MainMenuCode, m_objMenuData.MenuCode, m_objNode.attributes.title, m_objNode.attributes.openUrl, m_objNode.attributes.iconUrl, true, m_objMenuData.Parameter);
                            }
                            return;
                        }
                    }
                }
            }
        }
    }
}
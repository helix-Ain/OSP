function platform_openSearchRefRecord(ci_iType, ci_strFun, ci_strQuery, ci_strTitle) {
    ci_iType = parseInt(ci_iType);
    ci_strFun = ci_strFun || "parent.addRefRecordText";
    ci_strTitle = ci_strTitle || '';
    if (ci_iType > 0) {
        switch (ci_iType) {
            case 1:
            case 2:
                ci_strTitle = ci_strTitle == '' ? '组织查询' : ci_strTitle;
                popupDialog(_strSysUrl + "Platform/SearchOrg.html#" + ci_strQuery, ci_strFun, ci_strTitle, true, 750, 500, 'dc-icon-search');
                break;
            case 3:
                ci_strTitle = ci_strTitle == '' ? '用户查询' : ci_strTitle;
                popupDialog(_strSysUrl + "Platform/SearchUser.html#" + ci_strQuery, ci_strFun, ci_strTitle, true, 750, 500, 'dc-icon-search');
                break;
            case 4:
                ci_strTitle = ci_strTitle == '' ? '角色查询' : ci_strTitle;
                popupDialog(_strSysUrl + "Platform/SearchUserGroup.html#" + ci_strQuery, ci_strFun, ci_strTitle, true, 750, 500, 'dc-icon-search');
                break;
            case 10:
                ci_strTitle = ci_strTitle == '' ? '部门查询' : ci_strTitle;
                popupDialog(_strSysUrl + "Platform/SearchDept.html#" + ci_strQuery, ci_strFun, ci_strTitle, true, 750, 500, 'dc-icon-search');
                break;
        }
    }
}

function openRefRecord(ci_iType, ci_iID, ci_strFun, ci_strQuery, ci_strTitle) {
    if (parseInt(ci_iID) > 0) {
        ci_iType = parseInt(ci_iType);
        ci_strFun = ci_strFun || "parent.searchData";
        ci_strQuery = ci_strQuery || '';
        ci_strTitle = ci_strTitle || '';
        if (ci_iType > 0) {
            switch (ci_iType) {
                case 1:
                    ci_strTitle = ci_strTitle == '' ? '组织详细资料' : ci_strTitle;
                    popupDialog(_strSysUrl + "BSM/UserGroupDetail.html#ID=" + ci_iID + ci_strQuery, ci_strFun, ci_strTitle, true, 750, 500, 'dc-icon-dialog-title');
                    break;
                case 2:
                    ci_strTitle = ci_strTitle == '' ? '组织详细资料' : ci_strTitle;
                    popupDialog(_strSysUrl + "Platform/UserGroupDetail.html#ID=" + ci_iID + ci_strQuery, ci_strFun, ci_strTitle, true, 750, 500, 'dc-icon-dialog-title');
                    break;
            }
        }
    }
    else {
        $.messager.alert('提示', '请选择记录', 'info');
    }
}
function bindProvinceData(ci_options) {
    if (ci_options != undefined && ci_options.controlID != undefined) {
        ci_options.valueField = ci_options.valueField || "iProvinceID";
        ci_options.textField = ci_options.textField || "cProvinceName";
        postData({
            url: 'DcCdCpcdManage',
            params: { Action: 'getprovincelist' },
            isSys: true,
            success: function(ci_result) {
                if (ci_result.rows != undefined) {
                    $.each(ci_options.controlID.split(','), function() {
                        try {
                            bindComboboxData(this, ci_result.rows, ci_options);
                        }
                        catch (ex) { }
                    });
                }
                if (ci_options.success != undefined && typeof (ci_options.success) == 'function') {
                    ci_options.success();
                }
            }
        });
    }
}

function bindCityData(ci_options) {
    if (ci_options != undefined && ci_options.controlID != undefined) {
        ci_options.valueField = ci_options.valueField || "iCityID";
        ci_options.textField = ci_options.textField || "cCityName";
        ci_options.iProvinceID = ci_options.iProvinceID || 0;
        if (!(parseInt(ci_options.iProvinceID) > 0)) {
            ci_options.iProvinceID = -1;
        }
        postData({
            url: 'DcCdCpcdManage',
            params: { Action: 'getcitylist', iProvinceID: ci_options.iProvinceID },
            isSys: true,
            success: function(ci_result) {
                if (ci_result.rows != undefined) {
                    $.each(ci_options.controlID.split(','), function() {
                        try {
                            bindComboboxData(this, ci_result.rows, ci_options);
                        }
                        catch (ex) { }
                    });
                }
                if (ci_options.success != undefined && typeof (ci_options.success) == 'function') {
                    ci_options.success();
                }
            }
        });
    }
}

function bindDistrictData(ci_options) {
    if (ci_options != undefined && ci_options.controlID != undefined) {
        ci_options.valueField = ci_options.valueField || "iDistrictID";
        ci_options.textField = ci_options.textField || "cDistrictName";
        ci_options.iCityID = ci_options.iCityID || 0;
        if (!(parseInt(ci_options.iCityID) > 0)) {
            ci_options.iCityID = -1;
        }
        postData({
            url: 'DcCdCpcdManage',
            params: { Action: 'getdistrictlist', iCityID: ci_options.iCityID },
            isSys: true,
            success: function(ci_result) {
                if (ci_result.rows != undefined) {
                    $.each(ci_options.controlID.split(','), function() {
                        try {
                            bindComboboxData(this, ci_result.rows, ci_options);
                        }
                        catch (ex) { }
                    });
                }
                if (ci_options.success != undefined && typeof (ci_options.success) == 'function') {
                    ci_options.success();
                }
            }
        });
    }
}
function bindIndustryData(ci_options) {
    if (ci_options != undefined && ci_options.controlID != undefined) {
        ci_options.valueField = ci_options.valueField || "iID";
        ci_options.textField = ci_options.textField || "cName";
        postData({
            url: 'DcCdIndustryManage',
            params: { Action: 'getlist' },
            isSys: true,
            success: function(ci_result) {
                if (existData(ci_result)) {
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
function setFieldEx(ci_options) {
    if (ci_options != undefined && ci_options.controlID != undefined && ci_options.objectCode != undefined) {
        var m_obj = $(ci_options.controlID);
        if (m_obj.length) {
            postData({
                url: 'DcCdFieldEx',
                params: { action: "GetList2", cObjectCode: ci_options.objectCode },
                isSys: true,
                success: function(ci_result) {
                    if (existData(ci_result)) {
                        var m_objHtml = [];
                        var m_iTd = 0;
                        var m_iColspan = 3;
                        var m_iMaxTd = 2;

                        $.each(m_obj.find('tr'), function() {
                            if ($(this).find('td').length > m_iMaxTd) {
                                m_iMaxTd = $(this).find('td').length;
                            }
                        });
                        if (m_iColspan + 1 > m_iMaxTd) {
                            m_iColspan = 1;
                        }

                        $.each(ci_result.rows, function() {
                            if (m_iTd == 0) {
                                m_objHtml.push('<tr>');
                            }
                            if (this.iType == 9) {
                                if (m_iTd + m_iColspan + 1 > m_iMaxTd) {
                                    m_objHtml.push('</tr>');
                                    m_objHtml.push('<tr>');
                                    m_iTd = 0;
                                }
                            }

                            m_objHtml.push('<td class="tabletext">');
                            m_objHtml.push(this.cName + '：');
                            m_objHtml.push('</td>');
                            m_iTd++;

                            if (this.iType == 9) {
                                m_objHtml.push('<td class="dcn-div" colspan="' + m_iColspan + '" name="' + this.cCode + '" field="' + this.cCode + '">');
                                m_objHtml.push('<input type="text" name="' + this.cCode + '" style="width: 550px;" ');
                                m_iTd += m_iColspan;
                            }
                            else {
                                m_objHtml.push('<td class="dcn-div" name="' + this.cCode + '" field="' + this.cCode + '">');
                                m_objHtml.push('<input type="text" name="' + this.cCode + '" style="width: 150px;" ');
                                m_iTd++;
                            }
                            switch (this.iType) {
                                case 3:
                                    m_objHtml.push('class="easyui-datebox" data-options="formatter:myDateFormatter,parser:myDateParser,editable:false,validType:\'datetime\'" />');
                                    break;
                                case 4:
                                    m_objHtml.push('class="TextEdit easyui-numberbox" data-options="min:0,precision:4" />');
                                    break;
                                case 7:
                                    m_objHtml.push('class="TextEdit easyui-numberbox" data-options="min:0,precision:0" />');
                                    break;
                                case 9:
                                    m_objHtml.push('class="TextEdit" />');
                                    break;
                            }
                            m_objHtml.push('</td>');

                            if (m_iTd + 2 > m_iMaxTd) {
                                m_objHtml.push('</tr>');
                                m_iTd = 0;
                            }
                        });
                        var m_objCtr = $(m_objHtml.join('')).appendTo(m_obj);
                        $.parser.parse(m_objCtr);
                        try {
                            m_obj.find('.dcn-div').dcndiv();
                        } catch (ex) { }
                    }
                    if (ci_options.success != undefined && typeof (ci_options.success) == 'function') {
                        ci_options.success();
                    }
                }
            });
        }
    }
}
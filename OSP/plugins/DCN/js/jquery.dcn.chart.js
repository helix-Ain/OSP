(function($) {
    function create(target) {
        //汉化图表菜单
        Highcharts.setOptions({
            lang: {
                contextButtonTitle: "图表导出菜单",
                decimalPoint: ".",
                downloadJPEG: "下载JPEG图片",
                downloadPDF: "下载PDF文件",
                downloadPNG: "下载PNG文件",
                downloadSVG: "下载SVG文件",
                drillUpText: "返回 {series.name}",
                loading: "加载中",
                months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                noData: "没有数据",
                numericSymbols: ["千", "兆", "G", "T", "P", "E"],
                printChart: "打印图表",
                resetZoom: "恢复缩放",
                resetZoomTitle: "恢复图表",
                shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                thousandsSep: ",",
                weekdays: ["星期一", "星期二", "星期三", "星期三", "星期四", "星期五", "星期六", "星期天"]
            }
        });

        var opts = $.data(target, 'dcnchart').options;
        var panel = $(target);

        panel.html('');
        panel.removeClass('dcn-chart');
        panel.addClass('dcn-chart');

        if (opts) {
            getData(target, function() { _create(); });

            function _create() {
                var m_objData = $.data(target, 'dcnchart').data;
                if (m_objData != undefined) {
                    panel.highcharts({
                        title: {
                            text: ''
                        },
                        credits: {
                            enabled: false
                        },
                        xAxis: {
                            categories: m_objData.xData
                        },
                        yAxis: {
                            title: {
                                text: ''
                            },
                            plotLines: [{ value: 0, width: 1, color: '#808080'}]
                        },
                        legend: {
                            align: 'center',
                            verticalAlign: 'top',
                            y: 10
                        },
                        series: m_objData.yData
                    });
                    while (panel.find('g.highcharts-button').length > 1) {
                        $(panel.find('g.highcharts-button')[0]).remove();
                    }
                }
            }
        }
    }

    function getData(target, callBack) {
        var opts = $.data(target, 'dcnchart').options;
        if (opts) {
            if (opts.settingCode != '') {
                if (opts.params == undefined) {
                    opts.params = { Action: 'GetData' };
                }
                opts.params.Action = 'GetData';
                opts.params.SettingCode = opts.settingCode;
                postData({
                    url: "DcCdDataGridManage",
                    params: opts.params,
                    isSys: true,
                    success: function(ci_result) {
                        if (ci_result.rows != undefined) {
                            if (opts.groupByField == '' && opts.yTitle == '') {
                                postData({
                                    url: "DcCdDataGridManage",
                                    params: { "action": "getdatagridcolumns", "DataGridCode": opts.settingCode },
                                    isSys: true,
                                    success: function(ci_result2) {
                                        var m_objCol = convertToJson(ci_result2.DcMessage);
                                        if (m_objCol.length > 0) {
                                            $.each(m_objCol, function() {
                                                if (this.field == opts.yField) {
                                                    opts.yTitle = this.title;
                                                    _setData();
                                                    return true;
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                            else {
                                _setData();
                            }

                            function _setData() {
                                var m_objData = { xData: [], yData: [] };
                                var m_objXData = [];
                                var m_objYData = new Array();
                                m_objYData[opts.yTitle] = new Array();

                                $.each(ci_result.rows, function() {
                                    switch (opts.chartType) {
                                        case 1:
                                            if (this[opts.xField] != undefined) {
                                                var m_strKey = this[opts.xField].toString();
                                                if (!in_array(m_strKey, m_objXData)) {
                                                    m_objXData.push(m_strKey);
                                                    m_objYData[opts.yTitle][m_strKey] = 0;
                                                }

                                                if (this[opts.yField] != undefined) {
                                                    if (!isNaN(this[opts.yField])) {
                                                        m_objYData[opts.yTitle][m_strKey] += parseFloat(this[opts.yField]);
                                                    }
                                                    else {
                                                        m_objYData[opts.yTitle][m_strKey]++;
                                                    }
                                                }
                                            }
                                            break;
                                    }
                                });

                                m_objData.xData = m_objXData;
                                for (var i in m_objYData) {
                                    m_objData.yData.push({ name: i, data: [] });
                                    for (var j in m_objYData[i]) {
                                        m_objData.yData[m_objData.yData.length - 1].data.push(m_objYData[i][j]);
                                    }
                                }
                                $.data(target, 'dcnchart').data = m_objData;
                                callBack();
                            }
                        }
                    }
                });
            }
        }
    }

    function in_array(stringToSearch, arrayToSearch) {
        for (s = 0; s < arrayToSearch.length; s++) {
            thisEntry = arrayToSearch[s].toString();
            if (thisEntry == stringToSearch) {
                return true;
            }
        }
        return false;
    }

    $.fn.dcnchart = function(options, param) {
        if (typeof options == 'string') {
            return $.fn.dcnchart.methods[options](this, param);
        }
        options = options || {};
        return this.each(function() {
            var state = $.data(this, "dcnchart");
            if (state) {
                if (options.yField != undefined) {
                    options.yTitle = '';
                }
                $.extend(state.options, options);
            }
            else {
                state = $.data(this, 'dcnchart', {
                    options: $.extend({}, $.fn.dcnchart.defaults, options)
                });
            }
            create(this);
        });
    };

    $.fn.dcnchart.methods = {
        options: function(jq) {
            return $.data(jq[0], "dcnchart").options;
        },
        load: function(jq) {

        }
    };

    $.fn.dcnchart.defaults = {
        chartType: 1,
        xField: '',
        yField: '',
        yTitle: '',
        groupByField: '',
        settingCode: '',
        params: null
    };

})(jQuery);
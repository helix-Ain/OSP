var m_objFileLoader = new fileLoader();
var m_objScriptList = [];
m_objScriptList.push(_strSysUrl + "plugins/fullcalendar/fullcalendar.css");
m_objScriptList.push(_strSysUrl + "plugins/fullcalendar/fullcalendar.print.css");
m_objScriptList.push(_strSysUrl + "plugins/fullcalendar/fullcalendar.min.js");

m_objFileLoader.load(m_objScriptList);

function calenderInit(ci_options) {
    if (ci_options != undefined && ci_options.controlID != undefined) {
        var m_jsonOptions = {
            defaultView: 'agendaDay',
            height: 400,
            header: { left: 'prev,next today', center: 'title', right: '' },
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
            dayNamesShort: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
            buttonText: { today: '今天', month: '月', week: '周', day: '日' },
            titleFormat: {
                month: '<b>yyyy年 MMMM</b>',
                week: " yyyy年MMM, d日[ yyyy]{ '&#8212;'[ MMM] d日}",
                day: 'yyyy年MMMd日,dddd'
            }
        }
        for (var i in ci_options) {
            if (i != "controlID") {
                m_jsonOptions[i] = ci_options[i];
            }
        }
        $('#' + ci_options.controlID).fullCalendar(m_jsonOptions);
    }
}
/**
* dcncalendar - jQuery EasyUI
* 
* Licensed under the GPL terms
* To use it on other terms please contact us
*
* Copyright(c) 2009-2012 stworthy [ stworthy@gmail.com ] 
* 
*/
(function($) {

    function setSize(target) {
        var opts = $.data(target, 'dcncalendar').options;
        var t = $(target);
        if (opts.fit == true) {
            var p = t.parent();
            opts.width = p.width();
            opts.height = p.height();
        }
        var header = t.find('.dcncalendar-header');
        t._outerWidth(opts.width);
        t._outerHeight(opts.height);
        //t.find('.dcncalendar-body')._outerHeight(t.height() - header._outerHeight());
    }

    function init(target) {
        $(target).addClass('dcncalendar').wrapInner(
				'<table cellpadding="0" cellspacing="0" border="0"><tr><td>' +
				'<div class="dcncalendar-header">' +
        //					'<div class="dcncalendar-prevday"></div>' +
        //					'<div class="dcncalendar-nextday"></div>' +
					'<div class="dcncalendar-prevmonth"></div>' +
					'<div class="dcncalendar-nextmonth"></div>' +
					'<div class="dcncalendar-prevyear"></div>' +
					'<div class="dcncalendar-nextyear"></div>' +
					'<div class="dcncalendar-title">' +
						'<span>Aprial 2010</span>' +
					'</div>' +
				'</div>' +
				'</td><td>' +
				'<div class="dcncalendar-body">' +
					'<div class="dcncalendar-menu">' +
						'<table cellpadding="0" cellspacing="0" border="0"><tr><td>' +
						'<div class="dcncalendar-menu-year-inner">' +
							'<span class="dcncalendar-menu-prev"></span>' +
							'<span><input class="dcncalendar-menu-year" type="text"></input></span>' +
							'<span class="dcncalendar-menu-next"></span>' +
						'</div>' +
						'</td><td>' +
						'<div class="dcncalendar-menu-month-inner">' +

						'</div>' +
						'</td></tr></table>' +
					'</div>' +
				'</div>' +
				'</td></tr></table>'
		);

        $(target).find('.dcncalendar-title span').hover(
			function() { $(this).addClass('dcncalendar-menu-hover'); },
			function() { $(this).removeClass('dcncalendar-menu-hover'); }
		).click(function() {
		    var menu = $(target).find('.dcncalendar-menu');
		    if (menu.is(':visible')) {
		        menu.hide();
		    } else {
		        showSelectMenus(target);
		    }
		});

        $('.dcncalendar-prevmonth,.dcncalendar-nextmonth,.dcncalendar-prevyear,.dcncalendar-nextyear', target).hover(
			function() { $(this).addClass('dcncalendar-nav-hover'); },
			function() { $(this).removeClass('dcncalendar-nav-hover'); }
		);

        $(target).find('.dcncalendar-nextday').click(function() {
            showDay(target, 1);
        });
        $(target).find('.dcncalendar-prevday').click(function() {
            showDay(target, -1);
        });
        $(target).find('.dcncalendar-nextmonth').click(function() {
            showMonth(target, 1);
        });
        $(target).find('.dcncalendar-prevmonth').click(function() {
            showMonth(target, -1);
        });
        $(target).find('.dcncalendar-nextyear').click(function() {
            showYear(target, 1);
        });
        $(target).find('.dcncalendar-prevyear').click(function() {
            showYear(target, -1);
        });

        $(target).bind('_resize', function() {
            var opts = $.data(target, 'dcncalendar').options;
            if (opts.fit == true) {
                setSize(target);
            }
            return false;
        });
    }

    /**
    * show the dcncalendar corresponding to the current month.
    */
    function showDay(target, delta) {
        var opts = $.data(target, 'dcncalendar').options;
        var dates = [];
        var lastDay = new Date(opts.year, opts.month, 0).getDate();

        var _thisday = opts.current.getDate();
        _thisday += delta;
        if (_thisday > lastDay) {
            _thisday = 1;
            opts.month++;
            if (opts.month > 12) {
                opts.year++;
                opts.month = 1;
            } else if (opts.month < 1) {
                opts.year--;
                opts.month = 12;
            }
        }
        else if (_thisday < 1) {
            opts.month--;
            if (opts.month > 12) {
                opts.year++;
                opts.month = 1;
            } else if (opts.month < 1) {
                opts.year--;
                opts.month = 12;
            }
            var prevlastday = new Date(opts.year, opts.month, 0).getDate();
            _thisday = prevlastday;
        }
        opts.current = new Date(opts.year, opts.month - 1, _thisday);
        show(target);
        opts.onSelect.call(target, opts.current);
        /*_this
        if(_thisday)
        for(var i=1; i<=lastDay; i++) dates.push([opts.year,opts.month,i]);
        var weeks = [], week = [];
        var memoDay = 0;
        while(dates.length > 0){
        var date = dates.shift();
        week.push(date);
        var day = new Date(date[0],date[1]-1,date[2]).getDay();
        if (memoDay == day){
        day = 0;
        } else if (day == (opts.firstDay==0 ? 7 : opts.firstDay) - 1){
        weeks.push(week);
        week = [];
        }
        memoDay = day;
        }
        opts.month += delta;
        if (opts.month > 12){
        opts.year++;
        opts.month = 1;
        } else if (opts.month < 1){
        opts.year--;
        opts.month = 12;
        } */

    }


    function showMonth(target, delta) {
        var opts = $.data(target, 'dcncalendar').options;
        opts.month = parseInt(opts.month) + delta;
        if (opts.month > 12) {
            opts.year++;
            opts.month = 1;
        } else if (opts.month < 1) {
            opts.year--;
            opts.month = 12;
        }
        var _thisday = opts.current.getDate();
        var lastDay = new Date(opts.year, parseInt(opts.month), 0).getDate();
        if (parseInt(_thisday) > parseInt(lastDay)) {
            _thisday = lastDay;
        }

        opts.current = new Date(opts.year, opts.month - 1, _thisday);
        opts.onSelect.call(target, opts.current);
        show(target);

        var menu = $(target).find('.dcncalendar-menu-month-inner');
        menu.find('td.dcncalendar-selected').removeClass('dcncalendar-selected');
        menu.find('td:eq(' + (opts.month - 1) + ')').addClass('dcncalendar-selected');
    }

    /**
    * show the dcncalendar corresponding to the current year.
    */
    function showYear(target, delta) {
        var opts = $.data(target, 'dcncalendar').options;
        opts.year = parseInt(opts.year) + delta;
        opts.current = new Date(opts.year, opts.month - 1, opts.current.getDate());
        show(target);
        opts.onSelect.call(target, opts.current);

        var menu = $(target).find('.dcncalendar-menu-year');
        menu.val(opts.year);
    }

    /**
    * show the select menu that can change year or month, if the menu is not be created then create it.
    */
    function showSelectMenus(target) {
        var opts = $.data(target, 'dcncalendar').options;
        $(target).find('.dcncalendar-menu').show();

        if ($(target).find('.dcncalendar-menu-month-inner').is(':empty')) {
            $(target).find('.dcncalendar-menu-month-inner').empty();
            var t = $('<table></table>').appendTo($(target).find('.dcncalendar-menu-month-inner'));
            var idx = 0;
            var tr = $('<tr></tr>').appendTo(t);
            for (var i = 0; i < 3; i++) {

                for (var j = 0; j < 4; j++) {
                    $('<td class="dcncalendar-menu-month"></td>').html(opts.months[idx++]).attr('abbr', idx).appendTo(tr);
                }
            }

            $(target).find('.dcncalendar-menu-prev,.dcncalendar-menu-next').hover(
					function() { $(this).addClass('dcncalendar-menu-hover'); },
					function() { $(this).removeClass('dcncalendar-menu-hover'); }
			);
            $(target).find('.dcncalendar-menu-next').click(function() {
                var y = $(target).find('.dcncalendar-menu-year');
                if (!isNaN(y.val())) {
                    y.val(parseInt(y.val()) + 1);
                }
            });
            $(target).find('.dcncalendar-menu-prev').click(function() {
                var y = $(target).find('.dcncalendar-menu-year');
                if (!isNaN(y.val())) {
                    y.val(parseInt(y.val() - 1));
                }
            });

            $(target).find('.dcncalendar-menu-year').keypress(function(e) {
                if (e.keyCode == 13) {
                    setDate();
                }
            });

            $(target).find('.dcncalendar-menu-month').hover(
					function() { $(this).addClass('dcncalendar-menu-hover'); },
					function() { $(this).removeClass('dcncalendar-menu-hover'); }
			).click(function() {
			    var menu = $(target).find('.dcncalendar-menu');
			    menu.find('.dcncalendar-selected').removeClass('dcncalendar-selected');
			    $(this).addClass('dcncalendar-selected');
			    setDate();
			    opts.onSelect.call(target, opts.current);
			});
        }



        function setDate() {
            var menu = $(target).find('.dcncalendar-menu');
            var year = menu.find('.dcncalendar-menu-year').val();
            var month = menu.find('.dcncalendar-selected').attr('abbr');
            if (!isNaN(year)) {
                opts.year = parseInt(year);
                opts.month = parseInt(month);
                var _thisday = opts.current.getDate();
                var lastDay = new Date(opts.year, parseInt(opts.month), 0).getDate();
                if (parseInt(_thisday) > parseInt(lastDay)) {
                    _thisday = lastDay;
                }
                opts.current = new Date(opts.year, parseInt(opts.month) - 1, _thisday);
                show(target);
            }
            menu.hide();
        }

        var body = $(target).find('.dcncalendar-body');
        var sele = $(target).find('.dcncalendar-menu');
        var seleYear = sele.find('.dcncalendar-menu-year-inner');
        var seleMonth = sele.find('.dcncalendar-menu-month-inner');

        seleYear.find('input').val(opts.year).focus();
        seleMonth.find('td.dcncalendar-selected').removeClass('dcncalendar-selected');
        seleMonth.find('td:eq(' + (opts.month - 1) + ')').addClass('dcncalendar-selected');

        sele._outerWidth(body._outerWidth());
        sele._outerHeight(body._outerHeight());
        //seleMonth._outerHeight(sele.height() - seleYear._outerHeight());
    }
    Date.prototype.toString = function() {
        return this.getFullYear() + "," + (this.getMonth() + 1) + "," + this.getDate();
    }

    function showWeek(target) {
        var opts = $.data(target, 'dcncalendar').options;
        $(target).find('.dcncalendar-title span').html(opts.months[opts.month - 1] + ' ' + opts.year);
        $(target).find('.dcncalendar-weekmenu').show();

        var Nowdate = opts.current;
        Nowdate = new Date((Nowdate / 1000 - 12 * 86400) * 1000);
        var WeekFirstDay;
        var result = "";
        var str = new Array();
        for (i = 0; i < 6; i++) {

            var WeekFirstDay = new Date(Nowdate - (Nowdate.getDay() - 1) * 86400000);
            var WeekLastDay = new Date((WeekFirstDay / 1000 + 6 * 86400) * 1000);
            var nWeekFirstDay = new Date((WeekLastDay / 1000 + 86400) * 1000);
            result += WeekFirstDay.toString() + " , ";
            Nowdate = nWeekFirstDay;
            str[i] = WeekFirstDay.toString();
        }

        var body = $(target).find('div.dcncalendar-body');
        body.find('>table').remove();
        $(target).find('.dcncalendar-menu-week-inner').empty();
        var t = $('<table cellspacing="0" cellpadding="0" border="0"></table>').appendTo($(target).find('.dcncalendar-menu-week-inner'));
        var tr = $('<tr></tr>').appendTo(t);
        for (var j = 0; j < str.length; j++) {
            $('<td class="dcncalendar-menu-week"></td>').html(str[j]).attr('abbr', str[j]).appendTo(tr);
        }

        var now = new Date();
        var today = now.getFullYear() + ',' + (now.getMonth() + 1) + ',' + now.getDate();
        t.find('td[abbr="' + today + '"]').addClass('dcncalendar-today');

        if (opts.current) {
            t.find('.dcncalendar-selected').removeClass('dcncalendar-selected');
            var current = opts.current.getFullYear() + ',' + (opts.current.getMonth() + 1) + ',' + opts.current.getDate();
            t.find('td[abbr="' + current + '"]').addClass('dcncalendar-selected');
        }

        t.find('td').hover(
			function() { $(this).addClass('dcncalendar-hover'); },
			function() { $(this).removeClass('dcncalendar-hover'); }
		).click(function() {
		    t.find('.dcncalendar-selected').removeClass('dcncalendar-selected');
		    $(this).addClass('dcncalendar-selected');
		    var parts = $(this).attr('abbr').split(',');
		    opts.year = parts[0];
		    opts.month = parseInt(parts[1]) - 1;
		    opts.current = new Date(parts[0], parseInt(parts[1]) - 1, parts[2]);
		    opts.onSelect.call(target, opts.current);
		});
    }

    function showWeekMenus(target) {
        var opts = $.data(target, 'dcncalendar').options;
        $(target).find('.dcncalendar-weekmenu').show();

        var Nowdate = opts.current;
        Nowdate = new Date((Nowdate / 1000 - 12 * 86400) * 1000);
        var WeekFirstDay;
        var result = "";
        var str = new Array();
        for (i = 0; i < 6; i++) {

            var WeekFirstDay = new Date(Nowdate - (Nowdate.getDay() - 1) * 86400000);
            var WeekLastDay = new Date((WeekFirstDay / 1000 + 6 * 86400) * 1000);
            var nWeekFirstDay = new Date((WeekLastDay / 1000 + 86400) * 1000);
            result += WeekFirstDay.toString() + " , ";
            Nowdate = nWeekFirstDay;
            str[i] = WeekFirstDay.toString();
        }

        $(target).find('.dcncalendar-menu-week-inner').empty();
        var t = $('<table></table>').appendTo($(target).find('.dcncalendar-menu-week-inner'));
        var idx = 0;
        var tr = $('<tr></tr>').appendTo(t);
        for (var j = 0; j < str.length; j++) {
            $('<td class="dcncalendar-menu-week"></td>').html(str[j]).attr('abbr', str[j]).appendTo(tr);
        }

        $(target).find('.dcncalendar-menu-week').hover(
					function() { $(this).addClass('dcncalendar-menu-hover'); },
					function() { $(this).removeClass('dcncalendar-menu-hover'); }
			).click(function() {
			    var menu = $(target).find('.dcncalendar-menu');
			    menu.find('.dcncalendar-selected').removeClass('dcncalendar-selected');
			    $(this).addClass('dcncalendar-selected');
			    setDate();
			});

    }

    /**
    * get weeks data.
    */
    function getWeeks(target, year, month) {
        var opts = $.data(target, 'dcncalendar').options;
        var dates = [];
        var lastDay = new Date(year, month, 0).getDate();
        for (var i = 1; i <= lastDay; i++) dates.push([year, month, i]);

        // group date by week
        var weeks = [], week = [];
        var memoDay = 0;
        while (dates.length > 0) {
            var date = dates.shift();
            week.push(date);
            var day = new Date(date[0], date[1] - 1, date[2]).getDay();
            if (memoDay == day) {
                day = 0;
            } else if (day == (opts.firstDay == 0 ? 7 : opts.firstDay) - 1) {
                weeks.push(week);
                week = [];
            }
            memoDay = day;
        }
        if (week.length) {
            weeks.push(week);
        }

        /* var firstWeek = weeks[0];
        if (firstWeek.length < 7){
        while(firstWeek.length < 7){
        var firstDate = firstWeek[0];
        var date = new Date(firstDate[0],firstDate[1]-1,firstDate[2]-1)
        firstWeek.unshift([date.getFullYear(), date.getMonth()+1, date.getDate()]);
        }
        } else {
        var firstDate = firstWeek[0];
        var week = [];
        for(var i=1; i<=7; i++){
        var date = new Date(firstDate[0], firstDate[1]-1, firstDate[2]-i);
        week.unshift([date.getFullYear(), date.getMonth()+1, date.getDate()]);
        }
        weeks.unshift(week);
        }
		
		var lastWeek = weeks[weeks.length-1];
        while(lastWeek.length < 7){
        var lastDate = lastWeek[lastWeek.length-1];
        var date = new Date(lastDate[0], lastDate[1]-1, lastDate[2]+1);
        lastWeek.push([date.getFullYear(), date.getMonth()+1, date.getDate()]);
        }
        if (weeks.length < 6){
        var lastDate = lastWeek[lastWeek.length-1];
        var week = [];
        for(var i=1; i<=7; i++){
        var date = new Date(lastDate[0], lastDate[1]-1, lastDate[2]+i);
        week.push([date.getFullYear(), date.getMonth()+1, date.getDate()]);
        }
        weeks.push(week);
        } */

        return weeks;
    }

    /**
    * show the dcncalendar day.
    */
    function show(target) {
        var opts = $.data(target, 'dcncalendar').options;
        $(target).find('.dcncalendar-title span').html(opts.months[opts.month - 1] + ' ' + opts.year);

        var body = $(target).find('div.dcncalendar-body');
        body.find('>table').remove();

        var t = $('<table cellspacing="0" cellpadding="0" border="0"><thead></thead><tbody></tbody></table>').prependTo(body);
        /* 		var tr = $('<tr></tr>').appendTo(t.find('thead'));
        for(var i=opts.firstDay; i<opts.weeks.length; i++){
        tr.append('<th>'+opts.weeks[i]+'</th>');
        }
        for(var i=0; i<opts.firstDay; i++){
        tr.append('<th>'+opts.weeks[i]+'</th>');
        } */
        var tr = $('<tr></tr>').appendTo(t.find('tbody'));
        switch (opts.defaultView) {
            case 'agendaDay':
                var weeks = getWeeks(target, opts.year, opts.month);
                for (var i = 0; i < weeks.length; i++) {
                    var week = weeks[i];
                    for (var j = 0; j < week.length; j++) {
                        var day = week[j];
                        $('<td class="dcncalendar-day dcncalendar-other-month"></td>').attr('abbr', day[0] + ',' + day[1] + ',' + day[2]).html(day[2]).appendTo(tr);
                    }
                }
                t.find('td[abbr^="' + opts.year + ',' + opts.month + '"]').removeClass('dcncalendar-other-month');
                if (opts.current) {
                    t.find('.dcncalendar-selected').removeClass('dcncalendar-selected');
                    var current = opts.current.getFullYear() + ',' + (opts.current.getMonth() + 1) + ',' + opts.current.getDate();
                    t.find('td[abbr="' + current + '"]').addClass('dcncalendar-selected');
                }
                break;
            case 'agendaWeek':
                var Nowdate = opts.current;
                Nowdate = new Date((Nowdate / 1000 - 12 * 86400) * 1000);
                var WeekFirstDay;
                var result = new Array();
                var str = new Array();
                for (i = 0; i < 6; i++) {

                    var WeekFirstDay = new Date(Nowdate - Nowdate.getDay() * 86400000);
                    var WeekLastDay = new Date((WeekFirstDay / 1000 + 6 * 86400) * 1000);
                    var nWeekFirstDay = new Date((WeekLastDay / 1000 + 86400) * 1000);
                    result[i] = (WeekFirstDay.getMonth() + 1) + "月" + WeekFirstDay.getDate() + "-" + (WeekFirstDay.getMonth() != WeekLastDay.getMonth() ? (WeekLastDay.getMonth() + 1) + "月" : '') + WeekLastDay.getDate();
                    Nowdate = nWeekFirstDay;
                    str[i] = WeekFirstDay.toString();
                }
                for (var j = 0; j < str.length; j++) {
                    $('<td class="dcncalendar-day"></td>').html(result[j]).attr('abbr', str[j]).appendTo(tr);
                }
                if (opts.current) {
                    t.find('.dcncalendar-selected').removeClass('dcncalendar-selected');
                    var _thisDay = new Date(opts.current - opts.current.getDay() * 86400000);
                    var current = _thisDay.getFullYear() + ',' + (_thisDay.getMonth() + 1) + ',' + _thisDay.getDate();
                    t.find('td[abbr="' + current + '"]').addClass('dcncalendar-selected');
                }

                break;
            case 'month':
                idx = 0;
                for (var j = 0; j < 12; j++) {
                    $('<td class="dcncalendar-day"></td>').html(opts.months[idx++]).attr('abbr', opts.year + ',' + idx + ',1').appendTo(tr);
                }
                if (opts.current) {
                    t.find('.dcncalendar-selected').removeClass('dcncalendar-selected');
                    var current = opts.current.getFullYear() + ',' + (opts.current.getMonth() + 1) + ',1';
                    t.find('td[abbr="' + current + '"]').addClass('dcncalendar-selected');
                }
                break;
        }


        var now = new Date();
        var today = now.getFullYear() + ',' + (now.getMonth() + 1) + ',' + now.getDate();
        t.find('td[abbr="' + today + '"]').addClass('dcncalendar-today');



        t.find('td').hover(
			function() { $(this).addClass('dcncalendar-hover'); },
			function() { $(this).removeClass('dcncalendar-hover'); }
		).click(function() {
		    t.find('.dcncalendar-selected').removeClass('dcncalendar-selected');
		    $(this).addClass('dcncalendar-selected');
		    var parts = $(this).attr('abbr').split(',');
		    opts.year = parts[0];
		    opts.month = parts[1];
		    opts.current = new Date(parts[0], parseInt(parts[1]) - 1, parts[2]);
		    if (opts.defaultView == 'agendaWeek') {
		        show(target);
		    }
		    opts.onSelect.call(target, opts.current);
		});
    }

    $.fn.dcncalendar = function(options, param) {
        if (typeof options == 'string') {
            return $.fn.dcncalendar.methods[options](this, param);
        }

        options = options || {};
        return this.each(function() {
            var state = $.data(this, 'dcncalendar');
            if (state) {
                $.extend(state.options, options);
            } else {
                state = $.data(this, 'dcncalendar', {
                    options: $.extend({}, $.fn.dcncalendar.defaults, $.fn.dcncalendar.parseOptions(this), options)
                });
                init(this);
            }
            if (state.options.border == false) {
                $(this).addClass('dcncalendar-noborder');
            }
            setSize(this);
            show(this);
            $(this).find('div.dcncalendar-menu').hide(); // hide the dcncalendar menu
        });
    };

    $.fn.dcncalendar.methods = {
        options: function(jq) {
            return $.data(jq[0], 'dcncalendar').options;
        },
        resize: function(jq) {
            return jq.each(function() {
                setSize(this);
            });
        },
        moveTo: function(jq, date) {
            return jq.each(function() {
                $(this).dcncalendar({
                    year: date.getFullYear(),
                    month: date.getMonth() + 1,
                    current: date
                });
            });
        },
        changeView: function(jq, viewName) {
            return jq.each(function() {
                $(this).dcncalendar({
                    defaultView: viewName
                });
            });
        }
    };

    $.fn.dcncalendar.parseOptions = function(target) {
        var t = $(target);
        return $.extend({}, $.parser.parseOptions(target, [
			'width', 'height', { firstDay: 'number', fit: 'boolean', border: 'boolean' }
		]));
    };

    $.fn.dcncalendar.defaults = {
        defaultView: 'agendaDay',
        width: 180,
        height: 180,
        fit: false,
        border: true,
        firstDay: 0,
        weeks: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        current: new Date(),
        onSelect: function(date) { }
    };
})(jQuery);

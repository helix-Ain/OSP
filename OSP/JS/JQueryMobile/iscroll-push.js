(function(window, document, Math) {
    function IScrollPush(ci_content, ci_options) {
        var me = this;
        var content = ci_content;
        content.addClass('iscroll-push-content');
        var scroller = $('<div class="iscroll-push-scroller"></div>').appendTo(content);
        var pullDown = $('<div class="ub ub-pc c-gra iscroll-push-updown"></div>').appendTo(scroller);
        pullDown.append($('<div class="pull-icon down-icon"></div>'));
        var pullDownL = $('<div>下拉刷新</div>').appendTo(pullDown);
        this.dataContent = $('<ul data-role="listview"></ul>').appendTo(scroller).listview();
        var pullUp = $('<div class="ub ub-pc c-gra iscroll-push-updown"></div>').appendTo(scroller);
        pullUp.append($('<div class="pull-icon up-icon"></div>'));
        var pullUpL = $('<div>上拉显示更多...</div>').appendTo(pullUp);

        var options = ci_options || {};
        var direction = 2;  //0：上拉刷新；1：下拉刷新；2：双向刷新
        if (options.direction) {
            direction = options.direction;
        }

        var loadingStep = 0; //加载状态0默认，1显示加载状态，2执行加载数据，只有当为0时才能再次加载，这是防止过快拉动刷新

        pullDown['class'] = pullDown.attr('class');
        pullDown.attr('class', '').hide();
        pullUp['class'] = pullUp.attr('class');
        pullUp.attr('class', '').hide();

        function pullDownAction() {//下拉事件
            setTimeout(function() {
                if (options.pullDownEvent) {
                    options.pullDownEvent();
                }
                pullDown.removeClass('loading');
                pullDownL.html('下拉显示更多...');
                pullDown['class'] = pullDown.attr('class');
                pullDown.attr('class', '').hide();
                me.iscroller.refresh();
                loadingStep = 0;
            }, 1000); //1秒
        }

        function pullUpAction() {//上拉事件
            setTimeout(function() {
                if (options.pullUpEvent) {
                    options.pullUpEvent();
                }

                pullUp.removeClass('loading');
                pullUpL.html('上拉显示更多...');
                pullUp['class'] = pullUp.attr('class');
                pullUp.attr('class', '').hide();
                me.iscroller.refresh();
                loadingStep = 0;
            }, 1000);
        }

        this.iscroller = new IScroll($(content)[0], {
            probeType: 2, //probeType：1对性能没有影响。在滚动事件被触发时，滚动轴是不是忙着做它的东西。probeType：2总执行滚动，除了势头，反弹过程中的事件。这类似于原生的onscroll事件。probeType：3发出的滚动事件与到的像素精度。注意，滚动被迫requestAnimationFrame（即：useTransition：假）。
            scrollbars: true, //有滚动条
            mouseWheel: true, //允许滑轮滚动
            fadeScrollbars: true, //滚动时显示滚动条，默认影藏，并且是淡出淡入效果
            bounce: true, //边界反弹
            interactiveScrollbars: true, //滚动条可以拖动
            shrinkScrollbars: 'scale', // 当滚动边界之外的滚动条是由少量的收缩。'clip' or 'scale'.
            click: true, // 允许点击事件
            keyBindings: true, //允许使用按键控制
            momentum: true// 允许有惯性滑动
        });

        //滚动时
        this.iscroller.on('scroll', function() {
            if (loadingStep == 0 && !pullDown.attr('class').match('flip|loading') && !pullUp.attr('class').match('flip|loading')) {
                if (this.y > 5 && (direction == 1 || direction == 2)) {
                    //下拉刷新效果                    
                    pullDown.attr('class', pullUp['class']);
                    pullDown.show();
                    me.iscroller.refresh();
                    pullDown.addClass('flip');
                    pullDownL.html('准备刷新...');
                    loadingStep = 1;
                } else if ((this.y == 0 || this.y < (this.maxScrollY - 5)) && (direction == 0 || direction == 2)) {
                    //上拉刷新效果
                    pullUp.attr('class', pullUp['class']);
                    pullUp.show();
                    me.iscroller.refresh();
                    pullUp.addClass('flip');
                    pullUpL.html('准备刷新...');
                    loadingStep = 1;
                }
            }
        });

        //滚动完毕
        this.iscroller.on('scrollEnd', function() {
            if (loadingStep == 1) {
                if (pullUp.attr('class').match('flip|loading')) {
                    pullUp.removeClass('flip').addClass('loading');
                    pullUpL.html('Loading...');
                    loadingStep = 2;
                    pullUpAction();
                } else if (pullDown.attr('class').match('flip|loading')) {
                    pullDown.removeClass('flip').addClass('loading');
                    pullDownL.html('Loading...');
                    loadingStep = 2;
                    pullDownAction();
                }
            }
        });
    }

    IScrollPush.prototype = {
        setItem: function(data) {
            $('<li>' + data + '</li>').appendTo(this.dataContent);
        },

        setLiItem: function(data) {
            $(data).appendTo(this.dataContent);
        },

        refresh: function() {
            this.iscroller.refresh();
            this.dataContent.listview('refresh');
        },

        clear: function() {
            this.dataContent.empty();
        }
    }

    window.IScrollPush = IScrollPush;
})(window, document, Math);
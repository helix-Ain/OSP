$.extend($.fn.validatebox.defaults.rules, {
    idCard: {// 验证身份证
        validator: function(value, param) {
            if (/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/i.test(value)) {
                if (param != undefined) {
                    try {
                        if ($("#" + param[0]).datebox('getValue') == '') {
                            var m_strDate = '';
                            var m_iAdd = 2;
                            if (value.length == 15) {
                                m_iAdd = 0;
                                m_strDate = '19'
                            }
                            m_strDate += value.substring(6, 8 + m_iAdd) + '-' + value.substring(8 + m_iAdd, 10 + m_iAdd) + '-' + value.substring(10 + m_iAdd, 12 + m_iAdd);
                            $("#" + param[0]).datebox('setValue', m_strDate);
                        }
                    }
                    catch (ex) { }
                }

                return true;
            }
            return false;
        },
        message: '身份证号码格式不正确'
    },
    idCardLast: {//身份证最后4位
        validator: function(value) {
            return /^\d{3}(\d|X|x)$/i.test(value);
        },
        message: '身份证最后4位格式不正确'
    },
    minLength: {
        validator: function(value, param) {
            return value.length >= param[0];
        },
        message: '请输入至少{0}个字符.'
    },
    length: { validator: function(value, param) {
        var len = $.trim(value).length;
        return len >= param[0] && len <= param[1];
    },
        message: "输入内容长度必须介于{0}和{1}之间."
    },
    phone: {// 验证电话号码 
        validator: function(value) {
            return /^0\d{2,3}-?\d{5,9}$|^\d{5,9}$/i.test(value);
        },
        message: '格式不正确，请使用格式：020-88888888'
    },
    mobile: {// 验证手机号码 
        validator: function(value) {
            return /^1(3|4|5|7|8)\d{9}$/i.test(value);
        },
        message: '格式不正确，请使用格式：13688888888'
    },
    phoneOrMobile: {//验证手机或电话
        validator: function(value) {
            return /^1(3|4|5|7|8)\d{9}$/i.test(value) || /^0\d{2,3}-?\d{5,9}$|^\d{5,9}$/i.test(value);
        },
        message: '格式不正确，请使用格式：13688888888 或 020-8888888'
    },
    number: {// 验证数字 
        validator: function(value) {
            return /^[0-9]+d*$/i.test(value);
        },
        message: '请输入数字'
    },
    intOrFloat: {// 验证整数或小数 
        validator: function(value) {
            return /^d+(.d+)?$/i.test(value);
        },
        message: '请输入数字'
    },
    currency: {// 验证货币 
        validator: function(value) {
            return /^d+(.d+)?$/i.test(value);
        },
        message: '货币格式不正确'
    },
    qq: {// 验证QQ,从10000开始 
        validator: function(value) {
            return /^[1-9]d{4,9}$/i.test(value);
        },
        message: 'QQ号码格式不正确'
    },
    integer: {// 验证整数 
        validator: function(value) {
            return /^[+]?[1-9]+d*$/i.test(value);
        },
        message: '请输入整数'
    },
    age: {// 验证年龄
        validator: function(value) {
            return /^(?:[1-9][0-9]?|1[01][0-9]|150)$/i.test(value);
        },
        message: '请输入0到150之间的整数'
    },

    chinese: {// 验证中文 
        validator: function(value) {
            return /^[Α-￥]+$/i.test(value);
        },
        message: '请输入中文'
    },
    english: {// 验证英语 
        validator: function(value) {
            //return /^[A-Za-z]+$/i.test(value);
            return /^[\x00-\xff]*$/i.test(value);
        },
        message: '请输入英文'
    },
    unnormal: {// 验证是否包含空格和非法字符 
        validator: function(value) {
            return /.+/i.test(value);
        },
        message: '输入值不能为空和包含其他非法字符'
    },
    username: {// 验证登录ID 
        validator: function(value) {
            return /^[a-zA-Z0-9_]{3,15}$/i.test(value);
        },
        message: '登录ID不正确(由3到15个字符组成，允许字母数字下划线)'
    },
    faxNo: {// 验证传真 
        validator: function(value) {
            return /^(((d{2,3}))|(d{3}-))?((0d{2,3})|0d{2,3}-)?[1-9]d{6,7}(-d{1,4})?$/i.test(value);
        },
        message: '格式不正确，请使用格式：020-88888888'
    },
    zip: {// 验证邮政编码 
        validator: function(value) {
            return /^[1-9]d{5}$/i.test(value);
        },
        message: '邮政编码格式不正确'
    },
    ip: {// 验证IP地址 
        validator: function(value) {
            return /d+.d+.d+.d+/i.test(value);
        },
        message: 'IP地址格式不正确'
    },
    name: {// 验证姓名，可以是中文或英文 
        validator: function(value) {
            return /^[Α-￥]+$/i.test(value) | /^w+[ws]+w+$/i.test(value);
        },
        message: '姓名不正确'
    },
    msn: {
        validator: function(value) {
            return /^w+([-+.]w+)*@w+([-.]w+)*.w+([-.]w+)*$/.test(value);
        },
        message: '请输入有效的msn账号(例：abc@hotnail(msn/live).com)'
    },
    samePassword: {
        validator: function(value, param) {
            if ($("#" + param[0]).val() != "") {
                return $("#" + param[0]).val() == value;
            }
            return true;
        },
        message: '两次输入的密码不一致！'
    },
    addpassword: {
        message: '密码格式不正确，请输入不少于8位的数字与字母组合的密码',
        validator: function(value, param) {
            if (param != undefined) {
                try {
                    $("#" + param[0]).validatebox({ required: m_bReturn });
                }
                catch (ex) { }
            }
            return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,}$/i.test(value);
        }
    },
    compareDate: {
        validator: function(value, ci_strID) {
            var m_strStartDate = $("#" + ci_strID[0]).combo("getValue");
            var m_strEndDate = $("#" + ci_strID[1]).combo("getValue");
            if (m_strEndDate != "" && m_strStartDate != "") {
                return m_strStartDate <= m_strEndDate;
            }
            return true;
        },
        message: '结束日期不能小于开始日期'
    },
    datetime: {
        validator: function(value, param) {
            return /^((\d{2}(([02468][048])|([13579][26]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|([1-2][0-9])))))|(\d{2}(([02468][1235679])|([13579][01345789]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|(1[0-9])|(2[0-8]))))))(\s(((0?[0-9])|([1-2][0-3]))\:([0-5]?[0-9])((\s)|(\:([0-5]?[0-9])))))?$/i.test(value);
        },
        message: '请输入正确时间格式'
    }
});
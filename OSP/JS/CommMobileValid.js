function isPhone(str) {
    return /^\d{3,4}-?\d{5,9}$|^\d{5,9}$/i.test(str);
}

function isMobile(str) {
    return /^1(3|4|5|7|8)\d{9}$/i.test(str);
}

function isPhoneOrMobile(str) {
    if (isMobile(str) || isPhone(str)) {
        return true;
    } else {
        return false;
    }
}

function isFax(str) {
    return /^(((d{2,3}))|(d{3}-))?((0d{2,3})|0d{2,3}-)?[1-9]d{6,7}(-d{1,4})?$/i.test(str);
}

function isEmail(str) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i.test(str);
}

function isQQ(str) {
    return /^[1-9]d{4,9}$/i.test(str);
}

function isPassword(str) {
    return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,}$/i.test(str);
}
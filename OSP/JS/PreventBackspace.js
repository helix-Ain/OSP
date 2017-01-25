$(document).keydown(function(e) {
    var m_bDoPrevent;
    if (e.keyCode == 8) {
        var m_obj = e.srcElement || e.target;
        if ((m_obj.tagName.toUpperCase() == 'INPUT' && (m_obj.type.toUpperCase() == 'TEXT' || m_obj.type.toUpperCase() == 'PASSWORD')) || m_obj.tagName.toUpperCase() == 'TEXTAREA'
            || (m_obj.tagName.toUpperCase() == 'DIV' && $(m_obj).attr('contentEditable'))) {
            m_bDoPrevent = m_obj.readOnly || m_obj.disabled;
        }
        else {
            m_bDoPrevent = true;
        }
    }
    else {
        m_bDoPrevent = false;
    }
    if (m_bDoPrevent) {
        e.preventDefault();
    }
});
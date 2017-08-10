function setCookie(tname,token,uname,userInfo)
{
    var exp = new Date();
    exp.setTime(exp.getTime() + 24*60*60*1000);
    document.cookie = tname+"="+token+";"+uname+"="+userInfo+";expires="+exp.toGMTString();
}

function getCookie(name)
{
    var _name = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) 
    {
        var c = ca[i].trim();
        if (c.indexOf(_name)==0) return c.substring(_name.length,c.length);
    }
    return "";
}

function delCookie(tname,uname)
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var tval=getCookie(tname);
    var uval=getCookie(uname);
    if(tval!=null&&uval!=null)
        document.cookie= tname + "="+tval+";"+uname+"="+uval+";expires="+exp.toGMTString();
}

export {setCookie,getCookie,delCookie}
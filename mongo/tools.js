// 时间格式化
function dateFormat(date) {
    var d = null;
    if (date instanceof Date) {
        d = date;
    } else {
        if (typeof date == "number" || typeof date == "string") {
            d = new Date(date);
        } else {
            console.log('你输入的值有误 请重新输入')
        }
    }
    var y = d.getFullYear();
    var m = d.getMonth() + 1;
    var day = d.getDate();

    var hours = d.getHours();
    var minute = d.getMinutes();
    var second = d.getSeconds();

    function retuen(r) {
        if (r < 10) {
            return r = '0' + r;
        } else {
            return r;
        }
    }
    m = retuen(m);
    day = retuen(day);
    hours = retuen(hours);
    minute = retuen(minute);
    second = retuen(second);
    return `${y}年${m}月${day}日 ${hours}:${minute}:${second}`
}


//ip地址
function ipFormat(str) {
    // ::ffff:127.0.0.1
    var reg = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
    var arr = reg.exec(str);
    return arr[0];
}

// id的处理
function idFormat(id) {
    return id.replace(/\"/g, '');
}



function time(date) {
    date = date.getTime()
    var newd = new Date().getTime()

    var diffTime = (newd - date) / 1000

    var day = parseInt(diffTime / (24 * 60 * 60));//计算整数天数
    var afterDay = diffTime - day * 24 * 60 * 60;//取得算出天数后剩余的秒数
    var hour = parseInt(afterDay / (60 * 60));//计算整数小时数
    var afterHour = diffTime - day * 24 * 60 * 60 - hour * 60 * 60;//取得算出小时数后剩余的秒数
    var min = parseInt(afterHour / 60);//计算整数分
    var afterMin = diffTime - day * 24 * 60 * 60 - hour * 60 * 60 - min * 60;//取得算出分后剩余的秒数
    if (afterMin < 60) {
        return '刚刚'
    } else if (diffTime > 60) {
        return min + '分钟前'
    }
}


















module.exports = {
    dateFormat,
    ipFormat,
    idFormat,
    time
};
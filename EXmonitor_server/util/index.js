const addDays = (days) => {
    const nowTime = new Date().getTime();
    const newDate = new Date(nowTime + days * 24 * 60 * 60 * 1000);
    const year = newDate.getFullYear();
    let month = newDate.getMonth() + 1;
    let day = newDate.getDate();

    // 格式化日期字符串
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    return `${year}-${month}-${day}`;
}

export default {
    addDays,
}
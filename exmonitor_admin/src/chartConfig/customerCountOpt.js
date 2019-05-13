export const customerCountOpt = (param) => {
    const series = param.map((item, index) => {
        return {
            type: 'line',
            name: !!item[0].hour ? ["今日", "昨日"][index] : ["当月", "上月"][index],
            data: item.map(item => item.count),
        }
    });
    let legend = {};
    if (param[0][0].hour) {
        legend = {
            data: param.length > 1 ? ["今日", "昨日"] : ["今日"],
        }
    } else {
        legend = {
            data: param.length > 1 ? ["当月", "上月"] : ["当月"],
        }
    }
    return {
        color: ['#1890ff', 'rgb(46, 199, 201)'],
        tooltip: {
            trigger: 'axis',
            confine: true,
            axisPointer: {
                type: 'line',
            },
        },
        toolbox: {
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                restore: {},
                saveAsImage: {},
                
            },
            iconStyle: {
                borderColor: '#1890ff',
            }
        },
        legend,
        grid: {
            containLabel: true,
            left: '3%',
            // bottom: '0%',
        },
        xAxis: [
            {
                type: 'category',
                name: '时间',
                data: param[0].map(item => {
                    if (item.day) {
                        return `${item.day}`
                    }
                    return `${item.hour}:00`;
                }),
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: "#1890ff",
                        type: "dashed"
                    }
                },
                axisTick: {
                    show: false,
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '访问量',
                max: 'dataMax',
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: "#1890ff",
                        type: "dashed"
                    }
                },
                axisTick: {
                    show: false,
                },
                splitLine: {
                    show: false
                },
                minInterval: 1,
            }
        ],
        dataZoom: [
            {
                type: 'slider',
                show: true,
            }
        ],
        series,
    }
}
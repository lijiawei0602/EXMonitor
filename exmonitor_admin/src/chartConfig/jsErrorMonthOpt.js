export const jsErrorMonthOpt = (param) => {
    // rgb(59,192,193)
    return {
        color: ['#1890ff'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
            },
            confine: true,
        },
        grid: {
            containLabel: true,
            left: '3%',
            bottom: '15%',
        },
        xAxis: [
            {
                type: 'category',
                data: param.map(item => item.day.slice(5)),
                axisTick: {
                    alignWithLabel: true,

                },
                axisLine: {
                    lineStyle: {
                        color: '#1890ff',
                        type: 'dashed',
                    }
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '数量',
                max: "dataMax",
                splitLine: {
                    show: false,
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: "#1890ff",
                        type: "dashed"
                    }
                },
            }
        ],
        series: [
            {
                name: '异常数量',
                type: 'bar',
                data: param.map(item => item.count),
            },
        ]
    }
}

export const jsErrorMonthLineOpt = (param) => {
    return {
        color: ['#1890ff'],
        tooltip: {
            trigger: 'axis',
            confine: true,
            axisPointer: {
                type: 'line',
            },
        },
        legend: {
            data: ["当月"],
        },
        grid: {
            containLabel: true,
            left: '3%',
            bottom: '15%',
        },
        xAxis: [
            {
                type: 'category',
                data: param.map(item => item.day.slice(5)),
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
                name: '数量',
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
            }
        ],
        series: [
            {
                type: 'line',
                name: '当月',
                data: param.map(item => item.count),
                // smooth: 0.1,
            },
        ]
    }
}
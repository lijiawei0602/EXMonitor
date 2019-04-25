const jsErrorMonthOpt = (param) => {
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
            bottom: '20%',
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

export default jsErrorMonthOpt;
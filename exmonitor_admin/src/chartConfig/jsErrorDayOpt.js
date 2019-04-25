const jsErrorDayOpt = (param) => {
    return {
        color: ['#1890ff', '#AEC5EB'],
        tooltip: {
            trigger: 'axis',
            confine: true,
        },
        legend: {
            data: ["今日", "一周前"],
        },
        grid: {
            containLabel: true,
            left: '3%',
            bottom: '20%',
        },
        xAxis: [
            {
                type: 'category',
                data: param['today'].map(item => `${item.hour}:00`),
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: "#666",
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
                        color: "#666",
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
                name: '今日',
                data: param['today'].map(item => item.count),
                smooth: true,
            },
            {
                type: 'line',
                name: '一周前',
                data: param['sevenAgo'].map(item => item.count),
                smooth: true,
            }
        ]
    }
}

export default jsErrorDayOpt;
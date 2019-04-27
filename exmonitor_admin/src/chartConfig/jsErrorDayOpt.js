const jsErrorDayOpt = (param) => {
    return {
        color: ['#1890ff', '#AEC5EB', 'rgb(42,34,51,.5)'],
        tooltip: {
            trigger: 'axis',
            confine: true,
        },
        legend: {
            data: ["今日", "昨天", "一周前"],
        },
        grid: {
            containLabel: true,
            left: '3%',
            bottom: '15%',
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
                // smooth: 0.5,
            },
            {
                type: 'line',
                name: '昨天',
                data: param['previous'].map(item => item.count),
                // smooth: 0.5,
            },
            {
                type: 'line',
                name: '一周前',
                data: param['sevenAgo'].map(item => item.count),
                // smooth: 0.5,
            }
        ]
    }
}

export default jsErrorDayOpt;
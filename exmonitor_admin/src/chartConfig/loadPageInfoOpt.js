export const loadPageInfoOpt = (param) => {
    return {
        color: ['#1890ff', 'rgb(63, 163, 114)'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
            },
        },
        legend: {
            data: param.map(item => {
                return item.simpleUrl;
            }),
        },
        grid: {
            containLabel: true,
            left: '0%',
            bottom: '5%',
        },
        toolbox: {
            show: true,
            feature: {
                saveAsImage: {},
            },
        },
        xAxis: {
            type: 'value',
            name: '毫秒/ms',
            axisLine: {
                lineStyle: {
                    color: '#1890ff',
                    type: 'dashed',
                }
            },
            splitLine: {
                show: false,
            },
        },
        yAxis: {
            type: 'category',
            data: ['解析DOM树结构', '页面加载完成', '内容加载完成'],
            axisLine: {
                lineStyle: {
                    color: '#1890ff',
                    type: 'dashed',
                }
            },
        },
        series: param.map(item => {
            return {
                name: item.simpleUrl,
                type: 'bar',
                data: [item.domReady, item.loadPage, item.resource],
                label: {
                    normal: {
                        show: true,
                        textBorderColor: '#333',
                        textBorderWidth: 1
                    },
                },
            }
        })
    };
}
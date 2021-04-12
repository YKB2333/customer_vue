export default function salesChart() {
    // 绘制图表
    if (this.salesList.scope.length == 12) {
        var xAxisData = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
    } else {
        var xAxisData = getDaysOfMonth(this.salesList.time.year, this.salesList.time.month)
    }
    let yAxisData = ['0', '50', '100']
    let blueData = clearNegative(this.salesList.scope)
    let greenData = clearNegative(this.salesList.lastScope)
    let ratioScope = this.salesList.ratioScope
    let tunit = this.MONEY_PERMISSION.includes(this.authType) ? '万元' : '万件'
    let rateTitle = this.year_month_active == 0 ? '同比' : '环比'
    console.log(ratioScope);

    window.onresize = this.salesChartObject.resize; // 适应屏幕放大缩小
    var that = this
    this.salesChartObject.setOption({
        // 图表背景颜色
        backgroundColor: "white",
        // 图表位置
        grid: {
            top: "10%",
            left: "14%",
            right: "5%",
            bottom: "20%",
        },
        tooltip: {
            trigger: 'axis',
            // formatter: '{b0}: {c0}<br />{b1}: {c1}'
            formatter: function (params) {
                // let sum = greenData.reduce( (total, num) => Number(total) +Number(num) ) 
                if (that.salesList.scope.length == 12) {
                    var result = params[0].name + "月<br>";
                } else {
                    var result = params[0].name + "日<br>";
                }
                params.forEach((item) => {
                    console.info(item)
                    if (item.value) {
                        if (['上年', '上月'].includes(item.seriesName)) {
                            result += `${rateTitle} : ${Number(ratioScope[item.dataIndex])} % </br>`
                            result += `${item.marker} ${item.seriesName} : ${formattedMoneyData(item.value)}` + tunit + `</br>`;
                        } else {
                            result += `${item.marker} ${item.seriesName} : ${formattedMoneyData(item.value)}` + tunit + `</br>`;
                        }
                    } else {
                        if (['上年', '上月'].includes(item.seriesName)) {
                            result += `${rateTitle} : ${Number(ratioScope[item.dataIndex])} % </br>`
                            result += `${item.marker} ${item.seriesName} : 0</br>`;
                        } else {
                            result += `${item.marker} ${item.seriesName} : 0 </br>`;
                        }
                    }
                });
                return result;
            },
            extraCssText: 'z-index: 998'
        },
        xAxis: [{
            type: "category",
            // 是否留白
            boundaryGap: false,
            axisLine: {
                show: true,
                onZero: true,
                // 字体颜色
                lineStyle: {
                    type: 'solid',
                    color: 'rgba(108, 123, 138, 0.08)'
                },
            },
            axisTick: {
                show: false,
            },
            axisPointer: {
                label: {
                    formatter: (params) => {
                        if (this.salesList.scope.length == 12) {
                            return params.value + '月'
                        }
                        return params.value + '日'
                    }
                }
            },
            data: formattingText(xAxisData)
        }],
        yAxis: [{
            type: 'value',
            nameGap: 5,
            minInterval: 1, //设置成1保证坐标轴分割刻度显示成整数。
            splitLine: {
                lineStyle: {
                    type: 'solid',
                    color: 'rgba(108, 123, 138, 0.1)'
                }
            },

            axisLabel: {
                // align:'left'
                fontSize: 13,
                fontWeight: "bold",
                verticalAlign: 'bottom',
                padding: [8, 0],
                formatter: function (value, index) {
                    return value = (value / 10000);
                }
            },
            axisTick: {
                show: true,
                length: 35,
                lineStyle: {
                    color: 'rgba(108, 123, 138, 0.1)'
                }
            },
            // 标尺线
            axisLine: {
                show: false,
                onZero: true,
                lineStyle: {
                    color: "#6c7b8ab0"
                },
            },

        }],

        series: [
            // 绿色
            {
                name: this.salesList.scope.length == 12 ? '上年' : '上月',
                type: "line",
                smooth: true, //是否平滑
                // symbol:'none',// 不要折线圆点
                symbol: "circle", //拐点设置为实心
                symbolSize: 3, //拐点大小
                itemStyle: {
                    normal: {
                        color: "#4ce4f8", //拐点颜色
                        // borderColor:'white',//拐点边框颜色
                        borderWidth: 3, //拐点边框大小
                        boxShadow: "0px 4px 8px 0px rgba(25,137,250,0.3)",
                        lineStyle: {
                            color: "#4ce4f8"
                        }
                    },
                    emphasis: {
                        color: "white",
                        borderColor: "#4ce4f8"
                    }
                },
                lineStyle: {
                    normal: {
                        width: 3,
                        color: "#4ce4f8",
                        shadowColor: "rgba(0, 0, 0, .3)",
                    }
                },
                data: greenData
            },
            // 蓝色
            {
                name: this.salesList.scope.length == 12 ? '本年' : '本月',
                type: "line",
                smooth: true, //是否平滑
                color: "#376ed8",
                symbol: "circle", //拐点设置为实心
                symbolSize: 3, //拐点大小
                itemStyle: {
                    normal: {
                        color: "#376ed8", //拐点颜色
                        borderWidth: 3, //拐点边框大小
                        boxShadow: "0px 4px 8px 0px rgba(25,137,250,0.3)",
                        lineStyle: {
                            color: "#1989FA"
                        }
                    },
                    emphasis: {
                        color: "white",
                        borderColor: "#1989FA"
                    }
                },
                lineStyle: {
                    type: 'solid',
                    normal: {
                        width: 3,
                        color: "#376ed8",
                        shadowColor: "rgba(0, 0, 0, .3)",
                    }
                },
                areaStyle: {
                    color: new this.$echarts.graphic.LinearGradient(
                        0,
                        0,
                        0,
                        1,
                        [{
                            offset: 0,
                            color: "rgba(181, 195, 247,0.9)"
                        },
                        {
                            offset: 1,
                            color: "rgba(108,80,243,0)"
                        }
                        ],
                        false
                    ),
                    shadowColor: "rgba(181, 195, 247,0.9)",
                    shadowBlur: 20,
                },
                data: blueData,
            },

        ]
    }, true);
}
//  格式化=字体
function formattingText(arr) {
    return arr.map((item, index) =>
        item = {
            value: item,
            textStyle: {
                fontSize: 14,
                color: '#959CA7',
                padding: 4
            }
        }
    )
}

// 获取最大的数组 生成标点
function maxArray(arr) {
    var max = Math.max(...arr);
    let Array = []
    if (!max) return
    arr.forEach(item => {
        if (item == max) item = { value: item, itemStyle: { color: 'white', }, symbolSize: 9 }
        Array.push(item)
    });
    return Array
}

function getDaysOfMonth(year, month) {
    var date = new Date(year, month, 0);
    var days = date.getDate();
    var MonthDays = []
    for (var a = 1; a <= days; a++) {
        MonthDays.push(a);
    }
    return MonthDays
}

function clearNegative(arr, type) {
    if (!arr) return []
    return arr.map(key => {
        //   if(key > 0) {
        return parseInt(key)
        //   }else{
        // return 0
        //   }
    })
}
import numbro from 'numbro';

function formattedMoneyData(number, mantissa = 2) {
    // return numbro(number).format({
    //   thousandSeparated: true,
    //   mantissa: mantissa
    // })

    if (!Number(number)) return 0
    if (Math.abs(number).toString().split('.')[0].length < 5) {
        number = number / 10000
        return numbro(number).format({
            thousandSeparated: true,
            mantissa: 4
        })
    }
    number = number / 10000
    return numbro(number).format({
        thousandSeparated: true,
        mantissa: mantissa
    })
}
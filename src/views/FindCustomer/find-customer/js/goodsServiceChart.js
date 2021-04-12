export default function goodsServiceChart() {
    // 基于准备好的dom，初始化echarts实例
    // 颜色列表
    var barTopColor =this.goodsService.map(key => key.color)
    // 绘制图表
    window.onresize = this.salesDepartmentObject.resize; // 适应屏幕放大缩小
    this.goodsServiceObject.setOption({
        // 位置
        grid:{
            left:'18',
            right:'18',
            top:29,
            height:201
        },
        xAxis: {
            // 坐标轴类型- 类目轴
            type: 'category',
            // 坐标轴轴线相关设置
            axisLabel: {  
                interval:0,  
            },
            axisLine: {
                show: true,
                // 字体颜色
                lineStyle: {
                    width:1,
                    type: 'solid',
                    color: '#cdd0d8',
                }
            },
            // 坐标轴刻度相关设置
            axisTick: {
                show: false,
            },
            // 类目数据
            data: formattingText(this.goodsService.map(key => key.name)) 
        },
        yAxis: {
            show: false,
        },
        // 系列列表。每个系列通过 type 决定自己的图表类型
        series: [
            // 灰色背景
            {
                // 数值
                data: [100,100,100,100],
                type: 'custom',
                color: '#f2f4f9',
                barWidth: '20px',
                itemStyle: {
                    barBorderRadius: [120, 120, 0, 0]
                },
            },
            // 柱图
            {
                type: 'bar',
                data: this.goodsService.map(key => key.value),
                barWidth: '20px',
                stack: 'one', //堆叠
                barGap: '-100%',
                showBackground: true,
                backgroundStyle: {
                    color: '#f2f4f9',
                    barBorderRadius: [120, 120, 0, 0]
                },
                itemStyle: {
                    normal: {
                        // 颜色
                        color: (params) => {
                            return new this.$echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [{
                                    offset: 1,
                                    color: barTopColor[params.dataIndex]
                                }]
                            );
                        },
                        barBorderRadius: [30, 30, 0, 0]
                    },
                },
                label: {
                    normal: {
                        show: true,
                        fontSize: 12,
                        fontWeight: 'bold',
                        color: '#959CA7',
                        position: 'top',
                        formatter: (val) => {
                            return `${val.value}%`;
                        }
                    }
                }
            },
        ]
    }, true);
}

function formattingText(arr){
    return arr.map(item => 
        item = {
            value:item,
            textStyle: {
                fontSize: 12,
                color: '#6B7178',
                lineHeight:15,
                padding:4
            }
        }

    )
}
export default function salesDepartmentChart() {
    // 基于准备好的dom，初始化echarts实例
    var colorList=['#f1bb4c', '#afa3f5', '#3feed4', '#3bafff', "#4DC0FF","#98ACCD"];
    // let value =  this.salesDepartment.filter(item => item.value)
    let selesData = this.salesDepartmentList 
    window.onresize = this.salesDepartmentObject.resize; // 适应屏幕放大缩小

    this.salesDepartmentObject.setOption({
        title: {
            text: '销售分布',
            subtext: '100%',
            x: '49%',
            y: '43%',
            textAlign: "center",
            textStyle: {
                fontSize:16,
                fontWeight:'normal',
                color: ['#393C41']
            },
            subtextStyle: {
                color: '#C7CBD3',
                fontSize: 14
            },
        },
        grid: {
            left:18,
            right:18,
            bottom: 15,
        },
        series: [
            // 主要展示层的
            {
                radius: ['31%', '46%'],
                center: ['50%', '50%'],
                type: 'pie',
                minShowLabelAngle:'1',
                avoidLabelOverlap:true,
                stillShowZeroSu:true,
                clickable:false,
                itemStyle: {
                    normal: {
                        color: (params)=> {
                            return this.salesDepartmentList.find(item => item.name == params.name) && this.salesDepartmentList.find(item => item.name == params.name).color 
                        }
                    }
                },
                legendHoverLink:false,
                hoverAnimation: false,
                markLine:{
                    animation:false
                },
                markArea:{
                    silent:true
                },
                labelLine: {
                    normal: {
                        show: true,
                        length:5,
                        length2:70,
                        lineStyle: {
                            color: '#d3d3d3'
                        },
                        align: 'right'
                    },
                    color: "#000",
                    emphasis: {
                        show: true
                    }
                },
                label:{
                    normal:{
                        formatter: function(params){
                            var str = '';
                            switch(params.name){
                                case '新零售':str = '{a|}\n{nameStyle|新零售 }'+'\n{rate|'+params.value+'%}';break;
                                case '美妆ODM':str = '{b|}\n{nameStyle|美妆ODM }'+'\n{rate|'+params.value+'%}';break;
                                case '传统电商':str = '{c|}\n{nameStyle|传统电商 }'+'\n{rate|'+params.value+'%}';break;
                                case '大客户':str = '{d|}\n{nameStyle|大客户 }'+'\n{rate|'+params.value+'%}';break;
                                case 'CS':str = '{d|}\n{nameStyle|CS }'+'\n{rate|'+params.value+'%}';break;
                                case '其它':str = '{f|}\n{nameStyle|其它 }'+'\n{rate|'+params.value+'%}';break;
                            }
                            if(str == '') str =  '{f|}\n{nameStyle|'+ params.name +' }'+'\n{rate|'+params.value+'%}'
                            return str
                        },
                        // 文字
                        padding: [0,-60],
                        height: 45,
                        rich: {
                            a: {
                                width:0,
                                height:0,
                                lineHeight: 0,
                                align: 'left'
                            },
                            b: {
                                width:0,
                                height:0,
                                lineHeight: 0,
                                align: 'left'
                            },
                            c: {
                                width:0,
                                height:0,
                                lineHeight: 0,
                                align: 'left'
                            },
                            d: {
                                width:0,
                                height:0,
                                lineHeight: 0,
                                align: 'left'
                            },
                            f: {
                                width:0,
                                height:0,
                                lineHeight: 0,
                                align: 'left'
                            },
                            nameStyle: {
                                fontSize: 12,
                                color: "#555",
                                align: 'left',
                                lineHeight:'25'
                            },
                            rate: {
                                fontSize: 12,
                                color: "#959CA7",
                                align: 'left',
                            },
                        }
                    }
                },
                data: selesData,
            },
            // 内边框的设置
            {
                radius: ['0%', '36%'],
                center: ['50%', '50%'],
                type: 'pie',
                label: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: false
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: false
                    }
                },
                animation: false,
                tooltip: {
                    show: false
                },
                itemStyle: {
                    normal: {
                        color:'rgba(250,250,250,0.5)'
                    }
                },
                data: [{
                    value: 1,
                }],
            },
        ]
    }, true);
}

function randomColor() {
    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);
    return `rgba(${r},${g},${b},0.8)`;
}
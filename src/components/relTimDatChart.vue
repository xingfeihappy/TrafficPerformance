<template>
<section>
    <el-row>
        <el-col>
            <div div id="relTimDatChart"style="width:100%; height:400px;" class="chart-content"></div>
        </el-col>
    </el-row>
</section>  
</template>

<<script>
export default {
  data(){
        return {}
  },
    methods:{
        darwRelTimDatChart(){
                let relTimDatChart = echarts.init(document.getElementById('relTimDatChart'));
                let option = {
                    title: {
                        text: '实时数据展示'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#283b56'
                            }
                        }
                    },
                    legend: {
                        data:['百公里油耗', '百公里标准煤']
                    },
                    dataZoom: {
                        show: false,
                        start: 0,
                        end: 100
                    },
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: true,
                            data: (function (){
                                var now = new Date();
                                var res = [];
                                var len = 10;
                                while (len--) {
                                    res.unshift(now.toLocaleTimeString().replace(/^\D*/,''));
                                    now = new Date(now - 2000);
                                }
                                return res;
                            })()
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            scale: true,
                            name: '百公里油耗',
                            max: 30,
                            min: 0,
                            boundaryGap: [0.2, 0.2]
                        },
                        {
                            type: 'value',
                            scale: true,
                            name: '百公里标准煤',
                            max: 1200,
                            min: 0,
                            boundaryGap: [0.2, 0.2]
                        }
                    ],
                    series: [
                        {
                            name:'百公里标准煤',
                            type:'bar',
                            yAxisIndex: 1,
                            data:(function (){
                                var res = [];
                                var len = 10;
                                while (len--) {
                                    res.push(Math.round(Math.random() * 1000));
                                }
                                return res;
                            })()
                        },
                        {
                            name:'百公里油耗',
                            type:'line',
                             smooth: true,
                            data:(function (){
                                var res = [];
                                var len = 0;
                                while (len < 10) {
                                    res.push((Math.random()*10 + 5).toFixed(1) - 0);
                                    len++;
                                }
                                return res;
                            })()
                        }
                    ]
                };
                app.count = 11;
                setInterval(function (){
                    var axisData = (new Date()).toLocaleTimeString().replace(/^\D*/,'');

                    var data0 = option.series[0].data;
                    var data1 = option.series[1].data;
                    data0.shift();
                    data0.push(Math.round(Math.random() * 1000));
                    data1.shift();
                    data1.push((Math.random() * 10 + 5).toFixed(1) - 0);

                    option.xAxis[0].data.shift();
                    option.xAxis[0].data.push(axisData);
                    relTimDatChart.setOption(option);
                }, 2100);
                relTimDatChart.setOption(option);





        }
    },
    mounted:function(){
        this.darwRelTimDatChart();
    },
    updated:function(){

    }


}
</script>






<template>
<!-- 货运车辆 -->
<section class ="chart">
    <el-row>
        <el-col class = "chart-container">
            <div class =" .chart-header">
                <el-date-picker
                v-model="datTimRange"
                type="datetimerange"
                placeholder="选择时间范围">
                </el-date-picker>
            </div>
        </el-col>
    </el-row>
    <el-row>
        <el-col class = "chart-container"> 
            <div div id="relTimDatChart"style="width:100%; height:400px;" class="chart-content"></div>
        </el-col>
    </el-row>
</section>  
</template>

<script>
export default {
  data(){
        return {
            datTimRange:''
        }
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
                    calculable:true,
                    dataZoom: {
                        show: true,
                        start: 0,
                        end: 100
                    },
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: true,
                            data:["17:17:00","17:17:10","17:17:20","17:17:30","17:17:40","17:17:50","17:18:00"]
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            scale: true,
                            name: '百公里油耗',
                            max:30,
                            min: 0,
                            boundaryGap: [0.2, 0.2]
                        },
                        {
                            type: 'value',
                            scale: true,
                            name: '百公里标准煤',
                            max: 100,
                            min: 0,
                            boundaryGap: [0.2, 0.2]
                        }
                    ],
                    series: [
                        {
                            name:'百公里标准煤',
                            type:'bar',
                            yAxisIndex: 1

                        },
                        {
                            name:'百公里油耗',
                            type:'line',
                             smooth: true
  
                        }
                    ]
                };
                app.count = 11;
                relTimDatChart.setOption(option);
                $.get(this.Constant.ajaxAddress+"/relTtimeData").done(function(res){
                    console.log(res);
                    option.series[0].data = res.data[0];
                    option.series[1].data = res.data[1];
                    relTimDatChart.setOption(option);
                });


        }
    },
    mounted:function(){
        this.darwRelTimDatChart();
    },
    updated:function(){

    }


}
</script>


<style scoped lang="scss">
    .chart {
        width: 100%;
        float: left;
        .chart-container{
             background-color: #F2F2F2; 
            .chart-header{
                float: right;
                margin-bottom: 20px;
                position: relative;
            }
            .chart-content{
                overflow: hidden;
            }
        }
        
    }
    /*.chart div {
        height: 400px;
        float: left;
    }*/

    .el-col {
        padding: 20px 20px;
    }
</style>



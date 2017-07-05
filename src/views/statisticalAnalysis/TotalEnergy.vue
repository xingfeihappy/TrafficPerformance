<template>
    <section class="chart">
        <el-row> 
            <el-col class="chart-container">
                <div class="chart-header">
                    <el-date-picker
                        v-model="yearSelectValue"
                        align="right"
                        type="year"
                        placeholder="选择年">
                    </el-date-picker>
                </div>
            </el-col>
        </el-row>
        <el-row> 
            <el-col class="chart-container">
                <div id="trafficTypeEnergyLine" style="width:100%; height:400px;"></div>
            </el-col>
        </el-row>
    </section>

</template>

<script>
    import echarts from 'echarts'
    export default{
        methods:{
            drawTrafficTypeEnergyLine(){
                this.trafficTypeEnergyLine = echarts.init(document.getElementById('trafficTypeEnergyLine'));
                var option={
                    title: {
                        text: '各运输类型的总能耗变化曲线'
                    },
                    tooltip : {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },
                    legend: {
                        data:['道路客运','道路货运','公交客运','出租车运输','内河运输','海洋货运','海洋客运']
                    },
                    toolbox: {
                        feature: {
                            dataView : {show: true, readOnly: false},
                            saveAsImage: {}
                        } 
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis :[
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']
                        }
                    ],
                    yAxis :[
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'道路客运',
                            type:'line',
                            stack: '总量',
                            areaStyle: {normal: {}},
                            data:[120, 132, 101, 134, 90, 230, 210,123,324,233,123,212]
                        },
                        {
                            name:'道路货运',
                            type:'line',
                            stack: '总量',
                            areaStyle: {normal: {}},
                            data:[220, 182, 191, 234, 290, 330, 310,315,320,330,345,242]
                        },

                        {
                            name:'公交客运',
                            type:'line',
                            stack: '总量',
                            areaStyle: {normal: {}},
                            data:[150, 232, 201, 154, 190, 330, 234,213,254,320,210,122]
                        },

                        {
                            name:'出租车运输',
                            type:'line',
                            stack: '总量',
                            areaStyle: {normal: {}},
                            data:[50, 132, 101, 54, 90, 230, 134,113,154,220,110,22]
                        },

                        {
                            name:'内河运输',
                            type:'line',
                            stack: '总量',
                            areaStyle: {normal: {}},
                            data:[250, 332, 301, 254, 190, 430, 334,313,354,420,310,222]
                        },

                        {
                            name:'海洋货运',
                            type:'line',
                            stack: '总量',
                            areaStyle: {normal: {}},
                            data:[350, 432, 401, 354, 290, 530, 434,413,454,520,410,322]
                        },

                        {
                            name:'海洋客运',
                            type:'line',
                            stack: '总量',
                            areaStyle: {normal: {}},
                            data:[350, 432, 401, 354, 290, 530, 434,413,454,520,410,322]
                        },
                    ]

                }
                this.trafficTypeEnergyLine.setOption(option);
            },
            drawCharts(){
                this.drawTrafficTypeEnergyLine()
            }
        },
        mounted: function () {
            this.drawCharts();
        },
        updated: function () {
            this.drawCharts()
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
                margin-left: 20px;
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
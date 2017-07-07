<template>
    <section class="chart">
        <el-row> 
            <el-col class="chart-container">
                <div class="chart-header">
                    <el-date-picker
                        v-model="dateSelectValue"
                        type="daterange"
                        placeholder="选择日期范围"
                        :picker-options="pickerOptions2">
                    </el-date-picker>
                </div>
            </el-col>
        </el-row>
        <el-row> 
            <el-col :xs="24" :sm="24" :md="12" :lg="12" class="chart-container">                
                <div id="energyPieChart" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" class="chart-container">                
                <div id="companyChart" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>   
        </el-row>  

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
                <div id="energyByYearChart" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>
        </el-row>   
    </section>
</template>

<script>
    import echarts from 'echarts'

    const err_OK = 0;
    export default {
        data() {
            return {
                pickerOptions2: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                            text: '最近三个月',
                            onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                dateSelectValue:'',
                energySelectValue:'汽油',
                yearSelectValue:''
            }
        },
        methods: {
            drawCompanyTypeChart(){
                let companyChart = echarts.init(document.getElementById('companyChart'));
                let option = {
                    title: {
                    text: '不同规模企业单位能耗图'
                    },
                    tooltip: {},
            
                    legend: {
                        data:['单耗']
                    },
                    color: ['#3398DB'],
                    toolbox: {
                        show : true,
                        feature : {
                        mark : {show: true},
                        saveAsImage : {show: true},
                        dataView : {readOnly:false},
                        magicType : {show: true, type: ['line', 'bar']},                   
                        }
                    },
                    xAxis: {
                        data: ["一规模","二规模","三规模","四规模","五规模","六规模","七规模"]
                    },
                    yAxis: {},
                        series: [{
                        name: '单耗',
                        type: 'bar',
                        barWidth: '60%',
                        data: [45, 20, 36, 10, 28, 16,55]
                    }]
                };
                companyChart.setOption(option);
            },
            drawEnergyPieChart(){
                let energyPieChart = echarts.init(document.getElementById('energyPieChart'));
                let option={
                    title:{
                        text: '海洋客运能源结构图',
                        x: 'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['汽油','柴油','CNG','LPG','LNG','重油','电力']
                    },
                    toolbox: {
                        show : true,
                        feature : {
                            mark : {show: true},                 
                            dataView : {show: true, readOnly: false},
                            saveAsImage : {show: true},
                        }
                    },
                    series : [
                        {
                            name: '能耗',
                            type: 'pie',
                            radius : '80%',
                            center: ['50%', '50%'],
                            data:[
                                {value:535, name:'汽油'},
                                {value:410, name:'柴油'},
                                {value:474, name:'CNG'},
                                {value:235, name:'LPG'},
                                {value:200, name:'LNG'},
                                {value:354, name:'重油'},
                                {value:401,name:'电力'}
                            ].sort(function(a,b){return a.value-b.value;}),
                            roseType: 'radius',
                            label:{
                                normal:{
                                    testStyle:{
                                        color: 'rgba(255, 255, 255, 0.5)'
                                    }
                                }
                            },
                            labelLine: {
                                 normal: {
                                    smooth: 0.2,
                                    length: 10,
                                    length2: 20
                                }
                            
                            },
                            animationType: 'scale',
                            animationEasing: 'elasticOut',
                            animationDelay: function (idx) {
                                return Math.random() * 200;
                             }
                        }
                    ]
                };
                energyPieChart.setOption(option);
            },     
            drawenergyByYearChart(){
                let energyByYearChart = echarts.init(document.getElementById('energyByYearChart'));
                let colors = ['#5793f3', '#d14a61'];
                let option = {
                    color:colors,
                    title:{
                        text:'年度单耗、使用能耗关系图'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross'
                        }
                    },

                    legend: {
                        data:['单位能耗','月使用能耗']
                    },
                    xAxis: [
                        {
                            type: 'category',
                            axisPointer: {
                                type: 'shadow'
                            },
                            data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '月使用能耗(万吨标准煤)',
                            min: 0,
                            max: 500,
                            interval: 50,
                            axisLine: {
                                lineStyle: {
                                    color: '#5793f3'
                                }
                            },
                            axisLabel: {
                                formatter: '{value} '
                            }
                        },
                        {
                            type: 'value',
                            name: '单位能耗(万吨标准煤/亿人公里)',
                            min: 0,
                            max: 200,
                            axisLine: {
                                lineStyle: {
                                    color: '#d14a61'
                                }
                            },
                            axisLabel: {
                                formatter: '{value} '
                            }
                        }
                    ],
                    series: [
                        {
                            name:'月使用能耗',
                            type:'line',
                            data:[200, 220, 330, 450, 490, 102, 230, 234, 345, 165, 170, 400]
                        },
                        {
                            name:'单位能耗',
                            type:'bar',
                            data:[20, 49, 70, 130, 125, 178, 135.6, 162.2, 132, 180, 178, 145]
                        }
                    ]
                };  
                energyByYearChart.setOption(option);
            },  
            drawCharts() {
                this.drawCompanyTypeChart()
                this.drawEnergyPieChart()
                this.drawenergyByYearChart()
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
                margin-bottom: 10px;
                margin-right: 20px;
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
        padding: 15px 15px;
    }
</style>
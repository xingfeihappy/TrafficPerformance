<template>
    <section  class="chart">
        <el-row>
            <el-col class="chart-container">
                <div class="chart-header">
                    <!--<el-select v-model="timeUnitType" placeholder="查询类型" >
                        <el-option key="按年" label="按年" value="按年"></el-option>
                        <el-option key="按半年" label="按半年" value="按半年"></el-option>
                        <el-option key="按季度" label="按季度" value="按季度"></el-option>
                        <el-option key="按月" label="按月" value="按月"></el-option>
                    </el-select>                      -->
                    <el-date-picker
                        v-model="timeRange"
                        type="daterange"
                        placeholder="选择日期范围">
                    </el-date-picker>                 
                </div> 
             </el-col>
        </el-row>
        <el-row >
            <el-col :xs="24" :sm="24" :md="24" :lg="24" class="chart-container">
                <div >
                    <el-button type="text"  v-on:click="darwEngPerTimeDifChart">不同排量分散</el-button> 
                    <el-button type="text" v-on:click="darwEngPerTimeAllChart">不同排量总和</el-button>
                </div>
                <div id="engPerTimeChart" style="width:100%;height:400px;" class="chart-content"></div>
            </el-col>
        </el-row>
        <el-row >
            <el-col  class="chart-container">
                   <div id="engTypeAllChart" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>
        </el-row>
        <el-row>
             <el-col  class="chart-container">
                <div  class="chart-header">
                    <el-date-picker
                        v-model="year"
                        type="year"
                        placeholder="选择年">
                    </el-date-picker>
                </div>
             </el-col>
        </el-row>
        <el-row>
             <el-col  class="chart-container">
            <el-col class="chart-container">
                <div id="perAllRelChart"style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>
             </el-col>
        </el-row>

    </section>  
</template>

<script>
import echarts from 'echarts'
var engPerTimeChart ;
export default {
  data(){
      return {
           timeRange:'',
           year:''
      }
  },
    methods: {
        selectEnegeTypeChange(){
        },
        selectTimeUnitTypeChange(){
        },
        darwEngPerTimeDifChart(){
            if(engPerTimeChart!=null) engPerTimeChart.dispose();

            engPerTimeChart = echarts.init(document.getElementById('engPerTimeChart'));

            let option = {
                    title: {
                        text: '不同燃料类型不同排量单位能耗柱状图',
                        left:'center'
                    },
                    legend: {
                        data:['排量1', '排量2', '排量3'],
                        top : 30
                    },
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    toolbox: {
                        show : true,
                        feature : {
                        mark : {show: true},
                        saveAsImage : {show: true},
                        dataView : {readOnly:false},
                        magicType : {show: true, type: ['line', 'bar']}
                        }
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data : ['汽油', '柴油', 'CNG', 'LPG', 'LNG', '重油', '电力']
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            nameLocation : 'middle',
                            name : '单位能耗(单位：万吨标准煤/亿人公里)',
                            nameGap : 35
                        }
                    ],
                    series : [
                        {
                            name:'排量1',
                            type:'bar',
                            data:[]
                        },
                        {
                            name:'排量2',
                            type:'bar',
                            data:[]
                        
                        },
                        {
                            name:'排量3',
                            type:'bar',
                            data:[]
                        }
                    ]
            };
            engPerTimeChart.setOption(option);
            $.get("./api/busTypLenData").done(function (res){
                    console.log(1);
                    option.series[0].data = res.data[0];
                    option.series[1].data = res.data[1];
                    option.series[2].data = res.data[2];
                    engPerTimeChart.setOption(option);
            });
        },
        darwEngPerTimeAllChart(){

            if(engPerTimeChart!=null) engPerTimeChart.dispose();
            engPerTimeChart = echarts.init(document.getElementById('engPerTimeChart'));
            let option = {
                    title: {
                        text: '不同燃料类型单位能耗柱状图',
                        left:'center'
                    },

                    legend: {
                        data:['排量1', '排量2', '排量3'],
                        top : 30
                    },
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    toolbox: {
                        show : true,
                        feature : {
                        mark : {show: true},
                        saveAsImage : {show: true},
                        dataView : {readOnly:false},
                        magicType : {show: true, type: ['line', 'bar']}
                        }
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data : ['汽油', '柴油', 'CNG', 'LPG', 'LNG', '重油', '电力']
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            nameLocation : 'middle',
                            name : '单位能耗(单位：万吨标准煤/亿人公里)',
                            nameGap : 35
                        }
                    ],
                    series : [
                        {
                            name:'排量1',
                            type:'bar',
                            stack: '总量',
                            data:[]
                        },
                        {
                            name:'排量2',
                            type:'bar',
                            stack: '总量',

                            data:[]
                        
                        },
                        {
                            name:'排量3',
                            type:'bar',
                            stack: '总量',
                            tooltip:{

                            },
                            data:[]
                        }
                    ]
            };
        
            engPerTimeChart.setOption(option);
            
            $.get("./api/busTypLenData").done(function (res){
                console.log(2);
                option.series[0].data = res.data[0];
                option.series[1].data = res.data[1];
                option.series[2].data = res.data[2];
                engPerTimeChart.setOption(option)
            });


        },
    
        darwCarLenPerTimeChart(){
                let carLenPerTimeChart = echarts.init(document.getElementById('carLenPerTimeChart'));
                let  option = {
                        title: {
                            text: '相同燃料类型不同排量车辆单位能耗柱状图',
                            left:'center'
                        },

                        color: ['#3398DB'],
                        tooltip : {
                            trigger: 'axis',
                            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        toolbox: {
                            show : true,
                            feature : {
                            mark : {show: true},
                            saveAsImage : {show: true},
                            dataView : {readOnly:false},
                            magicType : {show: true, type: ['line', 'bar']}
                            }
                        },
                        xAxis : [
                            {
                                type : 'category',
                                name : '车长',
                                nameGap : 10,
                                data : ['5-7米', '8-11米', '12-14米'],
                                axisTick: {
                                    alignWithLabel: false
                                }
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value',
                                nameLocation : 'middle',
                                name : '单位能耗(单位：万吨标准煤/亿人公里)',
                                nameGap :35
                                

                            }
                        ],
                        series : [
                            {
                                type:'bar',
                                barWidth: '30%',
                                data:[334, 390, 330]
                            }
                        ]
                    };
            carLenPerTimeChart.setOption(option);
        },

        darwEngTypeAllChart(){
                let engTypeAllChart = echarts.init(document.getElementById('engTypeAllChart'));
                var option={
                        title : {
                            text: '出租车运输能源结构图饼图',
                            left:'center'
                        },
                        tooltip : {
                            trigger: 'item',
                            formatter: "{b} : {c} ({d}%)"
                        },
                        legend: {
                            x : 'center',
                            y : 'bottom'
                        },
                        toolbox: {
                            show : true,
                            feature : {
                            mark : {show: true},
                            saveAsImage : {show: true},
                            dataView : {readOnly:false}
                            }
                        },
                        calculable : true,
                        series : [
                            {
                                type:'pie',
                                radius : [20, 110],
                                center : ['50%', '50%'],
                                roseType : 'area'
                            }
                        ]
                    }
                engTypeAllChart.setOption(option);
                $.get("./api/engTypAllData").done(function(res){
                        option.series[0].data = res.data;
                        engTypeAllChart.setOption(option);
                })


        },

        darwperAllRelChart(){
                let perAllRelChart = echarts.init(document.getElementById('perAllRelChart'));
                let colors = ['#5793f3', '#d14a61'];
                let option = {
                    color:colors,
                    title:{
                        text:'年度单耗、使用能耗关系图',
                        left:'center'

                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross'
                        }
                    },
                    toolbox: {
                            show : true,
                            feature : {
                            mark : {show: true},
                            saveAsImage : {show: true},
                            dataView : {readOnly:false}
                            }
                        },
                    legend: {
                        data:['单位能耗','月使用能耗'],
                        top : 20
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
                            nameGap : 35,
                            nameLocation:'middle',
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
                            type:'line'
                        },
                        {
                            name:'单位能耗',
                            type:'bar'
                        }
                    ]
                };             
                
            perAllRelChart.setOption(option);
            $.get("./api/perAllRelData").done(function(res){
                option.series[0].data = res.data[0];
                option.series[1].data = res.data[1];
                perAllRelChart.setOption(option);
            });
        },


    },
    mounted:function(){
        this.darwEngPerTimeDifChart();
        this.darwEngTypeAllChart();
        this.darwperAllRelChart();
    },
     updated: function () {
           
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




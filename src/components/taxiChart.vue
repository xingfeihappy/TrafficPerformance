<template>
    <section class="chart" >
        <el-row  >
             <el-col :xs="24" :sm="24" :md="12" :lg="12" class="chart-container">
                  <div class="chart-header">
                        <el-select v-model="timeUnitType" placeholder="查询类型" @change="selectTimeUnitTypeChange">
                            <el-option key="按年" label="按月" value="按年"></el-option>
                            <el-option key="按半年" label="按半年" value="按半年"></el-option>
                            <el-option key="按季度" label="按季度" value="按季度"></el-option>
                            <el-option key="按月" label="按月" value="按月"></el-option>
                        </el-select>                      
                  </div>         
             </el-col>
        </el-row>
        </br>
        <el-row >
            <el-col >
                   <div id="engPerTimeChart" style="width:100%;height:300px;" class="chart-content"></div>
            </el-col>
            </br>
             <el-col >
                   <div id="carLenPerTimeChart" style="width:100%; height:300px;" class="chart-content"></div>
            </el-col>
            </br>
            <el-col >
                   <div id="engTypeAllChart" style="width:100%; height:500px;" class="chart-content"></div>
            </el-col>
            </br>
        </el-row>
        <el-row>
            <el-col>
                <div id="perAllRelChart"style="width:100%; height:300px;" class="chart-content"/>
            </el-col>
        </el-row>

    </section>  
</template>

<script>
    import echarts from 'echarts'

export default {
  data(){
      return {
           timeUnitType:'',
           selectEnegeType:''
      }
  },
    methods: {
        selectEnegeTypeChange(){
        },
        selectTimeUnitTypeChange(){
        },
        darwEngPerTimeChart(){
            let engPerTimeChart = echarts.init(document.getElementById('engPerTimeChart'));

            let  option = {
                    title: {
                        text: '不同燃料类型单位能耗柱状图',
                        left:'center'
                    },

                    color: ['#3398DB'],
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data : ['汽油', '柴油', 'CNG', 'LPG', 'LNG', '重油', '电力'],
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            type:'bar',
                            barWidth: '60%',
                            data:[1022, 52, 200, 334, 390, 330, 220]
                        }
                    ]
                };
            engPerTimeChart.setOption(option);       
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
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data : ['6米小巴', '7米中巴', '7.5米中巴', '8米中巴', 
                                    '8.5米中巴', '9米大巴', '9.5米大巴','10.5米大巴','11.5米大巴','12米大巴'],
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            type:'bar',
                            barWidth: '60%',
                            data:[102, 52, 200, 334, 390, 330, 220,370,500,400]
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
                    calculable : true,
                    series : [
                        {
                            type:'pie',
                            radius : [20, 110],
                            center : ['50%', '50%'],
                            roseType : 'area',
                            data:[
                                {value:600,name:'汽油'},
                                {value:150,name:'柴油'},
                                {value:200,name:'CNG'},
                                {value:450,name:'LPG'},
                                {value:542,name:'LNG'},
                                {value:102,name:'重油'},
                                {value:360,name:'电力'},
                            ]
                        }
                    ]
                }
        engTypeAllChart.setOption(option);
    },

    darwperAllRelChart(){
            let perAllRelChart = echarts.init(document.getElementById('perAllRelChart'));
            let colors = ['#5793f3', '#d14a61', '#675bba'];
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
            
        perAllRelChart.setOption(option);
    },


    },
    mounted:function(){
        this.darwEngPerTimeChart();
        this.darwCarLenPerTimeChart();
        this.darwEngTypeAllChart();
        this.darwperAllRelChart();
    },
     updated: function () {
           
    }
  }
</script>




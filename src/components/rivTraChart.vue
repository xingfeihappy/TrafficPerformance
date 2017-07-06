<template>
    <section class = "chart">
        <el-row>
            <el-col :xs="24" :sm="24" :md="12" :lg="12"  class="chart-container">
                  <div class="chart-header">
                        <el-select v-model="timeUnitType" placeholder="查询类型" >
                            <el-option key="按年" label="按月" value="按年"></el-option>
                            <el-option key="按半年" label="按半年" value="按半年"></el-option>
                            <el-option key="按季度" label="按季度" value="按季度"></el-option>
                            <el-option key="按月" label="按月" value="按月"></el-option>
                        </el-select>                      
                  </div>         
             </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12"  class="chart-container">
                <div class="chart-header">
                   <el-select v-model="engerType" placeholder="能源类型" >
                        <el-option key="汽油" label="汽油" value="汽油"></el-option>
                        <el-option key="柴油" label="柴油" value="柴油"></el-option>
                        <el-option key="CNG" label="CNG" value="CNG"></el-option>
                        <el-option key="LPG" label="LPG" value="LPG"></el-option>
                        <el-option key="LNG" label="LNG" value="LNG"></el-option>
                        <el-option key="重油" label="重油" value="重油"></el-option>
                        <el-option key="电力" label="电力" value="电力"></el-option>
                    </el-select>                     
                </div>         
             </el-col>
        </el-row>
        <el-row>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" class="chart-container">
                <div id="weiPerChart" style="width:80%;height:400px;" class="chart-content"></div>
            </el-col>
             <el-col :xs="24" :sm="24" :md="12" :lg="12" class="chart-container">
                 <div id="comSizPerChart" style="width:80%; height:400px;" class="chart-content"></div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" class="chart-container">
                <div id="shiTypPerChart" style="width:100%;height:400px;" class="chart-content"></div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" class="chart-container">
                   <div id="engTypeAllChart" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>
        </el-row>
        <el-row>
            <el-col  class="chart-container">
                <div class="chart-header">
                    <el-date-picker
                        v-model="yearSelectValue"
                        type="year"
                        placeholder="选择年">
                    </el-date-picker>
                </div>
                <div id="perAllRelChart"style="width:100%; height:400px;" ></div>
            </el-col>
        </el-row>
    </section>  
</template>


<script>
export default {
    data(){
        return {
            timeUnitType:'',
            engerType:'',
            yearSelectValue:''
        }
    },
    methods:{
        darwWeiPerChart(){
            let weiPerChart = echarts.init(document.getElementById('weiPerChart'));
            let option = {
                    title:{
                        text:'运输单位能耗'
                    },
                    color: ['#3333DB'],
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
                            name:'吨位',
                            data : ['<1000', '1000~3000', '3000~10000', '>10000'],
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            name : '单位能耗(单位：万吨标准煤/亿吨公里)'
                        }
                    ],
                    series : [
                        {
                            type:'bar',
                            barWidth: '40%',
                            data:[250, 304, 350, 280]
                        }
                    ]
            };

            weiPerChart.setOption(option);
        },
        darwComSizPerChart(){
            let comSizPerChart = echarts.init(document.getElementById('comSizPerChart'));
            let option = {
                    title:{
                        text:'不同规模企业运输单位能耗'
                    },
                    color: ['#33554B'],
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
                            name:'企业规模',
                            data : ['规模1', '规模2', '规模3', '规模4'],
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            name : '单位能耗(单位：万吨标准煤/亿吨公里)'
                        }
                    ],
                    series : [
                        {
                            type:'bar',
                            barWidth: '40%',
                            data:[150, 304, 320, 280]
                        }
                    ]
            };
            comSizPerChart.setOption(option)
        },
        darwShiTypPerChart(){
            let shiTypPerChart = echarts.init(document.getElementById('shiTypPerChart'));
            let option = {
                    title:{
                        text:'不同规模企业运输单位能耗'
                    },
                    color: ['#33744B'],
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
                            name:'船舶类型',
                            nameGap : 0,
                            data : ['集装箱船', '散杂货船', '液体散货船', '客货船','拖船'],
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            name : '单位能耗'
                        }
                    ],
                    series : [
                        {
                            type:'bar',
                            barWidth: '40%',
                            data:[150, 304, 360, 280,200]
                        }
                    ]
            };            
            shiTypPerChart.setOption(option);
        },
        darwEngTypeAllChart(){
            let engTypeAllChart = echarts.init(document.getElementById('engTypeAllChart'));
            var option={
                    title : {
                        text: '内河运输能源结构图饼图',
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
                        min: 0,
                        max: 200,
                        nameGap : 35,
                        nameLocation:'middle',
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
        this.darwWeiPerChart();
        this.darwComSizPerChart();
        this.darwShiTypPerChart();
        this.darwEngTypeAllChart();
        this.darwperAllRelChart();
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
            #energyTypePie{
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




<template>
    <section class="chart">
        <el-row> 
            <el-col class="chart-container">
                <div class="chart-header">
                    <el-select v-model="energyTypeSelect" placeholder="选择燃料类型" >
                        <el-option key="汽油" label="汽油" value="汽油"></el-option>
                        <el-option key="柴油" label="柴油" value="柴油"></el-option>
                        <el-option key="CNG" label="CNG" value="CNG"></el-option>
                        <el-option key="LPG" label="LPG" value="LPG"></el-option>
                        <el-option key="LNG" label="LNG" value="LNG"></el-option>
                        <el-option key="重油" label="重油" value="重油"></el-option>
                        <el-option key="电力" label="电力" value="电力"></el-option>
                    </el-select>                      
                </div> 
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
                <div id="unitEnergyChart" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>
              
        </el-row>
        <el-row>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" class="chart-container">                
                <div id="distanceShipChart" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>   
            <el-col :xs="24" :sm="24" :md="12" :lg="12" class="chart-container">                
                <div id="companyChart" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>        
        </el-row>
        <el-row> 
            <el-col  class="chart-container">                
                <div id="guestChart" style="width:100%; height:400px;" class="chart-content"></div>
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
                yearSelectValue:'',
                energyTypeSelect:''
            }
        },
        methods: {
            drawGuestTypeChart(){
                let guestChart = echarts.init(document.getElementById('guestChart'));
                let option = {
                    title: {
                    text: '不同燃料类型、不同吨位车辆单位能耗图'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer : {            
                            type : 'shadow'        
                        }
                    },
            
                    legend: {
                       // orient: 'vertical',
                        //y:'bottom',
                       // x:'center',
                        data:['一吨位','二吨位','三吨位','四吨位']
                    },
                    toolbox: {
                        show : true,
                        feature : {
                        mark : {show: true},
                        dataView : {readOnly:false},
                        saveAsImage : {show: true}
                                            
                        }
                    },
                    xAxis: {
                        data: ['汽油', '柴油', 'CNG', 'LPG', 'LNG', '重油', '电力'],
                        name:'燃料类型',
                        nameGap:'10'
                    },
                    yAxis: {
                        name:'单位能耗(万吨标煤/亿吨公里)',
                        nameLocation:'middle',
                        nameGap:'40'
                    },
                    series : [
                        {
                            name:'一吨位',
                            type:'bar',
                            data:[0.123, 0.2, 0.321, 0.134,0.231,0.142,0.213]
                        },
                        {
                            name:'二吨位',
                            type:'bar',
                            data:[0.323, 0.3, 0.121, 0.231,0.131,0.242,0.243]
                        
                        },
                        {
                            name:'三吨位',
                            type:'bar',
                            data:[0.423, 0.35, 0.221, 0.331,0.251,0.122,0.343]
                        },
                        {
                            name:'四吨位',
                            type:'bar',
                            data:[0.453, 0.42, 0.241, 0.281,0.351,0.322,0.393]
                        }
                        
                    ]
                };
                guestChart.setOption(option);
               
            },
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
                        data: ["一规模","二规模","三规模","四规模","五规模","六规模","七规模"],
                        name:'规模类型',
                        nameGap:3

                    },
                    yAxis: {
                        name:'单位能耗(万吨标煤/亿吨公里)',
                        nameLocation:'middle',
                        nameGap:'40'
                    },
                        series: [{
                        name: '单耗',
                        type: 'bar',
                        barWidth: '60%',
                        data: [45, 20, 36, 10, 28, 16,55]
                    }]
                };
                companyChart.setOption(option);
            },
            drawUnitEnergyChart(){
                let unitEnergyChart = echarts.init(document.getElementById('unitEnergyChart'));
                let option = {
                    title : {
                        text: '不同车辆类型单位能耗图',
                    },
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            
                            type : 'shadow'        
                        }
                    },
                    legend: {
                       // orient: 'vertical',
                        x:'center',
                       // data:['集装箱船','干散货船','件杂货船','液体散货船','客滚船']
                       data:['单耗'] //
                    },
                    toolbox: {
                        show : true,
                        feature : {
                            dataView : {show: true, readOnly: false},
                            magicType : {show: true, type: ['line', 'bar']},     
                            saveAsImage : {show: true}
                            
                        }
                    },
                    
                    calculable : true,
                    xAxis : [
                        {
                            name:'车辆类型',
                            type : 'category',
                            nameGap:'5',
                            //data : ['<1000','1000~3000','3000~10000','>10000']
                            data: ['一类车', '二类车', '三类车', '四类车', '五类车']
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            name: '单耗(万吨标准煤/亿吨公里)',
                            nameLocation:'middle',
                            nameGap:'40'
                        }
                    ],
                    series : [
                        /*{
                            name:'集装箱船',
                            type:'bar',
                            data:[7.0, 23.2, 25.6, 76.7]
                        },
                        {
                            name:'干散货船',
                            type:'bar',
                            data:[26.4, 28.7, 70.7, 175.6]
                        
                        },
                        {
                            name:'件杂货船',
                            type:'bar',
                            data:[12.4, 24.7, 67.7, 155.6]
                        },
                        {
                            name:'液体散货船',
                            type:'bar',
                            data:[17.4, 26.7, 47.7, 55.6]
                        },
                        {
                            name:'客滚船',
                            type:'bar',
                            data:[31.4, 36.7, 40.7, 123.6]
                        },*/
                        {
                            name: '单耗',
                            type: 'bar',
                            barWidth: '40%',
                            data: [4.1, 2.3, 5.4, 2.5,1.9]
                        }
                        
                    ]
                };
                unitEnergyChart.setOption(option);
            },
            drawDistanceShipChart(){
                let distanceShipChart = echarts.init(document.getElementById('distanceShipChart'));
                let option = {
                    title: {
                    text: '不同吨位车辆单位能耗图'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer : {            
                            type : 'shadow'        
                        }
                    },
                    legend: {
                        //data:['一运距','二运距','三运距','四运距']
                        data:['单耗']//
                    },
                    toolbox: {
                        show : true,
                        feature : {
                            mark : {show: true},
                            dataView : {readOnly:false},
                            saveAsImage : {show: true},
                            magicType : {show: true, type: ['line', 'bar']}                               
                        }
                    },
                    xAxis: {
                        //data: ['汽油', '柴油', 'CNG', 'LPG', 'LNG', '重油', '电力'],
                        data:['一吨位','二吨位','三吨位','四吨位'],//
                        name:'吨位类型',
                        nameGap:'5'
                    },
                    yAxis: {
                        name:'单位能耗(万吨标煤/亿吨公里)',
                        nameLocation:'middle',
                        nameGap:'40'
                    },
                    series : [
                        /*{
                            name:'一运距',
                            type:'bar',
                            data:[0.123, 0.2, 0.321, 0.134,0.231,0.142,0.213]
                        },
                        {
                            name:'二运距',
                            type:'bar',
                            data:[0.323, 0.3, 0.121, 0.231,0.131,0.242,0.243]
                        
                        },
                        {
                            name:'三运距',
                            type:'bar',
                            data:[0.423, 0.35, 0.221, 0.331,0.251,0.122,0.343]
                        },
                        {
                            name:'四运距',
                            type:'bar',
                            data:[0.453, 0.42, 0.241, 0.281,0.351,0.322,0.393]
                        }*/
                        {
                            name: '单耗',
                            type: 'bar',
                            barWidth: '40%',
                            data: [45, 20, 36, 10]
                        }
                        
                    ]
                };
                distanceShipChart.setOption(option);
            },
            drawEnergyPieChart(){
                let energyPieChart = echarts.init(document.getElementById('energyPieChart'));
                let option={
                    title:{
                        text: '道路货运能源结构图',
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
                this.drawGuestTypeChart()
                this.drawCompanyTypeChart()
                this.drawUnitEnergyChart()
                this.drawDistanceShipChart()
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

<template>
    <section class="chart">
        <el-row> 
        <!-- 燃料类型图 -->
            <el-col :xs="24" :sm="24" :md="12" :lg="12" class="chart-container">                
               <div class="chart-header">
                    <el-select v-model="energyTypeSelectValue" placeholder="请选择" @change="energyTypeSelectChange"  >
                        <el-option key="本月" label="本月" value="本月"></el-option>
                        <el-option key="本季" label="本季" value="本季"></el-option>
                        <el-option key="半年" label="半年" value="半年"></el-option>
                        <el-option key="本年" label="本年" value="本年"></el-option>
                    </el-select>
               </div>

                <div id="barChart" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>

            <!-- 吨位车辆能耗图 -->
             <el-col :xs="24" :sm="24" :md="12" :lg="12" class="chart-container">                
               <div class="chart-header">
                    <el-select v-model="energyTypeSelectValue" placeholder="请选择" @change="energyTypeSelectChange"  >
                        <el-option key="本月" label="本月" value="本月"></el-option>
                        <el-option key="本季" label="本季" value="本季"></el-option>
                        <el-option key="半年" label="半年" value="半年"></el-option>
                        <el-option key="本年" label="本年" value="本年"></el-option>
                    </el-select>
               </div>

                <div id="barChartPeople" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>
        </el-row>
        <el-row>
        <!-- 企业能耗图 -->
            <el-col :xs="24" :sm="24" :md="12" :lg="12" class="chart-container">    <div class="chart-header">
                    <el-select v-model="energyTypeSelectValue" placeholder="请选择" @change="energyTypeSelectChange"  >
                        <el-option key="本月" label="本月" value="本月"></el-option>
                        <el-option key="本季" label="本季" value="本季"></el-option>
                        <el-option key="半年" label="半年" value="半年"></el-option>
                        <el-option key="本年" label="本年" value="本年"></el-option>
                    </el-select>
                     <el-select v-model="energyTypeSelectValue" placeholder="请选择" @change="energyTypeSelectChange"  >
                        <el-option key="汽油" label="汽油" value="汽油"></el-option>
                        <el-option key="柴油" label="柴油" value="柴油"></el-option>
                        <el-option key="重油" label="重油" value="重油"></el-option>
                        <el-option key="电力" label="电力" value="电力"></el-option>
                    </el-select>
               </div>

                <div id="barChartEnterprise" style="width:100%; height:400px;" class="chart-content"></div>
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
                energyTypeSelectValue: '本月',
                energyTypeUrl : './api/energyTypeMonth'
            }
        },
        methods: {
            energyTypeSelectChange(){
                let value= this.energyTypeSelectValue;
                if(value === "本月"){
                    this.energyTypeUrl = './api/energyTypeMonth';
                }else if(value === "本季"){
                    this.energyTypeUrl = './api/energyTypeQuater';
                }else if(value === "本年"){
                    this.energyTypeUrl = './api/energyTypeYear';
                }
            },
            drawEnergyTypePie(){
                let barChart = echarts.init(document.getElementById('barChart'));
                 
                let option = {
                    title : {
                        text: '燃料类型图',
                        // subtext: '演示用例',
                        x:'left'
                    },
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['最高','最低']
                    },
                    toolbox: {
                        show : true,
                        feature : {
                            mark : {show: true},
                            dataView : {readOnly:false},
                            magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    calculable : true,
                    dataZoom : {
                        show : true,
                        realtime : true,
                        start : 40,
                        end : 60
                    },
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : true,
                            data : function (){
                                var list = [];
                                for (var i = 1; i <= 30; i++) {
                                    list.push('2013-03-' + i);
                                }
                                return list;
                            }()
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'最高',
                            type:'line',
                            data:function (){
                                var list = [];
                                for (var i = 1; i <= 30; i++) {
                                    list.push(Math.round(Math.random()* 30) + 30);
                                }
                                return list;
                            }()
                        },
                        {
                            name:'最低',
                            type:'bar',
                            data:function (){
                                var list = [];
                                for (var i = 1; i <= 30; i++) {
                                    list.push(Math.round(Math.random()* 10));
                                }
                                return list;
                            }()
                        }
                    ]
                };
                barChart.setOption(option);
                barChart.on('click',function(param) {
                    var mes = '【' + param.type + '】';
                    if (typeof param.seriesIndex != 'undefined') {
                        mes += '  seriesIndex : ' + param.seriesIndex;
                        mes += '  dataIndex : ' + param.dataIndex;
                    }
                    if (param.type == 'hover') {
                        alert('Event Console : ' + mes);
                    }
                    else {
                        alert(mes);
                    }
                    console.log(param);
                })
            },
            drawEnergyTypePie1(){
                var barChart = echarts.init(document.getElementById('barChartPeople'));
                 
                var option = {
                    title:{
                        text:'吨位车辆能耗图'
                    },
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['能耗']
                    },
                    toolbox: {
                        show : true,
                        feature : {
                            mark : {show: true},
                            dataView : {readOnly:false},
                            magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    xAxis : {
                        data:["3人","6人","8人","10人","15人","20人","25人","30人"]
                    },
                    yAxis :{},
                    series : [
                        {
                            name:'功耗',
                            type:'bar',
                            data:[5,20,36,10,33,3,5,7]
                        }
                    ]
                };
                barChart.setOption(option);
            },
            drawEnergyTypePie2(){
                var barChart = echarts.init(document.getElementById('barChartEnterprise'));
                 
                var option = {
                    title:{
                        text:'企业能耗图'
                    },
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['能耗']
                    },
                    toolbox: {
                        show : true,
                        feature : {
                            mark : {show: true},
                            dataView : {readOnly:false},
                            magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    xAxis : {
                        data:["小型","中型","大型"]
                    },
                    yAxis :{},
                    series : [
                        {
                            name:'功耗',
                            type:'bar',
                            data:[5,20,36]
                        }
                    ]
                };
                barChart.setOption(option);
            },
           
            drawCharts() {
                this.drawEnergyTypePie();
                this.drawEnergyTypePie1();
                this.drawEnergyTypePie2();
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

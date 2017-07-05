<template>
    <section class="chart">
        <el-row> 
            <el-col :xs="24" :sm="24" :md="12" :lg="12" class="chart-container">                
               <div class="chart-header">
                    <el-select v-model="energyTypeSelectValue" placeholder="请选择" @change="energyTypeSelectChange"  >
                        <el-option key="本月" label="本月" value="本月"></el-option>
                        <el-option key="本季" label="本季" value="本季"></el-option>
                        <el-option key="本年" label="本年" value="本年"></el-option>
                    </el-select>
               </div>

                <div id="energyChart" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>

            <el-col :xs="24" :sm="24" :md="12" :lg="12" class="chart-container">                
               <div class="chart-header">
                    <el-select v-model="tonnageTypeSelectValue" placeholder="请选择" @change="tonnageTypeSelectChange"  >
                        <el-option key="本月" label="本月" value="本月"></el-option>
                        <el-option key="本季" label="本季" value="本季"></el-option>
                        <el-option key="本年" label="本年" value="本年"></el-option>
                    </el-select>
               </div>

                <div id="tonnageChart" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>
        </el-row>
        <el-row> 
            <el-col :xs="24" :sm="24" :md="12" :lg="12" class="chart-container">                
               <div class="chart-header">
                    <el-select v-model="companyTypeSelectValue" placeholder="请选择" @change="companyTypeSelectChange"  >
                        <el-option key="本月" label="本月" value="本月"></el-option>
                        <el-option key="本季" label="本季" value="本季"></el-option>
                        <el-option key="本年" label="本年" value="本年"></el-option>
                    </el-select>
               </div>

                <div id="companyChart" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>

            <el-col :xs="24" :sm="24" :md="12" :lg="12" class="chart-container">                
               <div class="chart-header">
                    <el-select v-model="shipTypeSelectValue" placeholder="请选择" @change="shipTypeSelectChange"  >
                        <el-option key="本月" label="本月" value="本月"></el-option>
                        <el-option key="本季" label="本季" value="本季"></el-option>
                        <el-option key="本年" label="本年" value="本年"></el-option>
                    </el-select>
               </div>

                <div id="shipChart" style="width:100%; height:400px;" class="chart-content"></div>
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
                tonnageTypeSelectValue:'本月',
                energyTypeUrl : './api/energyTypeMonth',
                tonnageTypeUrl:'./api/energyTypeMonth'
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
            tonnageTypeSelectChange(){
                let value = this.tonnageTypeSelectValue;
                if(value === "本月"){
                    this.tonnageTypeUrl = './api/energyTypeMonth';
                }else if(value === "本季"){
                    this.tonnageTypeUrl = './api/energyTypeQuater';
                }else if(value === "本年"){
                    this.tonnageTypeUrl = './api/energyTypeYear';
                }
            },
            companyTypeSelectChange(){},
            shipTypeSelectChange(){},

            drawEnergyTypePie(){
                let energyChart = echarts.init(document.getElementById('energyChart'));
                 
                let option = {
                    title: {
                    text: '不同燃料类型单位能耗图'
                    },
                    tooltip: {},
            
                    legend: {
                        data:['单耗']
                    },
                    toolbox: {
                        show : true,
                        feature : {
                        mark : {show: true},
                        saveAsImage : {show: true},
                        dataView : {readOnly:false},
                        magicType : {show: true, type: ['line', 'bar']},
                        restore : {show: true}
                        
                        }
                    },
                    xAxis: {
                        data: ["汽油","柴油","CNG","LPG","LNG","重油","电力"]
                    },
                    yAxis: {},
                        series: [{
                        name: '单耗',
                        type: 'bar',
                        data: [5, 20, 36, 10, 10, 20,50]
                    }]
                };
                energyChart.setOption(option);
                
            },

            drawTonnageTypeChart(){
                let tonnageChart = echarts.init(document.getElementById('tonnageChart'));
                let option = {
                    title: {
                    text: '不同吨位船舶单位能耗图'
                    },
                    tooltip: {},
            
                    legend: {
                        data:['单耗']
                    },
                    toolbox: {
                        show : true,
                        feature : {
                        mark : {show: true},
                        saveAsImage : {show: true},
                        dataView : {readOnly:false},
                        magicType : {show: true, type: ['line', 'bar']},
                        restore : {show: true}
                        
                        }
                    },
                    xAxis: {
                        data: ["一等船舶","二等船舶","三等船舶","四等船舶","五等船舶"]
                    },
                    yAxis: {},
                        series: [{
                        name: '单耗',
                        type: 'bar',
                        data: [50, 40, 30, 20, 10,]
                    }]
                };
                tonnageChart.setOption(option);
            },

            drawcompanyTypeChart(){
                let companyChart = echarts.init(document.getElementById('companyChart'));
                let option = {
                    title: {
                    text: '不同规模企业单位能耗图'
                    },
                    tooltip: {},
            
                    legend: {
                        data:['单耗']
                    },
                    toolbox: {
                        show : true,
                        feature : {
                        mark : {show: true},
                        saveAsImage : {show: true},
                        dataView : {readOnly:false},
                        magicType : {show: true, type: ['line', 'bar']},
                        restore : {show: true}
                        
                        }
                    },
                    xAxis: {
                        data: ["一规模","二规模","三规模","四规模","五规模","六规模","七规模"]
                    },
                    yAxis: {},
                        series: [{
                        name: '单耗',
                        type: 'bar',
                        data: [45, 20, 36, 10, 28, 16,55]
                    }]
                };
                companyChart.setOption(option);
            },
           
            drawCharts() {
                this.drawEnergyTypePie()
                this.drawTonnageTypeChart()
                this.drawcompanyTypeChart()
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
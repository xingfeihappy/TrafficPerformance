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
            <el-col :xs="24" :sm="24" :md="8" :lg="8" class="chart-container">  
                <div id="hangZhouEnergyPie" style="width:100%; height:300px;" class="chart-content"></div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="8" :lg="8" class="chart-container">  
                <div id="ningBoEnergyPie" style="width:100%; height:300px;" class="chart-content"></div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="8" :lg="8" class="chart-container">  
                <div id="wenZhouEnergyPie" style="width:100%; height:300px;" class="chart-content"></div>
            </el-col>
        </el-row>
    </section>
</template>    

<script>
    import echarts from 'echarts'
    export default {
        data(){
            return{
                dateSelectValue:'',
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
                }
            }
        },
        methods:{
            drawHangZhouEnergyPie(){
                let hangZhouEnergyPie = echarts.init(document.getElementById('hangZhouEnergyPie'));
                let option={
                    title:{
                        text: '杭州市能耗结构图',
                        x: 'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        y:'bottom',
                        data: ['电耗','油耗','气耗']
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
                            type: 'pie',
                            radius : '80%',
                            center: ['50%', '50%'],
                            data:[],
                            roseType: 'area',
                            calculable : true,
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
                            data:[
                                {value:242,name:'电耗'},
                                {value:339,name:'油耗'},
                                {value:113,name:'气耗'},
                            ]
                            
                        }
                    ]
                };
                hangZhouEnergyPie.setOption(option);
            },
            drawNingBoEnergyPie(){
                let ningBoEnergyPie = echarts.init(document.getElementById('ningBoEnergyPie'));
                let option={
                    title:{
                        text: '宁波市能耗结构图',
                        x: 'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        y:'bottom',
                        data: ['电耗','油耗','气耗']
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
                            type: 'pie',
                            radius : '80%',
                            center: ['50%', '50%'],
                            data:[],
                            roseType: 'area',
                            calculable : true,
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
                            data:[
                                {value:218,name:'电耗'},
                                {value:250,name:'油耗'},
                                {value:109,name:'气耗'},
                            ]
                            
                        }
                    ]
                };
                ningBoEnergyPie.setOption(option);
            },
            drawWenZhouEnergyPie(){
                let wenZhouEnergyPie = echarts.init(document.getElementById('wenZhouEnergyPie'));
                let option={
                    title:{
                        text: '温州市能耗结构图',
                        x: 'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        y:'bottom',
                        data: ['电耗','油耗','气耗']
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
                            type: 'pie',
                            radius : '80%',
                            center: ['50%', '50%'],
                            data:[],
                            roseType: 'area',
                            calculable : true,
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
                            data:[
                                {value:211,name:'电耗'},
                                {value:350,name:'油耗'},
                                {value:238,name:'气耗'},
                            ]
                            
                        }
                    ]
                };
                wenZhouEnergyPie.setOption(option);
            },
            drawCharts(){
                this.drawHangZhouEnergyPie()
                this.drawNingBoEnergyPie()
                this.drawWenZhouEnergyPie()
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
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
                <div class="chart-header">
                    <el-select v-model="trafficSelectValue" placeholder="请选择交通工具" @change="trafficSelectChange">
                        <el-option key="道路客运" label="道路客运" value="道路客运"></el-option>
                        <el-option key="道路货运" label="道路货运" value="道路货运"></el-option>
                        <el-option key="公交客运" label="公交客运" value="公交客运"></el-option>
                        <el-option key="出租车运输" label="出租车运输" value="出租车运输"></el-option>
                        <el-option key="内河运输" label="内河运输" value="内河运输"></el-option>
                        <el-option key="海洋货运" label="海洋货运" value="还有货运"></el-option>
                        <el-option key="海洋客运" label="海洋客运" value="海洋客运"></el-option>
                    </el-select>
                </div>
            </el-col>
        </el-row>
        <el-row> 
            <el-col class="chart-container">
                <div id="cityTypeEnergyPie" style="width:100%; height:400px;"></div>
            </el-col>
        </el-row>

    </section>
</template>

<script>
    import echarts from 'echarts'
    export default{
        data(){
            return{
                trafficSelectValue: '',
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
                },                
            }
        },
        methods:{
            trafficSelectChange(){},
            drawCityTypeEnergyPie(){
                this.cityTypeEnergyPie = echarts.init(document.getElementById('cityTypeEnergyPie'));

                var option={
                    title:{
                        text: '各个地市所占能耗图',
                        x: 'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['杭州','宁波','温州','嘉兴','湖州','绍兴','衢州','金华','舟山','台州','丽水']
                    },
                    toolbox: {
                        show : true,
                        feature : {
                            mark : {show: true},
                            dataView : {show: true, readOnly: false},
                            magicType : {
                                show: true,
                                type: ['pie', 'funnel']
                            },
                            saveAsImage : {show: true}
                        }
                    },
                    series : [
                        {
                            name: '能耗',
                            type: 'pie',
                            radius : '80%',
                            center: ['50%', '50%'],
                            data:[
                                {value:535, name:'杭州'},
                                {value:410, name:'宁波'},
                                {value:474, name:'温州'},
                                {value:235, name:'嘉兴'},
                                {value:200, name:'湖州'},
                                {value:354, name:'绍兴'},
                                {value:259, name:'衢州'},
                                {value:359, name:'金华'},
                                {value:289, name:'舟山'},
                                {value:179, name:'台州'},
                                {value:159, name:'丽水'}
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

                }
                this.cityTypeEnergyPie.setOption(option);
            },
            drawCharts(){
                this.drawCityTypeEnergyPie()
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
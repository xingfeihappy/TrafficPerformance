<template>
    <section class="chart">
        <el-row> 
            <el-col class="chart-container">
                <div class="chart-header">
                    <el-date-picker
                        v-model="dateSelectValue"
                        type="date"
                        placeholder="选择日期"
                       :picker-options="pickerOptions0">
                        </el-date-picker>
                </div>
                <div class="chart-header">
                    <el-select v-model="citySelectValue" placeholder="请选择城市" @change="citySelectChange">
                        <el-option key="杭州" label="杭州" value="杭州"></el-option>
                        <el-option key="宁波" label="宁波" value="宁波"></el-option>
                        <el-option key="温州" label="温州" value="温州"></el-option>
                        <el-option key="嘉兴" label="嘉兴" value="嘉兴"></el-option>
                        <el-option key="湖州" label="湖州" value="湖州"></el-option>
                        <el-option key="绍兴" label="绍兴" value="绍兴"></el-option>
                        <el-option key="金华" label="金华" value="金华"></el-option>
                        <el-option key="衢州" label="衢州" value="衢州"></el-option>
                        <el-option key="舟山" label="舟山" value="舟山"></el-option>
                        <el-option key="台州" label="台州" value="台州"></el-option>
                        <el-option key="丽水" label="丽水" value="丽水"></el-option>
                    </el-select>
                </div>
            </el-col>
        </el-row>

        <el-row> 
            <el-col class="chart-container">
                <div id="trafficTypeEnergyPie" style="width:100%; height:400px;"></div>
            </el-col>
        </el-row>
    </section>
</template>

<script>
    import echarts from 'echarts'
    export default{
        data(){
            return{
                citySelectValue: '杭州'
            }
        },
        methods:{
            citySelectChange(){},
            drawTrafficTypeEnergyPie(){
                this.trafficTypeEnergyPie = echarts.init(document.getElementById('trafficTypeEnergyPie'));

                var option={
                    title:{
                        text: '各运输类型所占能耗图',
                        x: 'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['道路客运','道路货运','公交客运','出租车运输','内河运输','海洋货运','海洋客运']
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
                                {value:335, name:'道路客运'},
                                {value:310, name:'道路货运'},
                                {value:274, name:'公交客运'},
                                {value:235, name:'出租车运输'},
                                {value:400, name:'内河运输'},
                                {value:354, name:'海洋货运'},
                                {value:459, name:'海洋客运'}
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
                this.trafficTypeEnergyPie.setOption(option);
            },
            drawCharts(){
                this.drawTrafficTypeEnergyPie()
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
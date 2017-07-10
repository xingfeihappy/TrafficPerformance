<template>
    <section class="chart">
        <el-row> 
        <!-- 能源类型图 -->
            <el-col :xs="24" :sm="24" :md="12" :lg="12" class="chart-container">                
               <div class="chart-header" style="opacity:0;">
                    <el-select v-model="energyTypeSelectValue" placeholder="请选择" @change="energyTypeSelectChange"  >
                        <el-option key="本月" label="本月" value="本月"></el-option>
                        <el-option key="本季" label="本季" value="本季"></el-option>
                        <el-option key="本年" label="本年" value="本年"></el-option>
                    </el-select>
               </div>

                <div id="energyTypePie" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>
            <!-- 能源分时图 -->
             <el-col :xs="24" :sm="24" :md="12" :lg="12" class="chart-container">                
               <div class="chart-header">
                    <el-select v-model="energyTypeSelectValue" placeholder="请选择" @change="energyTypeSelectChange"  >
                        <el-option key="本月" label="本月" value="本月"></el-option>
                        <el-option key="本季" label="本季" value="本季"></el-option>
                        <el-option key="本年" label="本年" value="本年"></el-option>
                    </el-select>
               </div>

                <div id="barChart" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>
        </el-row>
    </section>
</template>

<script>
    import echarts from 'echarts'

    const err_OK = 0;
    var currentEnergy = -1;
    export default {
        data() {
            return {
                energyTypeSelectValue: '本月',
                energyTypeUrl : './api/energyTypeMonth',
                // energyUseUrl:'./api/energyTotalUse'
                energyUseUrl:'./api/electric'
            }
        },
        watch:{
            energyUseUrl: function(curVal,oldVal){
　　　　　　　　　　alert(curVal+"---"+oldVal);
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
            // currentEnergyChange(){
            //     alert("111")
            //     let value= this.currentEnergy;
            //     if(value === 0){
            //         this.energyUseUrl = './api/electric';
            //     }
            //     alert(value);
            // },
            drawEnergyTypePie(){//饼图
                 this.energyTypePie = echarts.init(document.getElementById('energyTypePie'));
                 
                var option={
                    title : {
                        text: '能源类型图',
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        x : 'center',
                        y : 'bottom',
                        data:['rose1','rose2','rose3','rose4','rose5','rose6','rose7','rose8']
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
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    calculable : true,
                    series : [
                       
                        {
                            name:'面积模式',
                            type:'pie',
                            radius : [40, 145],
                            center : ['50%', '50%'],
                            roseType : 'area',
                            data:[]
                        }
                    ]
                }
                this.energyTypePie.setOption(option);
                var _this = this;
                console.log(this.energyTypeUrl);
                $.get(this.energyTypeUrl).done(function (res) {
                    if(res.errno ===  err_OK){
                        console.log(res.data);
                        var data = res.data;
                        _this.energyTypePie.setOption({
                            series : [
                                {
                                    data: data
                                }
                            ]
                        });
                    }
                })
                // 饼图的点击事件  获取当前点击是哪个能源
                 this.energyTypePie.on('click',function(param) {
                    var mes = '【' + param.type + '】';
                   currentEnergy = param.dataIndex;
                   alert("饼图被点击"+currentEnergy);
                   // currentEnergyChange();
                   let value= currentEnergy;
                   if(value == '0'){
                    // this.energyUseUrl = './api/electric';
                    this.energyUseUrl = './api/energyTotalUse';
                    alert(this.energyUseUrl)
                   }
                })
            },

             drawEnergyTypeLine(){//柱状图
                var barChart = echarts.init(document.getElementById('barChart'));
                 
                var option = {
                    title:{
                        text:'能源分时图'
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
                    calculable : true,
                    dataZoom : {
                        show : true,
                        realtime : true,
                        start : 0,
                        end : 100
                    },
                    xAxis : {
                        data:["1","2","3","4","5","6","7","8","9","10","11","12"]
                    },
                    yAxis :{},
                    series : [
                        {
                            name:'能耗',
                            type:'bar',
                            data:[]
                        }
                    ]
                };
                barChart.setOption(option);
                var _this = this;
                $.get(this.energyUseUrl).done(function (res) {
                    if(res.errno ===  err_OK){
                        console.log(res.data);
                        var data = res.data;
                        barChart.setOption({
                            series : [
                                {
                                    data: data
                                }
                            ]
                        });
                    }
                })
                // barChart.on('click',function(param) {
                //     var mes = '【' + param.type + '】';
                //     if (typeof param.seriesIndex != 'undefined') {
                //         mes += '  seriesIndex : ' + param.seriesIndex;
                //         mes += '  dataIndex : ' + param.dataIndex;
                //     }
                //     if (param.type == 'hover') {
                //         alert('Event Console : ' + mes);
                //     }
                //     else {
                //         alert(mes);
                //     }
                //     console.log(param);
                // })
            },
           
            drawCharts() {
                this.drawEnergyTypePie()
                this.drawEnergyTypeLine()
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

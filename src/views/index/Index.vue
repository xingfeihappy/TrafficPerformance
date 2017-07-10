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
                energyUseUrl:'./api/energyTotalUse',
                barChart:null
            }
        },
        watch:{
            energyUseUrl:function(curVal,oldVal){
// 　　　　　　　　alert(curVal+"---"+oldVal);
                var _this = this;
                $.get(_this.energyUseUrl).done(function (res) {
                        // alert("饼图点击后，电力数据changed" + _this.energyUseUrl);
                        if(res.errno ===  err_OK){
                            // alert("res.data: "+res.data);
                            var data = res.data;
                            // alert("234"+_this.barChart)
                            _this.barChart.setOption({
                                series : [
                                    {
                                        data: data
                                    }
                                ]
                            });
                        }
                    })
　　　　　　　}
        },
        /*mounted(){
            this.barChart = echarts.init(document.getElementById('barChart'));
        },*/
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
                   // alert("饼图被点击"+currentEnergy);
                   // currentEnergyChange();
                   let value= currentEnergy;
                   if(value == '0'){
                    _this.energyUseUrl = './api/electric';
                   }else if(value == '1'){
                    _this.energyUseUrl = './api/diesel';
                   }else if(value == '2'){
                    _this.energyUseUrl = './api/electric';
                   }else if(value == '3'){
                    _this.energyUseUrl = './api/diesel';
                   }else if(value == '4'){
                    _this.energyUseUrl = './api/electric';
                   }else if(value == '5'){
                    _this.energyUseUrl = './api/diesel';
                   }else if(value == '6'){
                    _this.energyUseUrl = './api/electric';
                   }else if(value == '7'){
                    _this.energyUseUrl = './api/diesel';
                   }
                })
            },
             drawEnergyTypeBar(){//柱状图
                // this.barChart = echarts.init(document.getElementById('barChart'));
                 
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
                        data:["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"]
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
                this.barChart.setOption(option);
                var _this = this;
                $.get(this.energyUseUrl).done(function (res) {
                    // alert("chushihua :"+_this.energyUseUrl)
                    if(res.errno ===  err_OK){
                        console.log(res.data);
                        var data = res.data;
                            _this.barChart.setOption({
                            series : [
                                {
                                    data: data
                                }
                            ]
                        });

                        
                    }
                })
                this.barChart.on('click',function(param) {
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
           
            drawCharts() {
                this.barChart = echarts.init(document.getElementById('barChart'));
                this.drawEnergyTypePie()
                this.drawEnergyTypeBar()
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

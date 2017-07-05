<template>
    <section class="chart">
        <el-row> 
        <!-- 能源类型图 -->
            <el-col :xs="24" :sm="24" :md="12" :lg="12" class="chart-container">                
               <div class="chart-header">
                    <el-select v-model="energyTypeSelectValue" placeholder="请选择" @change="energyTypeSelectChange"  >
                        <el-option key="本月" label="本月" value="本月"></el-option>
                        <el-option key="本季" label="本季" value="本季"></el-option>
                        <el-option key="本年" label="本年" value="本年"></el-option>
                    </el-select>
               </div>

                <div id="energyTypePie" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>
            <!-- 能源时序图 -->
             <el-col :xs="24" :sm="24" :md="12" :lg="12" class="chart-container">                
               <div class="chart-header">
                    <el-select v-model="energyTypeSelectValue" placeholder="请选择" @change="energyTypeSelectChange"  >
                        <el-option key="本月" label="本月" value="本月"></el-option>
                        <el-option key="本季" label="本季" value="本季"></el-option>
                        <el-option key="本年" label="本年" value="本年"></el-option>
                    </el-select>
               </div>

                <div id="barChart" style="width:100%; height:455px;" class="chart-content"></div>
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
                 this.energyTypePie = echarts.init(document.getElementById('energyTypePie'));
                 
                var option={
                    title : {
                        text: '能源类型图',
                        subtext: '纯属虚构',
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
                            radius : [30, 110],
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
            },

             drawEnergyTypePie1(){
                var barChart = echarts.init(document.getElementById('barChart'));
                 
                var option = {
                    title:{
                        text:'能源时序图'
                    },
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['功耗']
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
                    // calculable : true,
                    // dataZoom : {
                    //     show : true,
                    //     realtime : true,
                    //     start : 40,
                    //     end : 60
                    // },
                    xAxis : {
                        data:["电力","柴油","汽油","天然气","重油","CNG","LPG","LNG"]
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
                this.drawEnergyTypePie1()
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

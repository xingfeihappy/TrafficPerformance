<template>
<section class ="chart">
    <el-row>
        <el-col class = "chart-container">
            <div class =" .chart-header">
                <el-date-picker
                v-model="datTimRange"
                type="datetimerange"
                range-separator = "&"
                placeholder="选择时间范围"
                @change="selectTimeRange">
                </el-date-picker>
            </div>
        </el-col>
    </el-row>
    <el-row>
        <el-col class = "chart-container"> 
            <div div id="relTimeChart"style="width:100%; height:400px;" class="chart-content"></div>
        </el-col>
    </el-row>

    <el-row>
        <el-col class = "chart-container"> 
            <div div id="relTimeChartCo"style="width:100%; height:400px;" class="chart-content"></div>
        </el-col>
    </el-row>

</section>  
</template>

<script>

var titleName = '油气百公里消耗'
var titleNameCo = '标煤百公里消耗'
var tranTypeA = '出租客运';

var relTimeData = [];//油气柱状图数据
var relTimeDataCo = [];//标煤曲线图数据

var relTimeChart;//油气柱状图
var relTimeChartCo;//标煤曲线图



var requestData = 
{
    username:'zwp',
    roleName:'enterprice',
    roleType:'R_TRA',
    place1:'杭州',
    place2:'江干区',
    timeRange:'2017-01-01 00:01:01&2017-01-01 23:59:59',

    tranType:tranTypeA,
    // carId:null,
    // shipId:null,
    // cityType:null,
    // companyId:null,

    token:null

}

var option = {
    title: {
        text: titleName
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: [],
        align: 'left'
    },
    toolbox: {
        // y: 'bottom',
        feature: {
            magicType: {
                type: ['bar', 'line']
            },
            dataView: {},
            saveAsImage: {
                pixelRatio: 2
            }
        }
    },
    xAxis: {
        name:'时间',
        data: [],
        silent: false,
        splitLine: {
            show: false
        }
    },
    yAxis: {
    },
    
    dataZoom: [
        {
            show: true,
            realtime: true,
            start: 0
        }
    ],
    
    series: [],
    animationEasing: 'elasticOut',
    animationDelayUpdate: function (idx) {
        return idx ;
    }
};

var optionCo = {
    tooltip: {
        trigger: 'axis',
        position: function (pt) {
            return [pt[0], '10%'];
        }
    },
    title: {
        left: 'left',
        text: titleNameCo,
    },
    legend: {
        data: [],
        align: 'left'
    },
    toolbox: {
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: []
    },
    yAxis: {
        // type: 'value',
        // boundaryGap: [0, '100%']
    },
    dataZoom: [
        {
            show: true,
            realtime: true,
            start: 0
        }
    ],
    series: [
        {
            name:'模拟数据',
            type:'line',
            smooth:true,
            symbol: 'none',
            sampling: 'average',
            itemStyle: {
                normal: {
                    color: 'rgb(255, 70, 131)'
                }
            },
            data: []
        }
    ]
};

export default {
    data(){
            return {
                datTimRange:''
            }
    },
    methods:{
        setData(res){
            var dataFulCa = [];
            var dataFulCo = [];

            var engTMuMap = {};
            res.engTypOther.forEach(function(eng) {
                eng.engTypTMu.forEach(function(TMu) {
                    if(!engTMuMap[eng.baseTyp]) 
                        engTMuMap[eng.baseTyp] = {};
                    if(!engTMuMap[eng.baseTyp][TMu.type]) 
                            engTMuMap[eng.baseTyp][TMu.type] = [0,0];
                    var t = engTMuMap[eng.baseTyp][TMu.type];
                    t[0] = (TMu.typDatOfAllEng / TMu.typDatOfAllLen).toFixed(2);
                    t[1] = (TMu.typDatOfAllCo / TMu.typDatOfAllLen).toFixed(2);
                    engTMuMap[eng.baseTyp][TMu.type] = t;              
                });
            });

            console.log(engTMuMap);
            var relTimeSerise = [];
            var relTimeCoSerise = [];
            res.xs[1].forEach(function(e){
                var t = engTMuMap[e];
                var tmpS = {
                    name: e,
                    type: 'bar',
                    data: []
                };
                var tmpSCo = {
                    name: e,
                    type:'line',
                    smooth:true,
                    symbol: 'none',
                    sampling: 'average',
                    data: []
                };

                if(!t){
                    // for(var i =0;i<res.xs[0].length;i++)
                    //     tmpS.data.push(0);
                }
                else{
                    res.xs[0].forEach(function(mu){
                        var t1 = t[mu];
                        if(!t1) {
                            tmpS.data.push(0);
                            tmpSCo.data.push(0);
                        }
                        else {
                            tmpS.data.push(t1[0]);
                            tmpSCo.data.push(t1[1]);
                        }
                    });
                }
                relTimeSerise.push(tmpS);
                relTimeCoSerise.push(tmpSCo);
            });
            
            relTimeData.splice(0,relTimeData.length);
            relTimeData.push(res.xs[1]);
            relTimeData.push(res.xs[0]);
            relTimeData.push(relTimeSerise);

            relTimeDataCo.splice(0,relTimeDataCo.length);
            relTimeDataCo.push(res.xs[1]);
            relTimeDataCo.push(res.xs[0]);
            relTimeDataCo.push(relTimeCoSerise);


        },
        selectTimeRange(tr){
            console.log('timeRange r ='+tr);
            if(!tr||tr== '')
                    return ;
            requestData['timeRange']=tr;     
            this.getDataFromService(requestData);
        },
        getDataFromService(requestData){
            console.log(requestData);
            var _this = this;
            $.get(this.Constant.ajaxAddress+this.Constant.relTimeAjax,requestData).
            done(function (res){
                console.log(res);
                _this.setData(res);

                option.legend.data = relTimeData[0];
                option.xAxis.data = relTimeData[1];
                option.series = relTimeData[2];
                relTimeChart.clear();
                relTimeChart.setOption(option);

                optionCo.legend.data = relTimeDataCo[0];
                optionCo.xAxis.data = relTimeDataCo[1];
                optionCo.series = relTimeDataCo[2];
                relTimeChartCo.clear();
                relTimeChartCo.setOption(optionCo);

            });
        }
    },
    mounted:function(){
        relTimeChart =  echarts.init(document.getElementById('relTimeChart'));
        relTimeChartCo = echarts.init(document.getElementById('relTimeChartCo'));
        relTimeChart.setOption(option);
        relTimeChartCo.setOption(optionCo);

        this.getDataFromService(requestData);
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



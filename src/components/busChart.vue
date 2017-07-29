<template>
    <section  class="chart">
        <el-row>
            <el-col class="chart-container">
                <div class="chart-header">
                    <!--<el-select v-model="timeUnitType" placeholder="查询类型" >
                        <el-option key="按年" label="按年" value="按年"></el-option>
                        <el-option key="按半年" label="按半年" value="按半年"></el-option>
                        <el-option key="按季度" label="按季度" value="按季度"></el-option>
                        <el-option key="按月" label="按月" value="按月"></el-option>
                    </el-select>                      -->
                    <el-date-picker
                        v-model="timeRange"
                        type="daterange"
                        placeholder="选择日期范围">
                    </el-date-picker>                 
                </div> 
             </el-col>
        </el-row>
        <el-row >
            <el-col :xs="24" :sm="24" :md="24" :lg="24" class="chart-container">
                <div id="engClsChart" style="width:100%;height:400px;" class="chart-content"></div>
            </el-col>
        </el-row>

        <el-row >
            <el-col :xs="24" :sm="24" :md="24" :lg="24" class="chart-container">
                <div id="engTypeChart" style="width:100%;height:400px;" class="chart-content"></div>
            </el-col>
        </el-row>

        <el-row >
            <el-col  class="chart-container">
                   <div id="engTypeAllChart" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>
        </el-row>
        <el-row>
             <el-col  class="chart-container">
                <div  class="chart-header">
                    <el-date-picker
                        v-model="year"
                        type="year"
                        placeholder="选择年">
                    </el-date-picker>
                </div>
             </el-col>
        </el-row>
        <el-row>
             <el-col  class="chart-container">
            <el-col class="chart-container">
                <div id="perAllRelChart"style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>
             </el-col>
        </el-row>

    </section>  
</template>

<script>


var xsAll; //[[],[].... ]
var xsCon;//包含的x项


var eng_type_all = new Array();//能耗总和
var month_all = new Array();//周转量
var month_per = new Array();// eng_cl_e / eng_cl_l ;
var eng_all_for_PI = [];
var eng_per = [];

var engClsSeries = [];
var engClsDatas = [];

var colors = ['#5793f3', '#d14a61'];
var option = {
    color:colors,
    title:{
        text:'年度单耗、使用能耗关系图',
        left:'center'

    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross'
        }
    },
    toolbox: {
            show : true,
            feature : {
            mark : {show: true},
            saveAsImage : {show: true},
            dataView : {readOnly:false}
            }
        },
    legend: {
        data:['月使用能耗','单位能耗'],
        top : 20
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
            nameGap : 35,
            nameLocation:'middle',
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
            type:'line'
        },
        {
            name:'单位能耗',
            type:'bar',
            yAxisIndex: 1
        }
    ]
};
let optionPi={
    title:{
        text: '公交车能源结构图',
        x: 'center'
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        data: []
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
            center: ['50%', '60%'],
            data:[],
        }
    ]
};

var optionEng = {
    title: {
        text: '不同燃料类型单位能耗柱状图',
        left:'center'
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
        data:[]
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
        data: [],
        name:'燃料类型',
        nameGap:'10'
    },
    yAxis: {
        name:'单位能耗(万吨标煤/亿人公里)',
        nameLocation:'middle',
        nameGap:'40'
    },
    series : [
        {
            name:'一吨位',
            type:'bar',
            data:[]
        }
    ]
};

let optionClsEng = {
    title: {
        text: '不同燃料类型不同长度车长单位能耗柱状图',
        left:'center'
    },
    dataZoom: [
        {
            id: 'dataZoomX',
            type: 'slider',
            xAxisIndex: [0],
            filterMode: 'filter'
        }
    ],

    legend: {
        data:[],
        top : 30
    },
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    toolbox: {
        show : true,
        feature : {
        mark : {show: true},
        saveAsImage : {show: true},
        dataView : {readOnly:false},
        magicType : {show: true, type: ['line', 'bar']}
        }
    },
    xAxis : [
        {
            type : 'category',
            data : []
        }
    ],
    yAxis : [
        {
            type : 'value',
            nameLocation : 'middle',
            name : '单位能耗(单位：万吨标准煤/亿人公里)',
            nameGap : 35
        }
    ],
    series : []
};





import echarts from 'echarts'
export default {
  data(){
      return {
           timeRange:'',
           year:''
      }
  },
    methods: {
    
    },
    mounted:function(){

    var perAllRelChart = echarts.init(document.getElementById('perAllRelChart'));
    var engTypeAllChart = echarts.init(document.getElementById('engTypeAllChart'));
    var engTypeChart = echarts.init(document.getElementById('engTypeChart'));
    var engClsChart =  echarts.init(document.getElementById('engClsChart'));
    perAllRelChart.setOption(option);
    engTypeAllChart.setOption(optionPi);
    engTypeChart.setOption(optionEng);
    engClsChart.setOption(optionClsEng);

    $.get(this.Constant.ajaxAddress+"/bustranO.json",{place1:'ttttt'}).done(function (res){
            console.log(res);
            var eng_cl_tds  = res.engTypOther;
            var monthData = new Object();
            var cls2enger = {};
            var engerData = {};

            eng_cl_tds.forEach(function(element) {
                //month data
                element.engTypMo.forEach(function(e2){
                    var t = monthData[e2.type];
                    if(!t) t = [0,0];
                    t[0] += e2.typDatOfAllEng;
                    t[1] += e2.typDatOfAllLen;
                    monthData[e2.type] = t;
                });

                //cls2enger
                element.engTypCLs.forEach(function(e2){
                    if(!cls2enger[e2.type])
                        cls2enger[e2.type] = {};
                    if(!cls2enger[e2.type][element.baseTyp])
                         cls2enger[e2.type][element.baseTyp] = [0,0];
                    
                    var t = cls2enger[e2.type][element.baseTyp];
                    t[0] += e2.typDatOfAllEng;
                    t[1] += e2.typDatOfAllLen;
                    cls2enger[e2.type][element.baseTyp] = t;

                    // cal engall
                    var t = engerData[element.baseTyp];
                    if(!t) t = [0,0];
                    t[0] += e2.typDatOfAllEng;
                    t[1] += e2.typDatOfAllLen;
                    engerData[element.baseTyp] = t;                   
                });
            });


            console.log(JSON.stringify(cls2enger));
            console.log(JSON.stringify(engerData));

            res.xs[1].forEach(function(e1){
                var t = engerData[e1];
                if(t)
                {
                    eng_all_for_PI.push({name:e1,value:t[0]})
                    eng_per.push((t[0]/t[1]).toFixed(2))
                }else{
                    //eng_all_for_PI.push({name:e1,value:0})
                    eng_per.push(0)
                }
            });

            optionPi.legend.data = res.xs[1];
            optionPi.series[0].data = eng_all_for_PI;
            engTypeAllChart.setOption(optionPi);

            //optionEng.legend.data = res.xs[1];
            optionEng.xAxis.data =  res.xs[1];
            optionEng.series[0].data = eng_per;
            engTypeChart.setOption(optionEng);

            res.xs[0].forEach(function(e1){
                var t = monthData[e1];
                if(t) 
                {
                    console.log(t);
                    month_all.push(t[0]);
                    month_per.push((t[0]/t[1]).toFixed(2));
                }else
                {
                    month_all.push(0);
                    month_per.push(0);
                }
            });
            option.xAxis[0].data =  res.xs[0];
            option.series[1].data = month_per;
            option.series[0].data = month_all;
            perAllRelChart.setOption(option);

            for(var i in cls2enger){
                var tmpEngDatas = [];
                res.xs[1].forEach(function(e1){
                    var t = cls2enger[i][e1];
                    if(t)
                    {
                        tmpEngDatas.push((t[0]/t[1]).toFixed(2))
                    }else{
                        //eng_all_for_PI.push({name:e1,value:0})
                       tmpEngDatas.push(0);
                    }
                });
                var tmpSeriseObj =  {
                                        name:i,
                                        type:'bar',
                                        data:tmpEngDatas
                                    };
                
                engClsSeries.push(tmpSeriseObj);
            }

            console.log(engClsSeries);

            optionClsEng.legend.data = res.xs[2];
            optionClsEng.xAxis[0].data = res.xs[1];
            optionClsEng.series = engClsSeries;
            engClsChart.setOption(optionClsEng);
    });
        },
     updated: function () {
           console.log("update");
    
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




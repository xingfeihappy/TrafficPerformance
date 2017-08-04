<template>
  <section class = "chart">
      <el-row>
            <el-col class="chart-container">
                <div class="chart-header">
                    <el-date-picker
                        v-model="timeRange"
                        type="daterange"
                        placeholder="选择日期范围"
                        range-separator = ':'
                        @change="selectOther">
                    </el-date-picker>                 
                </div> 
            </el-col>
      </el-row>
      <el-row>
            <el-col class="chart-container">
                <div id="allTypChart"style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>
      </el-row>    
  </section>
</template>

<script>

var dataForTraEng = [];//运输类型燃料
var allTypChart;

var beforTimeRange = '';

var requestData = 
{
    username:'zwp',
    roleName:'enterprice',
    roleType:'R_TRA',
    place1:'杭州',
    place2:'江干',
    timeRange:'2017-01-01:2017-12-30'
}

var optionTraEng = {
    title: {
        text: '',
        //left:'center'
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
        top : 10
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
            data : [],
            name:'运输类型',
            nameGap:10
        }
    ],
    yAxis : [
        {
            type : 'value',
            //nameLocation : 'middle',
            name : '单位运距能耗(单位：万吨标准煤/公里)',
            //nameGap : 35
        }
    ],
    series : []
};

function setData(res){
    
    var traEngMap={};

    var traEngSeries=[];

    res.traTypOther.forEach(function(element){ 
        element.traTypEt.forEach(function(e2){
            if(!traEngMap[e2.type])
                traEngMap[e2.type] ={};
            if(!traEngMap[e2.type][element.baseTyp])
                traEngMap[e2.type][element.baseTyp] =[0,0];
            var t = traEngMap[e2.type][element.baseTyp];
            t[0] += e2.typDatOfAllEng;
            t[1] += e2.typDatOfAllLen;
            traEngMap[e2.type][element.baseTyp] =t;
        });
    });
    res.xs[1].forEach(function(element){
        var tmpEngDatas = [];
        if(!traEngMap[element]){
            var tmpSeriseObj = {
                name:element,
                type:'bar',
                data:[]
            };
            traEngSeries.push(tmpSeriseObj);
        }else{
            res.xs[0].forEach(function(e2){
                var t = traEngMap[element][e2];
                if(t){
                    tmpEngDatas.push((t[0]/t[1]).toFixed(2))
                }else{
                    tmpEngDatas.push(0);
                }
            });
            var tmpSeriseObj={
                name:element,
                type:'bar',
                data:tmpEngDatas
            };
            traEngSeries.push(tmpSeriseObj);
        }
    });

    dataForTraEng.splice(0,dataForTraEng.length);
    dataForTraEng.push(res.xs[1]);
    dataForTraEng.push(res.xs[0]);
    dataForTraEng.push(traEngSeries);
};

export default {
    data(){
      return {
            timeRange:''
      }
    },
    methods:{
        getDataFromService(requestData){
            console.log(requestData);
            $.get(this.Constant.ajaxAddress+this.Constant.perdisengAjax,requestData).
            done(function (res){
                setData(res);
                optionTraEng.legend.data = dataForTraEng[0];
                optionTraEng.xAxis[0].data = dataForTraEng[1];
                optionTraEng.series = dataForTraEng[2];
                allTypChart.clear();
                allTypChart.setOption(optionTraEng);
            });
            
        },
        selectOther(tr){
            console.log(tr+'   before=' + beforTimeRange);
            if(!tr||tr== '')
                 return ;
            requestData['timeRange']=tr;     
            this.getDataFromService(requestData);
            beforTimeRange = tr;
        },
    },
    mounted:function(){
        allTypChart = echarts.init(document.getElementById('allTypChart'));
        allTypChart.setOption(optionTraEng);
        this.getDataFromService(requestData);
        
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
             border-radius: 8px;
            .chart-header{
                float: right;
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
        padding: 20px 20px;
    }

    .el-row {
        margin-bottom: 15px;
        &:last-child {
        margin-bottom: 0;
        }
    }
</style>





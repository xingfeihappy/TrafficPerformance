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
                        placeholder="选择日期范围"
                        range-separator = ':'
                        @change="selectOther">
                    </el-date-picker>                 
                </div> 
             </el-col>
        </el-row>
        <el-row >
            <el-col  class="chart-container">
                   <div id="engTypeAllChart" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>
        </el-row>

        <el-row >
            <el-col :xs="24" :sm="24" :md="24" :lg="24" class="chart-container">
                <div id="engTypeChart" style="width:100%;height:400px;" class="chart-content"></div>
            </el-col>
        </el-row>

        <el-row >
            <el-col :xs="24" :sm="24" :md="24" :lg="24" class="chart-container">
                <div id="engClsChart" style="width:100%;height:400px;" class="chart-content"></div>
            </el-col>
        </el-row>
        <el-row>
             <el-col  class="chart-container">
                <div  class="chart-header">
                    <el-date-picker
                        v-model="year"
                        type="year"
                        placeholder="选择年"
                        @change="selectYearMonth">
                    </el-date-picker>
                </div>
             </el-col>
        </el-row>
        <el-row>   
            <el-col class="chart-container">
                <div id="perAllRelChart"style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>
        </el-row>

    </section>  
</template>

<script>


var dataForMoth = [];//年度图表
var dataForEngCls = [];//能源车长
var dataForEngPer = [];//各能源类型单耗
var dataForEngAll = [];//各能源饼图
var k = 3;//标志

var perAllRelChart;
var engTypeAllChart;
var engTypeChart;
var engClsChart;

var beforTimeRange = '';
var beforeYear = '';

var requestData = 
{
    /*username:this.$userInfo.username,
    roleName:'enterprice',
    roleType:'R_TRA',
    place1:'杭州',
    place2:'江干',
    timeRange:'2017-01-01:2017-12-30',
    token : this.$token*/
}




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

function  setData(res){
    console.log(res);

    var monthData = new Object();
    var clsEngMap = {};
    var engerData = {};
    var month_all = new Array();//周转量
    var month_per = new Array();// eng_cl_e / eng_cl_l ;
    var eng_type_all = new Array();//能耗总和
    var eng_all_for_PI = [];
    var eng_per = [];

    var engClsSeries = [];

    //遍历计算
    res.engTypOther.forEach(function(element) {
        //month data
        element.engTypMo.forEach(function(e2){
            var t = monthData[e2.type];
            if(!t) t = [0,0];
            t[0] += e2.typDatOfAllEng;
            t[1] += e2.typDatOfAllLen;
            monthData[e2.type] = t;
        });

        //clsEngMap
        element.engTypCLs.forEach(function(e2){
            if(!clsEngMap[e2.type])
                clsEngMap[e2.type] = {};
            if(!clsEngMap[e2.type][element.baseTyp])
                    clsEngMap[e2.type][element.baseTyp] = [0,0];
            
            var t = clsEngMap[e2.type][element.baseTyp];
            t[0] += e2.typDatOfAllEng;
            t[1] += e2.typDatOfAllLen;
            clsEngMap[e2.type][element.baseTyp] = t;

            // cal engall
            var t = engerData[element.baseTyp];
            if(!t) t = [0,0];
            t[0] += e2.typDatOfAllEng;
            t[1] += e2.typDatOfAllLen;
            engerData[element.baseTyp] = t;                   
        });
    });



    //准备能源类型数据
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


    //准备能源车长数据
    res.xs[2].forEach(function(i){
        var tmpEngDatas = [];
        //console.log('clsEngMap i = ');
        if(!clsEngMap[i])
        {
            var tmpSeriseObj = {
                        name:i,
                        type:'bar',
                        data:[]
                };
            engClsSeries.push(tmpSeriseObj);
               
        }else
        {
            res.xs[1].forEach(function(e1){
                var t = clsEngMap[i][e1];
                if(t)
                {
                    tmpEngDatas.push((t[0]/t[1]).toFixed(2))
                }else{
                    //eng_all_for_PI.push({name:e1,value:0})
                    tmpEngDatas.push(0);
                }
            });
            var tmpSeriseObj = {
                name:i,
                type:'bar',
                data:tmpEngDatas
            };
            engClsSeries.push(tmpSeriseObj);
        }

    });











   // console.log('set data k = ' + k);
    if( k == 1 ||k==3 )
    {
        dataForEngAll.splice(0,dataForEngAll.length);
        dataForEngAll.push(res.xs[1]);
        dataForEngAll.push(eng_all_for_PI);

        dataForEngPer.splice(0,dataForEngPer.length);
        dataForEngPer.push(res.xs[1]);
        dataForEngPer.push(eng_per);

        dataForEngCls.splice(0,dataForEngCls.length);
        dataForEngCls.push(res.xs[2]);
        dataForEngCls.push(res.xs[1]);
        dataForEngCls.push(engClsSeries);
    }
    // engMonth
    res.xs[0].forEach(function(e1){
        var t = monthData[e1];
        if(t) 
        {
            month_all.push(t[0]);
            month_per.push((t[0]/t[1]).toFixed(2));
        }else
        {
            month_all.push(0);
            month_per.push(0);
        }
    });
    if( k == 2 || k==3 )
    {
        dataForMoth.splice(0,dataForMoth.length);
        dataForMoth.push(res.xs[0]);
        dataForMoth.push(month_all);
        dataForMoth.push(month_per); 
    }

}  




import echarts from 'echarts'
export default {
  data(){
      return {
           timeRange:'',
           year:(new Date).getFullYear().toString()
      }
  },
    methods: {

        initRequestData(requestData){
            var date = new Date;
            var year = date.getFullYear().toString();
           // var month = (date.getMonth()+1).toString();
            requestData.username = this.$userInfo.name;
            requestData.roleName = this.$userInfo.roleName;
            requestData.roleType = this.$userInfo.roleType;
            if(this.$userInfo.place1!=null&&this.$userInfo.place1!="")
                requestData.place1 = this.$userInfo.place1;
            if(this.$userInfo.place2!=null&&this.$userInfo.place2!="")
                requestData.place2 = this.$userInfo.place2;          
            requestData.timeRange = year+'-01-01:'+year+'-12-31';
            requestData.token = this.$token;
        },

        getDataFromService(requestData){
            
            $.get(this.Constant.ajaxAddress+this.Constant.bustranAjax,requestData).
            done(function (res){
                setData(res);
            //    console.log('show data k = ' + k);
                if(k==1||k==3)
                {

                    optionPi.legend.data = dataForEngAll[0];
                    optionPi.series[0].data = dataForEngAll[1];
                    engTypeAllChart.clear();
                    engTypeAllChart.setOption(optionPi);

                    optionClsEng.legend.data = dataForEngCls[0];
                    optionClsEng.xAxis[0].data = dataForEngCls[1];
                    optionClsEng.series = dataForEngCls[2];
                    engClsChart.clear();
                    engClsChart.setOption(optionClsEng);

                    //optionEng.legend.data = res.xs[1];
                    optionEng.xAxis.data =  dataForEngPer[0];
                    optionEng.series[0].data = dataForEngPer[1];
                    engTypeChart.clear();
                    engTypeChart.setOption(optionEng);

                }
                if(k ==2 || k==3){
                    option.xAxis[0].data =  dataForMoth[0];
                    option.series[1].data = dataForMoth[2];
                    option.series[0].data = dataForMoth[1];
                    perAllRelChart.clear();
                    perAllRelChart.setOption(option);
                }

                
            });
            
        },
        selectOther(tr){
            k = 1;
            console.log(tr+'   before=' + beforTimeRange);
            if(!tr||tr== '')
                 return ;
            requestData['timeRange']=tr;     
            this.getDataFromService(requestData);
            beforTimeRange = tr;
        },
        selectYearMonth(y)
        {
            k =2;
            console.log(y+'   before=' + beforeYear);
            if(!y||y=='')
                 return ;
            
            y = y+'-01-01:'+y+'-12-31';
            requestData['timeRange']=y;
            this.getDataFromService(requestData);
            beforeYear = y;
        }
    },
    mounted:function()
    {

        perAllRelChart = echarts.init(document.getElementById('perAllRelChart'));
        engTypeAllChart = echarts.init(document.getElementById('engTypeAllChart'));
        engTypeChart = echarts.init(document.getElementById('engTypeChart'));
        engClsChart =  echarts.init(document.getElementById('engClsChart'));
        perAllRelChart.setOption(option);
        engTypeAllChart.setOption(optionPi);
        engTypeChart.setOption(optionEng);
        engClsChart.setOption(optionClsEng);
        this.initRequestData(requestData);
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




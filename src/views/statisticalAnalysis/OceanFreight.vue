<template>
    <section class="chart">
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
            <el-col :span="12" class="chart-container">                
                <div id="energyPieChart" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>
            <el-col :span="12" class="chart-container">                
                <div id="companyChart" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>   
        </el-row>
        <el-row> 
            <el-col  class="chart-container">                
                <div id="engTonChart" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>             
        </el-row>
        <el-row> 
            <el-col class="chart-container">                
                <div id="tonShipChart" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>
        </el-row> 
        <el-row>
            <el-col  class="chart-container">                
                <div id="engDisChart" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>  
        </el-row>
        <el-row>
            <el-col class="chart-container">
                <div class="chart-header">
                    <el-date-picker
                        v-model="year"
                        align="right"
                        type="year"
                        placeholder="选择年"
                        @change="selectYearMonth">
                    </el-date-picker>
                </div>
                <div id="energyByYearChart" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>
        </el-row>   
    </section>
</template>

<script>
    import echarts from 'echarts'

    var energyPieChart;
    var companyChart;
    var engTonChart;
    var tonShipChart;
    var engDisChart;
    var energyByYearChart;

    var dataForEngAll = [];//各能源饼图
    var dataForScalePer = [];//各规模企业类型单耗
    var dataForEngTog = [];//能源吨位
    var dataforTogShip =[];//吨位船舶类型
    var dataForEngDis = [];//能源运距;
    var dataForMoth = [];//年度图表
    
    var k=3; //标志

    var beforTimeRange = '';
    var beforeYear = '';
    
    var requestData = {};
    

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
    var optionPi = {
        title:{
            text: '海洋货运能源结构图',
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
    var optionScale={
        title:{
            text: '不同规模企业单位能耗柱状图',
            left:'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer : {            
                type : 'shadow'        
            }
        },
        legend: {
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
            name:'企业规模',
            nameGap:'10'
        },
        yAxis: {
            name:'单位能耗(万吨标煤/亿人公里)',
            nameLocation:'middle',
            nameGap:'40'
        },
        series : [
            {
                name:'单耗',
                type:'bar',
                data:[]
            }
        ]
    };
    var optionEngTog={
        title: {
            text: '不同燃料类型不同吨位船舶单位能耗柱状图',
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
    var optionTogShip={
        title: {
            text: '不同吨位不同类型船舶单位能耗柱状图',
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
    var optionEngDis = {
        title: {
            text: '不同燃料类型不同运距船舶单位能耗柱状图',
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

    function setData(res){
        var monthData = new Object();
        var engerData = {};
        var scaleData={};
        var engTogMap={};
        var togShipMap={};
        var engDisMap={};
        
        var month_all = new Array();//周转量
        var month_per = new Array();// eng_cl_e / eng_cl_l ;

        var eng_all_for_PI = []; //饼图填充数据
        var engTogSeries = [];
        var togShipSeries = [];
        var engDisSeries = [];
        var eng_per_for_scale =[];

        //遍历计算
        //monthData  engerData engTogMap engDisMap
        res.engTypOther.forEach(function(element) {

            element.engTypMo.forEach(function(e2){
                var t = monthData[e2.type];
                if(!t) t = [0,0];
                t[0] += e2.typDatOfAllEng;
                t[1] += e2.typDatOfAllLen;
                monthData[e2.type] = t;
            });

            element.engTypWs.forEach(function(e2){
                if(!engTogMap[e2.type])
                    engTogMap[e2.type]={};
                if(!engTogMap[e2.type][element.baseTyp])
                    engTogMap[e2.type][element.baseTyp] = [0,0];

                var t = engTogMap[e2.type][element.baseTyp];
                t[0] += e2.typDatOfAllEng;
                t[1] += e2.typDatOfAllLen;
                engTogMap[e2.type][element.baseTyp] = t;

                // cal engall
                var t = engerData[element.baseTyp];
                if(!t) t = [0,0];
                t[0] += e2.typDatOfAllEng;
                t[1] += e2.typDatOfAllLen;
                engerData[element.baseTyp] = t; 
            });

            element.engTypLs.forEach(function(e2){
                if(!engDisMap[e2.type])
                    engDisMap[e2.type] = {};
                if (!engDisMap[e2.type][element.baseTyp])
                    engDisMap[e2.type][element.baseTyp] =  [0,0];
                var t = engDisMap[e2.type][element.baseTyp];
                t[0] += e2.typDatOfAllEng;
                t[1] += e2.typDatOfAllLen;
                engDisMap[e2.type][element.baseTyp] =t;           
            });

            
        });
        

        //togShipMap
        res.weiTypOther.forEach(function(element){
            element.weiTypSt.forEach(function(e2){
                if(!togShipMap[e2.type])
                    togShipMap[e2.type] = {};
                if(!togShipMap[e2.type][element.baseTyp])
                    togShipMap[e2.type][element.baseTyp] = [0,0];
                
                var t = togShipMap[e2.type][element.baseTyp];
                t[0] += e2.typDatOfAllEng;
                t[1] += e2.typDatOfAllLen; 
                togShipMap[e2.type][element.baseTyp] = t;
            });
        });

        //scaleData
        res.entTypOther.forEach(function(element){
            var t = scaleData[element.baseTyp];
            if(!t) t = [0,0];
            t[0] += element.baseTypDatOfAllEng;
            t[1] += element.baseTypDatOfAllLen;
            scaleData[element.baseTyp] = t;
        });

        //准备能源饼图数据
        res.xs[1].forEach(function(e1){
            var t = engerData[e1];
            if(t)
            {
                eng_all_for_PI.push({name:e1,value:t[0]})
            }else{
            }
        });

        //准备企业规模柱状图数据
        res.xs[3].forEach(function(e1){
            var t = scaleData[e1];
            if(t){
                eng_per_for_scale.push((t[0]/t[1]).toFixed(2));
            }else{
                eng_per_for_scale.push(0);
            }
        });

        //准备燃料吨位柱状图数据
        res.xs[2].forEach(function(i){
            var tmpEngDatas = [];
           // console.log('engTogMap i = ');
            if(!engTogMap[i])
            {
                var tmpSeriseObj = {
                        name:i,
                        type:'bar',
                        data:[]
                };
                engTogSeries.push(tmpSeriseObj);
                
            }else
            {
                res.xs[1].forEach(function(e1){
                    var t = engTogMap[i][e1];
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
                engTogSeries.push(tmpSeriseObj);
            }
        });

        //准备吨位船舶柱状图数据
        res.xs[4].forEach(function(i){
            var tmpEngDatas =[];
            if(!togShipMap[i]){
                var tmpSeriseObj = {
                        name:i,
                        type:'bar',
                        data:[]
                };
                togShipSeries.push(tmpSeriseObj);
            }else{
                res.xs[2].forEach(function(e1){
                    var t = togShipMap[i][e1];
                    if(t){
                        tmpEngDatas.push((t[0]/t[1]).toFixed(2));
                    }else{
                        tmpEngDatas.push(0);
                    }
                });
                var tmpSeriseObj = {
                    name:i,
                    type:'bar',
                    data:tmpEngDatas
                };
                togShipSeries.push(tmpSeriseObj);
            }
        });

        //准备燃料运距柱状图数据
        res.xs[5].forEach(function(i){
            var tmpEngDatas = [];
            if(!engDisMap[i]){
                var tmpSeriseObj = {
                    name : i,
                    type : 'bar',
                    data : []
                };
                engDisSeries.push(tmpSeriseObj);
            }else{
                res.xs[1].forEach(function(e1){
                    var t = engDisMap[i][e1];
                    if(t){
                        tmpEngDatas.push((t[0]/t[1]).toFixed(2));
                    }else{
                        tmpEngDatas.push(0);
                    }
                });
                var tmpSeriseObj = {
                    name : i,
                    type : 'bar',
                    data : tmpEngDatas
                };
                engDisSeries.push(tmpSeriseObj);
            }
        });

        if (k==1 || k==3) {
            dataForEngAll.splice(0,dataForEngAll.length);
            dataForEngAll.push(res.xs[1]);
            dataForEngAll.push(eng_all_for_PI);

            dataForScalePer.splice(0,dataForScalePer.length);
            dataForScalePer.push(res.xs[3]);
            dataForScalePer.push(eng_per_for_scale);

            dataForEngTog.splice(0,dataForEngTog.length);
            dataForEngTog.push(res.xs[2]);
            dataForEngTog.push(res.xs[1]);
            dataForEngTog.push(engTogSeries);

            dataforTogShip.splice(0,dataforTogShip.length);
            dataforTogShip.push(res.xs[4]);
            dataforTogShip.push(res.xs[2]);
            dataforTogShip.push(togShipSeries);

            dataForEngDis.splice(0,dataForEngDis.length);
            dataForEngDis.push(res.xs[5]);
            dataForEngDis.push(res.xs[1]);
            dataForEngDis.push(engDisSeries);
        }

        //准备年度数据
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
        if (k==2||k==3) {
            dataForMoth.splice(0,dataForMoth.length);
            dataForMoth.push(res.xs[0]);
            dataForMoth.push(month_all);
            dataForMoth.push(month_per);
        }

    }
    export default {
        data() {
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
               // console.log(requestData);
                $.get(this.Constant.ajaxAddress+this.Constant.oceangoodsAjax,requestData).
                done(function (res){
                    setData(res);

                  //  console.log('show data k = ' + k);
                    if(k==1||k==3)
                    {

                        optionPi.legend.data = dataForEngAll[0];
                        optionPi.series[0].data = dataForEngAll[1];
                        energyPieChart.clear();
                        energyPieChart.setOption(optionPi);

                        optionEngTog.legend.data = dataForEngTog[0];
                        optionEngTog.xAxis[0].data = dataForEngTog[1];
                        optionEngTog.series = dataForEngTog[2];
                        engTonChart.clear();
                        engTonChart.setOption(optionEngTog);

                        optionScale.xAxis.data = dataForScalePer[0];
                        optionScale.series[0].data = dataForScalePer[1];
                        companyChart.clear();
                        companyChart.setOption(optionScale);

                        optionTogShip.legend.data = dataforTogShip[0];
                        optionTogShip.xAxis[0].data = dataforTogShip[1];
                        optionTogShip.series = dataforTogShip[2];
                        tonShipChart.clear();
                        tonShipChart.setOption(optionTogShip);

                        optionEngDis.legend.data = dataForEngDis[0];
                        optionEngDis.xAxis[0].data = dataForEngDis[1];
                        optionEngDis.series = dataForEngDis[2];
                        engDisChart.clear();
                        engDisChart.setOption(optionEngDis);
                    }
                    if(k ==2 || k==3){
                        option.xAxis[0].data =  dataForMoth[0];
                        option.series[1].data = dataForMoth[2];
                        option.series[0].data = dataForMoth[1];
                        energyByYearChart.clear();
                        energyByYearChart.setOption(option);
                    }

                    
                });
                
            },
            selectOther(tr){
                k = 1;
               // console.log(tr+'   before=' + beforTimeRange);
                if(!tr||tr== '')
                    return ;
                requestData['timeRange']=tr;     
                this.getDataFromService(requestData);
                beforTimeRange = tr;
            },
            selectYearMonth(y){
                k =2;
               // console.log(y+'   before=' + beforeYear);
                if(!y||y=='')
                    return ;
                
                y = y+'-01-01:'+y+'-12-31';
                requestData['timeRange']=y;
                this.getDataFromService(requestData);
                beforeYear = y;
            }    
            
        },
        mounted: function () {
            energyPieChart = echarts.init(document.getElementById('energyPieChart'));
            companyChart = echarts.init(document.getElementById('companyChart'));
            engTonChart = echarts.init(document.getElementById('engTonChart'));
            tonShipChart = echarts.init(document.getElementById('tonShipChart'));
            engDisChart = echarts.init(document.getElementById('engDisChart'));
            energyByYearChart = echarts.init(document.getElementById('energyByYearChart'));
            energyPieChart.setOption(optionPi);
            companyChart.setOption(optionScale);
            engTonChart.setOption(optionEngTog);
            tonShipChart.setOption(optionTogShip);
            engDisChart.setOption(optionEngDis);
            energyByYearChart.setOption(option);
            this.initRequestData(requestData);
            this.getDataFromService(requestData)

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
          //   margin-bottom: 15px;
             border-radius: 8px;
            .chart-header{
                float: right;
               // margin-bottom: 10px;
                margin-right: 20px;
               // position: relative;
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
       border-radius: 4px;
    }

    .el-row {
        margin-bottom: 15px;
        &:last-child {
        margin-bottom: 0;
        }
    }

</style>
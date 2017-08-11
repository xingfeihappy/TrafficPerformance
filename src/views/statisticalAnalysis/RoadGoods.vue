<template>
    <section class="chart">
        <el-row> 
            <el-col class="chart-container">
               <!-- <div class="chart-header">
                    <el-select v-model="energyTypeSelect" placeholder="选择燃料类型" >
                        <el-option key="汽油" label="汽油" value="汽油"></el-option>
                        <el-option key="柴油" label="柴油" value="柴油"></el-option>
                        <el-option key="CNG" label="CNG" value="CNG"></el-option>
                        <el-option key="LPG" label="LPG" value="LPG"></el-option>
                        <el-option key="LNG" label="LNG" value="LNG"></el-option>
                        <el-option key="重油" label="重油" value="重油"></el-option>
                        <el-option key="电力" label="电力" value="电力"></el-option>
                    </el-select>                      
                </div> -->
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
            <el-col  class="chart-container">                
                <div id="energyPieChart" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>       
        </el-row>
        <el-row>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" class="chart-container">                
                <div id="tonnageChart" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>   
            <el-col :xs="24" :sm="24" :md="12" :lg="12" class="chart-container">                
                <div id="companyChart" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>        
        </el-row>
        <el-row> 
            <el-col  class="chart-container">                
                <div id="engTonChart" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>
              
        </el-row>
        <el-row>
            <el-col  class="chart-container">                
                <div id="carTonChart" style="width:100%; height:400px;" class="chart-content"></div>
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
    import {getCookie,delCookie,setCookie} from '../../common/js/Cookie.js';
    var energyPieChart;
    var tonnageChart;
    var companyChart;
    var engTonChart;
    var carTonChart;
    var energyByYearChart;

    var dataForEngAll = [];//各能源饼图
    var dataForTonPer = [];//不同吨位
    var dataForScalePer =[];//不同规模
    var dataForEngTon = [];//不同燃料不同吨位
    var dataForCarTon = [];//车辆类型
    var dataForMon = [];//年度图表

    var k=3; //标志

    var beforTimeRange = '';
    var beforeYear = '';

    var requestData = 
    {
        /*username:'zwp',
        roleName:'enterprice',
        roleType:'R_TRA',
        place1:'杭州',
        place2:'江干',
        timeRange:'2017-01-01:2017-12-30'*/
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
    var optionPi = {
        title:{
            text: '道路货运能源结构图',
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
    var optionTon= {
        title: {
            text: '不同吨位车辆能耗柱状图',
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
            name:'吨位',
            nameGap:'5'
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
            nameGap:'5'
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
    var optionEngTon={
        title: {
            text: '不同燃料类型不同吨位车辆单位能耗柱状图',
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
                data : [],
                name:'燃料类型',
                nameGap:'10'
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
    var optionCarTon={
        title: {
            text: '不同车辆类型不同吨位车辆单位能耗柱状图',
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
                data : [],
                name:'车辆类型',
                nameGap:'10'
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
       // var carTypeData={};
        var tonnageData ={};
        var scaleData={};
        var engTonMap={};
        var carTonMap ={};

        var month_all = new Array();//能耗
        var month_per = new Array();// eng_cl_e / eng_cl_l ;
        var eng_all_for_PI = []; //饼图填充数据
        var eng_per_for_scale =[];
        var eng_per_for_ton = [];
        var engTonSeries =[];
        var carTonSeries=[];


        res.engTypOther.forEach(function(element){
            element.engTypMo.forEach(function(e2){
                var t = monthData[e2.type];
                if(!t) t = [0,0];
                t[0] += e2.typDatOfAllEng;
                t[1] += e2.typDatOfAllLen;
                monthData[e2.type] = t;
            });

            element.engTypWs.forEach(function(e2){
                if(!engTonMap[e2.type])
                    engTonMap[e2.type] = {};
                if(!engTonMap[e2.type][element.baseTyp])
                    engTonMap[e2.type][element.baseTyp] =[0,0];    
                var t = engTonMap[e2.type][element.baseTyp];
                t[0] += e2.typDatOfAllEng;
                t[1] += e2.typDatOfAllLen;
                engTonMap[e2.type][element.baseTyp] =t;

                var t = engerData[element.baseTyp];
                if(!t) t = [0,0];
                t[0] += e2.typDatOfAllEng;
                t[1] += e2.typDatOfAllLen;
                engerData[element.baseTyp] = t; 

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

        //tonnageData carTonData
        res.carTypOther.forEach(function(element){
            element.carTypWs.forEach(function(e2){
                if(!carTonMap[e2.type])
                    carTonMap[e2.type]={};
                if(!carTonMap[e2.type][element.baseTyp])
                    carTonMap[e2.type][element.baseTyp]=[0,0];
                var t = carTonMap[e2.type][element.baseTyp];
                t[0] += e2.typDatOfAllEng;
                t[1] += e2.typDatOfAllLen;
                carTonMap[e2.type][element.baseTyp] = t;

                var t = tonnageData[e2.type];
                if(!t) t = [0,0];
                t[0] += e2.typDatOfAllEng;
                t[1] += e2.typDatOfAllLen;
                tonnageData[e2.type] =t;
            })
        });

        console.log(tonnageData)

        //准备饼图数据
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

        //准备吨位柱状图数据 燃料吨位柱状图数据
        res.xs[2].forEach(function(i){
            var t = tonnageData[i];
            if (t) {
                eng_per_for_ton.push((t[0]/t[1]).toFixed(2));
            }else{
                eng_per_for_ton.push(0);
            }
            
            var tmpEngDatas = [];
            if(!engTonMap[i])
            {
                var tmpSeriseObj = {
                            name:i,
                            type:'bar',
                            data:[]
                    };
                engTonSeries.push(tmpSeriseObj);
                
            }else
            {
                res.xs[1].forEach(function(e1){
                    var t = engTonMap[i][e1];
                    if(t)
                    {
                        tmpEngDatas.push((t[0]/t[1]).toFixed(2))
                    }else{
                        tmpEngDatas.push(0);
                    }
                });
                var tmpSeriseObj = {
                    name:i,
                    type:'bar',
                    data:tmpEngDatas
                };
                engTonSeries.push(tmpSeriseObj);
            }
        });

        //车辆类型吨位数据
        res.xs[2].forEach(function(i) {
            var tmpEngDatas =[];
            if(!carTonMap[i]){
                var tmpSeriseObj = {
                    name:i,
                    type:'bar',
                    data:[]
                };
                carTonSeries.push(tmpSeriseObj);
            }else{
                res.xs[4].forEach(function(e1){
                    var t = carTonMap[i][e1];
                    if(t)
                    {
                        tmpEngDatas.push((t[0]/t[1]).toFixed(2))
                    }else{
                        tmpEngDatas.push(0);
                    }
                });
                var tmpSeriseObj = {
                    name:i,
                    type:'bar',
                    data:tmpEngDatas
                };
                carTonSeries.push(tmpSeriseObj);
            }
        });
        
        if(k==1||k==3){
            dataForEngAll.splice(0,dataForEngAll.length);
            dataForEngAll.push(res.xs[1]);
            dataForEngAll.push(eng_all_for_PI);

            dataForScalePer.splice(0,dataForScalePer.length);
            dataForScalePer.push(res.xs[3]);
            dataForScalePer.push(eng_per_for_scale);

            dataForTonPer.splice(0,dataForTonPer.length);
            dataForTonPer.push(res.xs[2]);
            dataForTonPer.push(eng_per_for_ton);

            dataForEngTon.splice(0,dataForEngTon.length);
            dataForEngTon.push(res.xs[2]);
            dataForEngTon.push(res.xs[1]);
            dataForEngTon.push(engTonSeries);

            dataForCarTon.splice(0,dataForCarTon.length);
            dataForCarTon.push(res.xs[2]);
            dataForCarTon.push(res.xs[4]);
            dataForCarTon.push(carTonSeries);

        }

         //准备年度数据
        res.xs[0].forEach(function(e1){
            var t = monthData[e1];
            if(t) 
            {
               // console.log(t);
                month_all.push(t[0]);
                month_per.push((t[0]/t[1]).toFixed(2));
            }else
            {
                month_all.push(0);
                month_per.push(0);
            }
        });

        if(k==2||k==3){
            dataForMon.splice(0,dataForMon.length);
            dataForMon.push(res.xs[0]);
            dataForMon.push(month_all);
            dataForMon.push(month_per);
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
                var token = getCookie('token');
                var userInfo = JSON.parse(getCookie('userInfo'));
                requestData.token = token;
                requestData.username = userInfo.name;
                if(userInfo.roleName!=null && userInfo.roleName!="")
                    requestData.roleName = userInfo.roleName;
                requestData.roleType = userInfo.roleType;
                if(userInfo.place1!=null && userInfo.place1!="")
                    requestData.place1 =userInfo.place1;
                if(userInfo.place2!=null && userInfo.place2!="")
                    requestData.place2 = userInfo.place2;          
                requestData.timeRange = year+'-01-01:'+year+'-12-31';
            },
            getDataFromService(requestData){
                var _this = this;
                $.get(this.Constant.ajaxAddress+this.Constant.roadgoodsAjax,requestData).
                done(function (res){

                    if(res.errCode==30){//data ok
                        setData(res);
                        if(k==1||k==3)
                        {

                            optionPi.legend.data = dataForEngAll[0];
                            optionPi.series[0].data = dataForEngAll[1];
                            energyPieChart.clear();
                            energyPieChart.setOption(optionPi);

                            optionScale.xAxis.data =  dataForScalePer[0];
                            optionScale.series[0].data = dataForScalePer[1];
                            companyChart.clear();
                            companyChart.setOption(optionScale);

                            optionTon.xAxis.data = dataForTonPer[0];
                            optionTon.series[0].data = dataForTonPer[1];
                            tonnageChart.clear();
                            tonnageChart.setOption(optionTon);

                            optionEngTon.legend.data = dataForEngTon[0];
                            optionEngTon.xAxis[0].data = dataForEngTon[1];
                            optionEngTon.series = dataForEngTon[2];
                            engTonChart.clear();
                            engTonChart.setOption(optionEngTon);

                            optionCarTon.legend.data = dataForCarTon[0];
                            optionCarTon.xAxis[0].data = dataForCarTon[1];
                            optionCarTon.series = dataForCarTon[2];
                            carTonChart.clear();
                            carTonChart.setOption(optionCarTon);
                        }
                        if(k ==2 || k==3){
                            option.xAxis[0].data =  dataForMon[0];
                            option.series[1].data = dataForMon[2];
                            option.series[0].data = dataForMon[1];
                            energyByYearChart.clear();
                            energyByYearChart.setOption(option);
                        }
                    }else if(res.errCode==31){ // data err
                        window.log('unknow err');
                    }else if(res.errCode==44){ // auth 
                        _this.$router.push('/login');
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
            tonnageChart = echarts.init(document.getElementById('tonnageChart'));
            companyChart = echarts.init(document.getElementById('companyChart'));
            engTonChart = echarts.init(document.getElementById('engTonChart'));
            carTonChart = echarts.init(document.getElementById('carTonChart'));
            energyByYearChart = echarts.init(document.getElementById('energyByYearChart'))

            energyPieChart.setOption(optionPi);
            tonnageChart.setOption(optionTon);
            companyChart.setOption(optionScale);
            engTonChart.setOption(optionEngTon);
            carTonChart.setOption(optionCarTon);
            energyByYearChart.setOption(option);
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
              //  margin-bottom: 10px;
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

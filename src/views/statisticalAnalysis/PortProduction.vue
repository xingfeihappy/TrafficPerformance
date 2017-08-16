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
            <el-col :xs="24" :sm="24" :md="12" :lg="12" class="chart-container">                
                <div id="energyPieChart" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" class="chart-container">                
                <div id="companyChart" style="width:100%; height:400px;" class="chart-content"></div>
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
    var companyChart;
    var energyByYearChart;

    var dataForEngAll = [];//各能源饼图
    var dataForScalePer = [];//各规模企业类型单耗
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
                    dataView : {readOnly:false},
                    saveAsImage : {show: true},
                
                },
                right:'3%'
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
                name:'月份',
                nameGap:'20',
                data: []
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '月使用能耗(万吨标准煤)',
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
                name: '单位能耗(亿吨标准煤/万吨生产量)',
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
            text: '港口生产能源结构图',
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
            },
            right:'4%'
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
                                
            },
            right:'4%'
        },
        xAxis: {
            data: [],
            name:'企业规模',
            nameGap:'2'
        },
        yAxis: {
            name:'单位能耗(亿吨标准煤/万吨生产量)',
            nameLocation:'middle',
            nameGap:'40'
        },
        series : [
            {
                name:'单耗',
                type:'bar',
                barMaxWidth:'60%',
                data:[]
            }
        ]
    };

    function setData(res){
        var monthData = new Object();
        var engerData = {};
        var scaleData={};

        var month_all = new Array();//周转量
        var month_per = new Array();// eng_cl_e / eng_cl_l ;
        var eng_all_for_PI = []; //饼图填充数据
        var eng_per_for_scale =[];

        res.engTypOther.forEach(function(element) {

            element.engTypMo.forEach(function(e2){
                var t = monthData[e2.type];
                if(!t) t = [0,0];
                t[0] += e2.typDatOfAllEng;
                t[1] += e2.typDatOfAllLen;
                monthData[e2.type] = t;

                // cal engall
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
        console.log(scaleData)

        //准备能源饼图数据
        res.xs[1].forEach(function(e1){
            var t = engerData[e1];
            if(t)
            {
                eng_all_for_PI.push({name:e1,value:(t[0]/10000).toFixed(2)})
            }else{
            }
        });

        //准备企业规模柱状图数据
        res.xs[2].forEach(function(e1){
            var t = scaleData[e1];
            if(t){
                eng_per_for_scale.push((t[0]/10000/t[1]).toFixed(2));
            }else{
                eng_per_for_scale.push(0);
            }
        });

        if (k==1 || k==3) {
            dataForEngAll.splice(0,dataForEngAll.length);
            dataForEngAll.push(res.xs[1]);
            dataForEngAll.push(eng_all_for_PI);

            dataForScalePer.splice(0,dataForScalePer.length);
            dataForScalePer.push(res.xs[2]);
            dataForScalePer.push(eng_per_for_scale);
        }
        console.log(monthData)
        //准备年度数据
        res.xs[0].forEach(function(e1){
            var t = monthData[e1];
            if(t) 
            {
                
                month_all.push((t[0]/10000).toFixed(2));
                month_per.push((t[0]/10000/t[1]).toFixed(2));
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
                year:''//(new Date).getFullYear().toString()
            }
        },
        methods: {
            initRequestData(requestData){
                var date = new Date;
                var year = date.getFullYear().toString();
                var month = date.getMonth();
                if(month>=1 && month<=9)
                    month = '0'+month;
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
                requestData.timeRange = year+'-'+month+'-01:'+year+'-'+month+'-31';
            },
            getDataFromService(requestData){
                var _this = this;
                $.get(this.Constant.ajaxAddress+this.Constant.portproAjax,requestData).
                done(function (res){
                    if(res.errCode==30){//data ok
                        setData(res);
                            if(k==1||k==3)
                            {

                               // optionPi.legend.data = dataForEngAll[0];
                                optionPi.series[0].data = dataForEngAll[1];
                                energyPieChart.clear();
                                energyPieChart.setOption(optionPi);

                                optionScale.xAxis.data = dataForScalePer[0];
                                optionScale.series[0].data = dataForScalePer[1];
                                companyChart.clear();
                                companyChart.setOption(optionScale);

                            }
                            if(k ==2 ){
                                option.xAxis[0].data =  dataForMoth[0];
                                option.series[1].data = dataForMoth[2];
                                option.series[0].data = dataForMoth[1];
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
            companyChart = echarts.init(document.getElementById('companyChart'));
            energyByYearChart = echarts.init(document.getElementById('energyByYearChart'));
            energyPieChart.setOption(optionPi);
            companyChart.setOption(optionScale);
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
               // margin-bottom: 10px;
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
    }

    .el-row {
        margin-bottom: 15px;
        &:last-child {
        margin-bottom: 0;
        }
    }
</style>
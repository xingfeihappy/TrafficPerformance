<template>
    <section class="chart">
        <el-row> 
            <el-col class="chart-container">
                <div class="chart-header">
                    <el-select v-model="timeRange" placeholder="请选择" @change="TimeRangeChange"  >
                        <el-option key="本月" label="本月" value="本月"></el-option>
                        <el-option key="本季" label="本季" value="本季"></el-option>
                        <el-option key="本年" label="本年" value="本年"></el-option>
                    </el-select>
                </div>
            </el-col>
        </el-row
        <el-row> 
        <!-- 能源类型图 -->
            <el-col :span="10" class="chart-container">                
                <div id="energyTypePie" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>
            <!-- 能源分时图 -->
             <el-col :span="14" class="chart-container">                
                <div id="barChart" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>
        </el-row>
    </section>
</template>

<script>

    var year = (new Date).getFullYear().toString();
    var xAisMon = [year+'-01',year+'-02',year+'-03',year+'-04',year+'-05',year+'-06',
            year+'-07',year+'-08',year+'-09',year+'-10',year+'-11',year+'-12']
    var dataForEngAll=[];
    var dataForMon=[];
    var dataFor
    var MonengMap = {};

    var energyTypePie;
    var barChart;

    var beforTimeRange = '';

    var requestData = 
    {
        username:'zwp',
        roleName:'enterprice',
        roleType:'R_WAT',
        place1:'杭州',
        place2:'江干',
        timeRange:'2017-01-01:2017-12-30'
    } 

    var optionPi = {
        title:{
            text: '能源结构图',
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
                radius : '70%',
                center: ['50%', '60%'],
                data:[],
            }
        ]

    };
    var optionMon={
        title:{
            text: '能源分时图',
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
            data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
            name:'月份',
            nameGap:'10'
        },
        yAxis: {
            name:'能耗(万吨标准煤)',
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

    function setData(res){
        
        var engerData = {};
        var monthData = new Object();

        var eng_all_for_PI = []; //饼图填充数据
        var month_all = new Array();//周转量
        MonengMap = new Object();
        res.engTypOther.forEach(function(element){
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

                if(!MonengMap[element.baseTyp])
                    MonengMap[element.baseTyp] = {};
                if(!MonengMap[element.baseTyp][e2.type])
                    MonengMap[element.baseTyp][e2.type]=[0,0];
                
                var t = MonengMap[element.baseTyp][e2.type];
                t[0] += e2.typDatOfAllEng;
               // t[1] += e2.typDatOfAllLen;
                MonengMap[element.baseTyp][e2.type] = t;
            });
        })

        //准备能源饼图数据
        res.xs[1].forEach(function(e1){
            var t = engerData[e1];
            if(t)
            {
                eng_all_for_PI.push({name:e1,value:t[0]})
            }else{
            }
        });

        //准备柱状图数据
        res.xs[0].forEach(function(e1){
            var t = monthData[e1];
            if(t) 
            {
                month_all.push(t[0]);
            }else
            {
                month_all.push(0);
            }
        });

        dataForEngAll.splice(0,dataForEngAll.length);
        dataForEngAll.push(res.xs[1]);
        dataForEngAll.push(eng_all_for_PI);

        dataForMon.splice(0,dataForMon.length);
        dataForMon.push(res.xs[0]);
        dataForMon.push(month_all);

    }

   
     
    

    import echarts from 'echarts'
 //   import {ajaxAddress} from '../../common/js/constant.js'
  //  var currentEnergy = -1;
    export default {
        data() {
            return {
                timeRange: '本年',
                /*energyTypeUrl : this.Constant.ajaxAddress+'/energyTypeMonth',
                energyUseUrl:this.Constant.ajaxAddress+'/energyTotalUse',
                barChart:null*/
            }
        },
        /*watch:{
            energyUseUrl:function(curVal,oldVal){
 　　　　　　　　alert(curVal+"---"+oldVal);
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
        },*/
        methods: {
            getDataFromService(requestData){
               // console.log(requestData);
                $.get(this.Constant.ajaxAddress+this.Constant.indexAjax,requestData).
                done(function (res){
                    setData(res);
                    optionPi.legend.data = dataForEngAll[0];
                    optionPi.series[0].data = dataForEngAll[1];
                    energyTypePie.clear();
                    energyTypePie.setOption(optionPi);

                    //optionMon.xAxis.data = dataForMon[0];
                    optionMon.series[0].data = dataForMon[1];
                    barChart.clear();
                    barChart.setOption(optionMon);                 
                });

                
            },
            TimeRangeChange(tr){
                if(!tr||tr== '')
                    return ;
                if(tr=='本月'){
                    var date = new Date;
                    var year = date.getFullYear();
                    var month = date.getMonth()+1;
                    requestData['timeRange'] = year.toString()+'-'+month.toString()+'-01:'
                                               +year.toString()+'-'+month.toString()+'-01'
                    this.getDataFromService(requestData);
                    beforTimeRange = tr;
                }
                if(tr=='本季'){
                    var date = new Date;
                    var year = date.getFullYear().toString();
                    var month = date.getMonth()+1;
                    var endMon = 3*Math.ceil(month/3);
                    var startMon = endMon-2;
                    requestData['timeRange'] = year+'-'+startMon.toString()+'-01:'
                                               +year+'-'+endMon.toString()+'-01'
                    this.getDataFromService(requestData);
                    beforTimeRange = tr;
                }
                if(tr=='本年'){
                    var date = new Date;
                    var year = date.getFullYear().toString();
                    requestData['timeRange'] = year+'-01-01:'+year+'-12-01';
                    this.getDataFromService(requestData);
                    beforTimeRange = tr;
                }
            },
            EngBarTypeChange(){
                
            }
            /*energyTypeSelectChange(){
                let value= this.energyTypeSelectValue;
                if(value === "本月"){
                    this.energyTypeUrl = this.Constant.ajaxAddress+'/energyTypeMonth';
                }else if(value === "本季"){
                    this.energyTypeUrl = this.Constant.ajaxAddress+'/energyTypeQuater';
                }else if(value === "本年"){
                    this.energyTypeUrl = this.Constant.ajaxAddress+'/energyTypeYear';
                }
            },*/
           
            /*drawEnergyTypePie(){//饼图
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
                    _this.energyUseUrl = _this.Constant.ajaxAddress+'/electric';
                   }else if(value == '1'){
                    _this.energyUseUrl = _this.Constant.ajaxAddress+'/diesel';
                   }else if(value == '2'){
                    _this.energyUseUrl = _this.Constant.ajaxAddress+'/electric';
                   }else if(value == '3'){
                    _this.energyUseUrl = _this.Constant.ajaxAddress+'/diesel';
                   }else if(value == '4'){
                    _this.energyUseUrl = _this.Constant.ajaxAddress+'/electric';
                   }else if(value == '5'){
                    _this.energyUseUrl = _this.Constant.ajaxAddress+'/diesel';
                   }else if(value == '6'){
                    _this.energyUseUrl = _this.Constant.ajaxAddress+'/electric';
                   }else if(value == '7'){
                    _this.energyUseUrl = _this.Constant.ajaxAddress+'/diesel';
                   }
                })
            },*/
             /*drawEnergyTypeBar(){//柱状图
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
            },*/
           
            /*drawCharts() {
                this.barChart = echarts.init(document.getElementById('barChart'));
                this.drawEnergyTypePie()
                this.drawEnergyTypeBar()
            }*/
        },
        mounted: function () {
            energyTypePie = echarts.init(document.getElementById('energyTypePie'));
            barChart = echarts.init(document.getElementById('barChart'));
            energyTypePie.setOption(optionPi);
            barChart.setOption(optionMon);
            this.getDataFromService(requestData);
            energyTypePie.on('click',function(params){
                //  alert('click pie');
                var engType = params.name;
                var tmpEngDatas = [];
                xAisMon.forEach(function(e1){
                    var t = MonengMap[engType][e1];
                    if(t){
                        tmpEngDatas.push((t[0]));
                    }else{
                        tmpEngDatas.push(0);
                    }
                });
                optionMon.series[0].data = tmpEngDatas;
                barChart.setOption(optionMon);
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

<template>
    <section class="chart">
        <el-row>
            <el-col>
                <div id="toolBar" style="width:1000px;height:50px;" class = "chart-container">
                    <div class="chart-header">
                        统计期：{{ countDate }}
                    </div>
                    <div class="chart-header2">
                        <el-tooltip class="item" effect="dark" content="仅辖区" placement="top-start">
                            <!--<el-cascader
                            @change="onCityChangeAdd"
                            :options="cityOption"
                            v-model="selectedOptions"
                            :props="props"
                            ></el-cascader>-->
                            <el-select v-model="selectedOptions" filterable placeholder="请选择城市" @change="onCityChangeAdd">
                                <el-option
                                    v-for="item in cityOption"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                    :disabled="item.disabled">
                                </el-option>
                            </el-select>
                        </el-tooltip>
                    </div>           
                </div>

            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <div id="energyDatainHeatMap" style="width:1000px;height:500px;" class = "chart-container">           
                </div>
            </el-col>
        </el-row>
    </section>
</template>

<script > 
    import {HeatMap} from '../../common/js/heatmap.js'
    import { Loading } from 'element-ui';
    import {makeCAZ} from '../../common/js/mapCenter.js'

    var timeNow = null;
    var requestData ={};
    var rawData = null;
    
    export default{

        data() {
            return {
                selectedOptions: '',
                cityOption: [],
				//props: {value: 'label',children: 'cities' },
                countDate: '',
            }
        },
        
        methods: {
            //初始化地图
            initMap(){                        
                window.maplet = new Maplet('energyDatainHeatMap');
                //window.maplet.centerAndZoom(new MPoint(121.5,30.7), 5);  
                window.maplet.centerAndZoom(new MPoint(120.18106,30.21456),8)
                window.maplet.addControl(new MStandardControl());
            },
            //根据用户辖区，设置地区级联选择器
            setCityInfo(){
                var ui = this.$userInfo;
				this.cityOption.splice(0,this.cityOption.length);
				var cities = this.cityinfo.cities;
				var counties = this.cityinfo.counties;
                var city = ['杭州','宁波','温州','金华','湖州','绍兴','嘉兴','台州','舟山','衢州','丽水'];
                var isDisabled;
                this.cityOption= city.map(item => {
                    isDisabled = false
                    if(ui.place1!=null && ui.place1!="" && ui.place1!=item)
                        isDisabled = true;
                    return { value: item, label: item ,disabled: isDisabled};
                });
				//console.log(this.cityinfo)
				/*for(var i=1;i<cities.length;i++){
					var tmpc = {};
					var tmpl = [];
					tmpc.label = cities[i];
					tmpc.value = cities[i];
                    
					if(ui.place1!=""&&ui.place1!=null){
                        if(tmpc.label!=ui.place1)
                            tmpc.disabled = true;
                        //console.log(tmpc.label);
                    }
					for(var j =1;j<counties[i].length;j++){
						var ctm = {label:counties[i][j],value:counties[i][j]};
						//if(j!=0) ctm.disabled =  true;//在这把区县设置给屏蔽了
                        if(ui.place2!=""&&ui.place2!=null){
                            if(ctm.label!=ui.place2)
                                ctm.disabled = true;
                        }
                        ctm.disabled = true;
						tmpl.push(ctm);
					}
					tmpc.cities = tmpl;	
					this.cityOption.push(tmpc);
				}*/
				//console.log(this.cityOption);
			},
            //从服务器获取数据
            getDataFromService(requestData){
                var _this = this;
                var options = {target:document.getElementById("energyDatainHeatMap")};
                var loadingInstance = Loading.service(options);
                $.get(this.Constant.ajaxAddress+this.Constant.heatMapAjax,requestData).
                done(function (res){
                    if(res.errCode==30){//data ok
                        rawData = res.data;
                        
                        _this.MakeHeatMap();
                        loadingInstance.close();
                        //console.log(rawData)
                    }else if(res.errCode==31){ // data err
                        window.log('unknow err');
                    }else if(res.errCode==44){ // auth 
                        _this.$router.push('/login');
                    }
                });
            },

           //生成热力图
            MakeHeatMap(){

                window.maplet.clearOverlays(true);
                

                var heatmap = new HeatMap();  //生成调色板，作为能耗坐标点上色标尺
                var palette = heatmap.getPalette();

                /*for(var i=0;i<50;i++){
                    var long = Number((120.20  +(Math.random()/10)).toFixed(3))
                    var lat = Number((30.11 + (Math.random()/10)).toFixed(3))
                    var val = Number((Math.random()).toFixed(2))
                    //console.log(long+" "+lat+" "+val)
                    heatmap.addPoint(long,lat,val)
                }*/
                console.log(rawData)
                rawData.forEach(function(e) {
                    var val = Number((e.fuelCo).toFixed(3));
                    if(val>0){
                        var long = Number((e.longitude).toFixed(3));  //经纬度精确到小数点后4位
                        var lat = Number((e.latitude).toFixed(3));
                        heatmap.addPoint(long,lat,val)
                    }
                });
                
                var dataMap = heatmap.options.points.dataMap;
                var maxVal = heatmap.options.points.max;
                var longLat = heatmap.options.points.longLat;
                console.log(dataMap);
                console.log(longLat);
                console.log(maxVal);
                var brush = new MBrush();
    
                /*根据能耗值给各点上色，这里将地图以0.001经纬度划分为一个个像素点，依次给存在能耗点的像素点上色*/
                for(var i=0;i<longLat.length;i++){
                    var lt = longLat[i]; 
                   
                    var minLong = lt[0];
                    var minLat = lt[1];
					var val = dataMap[minLong][minLat];

					var maxLong = (Number(minLong)+0.001).toFixed(3);
					var maxLat = (Number(minLat)+0.001).toFixed(3);
                   
                    //console.log([minLong,minLat,maxLong,maxLat,val]);
                    if(val){
                        brush.fill = true;
                        var alpha = (val/maxVal*256-1).toFixed(0);
                        alpha = (alpha > 20) ? alpha : 20;

                        var offset = alpha*4;
                        //console.log(offset);
                        var r = palette[offset];
			            var g = palette[offset+1];
			            var b = palette[offset+2]; 

                        var hexColor = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
                        var finalAlpha = (alpha < 80) ? alpha : 80;
                        brush.bgcolor = hexColor;
			            brush.bgtransparency = finalAlpha;
                        brush.color = hexColor;
			            brush.stroke = 0;

                        var minpt = new MPoint(minLong,minLat); //矩形左上角经纬度
						var maxpt = new MPoint(maxLong,maxLat);  //矩形右下角点经纬度

                        //生成一个矩形
                        window.mroundrect = new MRoundRect(
							minpt,
							maxpt,
							0,
							brush,
						)
                        window.maplet.addOverlay(window.mroundrect)

                    }
                }
                
                console.log("end MakeHeatMap()");
            },
            getTime(){
                var d = new Date();    
                var th = d.getHours();           
                if(th==0){
                    var yesterday = (new Date()).setTime(d.getTime()-60*60*1000);
                    var ym = yesterday.getMonth()+1;
                    var yd = yesterday.getDate();
                    if(ym>=1 && ym <= 9)
                        ym = '0' + ym;
                    if(yd>=1 && yd<=9)
                        yd = '0'+yd;
                    var yy = yesterday.getFullYear()+'-'+ym+'-'+'yd';
                    requestData.timeRange = yy+' 23:00:00&'+yy+' 23:59:59';  
                    this.countDate = '23:00 至 23:59';
                }else{
                    var tm = d.getMonth()+1;
                    var td = d.getDate();
                    th = th-1;
                    if(tm>=1 && tm <= 9)
                        tm = '0' + tm;
                    if(td>=1 && td<=9)
                        td = '0'+td;
                    if(th>=0 && th<=9)
                        th = '0'+th;
                    var t = d.getFullYear()+'-'+tm+'-'+td;
                    
                    requestData.timeRange = t+' '+th+':00:00&'+t+' '+th+':59:59'; 
                    this.countDate = th+':00 至 '+th+':59';                 
                }

                requestData.timeRange = '2017-09-09 00:00:00&2017-09-09 23:59:59';
            },
            //初始化请求数据
            initRequestData(){
                var ui = this.$userInfo;
                var token  =this.$token;

                requestData.username = ui.username;
                requestData.roleType = ui.roleType;
                requestData.roleName = ui.roleName;
                requestData.place1 = ui.place1;
                requestData.place2 = ui.place2;
                requestData.token = token;

                if(ui.place1==""||ui.place1==null){
                    requestData.cityType = '杭州';
                }
                //this.getTime();
                
                console.log(requestData)
            },

            onCityChangeAdd(val){
                console.log(val)
                requestData.cityType = val;
                this.getTime();
                var centerAndZoom = makeCAZ();
                var caz = centerAndZoom[val];
                window.maplet.centerAndZoom(new MPoint(caz[0],caz[1]),caz[2])
                this.getDataFromService(requestData);
                //console.log(centerAndZoom)

            }

        },
        
        mounted() {
            this.initMap();
            this.setCityInfo();
            this.initRequestData();
            //this.getDataFromService(requestData);
            //this.MakeHeatMap();
            
        },
        updated() {
            
        }

    }
    

</script>



<style scoped lang="scss">
    .chart {
        
        .chart-container{
            background-color: #F2F2F2;
            border-radius: 8px; 
            //overflow: hidden;           
        }
        .chart-header{
            float: left;
            margin-top:15px; 
            margin-left: 20px;
        }
        .chart-header2{
            float: right;
            margin-right: 20px;
            margin-top:7px; 
        }
        
    }
    /*.chart div {
        height: 400px;
        float: left;
    }*/

    .el-col {
        padding: 5px 20px;
    }
</style>
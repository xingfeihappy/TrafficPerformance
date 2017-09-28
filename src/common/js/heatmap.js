function HeatMap() {
	this.config();
}
HeatMap.prototype = {

	// 初始化参数配置
	config: function(){
		var me = this;
		me.options = {
			// 缓存画布中点数据，并且记录最大值,
			points: {
				max: 0,
				dataMap: {},  //二维能耗数据
				radius:0.006, //圆半径
				opacity: 70,  //透明度
				longLat:[],  //记录已有经纬度
			},
			// 调色板颜色取值范围
			gradient: {0.35: "rgb(0,0,255)", 0.45: "rgb(0,255,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)"}

		};

		// 调色板画布
        var pcanvas = document.createElement("canvas"), pctx = pcanvas.getContext('2d');
        pcanvas.width = 1;
        pcanvas.height = 256;
        pcanvas.style.display = 'none';
		me.options.pctx = pctx;
	},
	/*画圆，(xc,yc)为一个能耗数据的经纬度，以此为圆心，用bresenham算法画一个半径为r的圆，
	圆内各点的能耗值与圆心的距离成反比*/
	mkCircle:function(r,xc,yc,val){
		//console.log(r+" "+xc+" "+yc+" "+val)
		var tmp={};
		var me = this;
		var dataMap = me.options.points.dataMap;
		var longLat  = me.options.points.longLat;
		var max = me.options.points.max;

		//bresenham算法内容
		function makePs(ix,iy){
			if(ix == 0){
				if(iy==0){
					var ps = [[ix,iy]]
				}else{
					var ps = [
						[ix, iy],
						[ix, -iy],
						[iy, ix],
						[-iy, ix]
					]
				}
			}else{
				if(iy==0){
					var ps = [
						[ix, iy],
						[-ix, iy],
						[iy, ix],
						[iy, -ix],
					]
				}else{
					if(ix == iy){
						var ps = [
							[ix, iy],
							[-ix, iy],
							[ix, -iy],
							[-ix, -iy]
						]
					}else{
						var ps = [
							[ix, iy],
							[-ix, iy],
							[ix, -iy],
							[-ix, -iy],
							[iy, ix],
							[-iy, ix],
							[iy, -ix],
							[-iy, -ix]
						]
					}
						
				}
			}
			return ps;
		}
		/*(xc,yc)圆心 | ix,iy偏移量 | val能耗值 | weight权重*/
		function c8(xc,yc,ix, iy, val,weight) {
			// 8 对称性 （bresenham算法内容）
			//console.log("Inter c8()")
			var newLong=0,newLat=0;
			var count=0;         //能耗
			var ii;
			var ps = makePs(ix,iy);
			//构造二维map存放地图上能耗点，dataMap[经度][纬度]=能耗
			for (ii = 0; ii < ps.length; ii ++) {
				newLong = (xc +ps[ii][0]).toFixed(3);
				newLat = (yc + ps[ii][1]).toFixed(3);
				count = Number(val*weight);
				//console.log(count);
				if(!dataMap[newLong]){
					dataMap[newLong]={};
				}
				if(!dataMap[newLong][newLat]){
					dataMap[newLong][newLat] = 0;
					longLat.push([newLong,newLat]);    //记录已有的能耗点经纬度，用于最后遍历上色
				}
				var t = dataMap[newLong][newLat];
				t = (t + count).toFixed(3);
				dataMap[newLong][newLat] = Number(t);
				if(t>max){
					max = t;
					//console.log(max)
				}
			}
		}
		var x=0,y=r,
			iy,
			d= 0.003-2*r
			
		while(x<=y){
			for(iy=x;iy<(y+0.001).toFixed(3);iy= Number((iy+0.001).toFixed(3))){
				//var weight = ((y+0.001-iy)/(y+0.001)).toFixed(2);
				var weight = (1-Math.sqrt(x*x+iy*iy)/r).toFixed(2)
				if(Number(weight) <= 0 ){
					weight = 0.01
				}
				//console.log(x+" "+iy+" "+weight)
				c8(xc,yc,x,iy,val,weight);
			}
			if(d<0){
				d = Number((d+(x*4)+0.006).toFixed(3));
			}else{
				d = Number((d+(x-y)*4+0.001).toFixed(3));
				y = Number((y-0.001).toFixed(3));
			}
			x = Number((x+0.001).toFixed(3));
		}
		me.options.points.dataMap = dataMap;
		me.options.points.longLat = longLat;
		me.options.points.max = max;
	}
}
HeatMap.prototype.getPalette = function() {
	var me = this, gradient = me.options.gradient, pctx = me.options.pctx;
	//缓存调色板数据
	var grad = me.options.pctx.createLinearGradient(0, 0, 1, 256);
	for (var x in gradient) {
		grad.addColorStop(x, gradient[x]);
	}
	pctx.fillStyle = grad;
	pctx.fillRect(0, 0, 1, 256);
	// 返回的是一个一维数组，每一个像素的的颜色有四个值来表示
	// 前三个值表示 红绿蓝，第四个值表示alpha 通道
	// 也就是这个一位数组的长度是: 1 * 256 * 4;
	return pctx.getImageData(0, 0, 1, 256).data;
}
HeatMap.prototype.addPoint = function(x,y,value){
	var me = this;
	var radius = me.options.points.radius;
	me.mkCircle(radius,x,y,value);
	//console.log(me.options.points);
}


export{
    HeatMap
}
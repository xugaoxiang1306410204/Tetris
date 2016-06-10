		//初始化引擎
		init(30,"mylegend",320,480,main,LEvent.INIT);
		//进度条显示层，背景层，方块绘制层，预览层
		var loadingLayer,backLayer,graphicsLayer,nextLayer;
		//存放图片对象的属性
		var imglist = {};
		//图片数据
		var imgData = new Array(
			{name:"backImage",path:"./image/backImage.png"},
			{name:"block1",path:"./image/block1.png"},
			{name:"block2",path:"./image/block2.png"},
			{name:"block3",path:"./image/block3.png"},
			{name:"block4",path:"./image/block4.png"}
			);
		//用于生成方块
		var box;
		//方块坐标数组初始化
		var map;
		var nodelist;
		var bitmapdataList;
		//方块区域起始位置
		var START_X1=15,START_Y1=20,START_X2=228,START_Y2=65;
		//预览方块和当前方块
		var nextBox,nowBox;
		var pointBox ={x:0,y:0};
		var speed=15,speedIndex=0,speedMax=15;
		//控制单元
		var myKey = {
			keyControl:null,
			step:1,
			stepindex:0,
			isTouchDown:false,
			touchX:0,
			touchY:0,
			touchMove:false
		};

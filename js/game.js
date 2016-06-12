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
		var point=0,pointText;
		//消除层数相关
		var del=0,delText;
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
		//main函数
		function main(){
			map =[
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0]
			];
			box = new Box();
			//背景层初始化
			backLayer = new LSprite();
			//在背景层描绘背景
			backLayer.graphics.drawRect(2,"brown",[0,0,350,480],true,"black");
			addChild(backLayer);
			//进度条显示层初始化
			loadingLayer = new LoadingSample1();
			backLayer.addChild(loadingLayer);
			//利用LLoadManage类：进度条的读取与显示
			LLoadManage.load(
				imgData,
				function(progress){
					loadingLayer.setProgress(progress);
			    },
			    function(result){
			    	imglist = result;
					backLayer.removeChild(loadingLayer);
					loadingLayer= null;
					gameInit();
			    }
			);	
			//gameInit();
		}
		//游戏标题画面初始化
		function gameInit(){
			//显示游戏标题
			var title = new LTextField();
			title.x = 100;
			title.y = 100;
			title.text = "俄罗斯方块";
			title.size = 30;
			title.color ="white";
			backLayer.addChild(title);
			//提示信息
			backLayer.graphics.drawRect(1,"white",[50,250,250,30]);
			var infoText = new LTextField();
			infoText.x = 75;
			infoText.y = 250;
			infoText.size = 25;
			infoText.text = "点击页面开始游戏";
			infoText.color = "white";
			backLayer.addChild(infoText);
			//添加鼠标点击事件侦听
			infoText.addEventListener(LMouseEvent.MOUSE_UP,gameStart);
		}
		//游戏画面初始化
		function gameStart(event){
			//背景层清空
			backLayer.die();
			backLayer.removeAllChild();
			var bitmap = new LBitmap(new LBitmapData(imglist["backImage"]));
			backLayer.addChild(bitmap);
			//预览层初始化
			nextLayer = new LSprite();
			backLayer.addChild(nextLayer);
			bitmapdataList = [
				new LBitmapData(imglist["block1"]),
				new LBitmapData(imglist["block2"]),
				new LBitmapData(imglist["block3"]),
				new LBitmapData(imglist["block4"])
			];
			//获得新方块
			getNewBox();
			//在屏幕上添加方块
			addBox();
			//添加循环播放事件
			backLayer.addEventListener(LEvent.ENTER_FRAME, onframe);
			//添加键盘事件用于控制方块移动
			LEvent.addEventListener(LGlobal.window,LKeyboardEvent.KEY_DOWN,onkeydown);
			LEvent.addEventListener(LGlobal.window,LKeyboardEvent.KEY_UP,onkeyup);
		}
		//键盘按下事件
		function onkeydown(event){
			if(myKey.keyControl != null){
				return;
			}
			if(event.keyCode == 37){
				//left
				myKey.keyControl = "left";
			}else if(event.keyCode == 38){
				//up
				myKey.keyControl = "up";
			}else if(event.keyCode == 39){
				//right
				myKey.keyControl = "right";
			}else if(event.keyCode == 40){
				//down
				myKey.keyControl = "down";
			}
		}
		//键盘弹起事件
		function onkeyup(event){
			//弹起后myKey属性恢复默认
			myKey.keyControl = null;
			myKey.stepindex = 0;
		}
		//循环实现方块下落
		function onframe(){
			//首先移除当前下落的方块
			removeBox();
			if(myKey.keyControl != null && myKey.stepindex-- < 0){
				myKey.stepindex = myKey.step;
				switch(myKey.keyControl){
					case "left":
						if(checkBox(-1,0)){
							pointBox.x-=1;
						}
						break;
					case "right":
						if(checkBox(1,0)){
							pointBox.x+=1;
						}
						break;
					case "down":
						if(checkBox(0,1)){
							pointBox.y+=1;
						}
						break;
					case "up":
						changeBox();
						break;	
				}
			}
			if(speedIndex++ > speed){
				speedIndex = 0;
				if(checkBox(0,1)){
					pointBox.y++;
				}else{
					//无法下移
					addBox();
					if(pointBox.y<0){
						gameOver();
						return;
					}
					delBox();
					getNewBox();
				}
			}
			addBox();
			drawMap();
		}
		//方块变形
		function changeBox(){
			var saveBox = nowBox;
			nowBox =[
				[0,0,0,0],
				[0,0,0,0],
				[0,0,0,0],
				[0,0,0,0]
			];
			var i,j;
			for(i=0;i<saveBox.length;i++){
				for(j=0;j<saveBox[0].length;j++){
					nowBox[i][j] = saveBox[3-j][i];
				}
			}
			if (!checkBox(0,0)){
				nowBox = saveBox;
			}
		}
		//绘制所有的方块
		function drawMap(){
			var i,j;
			for(i=0;i<map.length;i++){
				for(j=0;j<map[0].length;j++){
					if(nodelist[i][j]["index"] >=0){
						nodelist[i][j]["bitmap"].bitmapData =bitmapdataList[nodelist[i][j]["index"]];
					}else{
						nodelist[i][j]["bitmap"].bitmapData = null;
					}
				}
			}
		}
		//判断是否可移动
		function checkBox(nx,ny){
			var i,j;
			if(pointBox.y < 0){
				//防止方块下落之前，就已向左或向右移到屏幕之外
				if(pointBox.x + nx < 0 || pointBox.x + nx > map[0].length - 4){
					return false;
				}
			}
			//遍历nowBox数组
			for(i=0;i<nowBox.length;i++){
				for(j=0;j<nowBox[0].length;j++){
					//判断方块网格是否进入map
					if(i+pointBox.y+ny<0){
						continue;
					}else if(i+pointBox.y+ny>=map.length||j+pointBox.x+nx>=map[0].length||j+pointBox.x+nx<0){
						//超出网格范围时
						if(nowBox[i][j] ==0){
							continue;
						}else{
							return false;
						}
					}
					if(nowBox[i][j] > 0 && map[i+pointBox.y+ny][j+pointBox.x+nx]>0){
						return false;
					}
				}
			}
			return true;
		}
		//移除方块
		function removeBox(){
			var i,j;
			for(i=0;i<nowBox.length;i++){
				for(j=0;j<nowBox[0].length;j++){
					if(i+pointBox.y<0||i+pointBox.y>=map.length||j+pointBox.x<0||j+pointBox.x>=map[0].length){
						continue;
					}
					map[i+pointBox.y][j+pointBox.x]=map[i+pointBox.y][j+pointBox.x]-nowBox[i][j];
					nodelist[i+pointBox.y][j+pointBox.x]["index"] = map[i+pointBox.y][j+pointBox.x] -1;
				}
			}
		}
		//将当前方块添加至游戏界面
		function addBox(){
			var i,j;
			for(i=0;i<nowBox.length;i++){
				for(j=0;j<nowBox[0].length;j++){
					if(i+pointBox.y<0||i+pointBox.y>=map.length||j+pointBox.x<0||j+pointBox.x>=map[i].length){
						continue;
					}
					map[i+pointBox.y][j+pointBox.x]=nowBox[i][j]+map[i+pointBox.y][j+pointBox.x];
					nodelist[i+pointBox.y][j+pointBox.x]["index"] = map[i+pointBox.y][j+pointBox.x] -1;
				}
			}
		}
		//获得新方块
		function getNewBox(){
			if(nextBox ==null){
				nextBox = box.getBox();
			}
			nowBox = nextBox;
			//当前下落方块的坐标
			pointBox.x=3;
			pointBox.y=-4;
			nextBox = box.getBox();
			nextLayer.removeAllChild();
			//将nextBox显示在预览层
			var i,j,bitmap;
			for(i=0;i<nextBox.length;i++){
				for(j=0;j<nextBox[0].length;j++){
					if(nextBox[i][j]===0){
						continue;
					}
					bitmap =new LBitmap(bitmapdataList[nextBox[i][j]-1]);
					bitmap.x= bitmap.getWidth()*j+START_X2;
					bitmap.y= bitmap.getHeight()*i+START_Y2;
					nextLayer.addChild(bitmap);
				}
			}
		}
		//消除整行方块
		function moveLine(line){
			var i;
			for(i = line;i>1;i--){
				for(j = 0; j<map[0].length; j++){
					map[i][j] = map[i-1][j];
					nodelist[i][j].index = nodelist[i-1][j].index;
				}
			}
			for(j=0;j<map[0].length;j++){
				map[0][j]= 0;
				nodelist[0][j].index= -1;
			}
		}
		//消除可消除的方块
		function delBox(){
			var i,j,count;
			for(i=pointBox.y;i<(pointBox.y+4);i++){
				if(i<0||i>=map.length)
					continue;
				for(j=0;j<map[0].length;j++){
					if(map[i][j]==0){
						break;
					}
					if(j==map[0].length-1){
						moveLine(i);
						count++;
					}
				}
			}
		}
		//游戏结束
		function gameOver(){
			backLayer.die();
			var over = new LTextField();
			over.color ="red";
			over.size = 40;
			over.text = "Game Over";
			over.x =(LGlobal.width - over.getWidth())*0.5;
			over.y =200;
			backLayer.addChild(over);
		}


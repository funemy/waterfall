	var body = document.body;
	var	topDelta = 10;
	var pageDisplay = {
		//点开每一个小块的具体作业内容页面切换展示
		page: document.getElementsByClassName("detailPage"),
		currentPage: 1,
		pageNumber: 4,
		lock: false,
		direction: null,

		showDetail: function (detailInfoObj){
			/*
			var i,
				imgArr,
				imgArrLen;
			*/
			var detail = document.createElement("div");
			detail.id = "detailWindow";
			detail.innerHTML = "<div id='statusBar'><div id='closeWindow'></div><div id='detailInfo'></div></div><div id='information'><p>作品名称:" + detailInfoObj.title + "</p><p>作者:" + detailInfoObj.author + "</p><p>年级:" + detailInfoObj.grade + "</p><p>作品分类:" + detailInfoObj.category + "</p><p>完成日期:" + detailInfoObj.date + "</p><p>作品分数:" + detailInfoObj.score + "</p><p>指导老师:" + detailInfoObj.teacher + "</p><p>作品简介:" + detailInfoObj.summary + "</p></div><div id='formerPage'></div><div id='nextPage'></div><div id='pictureBox'><img class='detailPage' src='static/images/project/" + md5(detailInfoObj.title) + "-1.jpg'><img class='detailPage' src='static/images/project/" + md5(detailInfoObj.title) + "-2.jpg'><img class='detailPage' src='static/images/project/" + md5(detailInfoObj.title) + "-3.jpg'><img class='detailPage' src='static/images/project/" + md5(detailInfoObj.title) + "-4.jpg'></div>";
			//将弹出窗口加入body中
			document.body.appendChild(detail);
			/*
			imgArr = document.getElementsByClassName("detailPage");
			imgArrLen = imgArr.length;
			for ( i = 0; i < imgArrLen; i++ ) {
				(function (x) {
					imgArr[x].addEventListener("error", function () {
						imgArr[x].remove();
					}, false);
				})(i);
			}
			*/
			//绑定翻页事件
			document.getElementById("formerPage").addEventListener("click",function () {
				pageDisplay.formerPage();
			},false);
			document.getElementById("nextPage").addEventListener("click",function () {
				pageDisplay.nextPage();
			},false);
			document.getElementById("closeWindow").addEventListener("click",function () {
				pageDisplay.removeDetail(detail);
			});
			document.getElementById("detailInfo").addEventListener("click",function () {
				pageDisplay.detailPage(detailInfoObj);
			});
			document.getElementById("pictureBox").addEventListener("click",function () {
				pageDisplay.removeDetail(detail);
			});

			//解决fixed布局超出页面部分无法滚动的问题
			var detailWindow = document.getElementById("detailWindow");
			detailWindow.style.top = topDelta + "px";
			window.addEventListener("mousewheel",pageDisplay.windowScroll,false);
		},

		detailPage: function (){
			var detailPage = document.getElementById("information");
			var detailPageVis = document.getElementById("information").style.visibility;
			if ( !detailPageVis || detailPageVis === "hidden" ) {
				detailPage.style.visibility = "visible";
			} else if ( detailPageVis === "visible" ) {
				detailPage.style.visibility = "hidden";
			}
		},

		removeDetail: function (node){
			document.body.removeChild(node);
			window.removeEventListener("mousewheel",pageDisplay.windowScroll);
		},

		bindDetailPage: function ( blockArr ){
			//将detailPage遍历与每个block绑定
			var i,
			j,
			imgArr = [],
			currentLen = detailInfoArr.length,
			imgArrLen,
			blockArrLen = blockArr.length;

			for ( i = 0; i < blockArrLen; i++ ) {
				imgArr.push(blockArr[i].children[0]);
			}
			
			imgArrLen = imgArr.length;

			//为了把参数传入addEventListener里，所以用了一个立即函数
			for ( i = 0; i < imgArrLen; i++ ) {
				for ( j = 0; j < currentLen; j++ ) {
					if ( imgArr[i].title == detailInfoArr[j].title ) {
						(function (x) {
							imgArr[i].addEventListener("click",function () {
								pageDisplay.showDetail(detailInfoArr[x]);
							},false);
						})(j);
						break;
					}
				}
			}
		},

		formerPage: function (){
			//向后翻页函数
			if ( this.currentPage > 1 ) {
				this.page[this.currentPage-1].style.zIndex = 0;
				this.currentPage -= 1;
				this.page[this.currentPage-1].style.opacity = 1;
				this.page[this.currentPage-1].style.zIndex = 9;
				this.page[this.currentPage].style.opacity = 0;
			} else if ( this.currentPage <= 1 ) {
				this.page[this.currentPage-1].style.zIndex = 0;
				this.currentPage = this.pageNumber;
				this.page[this.currentPage-1].style.opacity = 1;
				this.page[this.currentPage-1].style.zIndex = 9;
				this.page[0].style.opacity = 0;
			}
		},

		nextPage: function (){
			//向后翻页函数
			if ( this.currentPage < this.pageNumber ) {
				this.page[this.currentPage-1].style.zIndex = 0;
				this.currentPage += 1;
				this.page[this.currentPage-1].style.opacity = 1;
				this.page[this.currentPage-1].style.zIndex = 9;
				this.page[this.currentPage-2].style.opacity = 0;
			} else if ( this.currentPage >= this.pageNumber ) {
				this.page[this.currentPage-1].style.zIndex = 0;
				this.currentPage = 1;
				this.page[this.currentPage-1].style.opacity = 1;
				this.page[this.currentPage-1].style.zIndex = 9;
				this.page[this.pageNumber-1].style.opacity = 0;
			}
		},

		windowScroll: function (event){
			var e = event || window.event;
			if ( topDelta <= 20 && topDelta >= -850 ) {
				topDelta += e.wheelDelta / 10;
				if ( topDelta >= 20 ) {
					topDelta = 20;
					detailWindow.style.top = topDelta + "px";
					console.log(topDelta);
				} else if ( topDelta <= -850 ) {
					topDelta = -850;
					detailWindow.style.top = topDelta + "px";
				}
				detailWindow.style.top = topDelta + "px";
			}
		},
	};

	var waterfall = {
		colWidth: 220,
		spaceWidth: 15,

		measureBlockHeight: function () {
			//计算每个生成块的高度
			var imgHeight,
			tmpHeight,
			imgArr = document.getElementsByClassName("preview");
			var heightArr = [];
			var getStyle = document.defaultView.getComputedStyle;

			for ( var i = 0; i < imgArr.length; i++ ) {
				imgHeight = parseInt(getStyle(imgArr));
				tmpHeight = imgHeight + 90;
				heightArr.push(tmpHeight);
			}

			return heightArr;
		},

		measureColNum: function (clientWidth) {
			//计算在当前浏览器宽度下能放置几条瀑布流
			var colNum = clientWidth / ( this.colWidth + this.spaceWidth * 2 );
			return Math.floor(colNum);
		},

		creatCol: function (colNum) {
			//根据计算得到的瀑布流列数生成相应的瀑布列
			var col = document.createElement("div");
			var container = document.getElementById("waterfallContainer");
			var i;
			//通过类名设置列的样式
			col.className = "column";

			for ( i=0; i < colNum; i++ ) {
				container.appendChild(col.cloneNode());
			}
		},

		createBlockArr: function (dataArr) {
			//向下滚动时自动生成新的块,返回生成块的数组
			var i,
			j,
			currentLen = detailInfoArr.length,
			block,
			blockArr = [];

			block = document.createElement("div");
			block.className = "waterBlock";

			for ( i = 0, j = currentLen; i < dataArr.project.length; i++, j++) {
				//下面代码块的地址和参数有部分待改
				block = block.cloneNode();
				block.innerHTML = "<!-- 瀑布块 --><img class='preview' title=" + dataArr.project[i].title + " src='/static/images/project/" + md5(dataArr.project[i].title) + "-0.jpg' alt='preview'><div class='workName' style='position: relative;'><b style='position: absolute;bottom: 5px;left: 5px;'>" + dataArr.project[i].title + "</b></div><div class='favor' id=" + dataArr.project[i].id + "><img src='static/images/favor.png' style='position: relative;top: 10px;'><span style='font-size: 8px;position: relative;top: 8px;'>" + dataArr.project[i].favor + "</span></div><div class='authorAndDate'><div style='position: relative;left: 8px;padding-top: 8px;font-size: 12px;'>" + dataArr.project[i].author + "</div></div>";
				detailInfoArr[j] = {
					title: dataArr.project[i].title,
					author: dataArr.project[i].author,
					grade: dataArr.project[i].grade,
					category: dataArr.project[i].category,
					date: dataArr.project[i].date,
					score: dataArr.project[i].score,
					teacher: dataArr.project[i].teacher,
					summary: dataArr.project[i].summary
				};

				blockArr.push(block);
			}

			return blockArr;
		},

		creatWaterfall: function (blockArr,colNum) {
			//将生成的块一次插入html生成瀑布
			var i,
			tmp,
			blockGroup = [],
			col = document.getElementsByClassName("column"),
			frag = document.createDocumentFragment(),
			favorArr = document.getElementsByClassName("favor");

			//根据列数创建dom碎片
			for ( i = 0; i < colNum; i++ ) {
				blockGroup.push(frag.cloneNode());
			}
			//将block以此插入碎片中
			for ( i = 0; i < blockArr.length; i++ ) {
				//blockGroup[0].appendChild(blockArr[i]);
				blockGroup[i%colNum].appendChild(blockArr[i]);
			}
			//将碎片流插入网页中
			for ( i = 0; i < colNum; i++ ) {
				col[i].appendChild(blockGroup[i]);
			}
			//设置每个瀑布块的高度
			//为点赞绑定事件
			var heightArr = this.measureBlockHeight();
			for ( i = 0; i < blockArr.length; i++ ) {
				blockArr[i].style.width = heightArr[i];
				favorArr[i].addEventListener("click",function () {
					waterfall.favor(this.id);
					this.children[1].innerHTML = parseInt(this.children[1].innerHTML)+1;
				},false);
			}

			return blockArr;
		},

		showWaterfall: function (blockArr){
			//将插入的瀑布块显示出来，主要是为了先给瀑布块加载样式的无奈之举
			for ( i = 0; i < blockArr.length; i++ ) {
				blockArr[i].style.webkitTransform = "none";
				blockArr[i].style.opacity = 1;
			}
		},

		favor: function (id) {
			var xhr;
			xhr = new XMLHttpRequest;
			xhr.open("GET","/favor?id=" + id)
			xhr.send();
		}
	};

	//分类导航栏的点击事件
	function navigation () {
		var navBar = document.getElementById("navigation");
		var navBarVis = document.getElementById("navigation").style.visibility;
		if ( !navBarVis || navBarVis === "hidden" ) {
			navBar.style.visibility = "visible";
		} else if ( navBarVis === "visible" ) {
			navBar.style.visibility = "hidden";
		}
	}

	//用AJAX向服务器请求数据
	function getData () {
		var xhr,
		data;
		xhr = new XMLHttpRequest;
		xhr.open("GET","/follow",false);
		xhr.send();

		data = JSON.parse(xhr.responseText);
		return data;
	}

	//选择按分类显示作品时向服务器发送特定请求
	function sendRequest (request) {
		var xhr,
		data;
		xhr = new XMLHttpRequest;
		xhr.open("GET","/search?" + request,false);
		xhr.send();

		data = JSON.parse(xhr.responseText);
		return data;
	}

	//因为不想在js里写一堆事件绑定所以写了一个函数放到html的onclick里面去了
	function displayInCat (request) {
		var i,
		data,
		currentCol = [];
		requestData = sendRequest(request);

		if ( requestData ) {
			currentCol = document.getElementsByClassName("column");
			
			for ( i = 0; i < colNum; i++ ) {
				document.getElementById("waterfallContainer").removeChild(currentCol[0]);
			}
			
			waterfall.creatCol(colNum);
			tmpBlockArr = waterfall.createBlockArr(requestData);
			tmpBlockArr = waterfall.creatWaterfall(tmpBlockArr,colNum);
			pageDisplay.bindDetailPage(tmpBlockArr);
			setTimeout(function () {
				waterfall.showWaterfall(tmpBlockArr);
			},200);
			document.getElementById("navigation").style.visibility = "hidden";
		}
	}

	//页面初次执行函数
	var tmpBlockArr,
	data;
	detailInfoArr = [];
	var clientWidth = document.body.clientWidth;
	var colNum = waterfall.measureColNum(clientWidth);

	data = getData();

	waterfall.creatCol(colNum);
	tmpBlockArr = waterfall.createBlockArr(data);
	tmpBlockArr = waterfall.creatWaterfall(tmpBlockArr,colNum);
	pageDisplay.bindDetailPage(tmpBlockArr);
	setTimeout(function () {
		waterfall.showWaterfall(tmpBlockArr); 
	},200);

	//各种事件的绑定和函数的执行
	document.getElementById("menuButton").addEventListener("click",navigation,false);

	//当滚动到底部时再次获取数据
	document.addEventListener("mousewheel",function(){
		console.log("1");
		if ( (body.scrollHeight - body.scrollTop) <= 768 ) {
			console.log("1")
			var tmpBlockArr,
			data;

			data = getData();
			
			tmpBlockArr = waterfall.createBlockArr(data);
			tmpBlockArr = waterfall.creatWaterfall(tmpBlockArr,colNum);
			pageDisplay.bindDetailPage(tmpBlockArr);
			setTimeout(function () {
				waterfall.showWaterfall(tmpBlockArr); 
			},200);
		}
	},false);

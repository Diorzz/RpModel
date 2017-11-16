//10000个订单
for (var j = 0; j < 35000; j++) {

	//按天选
	var len = Buyers.length;
	var pos = j % len
	currentBuyer = Buyers[pos]
		//随机选用户
		// var x = Math.floor(Math.random() * 99)
		// var currentBuyer = Buyers[x]
	var currentSeller = findSeller();

	typeof badTransactions1[currentBuyer.BID] == "undefined" ? badTransactions1[currentBuyer.BID] = [] : 1;
	typeof badTransactions2[currentBuyer.BID] == "undefined" ? badTransactions2[currentBuyer.BID] = [] : 1;
	typeof badTransactions3[currentBuyer.BID] == "undefined" ? badTransactions3[currentBuyer.BID] = [] : 1;

	//买家类型为1
	if (currentBuyer.type == 1) {

		if (badTransactions1[currentBuyer.BID].length >= 50) {
			//currentBuyer.type = 3
			//currentBuyer.isChange = true;
			//console.error("type:1 , " + currentBuyer.BID)
			continue
		}
		while (currentSeller.honesty < 0.5 || findIn(currentSeller, badTransactions1[currentBuyer.BID])) {
			currentSeller = findSeller()
		}
		var R = Math.random()
		if (R > currentSeller.honesty) {
			badBehavior = false;
			badTransactions1[currentBuyer.BID].push(currentSeller)
		}

	}
	//买家类型为2
	if (currentBuyer.type == 2) {
		if (badTransactions2[currentBuyer.BID].length >= 40) {
			//console.error("type:2 , " + currentBuyer.BID)

			//currentBuyer.type = 3
			//currentBuyer.isChange = true;
			continue;
		}
		while (currentSeller.honesty >= 0.5 || findIn(currentSeller, badTransactions2[currentBuyer.BID])) {
			currentSeller = findSeller()
		}
		var R = Math.random()
		if (R > currentSeller.honesty) {
			badBehavior = false;
			badTransactions2[currentBuyer.BID].push(currentSeller)
		}
	}
	//买家类型为3
	if (currentBuyer.type == 3) {

		// if (currentBuyer.originalType != 3) {
		// 	currentBuyer.originalType = 3;
		// 	typeof goodTransaction[currentBuyer.BID] == "undefined" ? goodTransaction[currentBuyer.BID] = [] : 1;

		// 	currentBuyer.isChange = true;
		// 	var nextSeller = findsellerp()
		// 	goodTransaction[currentBuyer.BID].push(nextSeller)
		// 	currentSeller = nextSeller
		// 		//console.log("x1:"+goodTransaction[currentBuyer.BID]+", "+nextSeller)

		// } 
		// else if (currentBuyer.isChange) {
		// 	badTransactions3[currentBuyer.BID] = [];
		// 	//console.log("xx:"+goodTransaction[currentBuyer.BID])
		// 	currentSeller = goodTransaction[currentBuyer.BID][0]

		// } 
		if (badTransactions3[currentBuyer.BID].length >= 50) {
			// typeof goodTransaction[currentBuyer.BID] == "undefined" ? goodTransaction[currentBuyer.BID] = [] : 1;

			// currentBuyer.isChange = true;
			// var nextSeller = findsellerp()
			// goodTransaction[currentBuyer.BID].push(nextSeller)
			// currentSeller = nextSeller
			continue;

		} else {
			//找即将交易的seller
			function findNextSeller(seller) {
				var R = Math.random()
				if (R > seller.honesty) {
					badBehavior = false
					var nextSeller = findSeller()
					while (nextSeller.honesty < 0.5) {
						nextSeller = findSeller()
					}
					badTransactions3[currentBuyer.BID].push(nextSeller)
				}
			}
			//回购
			if (badTransactions3[currentBuyer.BID].length != 0) {
				currentSeller = badTransactions3[currentBuyer.BID][badTransactions3[currentBuyer.BID].length - 1]
				findNextSeller(currentSeller);

			}
			//第一次交易
			else {
				while (currentSeller.honesty < 0.5) {
					currentSeller = findSeller()
				}
				badTransactions3[currentBuyer.BID].push(currentSeller)
				findNextSeller(currentSeller);
			}
		}

	}
	//if (typeof currentSeller == "undefined")
	//console.log(currentBuyer)
	updateCredibility(currentBuyer, currentSeller)
	updateHonest(currentSeller)
	currentBuyer.utility = currentBuyer.Cj * currentSeller.honesty * 4

	var Transaction = {
		"buyer": currentBuyer,
		"seller": currentSeller,
		"Tid": j + 1,
		"truePrice": currentSeller.price - currentBuyer.Cj * currentSeller.honesty * 4,
		"Wij": calculateWij(currentBuyer, currentSeller),
		'ratting': currentSeller.honesty,
		"bt": currentBuyer.type,
		"butility": currentBuyer.utility

	}
	console.log("订单：" + j);
	//评价
	if (badBehavior) {
		Transactions[Transactions.length - 1].ratting = 1 - currentSeller.honesty
	}
	Transactions.push(Transaction)
	
}


function sumprice(array) {
	var sum = 0;
	array.forEach((item) => {
		sum += item.truePrice
	})
	return sum;
}
var myChart = echarts.init(document.getElementById('main'));



function min(a, b, c) {
	var result = []
	result.push(a.length)
	result.push(b.length)
	result.push(c.length)

	result.sort();
	return result[0]

}

//卖家的订单总数
var s1=Transactions.filter((item)=>{
	if(item.seller.type==1)
		return true;
}).length

var s2=Transactions.filter((item)=>{
	if(item.seller.type==2)
		return true;
}).length
var s3=Transactions.filter((item)=>{
	if(item.seller.type==3)
		return true;
}).length
var s4=Transactions.filter((item)=>{
	if(item.seller.type==4)
		return true;
}).length
var s5=Transactions.filter((item)=>{
	if(item.seller.type==5)
		return true;
}).length
var s6=Transactions.filter((item)=>{
	if(item.seller.type==6)
		return true;
}).length
var s7=Transactions.filter((item)=>{
	if(item.seller.type==7)
		return true;
}).length
var s8=Transactions.filter((item)=>{
	if(item.seller.type==8)
		return true;
}).length
var s9=Transactions.filter((item)=>{
	if(item.seller.type==9)
		return true;
}).length

var xd=[0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9]
//console.log(price9)

//指定图表的配置项和数据
var option = {
	title: {
		text: 'Seller Order Number',
	},
	tooltip: {},
	toolbox: {
		show: true,
		feature: {
			mark: {
				show: true
			},
			dataZoom: {
				show: true
			},
			dataView: {
				show: true,
				readOnly: false
			},
			restore: {
				show: true
			},
			saveAsImage: {
				show: true
			}
		}
	},
	legend: {
		
	},
	xAxis: {
		data: xd
	},
	yAxis: {
		
	},
	series: [{
		name: '1',
		type: 'line',
		smooth: true,
		data: [s1,s2,s4,s4,s5,s6,s7,s8,s9]
	}]
};

// 使用刚指定的配置项和数据显示图表。
myChart.setOption(option);
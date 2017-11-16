function createOrder(rate) {
	//10000个订单
	for (var j = 0; j < 50000; j++) {

		//console.log(j+" Start")
		//按天选
		var len = Buyers.length;
		var pos = j % len
		currentBuyer = Buyers[pos]
		var badrat = false;
		var currentSeller = findSeller();

		typeof badTransactions1[currentBuyer.BID] == "undefined" ? badTransactions1[currentBuyer.BID] = [] : 1;
		typeof badTransactions2[currentBuyer.BID] == "undefined" ? badTransactions2[currentBuyer.BID] = [] : 1;
		typeof badTransactions3[currentBuyer.BID] == "undefined" ? badTransactions3[currentBuyer.BID] = [] : 1;

		//买家类型为1
		if (currentBuyer.type == 1) {
			if (badTransactions1[currentBuyer.BID].length >= getHighRpSellerNum(Sellers)) {
				continue
			}
			while (currentSeller.honesty < 0.5 || isSellerIn(currentSeller, badTransactions1[currentBuyer.BID])) {
				currentSeller = findSeller()
			}
			var R = Math.random()
			if (R > currentSeller.honesty) {
				badrat = true;
				badTransactions1[currentBuyer.BID].push(currentSeller)
			}

		}
		//买家类型为2
		if (currentBuyer.type == 2) {
			if (badTransactions2[currentBuyer.BID].length >= getLowRpSellerNum(Sellers)) {
				// type2num+=1;
				// if(type2num>=33)
				// 	break
				continue;
			}
			while (currentSeller.honesty >= 0.5 || isSellerIn(currentSeller, badTransactions2[currentBuyer.BID])) {
				currentSeller = findSeller()
			}
			var R = Math.random()
			if (R > currentSeller.honesty) {
				badrat = true;
				badTransactions2[currentBuyer.BID].push(currentSeller)
			}
		}
		//买家类型为3
		if (currentBuyer.type == 3) {
			if (badTransactions3[currentBuyer.BID].length >= getHighRpSellerNum(Sellers)) {
				continue;

			} else {
				//找即将交易的seller
				function findNextSeller(seller) {
					var R = Math.random()
					if (R > seller.honesty) {
						badrat = true;
						var nextSeller = findSeller()
						while (nextSeller.honesty < seller.honesty && isSellerIn(currentSeller, badTransactions3[currentBuyer.BID])) {
							nextSeller = findSeller()
						}
						badTransactions3[currentBuyer.BID].push(nextSeller)
					}
				}
				//回购
				if (badTransactions3[currentBuyer.BID].length != 0) {
					//取上次的交易商家，交易完判断商家是否
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

		//console.log(j)
		//差评虚拟
		var sp = currentSeller.honesty;
		if (badrat) {
			badrat = false;
			var R = Math.random()
			if (R < rate) {
				R = Math.random()
				while (R < currentSeller.honesty) {
					R = Math.random()
				}
				sp = R
			} else {
				R = Math.random()
				while (R > currentSeller.honesty) {
					R = Math.random()
				}
				sp = R
			}
		}
		//好评虚拟
		else {
			var R = Math.random()
				//0.5几率给差评
			if (R < rate) {
				R = Math.random()
					//随机找到小于原商家honesty的值
				while (R > currentSeller.honesty) {
					R = Math.random()
				}
				sp = R
			}
		}

		updateCredibility(currentBuyer, currentSeller)
		updateHonest(currentSeller)
		currentBuyer.utility = currentBuyer.Cj * currentSeller.honesty * 4

		var Transaction = {
			"buyer": currentBuyer,
			"seller": currentSeller,
			"Tid": j + 1,
			"truePrice": currentSeller.price - currentBuyer.Cj * currentSeller.honesty * 4,
			"Wij": calculateWij(currentBuyer, currentSeller),
			'ratting': sp,
			"bt": currentBuyer.type,
			"butility": currentBuyer.utility,
			"cj": currentBuyer.Cj,
			"mcash": currentBuyer.Cj * currentSeller.honesty * 4
		}

		
		console.log("单号("+rate+"虚假)："+j)
		Transactions.push(Transaction)


		// if (pos == 0 && j != 0) {


		// 	var c1 = Transactions.filter((item) => {
		// 		if (item.buyer.type == 1)
		// 			return true
		// 	})
		// 	var c2 = Transactions.filter((item) => {
		// 		if (item.buyer.type == 2)
		// 			return true
		// 	})

		// 	var c3 = Transactions.filter((item) => {
		// 		if (item.buyer.type == 3)
		// 			return true
		// 	})

		// 	var tmps1 = 0,
		// 		tmps2 = 0,
		// 		tmps3 = 0



		// 	c1.forEach((item) => {
		// 		tmps1 += item.cj
		// 	})
		// 	c2.forEach((item) => {
		// 		tmps2 += item.cj
		// 	})
		// 	c3.forEach((item) => {
		// 		tmps3 += item.cj
		// 	})
		// 	b1p.push(tmps1 / c1.length)
		// 	b2p.push(tmps2 / c2.length)
		// 	b3p.push(tmps3 / c3.length)
		// 	ss += 1;
		// 	xz.push(ss)
		// }

	}
}

function getavg(array,interval){
	var result = []
	var tmp = 0;
	for(var i = 0 ;i<array.length;i++){
		tmp+=array[i];
		if(i % interval == 0 && i != 0){
			result.push(tmp/interval)
			tmp = 0
		}
	}
	result.push(tmp/interval)
	console.log(result)
	return result;
}

init()
createBuyer(99)
createSeller(180)
createOrder(0.3)
var xdata1 = [10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180]
var ydata1 = []
Sellers.forEach(function(item){
	ydata1.push(item.Rj)
})

init()
createBuyer(99)
createSeller(180)
createOrder(0.6)
var ydata2 = []
Sellers.forEach(function(item){
	ydata2.push(item.Rj)
})

init()
createBuyer(99)
createSeller(180)
createOrder(0.9)

var ydata3 = []
Sellers.forEach(function(item){

	ydata3.push(item.Rj)
})

console.log(Sellers)
// var b1 = b3p
// init()
// createBuyer(99)
// createSeller(180)
// createOrder(0.6)
// var b2 = b3p
// init()
// createBuyer(99)
// createSeller(180)
// createOrder(0.9)
// var b3 = b3p

// console.table(Buyers)
// console.table(Sellers)


var myChart = echarts.init(document.getElementById('main'));



//指定图表的配置项和数据
var option = {
	title: {
		text: 'Seller Order Number',
		subtext:'Three Type False Evaluation'
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
		data: [{
			name: '30%',
			icon: 'circle'
		}, {
			name: '60%',
			icon: 'triangle'
		}, {
			name: '90%',
		}]
	},
	xAxis: {
		data: xdata1,
		axisLabel:{
			interval:0
		}
	},
	yAxis: {
		//min: 16,
		//max: 20
	},
	series: [{
		name: '30%',
		type: 'line',
		smooth: true,
		data: getavg(ydata1,10),
		lineStyle: {
			normal: {
				type: "dotted"
			}
		},
		symbol: 'circle',
		label: {
			emphasis: {
				show: true
			}
		},
		clipOverFlow: true,
		symbolSize: 10
	}, {
		name: '60%',
		type: 'line',
		smooth: true,
		data: getavg(ydata2,10),
		lineStyle: {
			normal: {
				type: "dashed"
			}
		},
		clipOverFlow: true,
		symbol: 'triangle',
		symbolSize: 10
	}, {
		name: '90%',
		type: 'line',
		smooth: true,
		symbolSize: 10,
		data: getavg(ydata3,10),
		clipOverFlow: true,
	}]
};

// 使用刚指定的配置项和数据显示图表。
myChart.setOption(option);
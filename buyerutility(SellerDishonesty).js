/*
 * 用户类型改变不依概率选择商家，Buyer的Utility
 */
//10000个订单
function createOrder(num, rate) {
	for (var j = 0; j < num; j++) {

		//按天选
		var len = Buyers.length;
		var pos = j % len
		currentBuyer = Buyers[pos]
		var currentSeller = findSeller();
		var badrat = false;

		typeof badTransactions1[currentBuyer.BID] == "undefined" ? badTransactions1[currentBuyer.BID] = [] : 1;
		typeof badTransactions2[currentBuyer.BID] == "undefined" ? badTransactions2[currentBuyer.BID] = [] : 1;
		typeof badTransactions3[currentBuyer.BID] == "undefined" ? badTransactions3[currentBuyer.BID] = [] : 1;

		//买家类型为1
		if (currentBuyer.type == 1) {

			if (badTransactions1[currentBuyer.BID].length >= 50) {
				currentBuyer.type = 3
				currentBuyer.isChange = true;
				continue
			}
			//寻找信誉大于0.5的且从未交易过的商家
			while (currentSeller.honesty < 0.5 || isSellerIn(currentSeller, badTransactions1[currentBuyer.BID])) {
				currentSeller = findSeller()
			}
			//一定概率不交易
			var R = Math.random()
			if (R > currentSeller.honesty) {
				badrat = true;
				badTransactions1[currentBuyer.BID].push(currentSeller)
			}

		}
		//买家类型为2
		if (currentBuyer.type == 2) {
			if (badTransactions2[currentBuyer.BID].length >= 40) {
				currentBuyer.type = 3
				currentBuyer.isChange = true;
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
						badrat = true;
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
			"butility": currentBuyer.utility

		}
		console.log("订单：" + j);

		Transactions.push(Transaction)
		if (pos == 0) {
			var price1 = Transactions.filter((item) => {
				if (item.bt == 1)
					return true
			})

			var price2 = Transactions.filter((item) => {
				if (item.bt == 2)
					return true
			})

			var price3 = Transactions.filter((item) => {
				if (item.bt == 3)
					return true
			})
			var tmps1 = 0,
				tmps2 = 0,
				tmps3 = 0
			price1.forEach((item) => {
				tmps1 += item.butility
			})
			price2.forEach((item) => {
				tmps2 += item.butility
			})
			price3.forEach((item) => {
				tmps3 += item.butility
			})
			s1 += tmps1;
			s2 += tmps2;
			s3 += tmps3
			b1p.push(tmps1)
			b2p.push(tmps2)
			b3p.push(tmps3)
			ss += 1;
			xz.push(ss)
			console.log(tmps2)
		}
	}
}
init()
createBuyer(99)
createSeller(180)
createOrder(30200,0)

function sumprice(array) {
	var sum = 0;
	array.forEach((item) => {
		sum += item.truePrice
	})
	return sum;
}
var myChart = echarts.init(document.getElementById('main'));



var price1 = Transactions.filter((item) => {
	if (item.bt == 1)
		return true
})

var price2 = Transactions.filter((item) => {
	if (item.bt == 2)
		return true
})

var price3 = Transactions.filter((item) => {
	if (item.bt == 3)
		return true
})

function min(a, b, c) {
	var result = []
	result.push(a.length)
	result.push(b.length)
	result.push(c.length)

	result.sort();
	return result[0]

}
console.log(price1.length + ", " + price2.length + ", " + price3.length)
var x = Buyers.filter((item) => {
	if (item.type == 1)
		return true;
})
console.log(x + " , " + ss)

//console.log(price9)

//指定图表的配置项和数据
var option = {
	title: {
		text: 'Buyer Utility',
		subtext: 'Seller Dishonesty',
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
			name: '1',
			icon: 'circle'
		}, {
			name: '2',
			icon: 'triangle'
		}, {
			name: '3',
		}]
	},
	xAxis: {
		data: xz
	},
	yAxis: {
		max: 50000
	},
	series: [{
		name: '1',
		type: 'line',
		smooth: true,
		data: b1p,
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
		name: '2',
		type: 'line',
		smooth: true,
		data: b2p,
		lineStyle: {
			normal: {
				type: "dashed"
			}
		},
		clipOverFlow: true,
		symbol: 'triangle',
		symbolSize: 10
	}, {
		name: '3',
		type: 'line',
		smooth: true,
		symbolSize: 10,
		data: b3p,
		clipOverFlow: true,

		markLine: {
			data: [{
				type: 'max',
				name: 'max'
			}]
		}
	}]
};

// 使用刚指定的配置项和数据显示图表。
myChart.setOption(option);
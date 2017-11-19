/**
 * 第一类实验：Buyer：Price
 * 程序设定：
 * 1.第一类、第二类用户不变，Wij=1，始终更新Cj，Cj~=Rk_j
 * 2.好评差评随机给分（大于或小于其honesty的分数）
 * 3.计算Rj默认返回值为seller.honesty
 * 4.Cj默认返回值为0
 * 5.Rj默认初始值为seller.honesty
 * 
 */

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
		typeof TransactionsB[currentBuyer.BID] == "undefined" ? TransactionsB[currentBuyer.BID] = [] : 1;
		typeof type3LastTx[currentBuyer.BID] == "undefined" ? type3LastTx[currentBuyer.BID] = [] : 1;
		//买家类型为1
		if (currentBuyer.type == 1) {

			if (badTransactions1[currentBuyer.BID].length >= 100) {
				//currentBuyer.type = 3
				//currentBuyer.isChange = true;
				continue
			}
			//寻找信誉大于0.5的且从未交易过的商家
			while (currentSeller.honesty < 0.5 || isSellerIn(currentSeller, badTransactions1[currentBuyer.BID])) {
				currentSeller = findSeller()
			}
			// var tx = TransactionsB[currentBuyer.BID].filter(function(item){
			// 	if(item.seller.SID == currentSeller.SID){
			// 		return true;
			// 	}
			// })
			// if(tx){
			// 	updateCredibility(currentBuyer, currentSeller)
			// }
			//一定概率不交易
			var R = Math.random()
			if (R > currentSeller.honesty) {
				badrat = true;
				badTransactions1[currentBuyer.BID].push(currentSeller)
			}

		}
		//买家类型为2
		if (currentBuyer.type == 2) {
			if (badTransactions2[currentBuyer.BID].length >= 80) {
				//currentBuyer.type = 3
				//currentBuyer.isChange = true;
				continue;
			}
			while (currentSeller.honesty >= 0.5 || isSellerIn(currentSeller, badTransactions2[currentBuyer.BID])) {

				currentSeller = findSeller()
			}
			// var tx = TransactionsB[currentBuyer.BID].filter(function(item){
			// 	if(item.seller.SID == currentSeller.SID){
			// 		return true;
			// 	}
			// })
			// if(tx){
			// 	updateCredibility(currentBuyer, currentSeller)
			// }


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
			if (badTransactions3[currentBuyer.BID].length >= 100) {
				// typeof goodTransaction[currentBuyer.BID] == "undefined" ? goodTransaction[currentBuyer.BID] = [] : 1;

				// currentBuyer.isChange = true;
				// var nextSeller = findsellerp()
				// goodTransaction[currentBuyer.BID].push(nextSeller)
				// currentSeller = nextSeller
				continue;

			} else {
				//回购
				if (type3LastTx[currentBuyer.BID].length != 0) {
					currentSeller = type3LastTx[currentBuyer.BID][0];
					var R = Math.random()
					if (R > currentSeller.honesty) {
						badrat = true;
						badTransactions3[currentBuyer.BID].push(currentSeller)
						if (badTransactions3[currentBuyer.BID].length >= 100)
							continue;
						//找到下次要交易的商家
						var nextSeller = findSeller()
						while (nextSeller.honesty < 0.5 || isSellerIn(nextSeller, badTransactions3[currentBuyer.BID])) {
							nextSeller = findSeller()
						}
						type3LastTx[currentBuyer.BID][0] = nextSeller;
						
						updateCredibility(currentBuyer, currentSeller)
					}

				}
				//第一次交易
				else {
					while (currentSeller.honesty < 0.5) {
						currentSeller = findSeller()
					}
					//如果交易失败，给差评
					var R = Math.random()
					if (R > currentSeller.honesty) {
						badrat = true;
						badTransactions3[currentBuyer.BID].push(currentSeller)
						if (badTransactions3[currentBuyer.BID].length >= 100)
							continue;
						//重新寻找下一个要交易的商家
						var nextSeller = findSeller()
						while (nextSeller.honesty < 0.5 || isSellerIn(nextSeller, badTransactions3[currentBuyer.BID])) {
							nextSeller = findSeller()
						}
						type3LastTx[currentBuyer.BID][0] = nextSeller;
						
					}
					else{
						type3LastTx[currentBuyer.BID][0] = currentSeller
					}
				}
			}

		}

		//差评虚拟
		var sp = currentSeller.honesty;
		if (badrat) {
			badrat = false;
			var R = Math.random()
			if(currentSeller.honesty > 0.5){
				while (R > currentSeller.honesty ) {
					R = Math.random()
				}
				sp = R
			}
			else{
				while (R > currentSeller.honesty) {
					R = Math.random()
				}
				sp = R
			}
			
			// if (R < rate) {
			// 	R = Math.random()
			// 	while (R < currentSeller.honesty) {
			// 		R = Math.random()
			// 	}
			// 	sp = R
			// } else {
			// 	R = Math.random()
			// 	while (R > currentSeller.honesty) {
			// 		R = Math.random()
			// 	}
			// 	sp = R
			// }
		}
		//好评虚拟
		else {
			var R = Math.random()
			while (R < currentSeller.honesty) {
				R = Math.random()
			}
			sp = R
			// var R = Math.random()
			// 	//0.5几率给差评
			// if (R < rate) {
			// 	R = Math.random()
			// 		//随机找到小于原商家honesty的值
			// 	while (R > currentSeller.honesty) {
			// 		R = Math.random()
			// 	}
			// 	sp = R
			// }
		}
		
		typeof TransactionsS[currentSeller.SID] == "undefined" ? TransactionsS[currentSeller.SID] = [] : 1;
		
		
		
		currentBuyer.utility = currentBuyer.Cj * currentSeller.honesty * 4

		var Transaction = {
			"buyer": currentBuyer,
			"seller": currentSeller,
			"Tid": j + 1,
			"truePrice": currentSeller.price - currentBuyer.Cj * currentSeller.honesty * 4,
			"Wij": currentBuyer.type == 3 ? calculateWij(currentBuyer, currentSeller) : 1,
			'ratting': sp,
			"bt": currentBuyer.type,
			"butility": currentBuyer.utility,
			"Rk_j":getRjExceptBuyer(currentSeller,currentSeller)

		}
		TransactionsB[currentBuyer.BID].push(Transaction)
		TransactionsS[currentSeller.SID].push(Transaction)
		//console.log("订单：" + j);

		Transactions.push(Transaction)
		updateHonest(currentSeller)
		if(currentBuyer.type!=3){
			updateCredibility(currentBuyer, currentSeller)
		}
		if(currentBuyer.BID == 49){
			console.log(49+" => "+currentSeller.SID+" , "+currentSeller.Rj+" , "+currentBuyer.Cj + " , "+Transaction.Rk_j)
		}
		if (pos == 0 && j != 0) {

			//console.table(Buyers)
			var c1 = Transactions.filter((item) => {
				if (item.buyer.type == 1)
					return true
			})
			var c2 = Transactions.filter((item) => {
				if (item.buyer.type == 2)
					return true
			})
			var c3 = Transactions.filter((item) => {
				if (item.buyer.type == 3)
					return true
			})

			var tmps1 = 0,
				tmps2 = 0,
				tmps3 = 0



			c1.forEach((item) => {
				tmps1 += item.truePrice
			})
			c2.forEach((item) => {
				tmps2 += item.truePrice
			})
			c3.forEach((item) => {
				tmps3 += item.truePrice
			})
			b1p.push(tmps1 / c1.length)
			b2p.push(tmps2 / c2.length)
			b3p.push(tmps3 / c3.length)
			console.log(tmps2 / c2.length)
			ss += 1;
			xz.push(ss)
		}
	}
}
init()
createBuyer(99)
createSeller(180)
createOrder(30000,0)



function sumprice(array) {
	var sum = 0;
	array.forEach((item) => {
		sum += item.truePrice
	})
	return sum;
}


var myChart = echarts.init(document.getElementById('main'));



// var price1 = Transactions.filter((item) => {
// 	if (item.bt == 1)
// 		return true
// })

// var price2 = Transactions.filter((item) => {
// 	if (item.bt == 2)
// 		return true
// })

// var price3 = Transactions.filter((item) => {
// 	if (item.bt == 3)
// 		return true
// })

// function min(a, b, c) {
// 	var result = []
// 	result.push(a.length)
// 	result.push(b.length)
// 	result.push(c.length)

// 	result.sort();
// 	return result[0]

// }
// console.log(price1.length + ", " + price2.length + ", " + price3.length)
// var x = Buyers.filter((item) => {
// 	if (item.type == 1)
// 		return true;
// })
// console.log(x + " , " + ss)

//console.log(price9)

//指定图表的配置项和数据
var option = {
	title: {
		text: 'Buyer Purchase Price',
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
			name: 'Type 1',
			icon: 'circle'
		}, {
			name: 'Type 2',
			icon: 'triangle'
		}, {
			name: 'Type 3',
		}],
		left:200
	},
	xAxis: {
		data: xz
	},
	yAxis: {
		max:20,
		min:16
	},
	series: [{
		name: 'Type 1',
		type: 'line',
		smooth: true,
		data: b1p,
		lineStyle: {
			normal: {
				type: "dotted"
			}
		},
		itemStyle:{
			normal:{
				color:"darkgreen"
			}
		},
		
		label: {
			emphasis: {
				show: true
			}
		},
		clipOverFlow: true,
		symbolSize: 10
	}, {
		name: 'Type 2',
		type: 'line',
		smooth: true,
		data: b2p,
		itemStyle:{
			normal:{
				color:"black"
			}
		},
		lineStyle: {
			normal: {
				type: "dashed",

			}
		},
		clipOverFlow: true,
		symbol: 'triangle',
		symbolSize: 10
	}, {
		name: 'Type 3',
		symbol: 'circle',
		type: 'line',
		smooth: true,
		symbolSize: 10,
		data: b3p,
		clipOverFlow: true,
		itemStyle:{
			normal:{
				color:"#CC3300"
			}
		},
		// markLine: {
		// 	data: [{
		// 		type: 'max',
		// 		name: 'max'
		// 	}]
		// }
	}]
};

// 使用刚指定的配置项和数据显示图表。
myChart.setOption(option);
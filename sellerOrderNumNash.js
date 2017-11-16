var Buyers = [];
var Sellers = [];
var Transactions = [];
var badTransactions1 = [];
var badTransactions2 = [];
var badTransactions3 = [];
var goodTransaction = [];
var badBehavior = false;
/*计算Wij*/
function calculateWij(buyer, seller) {
	//Fij
	var Fij = Transactions.filter(function(i) {
		if (i.buyer == buyer && i.seller == seller)
			return true
	}).length;
	if (Fij < 1)
		Fij = 1;
	else if (Fij < 2)
		Fij = 2
	else if (Fij < 3)
		Fij = 3;
	else if (Fij < 4)
		Fij = 4
	else
		Fij = 5
		//Mij
	var Mij = Transactions.filter(function(i) {
		if (i.buyer == buyer && i.seller == seller)
			return true
	});
	if (Mij.length > 0) {
		Mij = Mij.reduce(function(i, j) {
			return i.truePrice + j.truePrice;
		})
		if (Mij < 16)
			Mij = 1
		else if (Mij < 32)
			Mij = 2
		else if (Mij < 48)
			Mij = 3
		else if (Mij < 56)
			Mij = 4
		else
			Mij = 5
	} else {
		Mij = 1;
	}

	//Eij
	var Eij = 3;
	return (Eij + Fij + Mij) / 3;
}

/*更新商家honest*/
function updateHonest(seller) {
	//过滤交易
	var sellers = Transactions.filter(function(item) {
			if (item.seller == seller)
				return true;
		})
		//计算Rij如果可以获取到值
	if (sellers.length > 0) {

		var wsum = 0;
		var ssum = 0;
		sellers.forEach(function(item) {
			wsum += item.Wij
			ssum += item.ratting * item.Wij;
		})
		seller.honesty = ssum / wsum
		return ssum / wsum;

	} else {

		return 0.5
	}

}
/*计算刨除指定用户的商家的Rj*/
function getRjExceptBuyer(seller, buyer) {
	//过滤交易
	var sellers = Transactions.filter(function(item) {
			if (item.seller == seller && item.buyer != buyer)
				return true
		})
		//计算Rij如果可以获取到值
	if (sellers.length > 0) {

		var wsum = 0;
		var ssum = 0;
		sellers.forEach(function(item) {
				wsum += item.Wij
				ssum += item.ratting * item.Wij;
			})
			//console.log("ExceptBuyer:ssum: "+ssum+", wsum"+wsum)
		return ssum / wsum;

	} else {

		return 0.5
	}
}

/*更新用户Cj*/
function updateCredibility(buyer, seller) {

	//过滤交易
	var buyers = Transactions.filter(function(item) {
		if (item.buyer == buyer)
			return true
	})

	var Rj = getRjExceptBuyer(seller, buyer)
		//计算
	if (buyers.length > 0) {

		var wsum = 0;
		var ssum = 0;
		buyers.forEach(function(item) {
			wsum += item.Wij;
			ssum += item.Wij * Rj
		})
		buyer.Cj = ssum / wsum
			//console.log("updateCredibility:ssum: "+ssum+", wsum"+wsum +"Rij"+Rj)

		return ssum / wsum

	} else {

		return 0;
	}
}

function randomNum(minNum,maxNum){ 
    switch(arguments.length){ 
        case 1: 
            return parseInt(Math.random()*minNum+1,10); 
        break; 
        case 2: 
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
        break; 
            default: 
                return 0; 
            break; 
    } 
}
//判断seller是否在array中
function findIn(seller, array) {
	return array.some(function(i) {
		if (seller == i)
			return true
	})
}
//寻找商家
function findSeller() {
	var y = Math.floor(Math.random() * 100)
	var currentSeller = Sellers[y]
	return currentSeller;
}

/*依概率选择高信誉商家*/
function findsellerp() {
	var R = Math.random()

	//1/15的概率选择0.5的商家
	if (R < (1/15)) {
		var x = randomNum(50,60)		
		var currentSeller = Sellers[x]
		return currentSeller;
	}
	//2/15的概率选择0.6的商家
	else if(R < (3/15)){
		var x = randomNum(60,70)
		var currentSeller = Sellers[x]
		return currentSeller;
	}
	//3/15的概率选择0.7的商家
	else if(R < (6/15)){
		var x = randomNum(70,80)
		var currentSeller = Sellers[x]
		return currentSeller;
	}
	//4/15的概率选择0.8的商家
	else if(R < (10/15)){
		var x = randomNum(80,90)
		var currentSeller = Sellers[x]
		return currentSeller;
	}
	//5/15的概率选择0.9的商家
	else if(R < 1){
		var x = randomNum(90,99)
		var currentSeller = Sellers[x]
		return currentSeller;
	}


}
var BT = 1;
var SH = 0.1;
//99个buyer
for (var i = 1; i <= 99; i++) {
	if ((i - 1) % 33 == 0 && (i - 1) != 0)
		BT += 1;
	var Buyer = {
		"BID": i,
		"name": "buyer" + i,
		"type": BT,
		"Cj": 0,
		"buyerUtility": 0,
		"isChange": false,
		"originalType": BT
	}
	Buyers.push(Buyer)

}
//100个seller
var stype = 1
for (var i = 1; i <= 100; i++) {

	if ((i - 1) % 10 == 0 && (i - 1) != 0) {
		SH += 0.1;
		stype += 1;
	}
	var Seller = {
		"SID": i,
		"name": "seller" + i,
		"honesty": SH,
		"price": 16 + SH * 4,
		"Rj": 0.5,
		"Utility": 0,
		"type": stype
	}
	Sellers.push(Seller)
}
//10000个订单
for (var j = 0; j < 25000; j++) {

	var x = Math.floor(Math.random() * 99)
	var currentBuyer = Buyers[x]
	var currentSeller = findSeller();

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
		while (currentSeller.honesty < 0.5 || findIn(currentSeller, badTransactions1[currentBuyer.BID])) {
			currentSeller = findSeller()
		}
		var R = Math.random()
		if (R > currentSeller.Rj) {
			badBehavior = false;
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
		while (currentSeller.honesty >= 0.5 || findIn(currentSeller, badTransactions2[currentBuyer.BID])) {
			currentSeller = findSeller()
		}
		var R = Math.random()
		if (R > currentSeller.Rj) {
			badBehavior = false;
			badTransactions2[currentBuyer.BID].push(currentSeller)
		}
	}
	//买家类型为3
	if (currentBuyer.type == 3) {

		if (currentBuyer.originalType != 3) {
			currentBuyer.originalType = 3;
			typeof goodTransaction[currentBuyer.BID] == "undefined" ? goodTransaction[currentBuyer.BID] = [] : 1;

			currentBuyer.isChange = true;
			var nextSeller = findsellerp()
			goodTransaction[currentBuyer.BID].push(nextSeller)
			currentSeller = nextSeller

		} else if (currentBuyer.isChange) {
			badTransactions3[currentBuyer.BID] = [];
			currentSeller = goodTransaction[currentBuyer.BID][0]

		} else if (badTransactions3[currentBuyer.BID].length >= 50) {
			typeof goodTransaction[currentBuyer.BID] == "undefined" ? goodTransaction[currentBuyer.BID] = [] : 1;

			currentBuyer.isChange = true;
			var nextSeller = findsellerp()
			goodTransaction[currentBuyer.BID].push(nextSeller)
			currentSeller = nextSeller

		} else {
			//找即将交易的seller
			function findNextSeller(seller) {
				var R = Math.random()
				if (R > seller.Rj) {
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
	if (typeof currentSeller == "undefined")
		console.log(currentBuyer)
	updateCredibility(currentBuyer, currentSeller)
	updateHonest(currentSeller)

	var Transaction = {
			"buyer": currentBuyer,
			"seller": currentSeller,
			"Tid": j + 1,
			"truePrice": currentSeller.price - currentBuyer.Cj * currentSeller.honesty * 4,
			"Wij": calculateWij(currentBuyer, currentSeller),
			'ratting': currentSeller.honesty

		}
		//评价
	if (badBehavior) {
		Transactions[Transactions.length - 1].ratting = 1 - currentSeller.honesty
	}
	Transactions.push(Transaction)
}

var x;
for (x in Transactions) {
	// console.log('单号：' + Transactions[x].Tid + " ，" +
	// 	Transactions[x].buyer.BID + "(" +
	// 	Transactions[x].buyer.type + ") => " +
	// 	Transactions[x].seller.SID) + " , sellerHonesty: " +
	// 	Transactions[x].seller.honesty + " , buyerCj: " +
	// 	Transactions[x].buyer.Cj + " , truePrice: " +
	// 	Transactions[x].truePrice + " , ratting: " +
	// 	Transactions[x].ratting
	//if(Transactions[x].seller.honesty==0.2)
	console.log(Transactions[x])
}

function sumprice(array) {
	var sum = 0;
	array.forEach((item) => {
		sum += item.truePrice
	})
	return sum;
}
var myChart = echarts.init(document.getElementById('main'));

var price1 = Transactions.filter((item) => {
	if (item.seller.type == 1)
		return true
})

var price2 = Transactions.filter((item) => {
	if (item.seller.type == 2)
		return true
})

var price3 = Transactions.filter((item) => {
	if (item.seller.type == 3)
		return true
})

var price4 = Transactions.filter((item) => {
	if (item.seller.type == 4)
		return true
})

var price5 = Transactions.filter((item) => {
	if (item.seller.type == 5)
		return true
})

var price6 = Transactions.filter((item) => {
	if (item.seller.type == 6)
		return true
})

var price7 = Transactions.filter((item) => {
	if (item.seller.type == 7)
		return true
})

var price8 = Transactions.filter((item) => {
	if (item.seller.type == 8)
		return true
})

var price9 = Transactions.filter((item) => {
	if (item.seller.type == 9)
		return true
})

console.log(price9)

// 指定图表的配置项和数据
var option = {
	title: {
		text: 'Seller Order Number',
		subtext:'Nash Equilibrium'
	},
	tooltip: {},
	legend: {

	},
	xAxis: {
		data: ["0.1", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8", "0.9"]
	},
	yAxis: {max:4000},
	series: [{
		name: '1',
		type: 'line',
		smooth: true,
		data: [price1.length, price2.length, price3.length, price4.length, price5.length, price6.length, price7.length, price8.length, price9.length]
	}]
};

// 使用刚指定的配置项和数据显示图表。
myChart.setOption(option);

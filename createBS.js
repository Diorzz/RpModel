var Buyers = [];
var Sellers = [];
var Transactions = [];
var badTransactions1 = [];
var badTransactions2 = [];
var badTransactions3 = [];
var goodTransaction = [];
var badBehavior = false
var ss = 0;
var s1 = 0,
	s2 = 0,
	s3 = 0

var b1p = []
var b2p = []
var b3p = []
var xz = []

function init() {
	Buyers = [];
	Sellers = [];
	Transactions = [];
	badTransactions1 = [];
	badTransactions2 = [];
	badTransactions3 = [];
	goodTransaction = [];
	badBehavior = false
	ss = 0;
	s1 = 0,
	s2 = 0,
	s3 = 0

	b1p = []
	b2p = []
	b3p = []
	xz = []
}

/*计算Wij*/
function calculateWij(buyer, seller) {
	//Fij
	var Fij = Transactions.filter(function(i) {
		if (i.buyer.BID == buyer.BID && i.seller.SID == seller.SID)
			return true
	}).length;

	if (Fij < 1)
		Fij = 1
	else if (Fij < 2)
		Fij = 2
	else if (Fij < 3)
		Fij = 3
	else if (Fij < 4)
		Fij = 4
	else
		Fij = 5

	//Mij
	var Mij = Transactions.filter(function(i) {
		if (i.buyer.BID == buyer.BID && i.seller.SID == seller.SID)
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
	//获得该商家的所有交易
	var sellers = Transactions.filter(function(item) {
			if (item.seller.SID == seller.SID)
				return true;
		})
		//如果存在记录计算，否则返回0.5
	if (sellers.length > 0) {

		var wsum = 0; //分母
		var ssum = 0; //分子

		sellers.forEach(function(item) {
			wsum += item.Wij
			ssum += item.ratting * item.Wij;
		})
		let result = ssum / wsum;
		seller.Rj = result;
		return result;

	} else {

		return 0.5
	}

}

/*计算刨除指定用户的商家的Rj*/
function getRjExceptBuyer(seller, buyer) {
	//过滤交易
	var sellers = Transactions.filter(function(item) {
			if (item.seller.SID == seller.SID && item.buyer.BID != buyer.BID)
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
		return ssum / wsum;

	} else {

		return 0.5
	}
}

/*更新用户Cj*/
function updateCredibility(buyer, seller) {

	var Rj = getRjExceptBuyer(seller, buyer)
		// if(buyer.type==1||buyer.type==2)
		// 	return Rj
		//过滤交易
	var buyers = Transactions.filter(function(item) {
		if (item.buyer.BID == buyer.BID && item.seller.SID == seller.SID)
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
		let result = ssum / wsum
		buyer.Cj = result
		return result

	} else {
		buyer.Cj = 0
		return 0;
	}
}

/*指定区间的随机数*/
function randomNum(minNum, maxNum) {
	switch (arguments.length) {
		case 1:
			return parseInt(Math.random() * minNum + 1, 10);
			break;
		case 2:
			return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
			break;
		default:
			return 0;
			break;
	}
}

/*判断seller是否在array中*/
function isSellerIn(seller, array) {
	return array.some(function(i) {
		if (seller.SID == i.SID)
			return true
	})
}

/*随机寻找商家*/
function findSeller() {
	var y = Math.floor(Math.random() * 180)
	var currentSeller = Sellers[y]
	return currentSeller;
}

/*依概率选择高信誉商家*/
function findSelleProbability() {

	var R = Math.random()
		//1/15的概率选择0.5的商家
	if (R < (1 / 15)) {
		var x = randomNum(40, 50)
		var currentSeller = Sellers[x]
		return currentSeller;
	}
	//2/15的概率选择0.6的商家
	else if (R < (3 / 15)) {
		var x = randomNum(50, 60)
		var currentSeller = Sellers[x]
		return currentSeller;
	}
	//3/15的概率选择0.7的商家
	else if (R < (6 / 15)) {
		var x = randomNum(60, 70)
		var currentSeller = Sellers[x]
		return currentSeller;
	}
	//4/15的概率选择0.8的商家
	else if (R < (10 / 15)) {
		var x = randomNum(70, 80)
		var currentSeller = Sellers[x]
		return currentSeller;
	}
	//5/15的概率选择0.9的商家
	else if (R <= 1) {
		var x = randomNum(80, 89)
		var currentSeller = Sellers[x]
		return currentSeller;
	}
}

/*创建用户*/
function createBuyer(num) {

	var BT = 1;
	for (var i = 1; i <= num; i++) {

		if ((i - 1) % (num / 3) == 0 && (i - 1) != 0) {

			BT += 1;
		}
		var Buyer = {
			"BID": i,
			"name": "buyer" + i,
			"type": BT,
			"Cj": 0.5,
			"buyerUtility": 0,
			"isChange": false,
			"originalType": BT
		}
		Buyers.push(Buyer)
	}
}

/*创建商家*/
function createSeller(num) {
	var SH = 0.1;
	var stype = 1
	for (var i = 1; i <= num; i++) {

		if ((i - 1) % 20 == 0 && (i - 1) != 0) {
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
}

/*获得信誉小于0.5的商家额数量*/
function getLowRpSellerNum(sellers) {
	var len = sellers.filter((item) => {
		if (item.honesty < 0.5)
			return true;
	}).length;
	return len;
}
/*获得信誉大于等于0.5的商家额数量*/
function getHighRpSellerNum(sellers) {
	var len = sellers.filter((item) => {
		if (item.honesty >= 0.5)
			return true;
	}).length;
	return len;
}

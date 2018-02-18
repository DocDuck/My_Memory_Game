var numpairs = 0;
var logLastPaired = 0;
var countPaired = 0;
var counttap = 0;
var openedCards = [];
var backCards = [];
var allmatched = [];
var timer = 0;
var starttheTime;

var resetAll = function(){
	numpairs = 0;
	countPaired = 0;
	counttap = 0;
	openedCards = [];
	backCards = [];
	allmatched = [];
	stopTimer();
}

$(document).ready(function(){
	$('.main').hide();
	$('.row-controls').hide();
	$('.result').hide();
	$('.start_container').on('tap','.start_btn',function(){
		logLastPaired = 0;
		$('.header').delay(200).fadeOut();
		load_cards(9);
		//тут должен быть код, который держит карты 5 секунд рубашкой вниз(картинки), потом скрывает
		logLastPaired = 9;
		$('.row-controls').delay(500).fadeIn();
		starttheTime = setInterval(function(){timer=timer+1;console.log(timer);},1000); 
		
		$('#reset').data(9, logLastPaired);
		
	});
	
	$('.row_cards').on('doubletap','.back_deck',function(event){
		backCards = [];
		openedCards = [];
		counttap = 0;
		$(this).fadeIn();
	});
	
	$('.row_cards').on('tap','.back_deck',function(){//алгоритм сравнения 2х карт после клика/тапания
		console.log('tapped');
		counttap++;
		$(this).fadeOut();//скрыли задник, открыли картинку
		openedCards.push($(this).next().data("card"));//записали НЕПОНЯТНО КАК в массив открытых карт
		console.log(openedCards);
		backCards.push($(this).attr("id"));
		console.log(backCards);
		matchOpen();
				
	});
	
	$('.row-controls').on('tap','#reset',function(){//реснуть колоду
		resetAll();
		$('.row_cards').empty();
		load_cards(9);
		starttheTime = setInterval(function(){timer=timer+1;console.log(timer);},1000);
		console.log('reset');
	});
		
	// $('.close').on('tap',function(){
	// 	$('.result').delay(300).fadeOut();
	// });
	
		
});

function matchOpen(){
	if(counttap==2){//если тапнул 2 раза
		if(backCards[0] != backCards[1]){//ПОЧЕМУ СРАВНИВАЮТСЯ ПЕРВЫЕ ДВА ЭЛЕМЕНТА МАССИВА???
			if(openedCards[0] === openedCards[1]) {//ПОЧЕМУ СРАВНИВАЮТСЯ ПЕРВЫЕ ДВА ЭЛЕМЕНТА МАССИВА??? 
				for(var xx = 0; xx<backCards.length; xx++){
					allmatched.push(backCards[xx]);//заполняется массив с раскрытыми картами
				}
				countPaired = countPaired+1;
				if(countPaired == numpairs) {
					//тут условие конца игры, переход на экран с количеством очков 
					//запуск fadeOut'ов
					setTimeout(function(){$('.result').show()},500);
					$('.result_pairs').text('Matched '+ numpairs +' Pairs in');//тут 
					// $('.result_time').text(timer +' Seconds'); нахер таймер
					
				}
			}
			else {
				
				$("#"+backCards[0]).delay(200).fadeIn();//если условия не выполняются 
				$("#"+backCards[1]).fadeIn();//обе карты снова прячутся за рубашку
				
				$('.back_deck').fadeIn();//класс задника снова активен
				for(var am=0; am<allmatched.length; am++){//малость не понял логику
					$("#"+allmatched[am]).hide();
				}
			}
			backCards = [];
			openedCards = [];
			counttap = 0;
			console.log("All matched: "+allmatched);
		}
		else {
			backCards = [];
			openedCards = [];
			counttap = 0;
		}
	}
}

function shuffle(a) {
	var j, x, i;
	for (i = a.length; i; i--) {//опять же, вместо длины массива можно сразу 18
		j = Math.floor(Math.random() * i);
		x = a[i - 1];//тут реализация алгоритма фишера-йетса
		a[i - 1] = a[j];
		a[j] = x;
	}
}


function stopTimer(){
	clearInterval(starttheTime);
	timer = 0;
}

function load_cards(){
	numpairs = 9;
	var cardsLoc = [];
	var cardsValue = new Array(
		"2S","3S","4S","5S","6S","7S","8S","9S","10S","AS","JS","QS","KS",
		"2C","3C","4C","5C","6C","7C","8C","9C","10C","AC","JC","QC","KC",
		"2H","3H","4H","5H","6H","7H","8H","9H","10H","AH","JH","QH","KH",
		"2D","3D","4D","5D","6D","7D","8D","9D","10D","AD","JD","QD","KD"
	);
	var randPosition;
	
	setTimeout(function(){
		
		for(var y=0; y<18; y++){
			$('.row_cards').append("<div class='deck col-2'><img id='cont"+y+"' class=' back_deck' src='img/Cards/back.png'></div>");//загрузились карты и пронумированы айдишками с 0 до 18
			cardsLoc.push(y);//айдишки запушились в массив
		}
		
		shuffle(cardsLoc);//перемешивание айдишников карт в колоде
		
		for(var x=0; x<9; x++){//сейчас будем дважды рандомно дёргать карты из массива-колоды и засовывать их в класс .deck
			var randValue = Math.floor(Math.random() * cardsValue.length);//рандомизируем 52 карты
			// var randType = Math.floor(Math.random() * 4);//рандом 4 масти, похоже эта хрень вообще не влияет на логику игры =)

			randPosition = Math.floor(Math.random() * cardsLoc.length);//тут можно просто 18 вместо переменной длины массива, получаем рандомную позицию от 0 до 18
			$('.deck').eq(cardsLoc[randPosition]).append("<img data-card="+cardsValue[randValue]+" class='front_deck' src='img/Cards/"+ cardsValue[randValue]+".png'>");//загружаем 1ю половину перетасованные карты в колоду .deck
			cardsLoc.splice(randPosition,1);//переписываем Массив-локатор карт с рандомными значемиями
			
			randPosition = Math.floor(Math.random() * cardsLoc.length);//загружаем вторую перетасованную часть пар карт в колоду
			$('.deck').eq(cardsLoc[randPosition]).append("<img data-card="+cardsValue[randValue]+" class='front_deck' src='img/Cards/"+ cardsValue[randValue]+".png'>");
			cardsLoc.splice(randPosition,1);//добавляем эти же значения в массив-локатор, получили пары значений
			
			cardsValue.splice(randValue,1);
		
	}
		
	},500)
	
}




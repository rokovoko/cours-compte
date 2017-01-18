var operateur=[], secteur=[], entreprise=[], keys={}, width=80;
function stringify (str) {
  return str.toLowerCase().replace(/ /g, '-').replace(/é|è/g, 'e').replace(/ô/g, 'o');
}

function select (el) {
  var i = parseInt($(el).parent().attr('index'));
  var tab = window[$(el).parent().attr('group')];

  var g = $(el).parent().attr('group');
  $('.wrapper:not(.' + g + ')').attr('index', 0);
  $('.wrapper.secteur:not(.' + g + ')').find('.title').html(keys[secteur[0]].title);
  $('.wrapper.operateur:not(.' + g + ')').find('.title').html(keys[operateur[0]].title);
  $('.wrapper.entreprise:not(.' + g + ')').find('.title').html(keys[entreprise[0]].title);

  $('.wrapper.secteur:not(.' + g + ')').find('.current').removeClass('current');
  $('.wrapper.operateur:not(.' + g + ')').find('.current').removeClass('current');
  $('.wrapper.entreprise:not(.' + g + ')').find('.current').removeClass('current');
  $('.wrapper.secteur:not(.' + g + ')').find('.index0').addClass('current');
  $('.wrapper.operateur:not(.' + g + ')').find('.index0').addClass('current');
  $('.wrapper.entreprise:not(.' + g + ')').find('.index0').addClass('current');
  $('.wrapper:not(.' + g + ')').find('ul').animate({'left': '0px'}, 600);

  $('li').removeClass('hide');
  $('li').addClass('hide');
  keys[tab[i]].attr.split(' ').forEach(function (a){
    $('.wrapper:not(' + g + ') .' + a).removeClass('hide');
  });
  $('.wrapper.operateur .num').html( $('.wrapper.operateur li:not(.hide)').length );
  $('.wrapper.secteur .num').html( $('.wrapper.secteur li:not(.hide)').length );
  $('.wrapper.entreprise .num').html( $('.wrapper.entreprise li:not(.hide)').length );
}

function changeSlide (el, direction) {
  var i = parseInt($(el).parent().attr('index'));
  var tab = window[$(el).parent().attr('group')];
  $(el).parent().find('.index' + i).removeClass('current');
  i += direction;

  if (i >= tab.length) {
    i = 0;
  }
  else if (i < 0) {
    i = tab.length - 1;
  }
  $(el).parent().find('.index' + i).addClass('current');
  $(el).parent().attr('index', i);
  $(el).parent().find('ul').stop().animate({'left': i * -width + 'px'}, 600);
  $(el).parent().find('.title').html(keys[tab[i]].title);
}

function Slider (tab, group) {
  var innerHTML = '<div class="' + group + ' wrapper"><div class="group">' + group.toUpperCase() + ' :</div>'
      innerHTML+= '<div class="num">' + tab.length + '</div>'
      innerHTML+= '<div class="arrow"></div>'
      innerHTML+= '<div class="prev">prev</div>'
      innerHTML+= '<div class="' + group + ' slider"><ul></ul></div>'
      innerHTML+= '<div class="next">next</div>'
      innerHTML+= '<div class="title">' + keys[tab[0]].title + '</div></div>';
  $('#wrapper .right').append(innerHTML);

  $('.' + group + '.wrapper').attr({'index': 0, 'group': group});
  this.rail = $('.' + group + '.slider ul');
  this.group = group;
  tab.forEach( function (each, i) {
    var c = i == 0 ? keys[each].attr + ' current' : keys[each].attr;
    var self = keys[each].self
    var src = 'https://rokovoko.github.io/cours-compte/img/logo.png'; //'./img/' +f[each].self + '.jpg';
    this.rail.append('<li class="' + c + ' index' + i + ' ' + self + '" self="' + self + '"><img src="' + src + '" alt="' + self + '"/><span>' + self + '<span/></li>');
  }.bind(this));

  $('.' + group + '.wrapper .prev').click(function () {
    changeSlide(this, -1);
  });

  $('.' + group + '.wrapper .next').click(function () {
    changeSlide(this, 1);
  });

  $('.' + group + '.wrapper .arrow').click(function () {
    select(this);
  });
}

$.get('data/data.json').then( function (data) {

  data.rows.forEach(function ( firm ){
    var o = stringify(firm.operateur);
    var s = stringify(firm.secteur);
    var f = stringify(firm.title);
    if (operateur.indexOf(o)<0) {
      operateur.push(o)
      keys[o] = {};
      keys[o].title = firm.operateur, keys[o].self = o, keys[o].attr = s + ' ' + o;
    }
    if (secteur.indexOf(s)<0) {
      secteur.push(s)
      keys[s] = {};
      keys[s].title = firm.secteur, keys[s].self = s, keys[s].attr = o + ' ' + s;
    }
    if (entreprise.indexOf(f)<0) {
      entreprise.push(f);
    }
    if (keys[s].attr.indexOf(o)<0 ) {
      keys[s].attr += ' ' + o;
    }
    if (keys[o].attr.indexOf(s)<0) {
      keys[o].attr += ' ' + s;
    }
    firm.self = f, firm.attr = s + ' ' + o;
    keys[f] = firm;
  });

  keys['bpifrance'] = {
    "self" : "bpifrance",
    "attr": "ape caisse-des-depots services-et-finance",
    "title" : "Bpifrance",
    "operateur" : "APE et Caisse des Dépôts",
    "secteur" : "Services et Finance",
    "chiffre" : "1,331",
    "capital" : "50.00"
  };

  var oSlider = new Slider(operateur, 'operateur');
  var sSlider = new Slider(secteur, 'secteur');
  var fSlider = new Slider(entreprise, 'entreprise');
});




$(function(){

	//this can also be stored on the DOM using the jQuery selector wrapped in a table.
	var data = '\
<tr>\
	<th>#ECD078</th>\
	<td>30</td>\
</tr>\
<tr>\
	<th>#D95B43</th>\
	<td>10</td>\
</tr>\
<tr>\
	<th>#C02942</th>\
	<td>20</td>\
</tr>\
<tr>\
	<th>#542437</th>\
	<td>60</td>\
</tr>\
<tr>\
	<th>#53777A</th>\
	<td>40</td>\
</tr>\
';

	var myColor = [];
	var myData = [];

	var base = 200;
	var px = base/2;

	ctx.width = base;
	ctx.height = base;

	function getTotal(){
		var myTotal = 0;

		for(var i = 0; i < myData.length; i++){
			myTotal += (typeof myData[i] == 'number') ? myData[i] : 0;
		}
		return myTotal;
	}

	function plotData(){
		var lastend = 0;
		var myTotal = getTotal();
		var canvas = document.getElementById("ctx");
		var ctx = canvas.getContext("2d");

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for(var i = 0; i < myData.length; i++){
			ctx.fillStyle = myColor[i];
			ctx.beginPath();
			ctx.moveTo(px,px);
			ctx.arc(px,px,px,lastend,lastend + (Math.PI*2*(myData[i]/myTotal)),false);
			ctx.lineTo(px,px);
			ctx.fill();
			lastend += Math.PI*2*(myData[i]/myTotal);
		}
	}

	$(data).each(function(){
		myColor.push($("th", this).text());
		myData.push(parseInt($("td", this).text(), 10));

		$('#list').append(
			'<li>'+
			'<div style="'  +  'display:inline-block;height:14px;width:14px;background:'+$("th", this).text()  +  '"></div> '+
			$("td", this).text()+
			'</li>'
		);
	});

	plotData();

});

var operateur=[], secteur=[], entreprise=[], keys={}, width=80, state=0, prevState=0, doubleSelect;

function stringify (str) {
  return str.toLowerCase().replace(/ /g, '-').replace(/é|è/g, 'e').replace(/ô/g, 'o');
}

var enBPI = {
  "self" : "bpifrance",
  "attr": "ape caisse-des-depots services-et-finance",
  "title" : "Bpifrance",
  "operateur" : "APE et Caisse des Dépôts",
  "secteur" : "Services et Finance",
  "chiffre" : "1,331",
  "capital" : "100.00"
}

var opBPI = {
  attr: "defense-et-aeronautique energie-et-matieres-premieres services-et-finance industrie-et-telecoms",
  self: "bpifrance",
  title: "Bpifrance"
}

function changeBPI (g) {
  if ( g == 'entreprise' ) {
    keys['bpifrance'] = enBPI;
  }
  else if ( g == 'operateur') {
    keys['bpifrance'] = opBPI;
  }
}

// ------------ SELECTS -------------//
// ------------ SELECTS -------------//
// ------------ SELECTS -------------//
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
function lock (item, g, i) {
  $('.' + g + ' .slot').fadeOut();
  $('.' + g + ' .slot-select').fadeIn();
  $('.' + g + ' .slot-select .logo-select').css({'background-image': 'url("https://rokovoko.github.io/cours-compte/img/' + g + 's/' + item.self + '.png' + '")'}).attr('index', i);
  $('.' + g + ' .slot-select .name-select').html(item.title);
}

function fiche (item, g, i) {
  $('.selected').fadeIn();
  $('.logo-fiche div').css({'background-image': 'url("https://rokovoko.github.io/cours-compte/img/fiches/' + item.self + '.png' + '")'});
  $('.entreprise-fiche .auto').html(item.title);
  $('.operateur-fiche .auto').html(item.operateur);
  $('.secteur-fiche .auto').html(item.secteur);
  $('.right-fiche .number').html(item.chiffre.replace(/,/,' '));
  (item.self == 'cdc-international-capital') ? $('.right-fiche').hide() : $('.right-fiche').show();
  (item.self == 'bpifrance') ? drawPie(item.capital, true) : drawPie(item.capital, false);
}

function refresh (g) {
  var wrappers = g ? $('.wrapper').not('.' + g ) : $('.wrapper');
  $(wrappers).each( function (idx, t) {
    var otherG = $(t).attr('group');
    var tab = window[otherG];
    var allElements = $(t).find('li').not('.hide');
    var current = $(t).find('li.current').hasClass('hide') ? $(allElements).first() : $(t).find('li.current');
    var currentPosition = allElements.index($(current));
    var currentIndex = $(current).attr('index');
    $(t).find('li').removeClass('current');
    $(current).addClass('current');
    $(t).attr('index', currentIndex);
    $(t).find('ul').stop().animate({'left': currentPosition * -width + 'px'}, 400);
    changeBPI(otherG);
    $(t).find('.title').html(keys[tab[currentIndex]].title);
    $(t).find('.num').html(allElements.length);
  });
}

function select (el) {

  var i = parseInt($(el).attr('index'));
  var g = $(el).closest('.wrapper').attr('group');
  var tab = window[g];
  prevState = state;

  changeBPI(g);

  if ( g != 'entreprise') {
    $('li').not('.'+g).addClass('hide');

    if (doubleSelect) {
      if ( '.' + keys[tab[i]].self != doubleSelect ) doubleSelect += '.' + keys[tab[i]].self;
      $('.wrapper').not('.'+g).find(doubleSelect).removeClass('hide');
    }
    else {
      if ( g == 'secteur') {
        keys[tab[i]].attr.split(' ').forEach( function (a) {
          $('.wrapper').not('.entreprise').find('.' + a).removeClass('hide');
        });
      }
      doubleSelect = '.' + keys[tab[i]].self;
      $('.wrapper').not('.'+g).find(doubleSelect).removeClass('hide');
    }

    if ( g == 'operateur' && keys[tab[i]].self == 'bpifrance' || doubleSelect == '.bpifrance'+'.'+keys[tab[i]].self) {
      $('.wrapper.entreprise li.ape.caisse-des-depots.bpifrance').addClass('hide');
    }

    refresh(g);

    lock(keys[tab[i]], g, i);
    state = 1;
    $('footer .back').fadeIn();
  }
  else {
    fiche(keys[tab[i]], g, i);
    state = 2;
    $('footer .back').fadeIn();
    $('footer .date').fadeIn();
  }
}

function unlock (el) {
  var i = parseInt($(el).attr('index'));
  var g = $(el).closest('.wrapper').attr('group');
  var tab = window[g];
  var otherG = (g == 'operateur') ? 'secteur' : 'operateur';
  var regex = new RegExp('\.'+tab[i], 'g');
  if (doubleSelect) {
    doubleSelect = doubleSelect.replace(regex,'');
    if (doubleSelect.length < 1) {
      $('.slot').fadeIn();
      $('.slot-select').fadeOut();
      doubleSelect = false;
      state = 0;
      $('li').removeClass('hide');
      refresh(false);
      $('footer .back').fadeOut();
    }
    else {
      $('.' + g + ' .slot').fadeIn();
      $('.' + g + ' .slot-select').fadeOut();
      select($('.' + otherG + ' ' + doubleSelect));
    }
  }
}

$('footer .back').click( function () {
  if ( state == 2 ) {
    $('.selected').fadeOut();
    $('footer .date').fadeOut();
    $('.left-fiche div.legend').fadeOut();
    if (prevState == 0) {
      $('footer .back').fadeOut();
    }
  }
  else {
    $('.slot').fadeIn();
    $('.slot-select').fadeOut();
    doubleSelect = false;
    $('li').removeClass('hide');
    refresh(false);
    $('footer .back').fadeOut();
  }
  state = prevState;
});

// ------------ SLIDER -------------//
// ------------ SLIDER -------------//
// ------------ SLIDER -------------//
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

function changeSlide (el, direction) {

  var g = $(el).closest('.wrapper').attr('group');
  var tab = window[g];
  var old = '.wrapper.' + g + ' .current';
  var oldIndex = parseInt($(old).attr('index'));

  var allElements = $(old).parent().find('li:not(.hide)');
  var oldElementIndex = allElements.index($(old));
  var newElementIndex = oldElementIndex+direction;
  if(newElementIndex<0) newElementIndex = allElements.length-1;
  else if (newElementIndex>allElements.length-1) newElementIndex = 0;

  var newIndex = parseInt($(allElements[newElementIndex]).attr('index'));

  $('.wrapper.' + g + ' .index' + oldIndex).removeClass('current');
  $('.wrapper.' + g + ' .index' + newIndex).addClass('current');
  $('.wrapper.' + g).attr('index', newIndex);
  $('.wrapper.' + g).find('ul').stop().animate({'left': newElementIndex * -width + 'px'}, 400);
  $('.wrapper.' + g).find('.title').html(keys[tab[newIndex]].title);
}

function Slider (tab, group) {
  changeBPI(group);
  var sliderName = (group == 'operateur') ? 'actionnaire' : group;
  var innerHTML = '<div class="' + group + ' wrapper">'
      innerHTML+= '<div class="slot"><div class="group ghost-center"><p>' + sliderName.toUpperCase() + 'S :</p></div>'
      innerHTML+= '<div class="num">' + tab.length + '</div>'
      innerHTML+= '<div class="arrow"></div>'
      innerHTML+= '<div class="prev"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i></div>'
      innerHTML+= '<div class="' + group + ' slider"><ul></ul></div>'
      innerHTML+= '<div class="next"><i class="fa fa-chevron-circle-right" aria-hidden="true"></i></div>'
      innerHTML+= '<div class="title">' + keys[tab[0]].title + '</div></div>'
      innerHTML+= '<div class="slot-select">'
      innerHTML+= '<div class="name-select"></div>'
      innerHTML+= '<div class="logo-select"></div>'
      innerHTML+= '</div></div>';
  $('#wrapper .right .selector').append(innerHTML);

  $('.' + group + '.wrapper').attr({'index': 0, 'group': group});
  this.rail = $('.' + group + '.slider ul');
  this.group = group;
  tab.forEach( function (each, i) {
    if (each == 'bpifrance') {
      changeBPI(this.group);
    }
    var c = (i == 0) ? keys[each].attr + ' current' : keys[each].attr;
    var self = keys[each].self
    var src = 'https://rokovoko.github.io/cours-compte/img/' + this.group + 's/' + keys[each].self + '.png';
    this.rail.append('<li class="' + c + ' index' + i + ' ' + self + '" index="' + i + '" self="' + self + '"><img src="' + src + '" alt="' + self + '"/></li>');
  }.bind(this));

  $('.' + group + '.wrapper .prev').click(function () {
    changeSlide(this, -1);
  });

  $('.' + group + '.wrapper .next').click(function () {
    changeSlide(this, 1);
  });

  $('.' + group + '.wrapper .slider li').click(function () {
    select(this);
  });


  $('.logo-select').click( function (e) {
    unlock(this);
    e.preventDefault();
  });
}


// ------------ DATA -------------//
// ------------ DATA -------------//
// ------------ DATA -------------//
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
$.get('https://rokovoko.github.io/cours-compte/data/data.json').then( function (data) {

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

  keys['bpifrance'] = enBPI;
  entreprise.push('bpifrance');
  var oSlider = new Slider(operateur, 'operateur');
  var sSlider = new Slider(secteur, 'secteur');
  var fSlider = new Slider(entreprise, 'entreprise');
});

// ------------ PIE CHARTS -------------//
// ------------ PIE CHARTS -------------//
// ------------ PIE CHARTS -------------//
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
function afterDraw (pie, total, bpi) {
  clearInterval(pie);
  if (!bpi) {
    var stringTotal = total.replace(/\./,',');
    stringTotal = stringTotal.replace(/,00/,'');
    $('.left-fiche div.legend').css('font-size', '2em').html(stringTotal).fadeIn();
  }
  else {
    $('.left-fiche div.legend').css('font-size', '0.9em').html('<div class="bpi">50%<br />APE<br /><br />50%<br />Caisse des Dépôts</div>').fadeIn();
  }
}

function drawPie (total, bpi) {

  var px = 45;
  var percent = 0;
  var start = 1.5*Math.PI;
  var ctx = document.getElementById('ctx').getContext('2d');

  function chart () {
    var slice = Math.PI*2*(percent/100);
    ctx.clearRect(0, 0, px*2, px*2);
    ctx.fillStyle = '#D2DDF0';
  	ctx.beginPath();
  	ctx.moveTo(px,px);
  	ctx.arc(px,px,px, 0,slice, true);
  	ctx.lineTo(px,px);
    ctx.closePath();
  	ctx.fill();
    ctx.fillStyle = '#26B4D5';
    ctx.beginPath();
    ctx.moveTo(px,px);
    ctx.arc(px,px,px,slice, 0,true);
    ctx.lineTo(px,px);
    ctx.closePath();
  	ctx.fill();
  }

  function animate () {
    percent+= total/40;
    if (percent>total) afterDraw(pie, total, bpi);
    else chart();
  }

  var pie = window.setInterval(animate, 16);
}

var operateur=[], secteur=[], entreprise=[], keys={}, width=80, state=0;

function stringify (str) {
  return str.toLowerCase().replace(/ /g, '-').replace(/é|è/g, 'e').replace(/ô/g, 'o');
}

function lock (item, g) {
  $('.' + g + ' .slot').fadeOut();
  $('.' + g + ' .slot-select').fadeIn();
  $('.' + g + ' .slot-select .logo-select').css({'background-image': 'url("https://rokovoko.github.io/cours-compte/img/' + g + 's/' + item.self + '.png' + '")'});
  $('.' + g + ' .slot-select .name-select').html(item.title);
}

function fiche (item, g) {
  $('.selected').fadeIn();
  $('.logo-fiche div').css({'background-image': 'url("https://rokovoko.github.io/cours-compte/img/fiches/' + item.self + '.png' + '")'});
  $('.entreprise-fiche .auto').html(item.title);
  $('.operateur-fiche .auto').html(item.operateur);
  $('.secteur-fiche .auto').html(item.secteur);
  $('.right-fiche .number').html(item.chiffre.slice(0,5));
  drawPie(item.capital);
}

function select (el) {
  var i = parseInt($(el).parent().parent().attr('index'));
  var g = $(el).parent().parent().attr('group');
  var tab = window[g];

  if ( g != 'entreprise') {
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

    lock(keys[tab[i]], g);
    state = 1;
    $('footer .back').fadeIn();
  }
  else {
    fiche(keys[tab[i]], g);
    state = 2;
    $('footer .back').fadeIn();
    $('footer .date').fadeIn();
  }
}

function changeSlide (el, direction) {
  var i = parseInt($(el).parent().parent().attr('index'));
  var tab = window[$(el).parent().parent().attr('group')];
  $(el).parent().find('.index' + i).removeClass('current');
  i += direction;

  if (i >= tab.length) {
    i = 0;
  }
  else if (i < 0) {
    i = tab.length - 1;
  }
  $(el).parent().find('.index' + i).addClass('current');
  $(el).parent().parent().attr('index', i);
  $(el).parent().find('ul').stop().animate({'left': i * -width + 'px'}, 600);
  $(el).parent().find('.title').html(keys[tab[i]].title);
}

function Slider (tab, group) {
  var innerHTML = '<div class="' + group + ' wrapper">'
      innerHTML+= '<div class="slot"><div class="group">' + group.toUpperCase() + ' :</div>'
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
    var c = i == 0 ? keys[each].attr + ' current' : keys[each].attr;
    var self = keys[each].self
    var src = 'https://rokovoko.github.io/cours-compte/img/' + this.group + 's/' + keys[each].self + '.png';
    this.rail.append('<li class="' + c + ' index' + i + ' ' + self + '" self="' + self + '"><img src="' + src + '" alt="' + self + '"/></li>');
  }.bind(this));

  $('.' + group + '.wrapper .prev').click(function () {
    changeSlide(this, -1);
  });

  $('.' + group + '.wrapper .next').click(function () {
    changeSlide(this, 1);
  });

  $('.' + group + '.wrapper .slider').click(function () {
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
  console.log(keys);
});

function afterDraw (pie, total) {
  clearInterval(pie);
  var stringTotal = total.replace(/\./,',');
  stringTotal = stringTotal.replace(/,00/,'');
  $('.left-fiche div.legend').html(stringTotal).fadeIn(600);
}

$('footer .back').click( function () {
  if ( state == 2 ) {
    $('.selected').fadeOut(600);
    $('footer .date').fadeOut();
  }
  else {
    $('.slot').fadeIn();
    $('.slot-select').fadeOut();
    $('footer .back').fadeOut();
  }
});


function drawPie (total) {

  var px = 45;
  var percent = 0;
  var start = 1.5*Math.PI;
  var ctx = document.getElementById('ctx').getContext('2d');

  function chart () {
    var slice = Math.PI*2*(percent/100);
    ctx.clearRect(0, 0, px*2, px*2);
    ctx.fillStyle = '#26B4D5';
  	ctx.beginPath();
  	ctx.moveTo(px,px);
  	ctx.arc(px,px,px, 0,slice, false);
  	ctx.lineTo(px,px);
    ctx.closePath();
  	ctx.fill();
    ctx.fillStyle = '#D2DDF0';
    ctx.beginPath();
    ctx.moveTo(px,px);
    ctx.arc(px,px,px,slice, 0,false);
    ctx.lineTo(px,px);
    ctx.closePath();
  	ctx.fill();
  }

  function animate () {
    percent+= total/40;
    if (percent>=total) afterDraw(pie, total);
    else chart();
  }

  var pie = window.setInterval(animate, 16);
}

// web framework

import 'font-awesome/css/font-awesome.min.css'
import moment from 'moment'
import Mustache from 'mustache/mustache.min.js'

const $ = require('jquery')

// custom modules

import './app.sass'
import './index.pug'
import './res/favicon.ico'

// dropbox paper

//import data from '../dist/data.json'
$.get('data.json', data => {
  moment.locale('zh-tw')
  for (let v of data.news) {
    v.date = moment(v.date).format('ll ddd')
  }

  let template = $('#news+script').html()
  let html = Mustache.render(template, { news: data.news })

  $('#news').html(html)

  $(window).resize()
})

///////////////////////////////////////////////////////

// responsive logic

$(window).resize(() => {
  let height = $(".page-content .title").outerHeight(true) + $(".date").outerHeight(true)
  let fontSize = $(".item p").css("font-size")
  let orientation = $(window).width() > $(window).height() ? 'landscape' : 'portrait'
  
  $('body').attr('data-orientation', orientation)

  if ('landscape' === orientation){
    $("#logo").attr("href", "#landing")
    
    let itemHeight = height + parseInt(fontSize)*7 //item height
    $(".item").css("height",itemHeight)
  
  } else{
    $("#logo").removeAttr("href")
  
    let itemHeight = height + parseInt(fontSize)*7.5 //item height
    $(".item").css("height",itemHeight)
  
  }
    
  $(".item").each( function(){ //multiline ellipsis
    if($(this).children("p").height() >= parseInt(fontSize)*7)
      $(this).attr("data-ellipsis","true")
    else
      $(this).removeAttr("data-ellipsis")
  })

})

// show content referred to url

window.onhashchange = () => {
  if(window.location.hash){
    let [page, itemID] = window.location.hash.match(/(\w+)(?:-(\d+))?/).slice(1, 3)
    if ($(`.page[data-page-id=${page}]`)) {
      $('body').attr('data-page', page)

      if(itemID) {
        $(`.page[data-page-id=${page}] .page-content`).attr('data-page-content', '')
        $(`#news .item:nth-child(${itemID})`).addClass('show')
      } else {
        $(`.page[data-page-id=${page}] .page-content`).attr('data-page-content', 'list')
        $('#news .item').removeClass('show')
      }
    }
  }
}
onhashchange()

//line-clamp


// DOM event

$("#page").click(function() {
  $("body").attr("data-page", $(this).data("page"))
  $("body").removeAttr("data-menued")
})

$("#logo").click(() => {
  if ("landscape" === $("body").attr("data-orientation"))
    return $("body").attr("data-page", "landing")

  if ($("body").is("[data-menued]")) {
    $("body").removeAttr("data-menued")
  } else {
    $("body").attr("data-menued", "")
  }
})

$("#menu>a").click(() => {
  $("body").removeAttr('data-menued')
  $(".page-content").attr("data-page-content", "list")
  $(".item").removeClass('show')
})

$(".return").click(() => {
  $(".page-content").attr("data-page-content", "list")
  $(".item").removeClass('show')
})

$(".group").click(() => {
  $(".lab_board").attr("data-status","member")
})

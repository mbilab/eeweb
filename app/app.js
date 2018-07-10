// web framework

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

  let template = $('#news+script').html()
  let html = Mustache.render(template, { news: data.news })

  $('#news').html(html)

  $(".item").click( function() {
    let id = $(this).attr("id")
    window.location.href = `./#${id}`
  })

  $(window).resize()
  window.onhashchange()
})

///////////////////////////////////////////////////////

// responsive logic

$(window).resize(() => {
  let orientation = $(window).width() > $(window).height() ? 'landscape' : 'portrait'

  $('body').attr('data-orientation', orientation)
  $('#logo').attr('href', 'landscape' === orientation ? '#landing' : '#')
})

// show content referred to url

window.onhashchange = () => {
  if(window.location.hash){
    let [page, itemID] = window.location.hash.match(/(\w+)(?:-(\d+))?/).slice(1, 3)
    if ($(`.page[data-page-id=${page}]`)) {
      $('body').attr('data-page', page)

      if(itemID) {
        $(`.page[data-page-id=${page}] .page-content`).attr('data-page-content', '')
        $('#news .item').removeClass('show')
        $(`#news .item:nth-last-child(${itemID})`).addClass('show')
      } else {
        $(`.page[data-page-id=${page}] .page-content`).attr('data-page-content', 'list')
        $('#news .item').removeClass('show')
      }
    }
  }
}
onhashchange()
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
  if ($("body").is("[data-menued]")) {
    $("body").removeAttr("data-menued")
  } else {
    $("body").attr("data-menued", "")
  }
})

$(".group").click( function(){
  $(".lab_board").attr("data-status","member")
})


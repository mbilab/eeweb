import 'font-awesome/css/font-awesome.min.css'

import './app.sass'
import './index.pug'

const $ = require('jquery')

// responsive logic

$(window).resize(() => $('body').attr('data-orientation',
  $(window).width() > $(window).height()
  ? "landscape"
  : "portrait")
).resize()

// show content referred to url

if (window.location.hash) {
  let page = window.location.hash.replace('#', '')

  if(0 !== $(`.page[data-page='${page}']`).length)
    $("body").attr("data-page", page)
}

$("#main").click(function(){
  $("body").attr("data-page",$(this).data("page"))
  $("body").removeAttr('data-menued')
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

$("#menu>a").click(function() {
  $("body").attr("data-page",$(this).attr('href').replace('#', ''))
  $("body").removeAttr('data-menued')
  $(".page-content").attr("data-page-content","list")
  $(".overview").attr("data-index","0")
  $(".lab_board").attr("data-status","group")
})

$(".return").click(() => {
  $(".page-content").attr("data-page-content","list")
  $(".overview").attr("data-index","0")
})

$(".header").click(function() {
    $(".page-content").attr("data-page-content","content")
    $(".overview").attr("data-index",$(this).data('index'))
})

$(".group").click(() => {
  $(".lab_board").attr("data-status","member")
})

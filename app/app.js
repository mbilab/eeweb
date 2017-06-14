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
    $("body").attr("data-content", page)
}

$("#content").click(function(){
  $("body").attr("data-content",$(this).data("page"))
  $("body").removeAttr('data-menued')
})

$("#logo").click(() => {
  if ("landscape" === $("body").attr("data-orientation"))
    return $("body").attr("data-content", "landing")
  if ($("body").is("[data-menued]")) {
    $("body").removeAttr("data-menued")
  } else {
    $("body").attr("data-menued", "")
  }
})

$("#menu>a").click(function() {
  $("body").attr("data-content",$(this).attr('href').replace('#', ''))
  $("body").removeAttr('data-menued')
  $(".board").attr("data-content","title")
  $(".lab_board").attr("data-status","group")
})

$(".return").click(() => {
  $(".board").attr("data-content","title")
})

$(".header").click(() => {
    $(".board").attr("data-content","content")
})

$(".group").click(() => {
  $(".lab_board").attr("data-status","member")
})

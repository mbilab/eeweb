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

$(".page").click(function(){
  $("body").attr("data-content",$(this).data("page"))
  $("body").removeAttr('data-list')
})

$("#logo").click(() => {
  $("body").attr("data-orientation") == "portrait" ? $("body").attr("data-list",'') : $("body").attr("data-content","landing")
})

$("#menu>a").click(function() {
  $("body").attr("data-content",$(this).attr('href').replace('#', ''))
  $("body").removeAttr('data-list')
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

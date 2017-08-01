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

window.onhashchange = function(){
  let page = window.location.hash.match(/[A-Za-z]+/)
  let num = window.location.hash.match(/\d+/)-1
  let item = $(".page[data-page-id='news'] .page-content .item")[num]
  if(window.location.hash.length==0){
    $("body").attr("data-page", "landing")
  }else{
    $("body").attr("data-page", page)
  }
  if(num !== -1){
    item.className+=" show"
    $(".page-content").attr("data-page-content","")
  }
  else{
    $(".item").removeClass("show")
    $(".page-content").attr("data-page-content","list")
  }
}
onhashchange()

//style
$(window).resize(() => {
  if ("landscape" === $("body").attr("data-orientation"))
    $("#logo").attr("href","#landing")
})

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
  $("body").removeAttr('data-menued')
  $(".page-content").attr("data-page-content","list")
  $(".item").removeClass('show')
})

$(".return").click(() => {
  location.hash.match(/[A-Za-z]+/)
  $(".page-content").attr("data-page-content","list")
  $(".item").removeClass('show')
})

$(".group").click(() => {
  $(".lab_board").attr("data-status","member")
})

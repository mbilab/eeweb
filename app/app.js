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
  let page = window.location.hash.replace(/[^A-Za-z]/g, '')
  //if(0 !== $(`.page[data-page='${page}']`).length)
  $("body").attr("data-page", page)
}


// pop state

//window.onpopstate = function(event){
// let pState = history.state.state
// $("body").attr("data-page", pState.replace('#', ''))
//}

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
  $(".page-content").attr("data-page-content","list")
  $(".item").removeClass('show')
})

$(".item").click(function() {
    $(".page-content").attr("data-page-content",$(this).index())
    $(".item").removeClass('show')
    $(this).addClass('show')
})

$(".group").click(() => {
  $(".lab_board").attr("data-status","member")
})

import 'font-awesome/css/font-awesome.min.css'

import './app.sass'
import './index.pug'

const $ = require('jquery')
const wdth = $(window).width()
const height = $(window).height()

// responsive logic

$(window).resize(() => $('body').attr("data-orientation", $(window).width() > $(window).height() ? "landscape" : "portrait"))
.resize()

$(".page").click(function(){
  $("body").attr("data-content",$(this).data("page"))
  $("body").attr("data-status","")
})

$("#logo").click(() => {
  $("body").attr("data-content","landing")
  $("body").attr("data-status","list")
}
)

$("#menu>div").click(function(){
  $("body").attr("data-content",$(this).data("page"))
  $(".board").attr("data-content","title")
  $(".lab_board").attr("data-status","group")
  $("body").attr("data-status","")
}
)

$(".redo").click(() => {
  $(".board").attr("data-content","title")
}
)

$(".outline>div").click(() => {
    $(".board").attr("data-content","content")
}
)

$(".group").click(() => {
  $(".lab_board").attr("data-status","member")
}
)

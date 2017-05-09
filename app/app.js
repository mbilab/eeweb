import 'font-awesome/css/font-awesome.min.css'

import './app.sass'
import './index.pug'

const $ = require('jquery')
const wdth = $(window).width()
const height = $(window).height()

if( wdth > height){
  $("body").attr("data-orientation","lanscape")
}
else{
  $("body").attr("data-orientation","portrait")
}

$("#logo").click( () => {
  $("body").attr("data-content","landing")
  $("body").attr("data-status","list")
}
)

$("#menu>li").click( function(){
  $("body").attr("data-content",$(this).attr("id"))
  $(".board").attr("data-content","title")
  $(".lab_board").attr("data-status","group")
  $("body").attr("data-status","")
}
)

$(".redo").click( () => {
  $(".board").attr("data-content","title")
}
)

$(".outline>div").click( () => {
    $(".board").attr("data-content","content")
}
)

$(".group").click( () => {
  $(".lab_board").attr("data-status","member")
}
)

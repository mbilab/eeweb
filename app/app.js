import 'font-awesome/css/font-awesome.min.css'

import './app.sass'
import './index.pug'

const $ = require('jquery')


$("#logo").click( () => {
  $("body").attr("data-content","landing")
  $(".nav").attr("data-status","")
}
)

$("#menu>li").click( function(){
  $("body").attr("data-content",$(this).attr("id"))
  $(".board").attr("data-content","title")
  $(".lab_board").attr("data-status","group")
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

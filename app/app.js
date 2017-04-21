import 'font-awesome/css/font-awesome.min.css'

import './app.styl'
import './index.pug'

const $ = require('jquery')

$("#logo").click( () => {
  $("body").attr("data-content","landing")
  $(".nav").attr("data-status","")
}
)

$("#An").click( () => {
  $("body").attr("data-content","activity")
  $(".board").attr("data-content","title")
  $(".nav").attr("data-status","")
}
)

$(".redo").click( () => {
  $(".board").attr("data-content","title")
}    
)

$("#La").click( () => {
  $("body").attr("data-content","lab")
  $(".nav").attr("data-status","")
  $(".lab_board").attr("data-status","group")
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

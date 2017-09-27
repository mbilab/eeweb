// web framework

import 'font-awesome/css/font-awesome.min.css'

const $ = require('jquery')

// custom modules

import './app.sass'
import './index.pug'

// dropbox paper

import news_data from './res/data.json'

///////////////////////////////////////////////////////

// responsive logic

$(window).resize(() => {
  let orientation = $(window).width() > $(window).height() ? 'landscape' : 'portrait'
  $('body').attr('data-orientation', orientation)

  if ('landscape' === orientation)
    $("#logo").attr("href", "#landing")
  else
    $("#logo").removeAttr("href")
  
  $(".title").map(function() {
    if (this.offsetWidth < this.scrollWidth) {
      $(this).addClass('wrap')
    }
    else{
      $(this).removeClass('wrap')
    }
  })

}).resize()

// show content referred to url

window.onhashchange = () => {
  if(window.location.hash){
    let [page, itemID] = window.location.hash.match(/(\w+)(?:-(\d+))?/).slice(1, 3)

    if ($(`.page[data-page-id=${page}]`)) {
      $('body').attr('data-page', page)

      if(itemID) {
        $(`.page[data-page-id=${page}] .page-content`).attr('data-page-content', '').children(`.item:nth-child(${itemID})`).addClass('show')
      } else {
        $(`.page[data-page-id=${page}] .page-content`).attr('data-page-content', 'list').children('.item').removeClass('show')
      }
    }
  }
}
onhashchange()

//d3

// d3.json(news_data,(data) => {console.log(data)})
//console.log(news_data)

// DOM event

$("#main").click(function() {
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
  $("body").removeAttr('data-menued')
  $(".page-content").attr("data-page-content", "list")
  $(".item").removeClass('show')
})

$(".return").click(() => {
  $(".page-content").attr("data-page-content", "list")
  $(".item").removeClass('show')
})

$(".group").click(() => {
  $(".lab_board").attr("data-status","member")
})

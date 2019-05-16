// web framework

import moment from 'moment'
import Mustache from 'mustache/mustache.min'
import swal from 'sweetalert2'
import urlencode from 'urlencode'

const $ = require('jquery')

// custom modules

import './app.sass'
import './index.pug'
import '@fortawesome/fontawesome-free/css/all.css'
import './res/favicon.ico'
// dropbox paper

//import data from '../dist/data.json'
$.get('data.json', data => {
  moment.locale('zh-tw')

  const tag = []
  $('.selector').children('.label').each( function() {
    tag.push( $(this).text().replace('#','') )
  })
  for (let v of data.news) {
    if(!v.tag) v.tag = '其它'
    else v.tag = v.tag.replace(/\[(.+?)\]/, '$1')

    if(v.date) v.date = moment(v.date).format('YYYY MMM DD ddd')

    if (!v.files) continue
    v.content += '<div class="file">'
    for (let f of v.files)
      v.content += f.replace(/^(https:\/\/www\.dropbox.*)\/(.*)\.(\w+)\?dl\=\d+\n*$/,
        (url, prefix, file, ext) => `<a href="${prefix}/${file}.${ext}">${urlencode.decode(file)}</a>`)
    v.content += '</div>'
  }
  data.news.reverse()

  let template = $('#news+script').html()
  let html = Mustache.render(template, { news: data.news })

  $('#news').html(html)

  $("[data-page-content] .item").click( function() { //!
    let id = $(this).attr("id")
    window.location.href = `./#${id}`
  })

  $(window).resize()
  window.onhashchange()
})

///////////////////////////////////////////////////////
// responsive logic
$('.button-right').click(() => {
  $('.button-left').addClass('buttonShow')
  $('.selector').css('margin-left', '-200px')
  //$('.selector').animate({ scrollLeft: 150 }, 300)
  $('.button-right').removeClass('buttonShow')
})

$('.button-left').click(() => {
  $('.button-right').addClass('buttonShow')
  $('.selector').css('margin-left', '0')
  //$('.selector').animate({ scrollLeft: 0 }, 300)
  $('.button-left').removeClass('buttonShow')
})

$(window).resize(() => {
  let orientation = $(window).width() > $(window).height() ? 'landscape' : 'portrait'

  $('body').attr('data-orientation', orientation)
  $('#logo').attr('href', 'landscape' === orientation ? '#landing' : '#')
})

// show content referred to url

let scrollpos = 0

window.onhashchange = () => {
  if(window.location.hash){
    let [page, itemID] = window.location.hash.match(/(\w+)(?:-(.*))?/).slice(1, 3)
    if ($(`.page[data-page-id=${page}]`)) {
      $('body').attr('data-page', page)

      if(itemID) {
        $(`.page[data-page-id=${page}] .page-content`).attr('data-page-content', '')
        $('#news .item').removeClass('show')
        $(`#news .item#${page}-${itemID}`).addClass('show')
        scrollpos = $("#news").scrollTop()
        $("#news").scrollTop(0)
      } else {
        $(`.page[data-page-id=${page}] .page-content`).attr('data-page-content', 'list')
        $('#news .item').removeClass('show')
        $('#news').scrollTop(scrollpos)
      }
    }
  }
}
onhashchange()
// DOM event

$("#page").click(function() {
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

$(".selector .label").click(function() {
  let type = $(this).text().replace(/#/, '')

  if (type !== '全部公告') {
    $("#news > .item").hide()
    $(`#news > .item[data-type='${type}']`).show()
  }
  else $("#news > .item").show()
})

$("#menu>a").click(() => {
  if ($("body").is("[data-menued]")) {
    $("body").removeAttr("data-menued")
  } else {
    $("body").attr("data-menued", "")
  }
})

$("#contact").click(() => {
  swal({
    html: '<iframe src="https://docs.google.com/forms/d/e/1FAIpQLSdJgYj8H3P-aarZ-YPG9Xhx7iA20mViu8o4c1RnioPP4Fiqfw/viewform?embedded=true" width="100%" height="800px" frameborder="0" marginheight="0" marginwidth="0">載入中…</iframe>' ,
    showConfirmButton: false,
  })
})

$(".group").click(() => {
  $(".lab_board").attr("data-status","member")
})
// vi:et:sw=2:ts=2

var chatdict = {}

function enterCheck() {
  var keyPress = window.event.keyCode;

  if (keyPress === 13) {
    axios.post('/chat', {
      'User' : window_user,
      'Message' : document.getElementById('chatbox').value,
      'Time' : Date.now()
    }).then(function(response){
      if(response.data.status_code === 200){
        console.log(response.data.chat)
        $("#chatbox").val('')
      } else {
        alert(response.data.message)
      }
    }).catch(function(error){
      console.log(error)
    })
  }
}

var highest = -1

var requestLoop = setInterval(function(){
  axios.get('/chat').then(function(response){
    if(response.data.status_code === 200){
      chatdict = response.data.chat
      for (var key in response.data.chat){
        if (parseInt(key) > highest){
          console.log(response.data.chat[key])
          $(makediv(response.data.chat, key)).appendTo('#messages');
          highest = parseInt(key)
        }
        if (response.data.chat[key].Link === 1){
          if (!$('#chat_' + key).hasClass('linkWanted')){
            $('#chat_' + key).addClass('linkWanted').attr('data-tooltip', 'Source Requested').append('<i class="fa fa-exclamation" aria-hidden="true"></i>')
          }
        } else {
          $('#chat_' + key).removeClass('linkWanted').find(".fa-exclamation").remove()
        }

        if (response.data.chat[key].Thumb === 1){
          if (!$('#chat_' + key).hasClass('Thumbed')){
            $('#chat_' + key).addClass('Thumbed').append('<i class="fa fa-thumbs-up thumb" aria-hidden="true"></i>')
          }

        if (response.data.chat[key].Url !== ''){
          if (!$('#chat_' + key).hasClass('urlSatisfied')){
            $('#chat_' + key).addClass('urlSatisfied').removeAttr('data-tooltip').find('#message_contents').after(makeLinkDiv(response.data.chat[key].Url))
          }
        }

        if (response.data.chat[key].Rebute !== ''){
          if(!$('#chat_' + key).hasClass('rebuted')){
            $('#chat_' + key).find('#message_contents').after(makeRebuteDiv(response.data.chat[key].Rebute))
            $('#chat_' + key).addClass('rebuted')
          }
        }
      }
      }
    } else {
      alert(response.data.message)
    }
  }).catch(function(error){
    console.log(error)
  })
}, 1000);

var makediv = function(dict, key){
  var str =  `<div id="chat_` + key + `" class="message col-xs-12 hoverable" user="` + dict[key].User + `" data-toggle="modal" data-target=".bd-example-modal-lg"><div class="message_container">`

  var prevNum = parseInt(key) - 1
  if (prevNum < 0) {
    prevNum = '0'
  } else {
    prevNum = prevNum.toString()
  }

  if(prevNum === '0' | dict[key].User !== dict[prevNum].User){
    str += `<div class="message_id">` + dict[key].User + `: </div>`
  }

  str += `<div id="message_contents">` + dict[key].Message + `</div>
     </div></div>`
  return(str)

}

var modalID = -1

var buttonClick = function(button_type){

  var endpoint = ''

  switch(button_type) {
    case 'link':
        endpoint = '/link'
        break;
    case 'thumb':
      endpoint = '/thumb'
        break;
    default:
        console.log('shouldnt happen')
  }

  axios.post(endpoint, {
    'index' : modalID.attr('id').substr(5),
  }).then(function(response){
    if(response.data.status_code === 200){
      console.log(response.data.message)
    } else {
      alert(response.data.message)
    }
  }).catch(function(error){
    console.log(error)
  })

}

$('#myModal').on('show.bs.modal', function (event) {
var clickedChat = $(event.relatedTarget) // Button that triggered the modal
var recipient = clickedChat.attr('id') // Extract info from data-* attributes
// If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
// Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
var modal = $(this)
modal.find("#rebuteDiv").addClass('hidden')
modal.find("#rebuteButton").click(function(){
  modal.find("#rebuteDiv").removeClass('hidden').show()
})
modalID = clickedChat
if (clickedChat.hasClass('linkWanted')){
  modal.find("#linkDiv").removeClass('hidden').show()
} else {
  modal.find("#linkDiv").addClass('hidden')
}
modal.find('#quoted-chat').text('"' + clickedChat.find('#message_contents').text() + '" -- by ' + clickedChat.attr('user'))
modal.find('.modal-body input').val('https://')
})

var setLink = function(){
  var link = $('#url-field').val()
  modalID.removeAttr('data-tooltip').removeClass('linkWanted')
  axios.post('/linkset', {
    'index' : modalID.attr('id').substr(5),
    'url' : link
  }).then(function(response){
    if(response.data.status_code === 200){
      console.log(response.data.message)
    } else {
      alert(response.data.message)
    }
  }).catch(function(error){
    console.log(error)
  })

}

var setRebuttal = function(){
  var link = $('#rebuttal-field').val()
  axios.post('/rebuttalset', {
    'index' : modalID.attr('id').substr(5),
    'rebuttal' : link
  }).then(function(response){
    if(response.data.status_code === 200){
      console.log(response.data.message)
    } else {
      alert(response.data.message)
    }
  }).catch(function(error){
    console.log(error)
  })

}


$("#friendly").click(function(){
    num = parseInt($("#friendly_span").text());
    $("#friendly_span").text(num+1);
})
$("#insightful").click(function(){
    num = parseInt($("#insightful_span").text());
    $("#insightful_span").text(num+1);
})
$("#scholarly").click(function(){
    num = parseInt($("#scholarly_span").text());
    $("#scholarly_span").text(num+1);
})


var makeLinkDiv = function(link){
  var str = `<div class="linkDiv">
  <b><span class="linkSpan">Source provided:</span> <b><a href="` + link + `">` + link + `</a><br>
  <div>`
  return(str)
}

var makeRebuteDiv = function(link){
  var str = `<div class="rebuteDiv">
  <b><span class="rebuteSpan">Counter Source provided:</span> <b><a href="` + link + `">` + link + `</a><br>
  <div>`
  return(str)
}

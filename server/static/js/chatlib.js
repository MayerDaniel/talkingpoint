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
            $('#chat_' + key).addClass('linkWanted').append('<i class="fa fa-exclamation" aria-hidden="true"></i>')
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
  var str =  `<div id="chat_` + key + `" class="message col-xs-12 hoverable" user="` + dict[key].User + `" data-toggle="modal" data-target=".bd-example-modal-lg"><div class="message_container">
      <div class="message_id">` + dict[key].User + `: </div>
      <p id="message_contents">` + dict[key].Message + `</p>
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
    case '':
        break;
    default:
        console.log('shouldnt happen')
  }

  axios.post(endpoint, {
    'index' : modalID,
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
modalID = parseInt(recipient.substr(5))
modal.find('#quoted-chat').text('"' + clickedChat.find('#message_contents').text() + '" -- by ' + clickedChat.attr('user'))
modal.find('.modal-body input').val(recipient)
})

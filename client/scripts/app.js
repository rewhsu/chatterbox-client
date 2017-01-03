// YOUR CODE HERE:
var app = {};

app.server = 'https://api.parse.com/1/classes/messages';

app.init = function() {
  // fetch messages every second
  // setInterval(function() {
  //   app.fetch();
  // }, 1000);
  
  // post message
  var urlUser = window.location.search;
  var userName = urlUser.slice(urlUser.indexOf('=') + 1);
  $('#sendMessage').on('click', function() {
    var message = {
      username: userName,
      text: $('#newMessage').val(),
      roomname: $('#roomSelect').val()
    };
    app.send(message);
    app.renderMessage(message);
  });

  // clear message
  $('#clearMessages').on('click', function() {
    app.clearMessages();
  });

  // fetch messages on room selection
  $('#roomSelect').change(function() {
    console.log($('#roomSelect').val());
  });
};

app.send = function(message) {
  $.ajax({
  // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = function() {
  $.ajax({
  // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'GET',
    data: 'order=-createdAt',
    contentType: 'application/json',
    success: function (data) {
      // debugger;
      console.log(data);
      var firstMessageId = $('#chats .message').first().attr('id');
      var messages = data.results;
      // for (var i = messages.length - 1; i >= 0; i--) {
      var patt = /[&<>"'`@$%()=+{}[\]]/g;
      for (var i = 0; i < messages.length; i++) {
        var validateData = function() {
          return patt.test(messages[i].text) || patt.test(messages[i].username);
        };
        if (!validateData && messages[i].objectId !== firstMessageId) {
          app.renderMessage(messages[i]);
        } else {
          console.log(messages[i].text);
        }
      }
      // _.each(data.results, function(msg) {
        
        
      // });
      console.log('chatterbox: Message fetched');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to fetch message', data);
    }
  });
};

app.clearMessages = function() {
  $('#chats').empty();
};

app.renderMessage = function(message) {
  // add user and message field to append
  // refactor using .attr
  $('#chats').append(
    '<div class="message" id="' + message.objectId + '">' +
      '<span class="userName"> @' + message.username + '</span>' +
      '<span class="msgText">: ' + message.text + message.createdAt + '</span>' +
    '</div>'
    );
};

app.renderRoom = function(roomName) {
  // consider using .attr() to add value attribute
  $('#roomSelect').append('<option value="' + roomName + '">' + roomName + '</option>');
};

$(document).ready(app.init);


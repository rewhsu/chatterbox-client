// YOUR CODE HERE:
var app = {};

app.init = function() {
  
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
    url: 'https://api.parse.com/1/classes/messages',
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

app.fetch = function(requestUrl) {
  $.ajax({
  // This is the url you should use to communicate with the parse API server.
    url: requestUrl,
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
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
  $('#chats').append('<p>' + message.text + '</p>');
};

app.renderRoom = function(roomName) {
  // consider using .attr() to add value attribute
  $('#roomSelect').append('<option value="' + roomName + '">' + roomName + '</option>');
};

$(document).ready(app.init);


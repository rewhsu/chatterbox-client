// YOUR CODE HERE:
var app = {};

app.server = 'https://api.parse.com/1/classes/messages';
app.friends = {};
app.friendCount = 0;

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
  });

  // clear message
  $('#clearMessages').on('click', function() {
    app.clearMessages();
  });

  // fetch messages on room selection
  $('#roomSelect').change(function() {
    console.log($('#roomSelect').val());
  });

  // fetch messages on room selection
  $('#friendSelect').change(function() {
    var selected = $('#friendSelect').val();
    if (selected === $('#friendSelect').children().first().val()) {
      $('.chat').show();
    } else {
      $('.chat').hide();
      $('.' + selected).show();
    }
  });

  // fetch new messages every second
  app.fetch();
  // setInterval(function() {
  //   app.fetch();
  // }, 1000);
};

app.clickHandlers = function () {
  // add friend
  setTimeout(function() {
    $('.username').on('click', function() {
      app.handleUsernameClick(event);
    });
  }, 500);
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
      app.clearMessages();
      var firstMessageId = $('#chats .chat').first().attr('id');
      var messages = data.results;
      var patt = /[&<>"'`@$%=+{}[\]]/g;
      for (var i = 0; i < messages.length; i++) {
        var validateData = function() {
          return patt.test(messages[i].text) || patt.test(messages[i].username) || patt.test(messages[i].roomname);
        };
        if (!validateData() && messages[i].objectId !== firstMessageId) {
          // console.log(messages[i].text);
          app.renderMessage(messages[i]);
        } else {
          // console.error('INVALID INPUT: ', messages[i].text);
        }
      }
      console.log('chatterbox: Message fetched');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to fetch message', data);
    }
  });
  app.clickHandlers();
};

app.clearMessages = function() {
  $('#chats').empty();
};

app.renderMessage = function(message) {
  // add user and message field to append
  // refactor using .attr
  $('#chats').append(
    `<div class="chat ${message.username}" id="${message.objectId}">
      <span class="username">${message.username}</span>
      <span class="msgText">: ${message.text}</span>
      <span class="createdAt">: ${message.createdAt}</span>
      <span class="roomName">: Room: ${message.roomname}</span>
    </div>`
    );
};

app.renderRoom = function(roomName) {
  // consider using .attr() to add value attribute
  $('#roomSelect').append('<option value="' + roomName + '">' + roomName + '</option>');
};

app.handleUsernameClick = function (event) {
  var friend = event.target.textContent;
  if (!app.friends[friend]) {
    app.friends[friend] = true;
    app.friendCount ++;
    $('.' + friend).css('font-weight', 'Bold');
    $('#friendSelect option').first().text(`Friends (${app.friendCount})`);
    $('#friendSelect').append(`<option value="${friend}">${friend}</option>`);
  } else {
    app.friends[friend] = false;
    app.friendCount --;
    $('.' + friend).css('font-weight', 'Normal');
    $('#friendSelect option').first().text(`Friends (${app.friendCount})`);
    var options = $('#friendSelect option');
    for (var i = 0; i < options.length; i++) {
      if (options[i].value === friend) {
        options[i].remove();
      }
    }
  }
};

$(document).ready(app.init);


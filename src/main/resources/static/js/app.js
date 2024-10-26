var stompClient = null;

function connect(username, group_id) {
    var socket = new SockJS('http://localhost:8080/chat');
    stompClient = Stomp.over(socket);

    stompClient.connect({ username: username, group_id: group_id }, function(frame) {
        console.log('Web Socket is connected: ' + frame);

        console.log("username: "+username);
        console.log("groupId: "+group_id);

        // Subscribe to the user-specific message queue
        stompClient.subscribe('/topic/messages/'+group_id, function(message) {
            // Display the message in the message area
            var messageDiv = document.createElement('div');
            messageDiv.textContent = message.body;
            document.getElementById("message").appendChild(messageDiv);
        });
    }, function(error) {
        console.error('WebSocket connection error: ' + error);
    });
}

// Event listeners for form submission and button clicks
document.addEventListener('DOMContentLoaded', function() {
    var connectButton = document.getElementById("connect");
    var sendButton = document.getElementById("send");
    var usernameInput = document.getElementById("username");
    var groupIdInput = document.getElementById("group_id");

    var receiverIdInput = document.getElementById("receiver_id");
    var messageInput = document.getElementById("receiver_message");

    connectButton.addEventListener('click', function() {
        var username = usernameInput.value;
        var group_id = groupIdInput.value;
        if (username) {
            connect(username, group_id);
        } else {
            alert("Please enter a username.");
        }
    });

    sendButton.addEventListener('click', function() {
        var senderId = usernameInput.value;
        var group_id = groupIdInput.value;
        var messageContent = messageInput.value;
        console.log("clicked");
        console.log("sender:"+senderId+"content:"+messageContent);

        if (senderId && messageContent && stompClient) {
            console.log("sending req to /app/sendMessage");
            stompClient.send("/app/groupMessage/"+group_id, {}, JSON.stringify({
                senderId: senderId,  // Corrected from `receiver_id` to `receiverId`
                groupId: group_id,
                content: messageContent
            }));
            messageInput.value = ''; // Clear the input field after sending
        } else {
            alert("Please enter a message to send.");
        }
    });

    // Prevent form submission
    document.querySelector("form").addEventListener('submit', function(e) {
        e.preventDefault();
    });
});

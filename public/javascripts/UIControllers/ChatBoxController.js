/*
	Handles the sending and receiving of messages in the front end UI
 */

	function ChatBoxController(sendMessage) {
		this.sendMessage = sendMessage;
		this.initializeSendButton();
		this.initializeRaiseButton();
	}

	ChatBoxController.prototype.displayMessage = function(message) {
		var messageContainer = $('.message-container');
		if(message === "/raisehand")
		{
			messageContainer.append(this.formRaiseHandBubble());
		} else {
			messageContainer.append(this.formMessageBubble(message));
		}
		messageContainer.animate({scrollTop: messageContainer.prop("scrollHeight")});
	}

	ChatBoxController.prototype.formRaiseHandBubble = function() {
		var image = $('<img/>')
			.attr('src', 'images/raiseHandIcon2.png')
			.attr('id', 'raise-hand-icon');
		var text = "Excuse me. I have a question."
		var raiseHandBubble = $('<div></div>')
			.append(image)
			.append(text)
			.addClass("raise-hand-bubble");
		return raiseHandBubble;
	}

	ChatBoxController.prototype.formMessageBubble = function(message) {
		var messageBubble = $('<div></div>')
			.append(message)
			.addClass("message-bubble");
		return messageBubble;
	}

	ChatBoxController.prototype.initializeSendButton = function () {
		var that = this;
		var sendButton = $("#send-button");
		//var sendMessageHandler =
		sendButton.click(function () {
			var textInput = $(".input-box").val();
			if(textInput.length != 0) {

				// Take this out in the real thing!
				that.displayMessage($(".input-box").val());

				that.sendMessage($(".input-box").val());
			}
		});
	}

	ChatBoxController.prototype.initializeRaiseButton = function () {
		var that = this;
		var raiseHandButton = $("#raise-hand-button");
		raiseHandButton.click(function () {

			// Take this out in the real thing!
			that.displayMessage("/raisehand");

			that.sendMessage("/raisehand");
		});
	}

	// Take this out in the real thing!
	var chatBoxController = new ChatBoxController(function() {});

	//$(document).ready(function() {
	//	var sendButton = $("#send-button");
	//	//var sendMessageHandler =
	//	sendButton.click(function () {
	//		displayMessage("Hello!!!!!!!!!!!!!!!!!!!!!!!!!!");
	//	});
	//})


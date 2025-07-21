import React from "react";
import Message from "../components/message/Message";

const ChatBox = ({
  currentChat,
  messages,
  newMessage,
  setNewMessage,
  handleSubmit,
  scrollRef,
  user,
  receiver
}) => {
  return (
    <div className="chatBox">
      <div className="chatBoxWrapper">
        {currentChat ? (
          <>
          <div className="chatHeader">
  <div className="chatHeaderLeft">
    <img
      src={receiver?.image || "/default-avatar.png"}
      alt="avatar"
      className="chatHeaderAvatar"
    />
    <div>
      <div className="chatHeaderName">{receiver?.username}</div>
      {/* <div className="chatHeaderStatus">
        <span className="onlineDot"></span>
        Đang hoạt động
      </div> */}
    </div>
  </div>
  <div className="chatHeaderRight">
    <i className="fas fa-phone"></i>
    <i className="fas fa-video"></i>
    <i className="fas fa-info-circle"></i>
  </div>
</div>

            <div className="chatBoxTop">
              {messages.length === 0 ? (
                <div className="noMessageYet">No messages yet. Say hi!</div>
              ) : (
                messages.map((m, index) => {
                  const isLastMessage = index === messages.length - 1;
                  const isOwnMessage = m.sender._id === user.account.id;

                  return (
                    <div key={m._id || index} ref={isLastMessage ? scrollRef : null}>
                      <Message message={m} own={isOwnMessage} sender={m.sender} />
                      {isLastMessage && isOwnMessage && (
                        <div className="not-seen-text">
                          {m.seen === false ? "Not seen yet" : "Seen"}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
            <div className="chatBoxBottom">
              <textarea
                className="chatMessageInput"
                placeholder="write something..."
                onChange={(e) => setNewMessage(e.target.value)}
                value={newMessage}
              ></textarea>
              <button className="chatSubmitButton" onClick={handleSubmit}>
                Send
              </button>
            </div>
          </>
        ) : (
          <span className="noConversationText">Open a conversation to start a chat.</span>
        )}
      </div>
    </div>
  );
};

export default ChatBox;

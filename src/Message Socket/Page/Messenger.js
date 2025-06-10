import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { ApiGetMessageByConversationId, ApiMarkMessagesAsSeen, ApiSendMessage, getConversationApi } from "../../../src/Service/ApiService";
import './Messenger.scss'
import Conversation from "../components/conversations";
import Message from "../components/message/Message";
import { io } from "socket.io-client";
const Messenger = () => {
  const user = useSelector(state => state.user);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();
  const scrollRef = useRef();
  if(messages){
    console.log(messages)
  }
  useEffect(() => {
    socket.current = io("ws://localhost:6060");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);
  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);
  useEffect(() => {
    socket.current.emit("addUser", user.account.id);
    socket.current.on("getUsers", (users) => {
      if (Array.isArray(user.followings)) {
        setOnlineUsers(
          user.followings.filter((f) => users.some((u) => u.userId === f))
        );
      }
    });
  }, [user]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    // const message = {
    //   sender: user.account.id,
    //   text: newMessage,
    //   conversationId: currentChat._id,
    // };
    const receiverId = currentChat.members.find(
      (member) => member !== user.account.id,
    );
    socket.current.emit("sendMessage", {
      senderId: user.account.id,
      receiverId,
      text: newMessage,
    });

    try {
      const data = await ApiSendMessage(receiverId, newMessage);

      const newMsg = {
        ...data,
        sender: { _id: user.account.id, image: user.account.image }
      };

      setMessages([...messages, newMsg]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }

  };
  useEffect(() => {
    const getConversations = async () => {
      try {
        let response = await getConversationApi();
        setConversations(response);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, []);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!currentChat) return;

    const getMessages = async () => {
      try {
        let response = await ApiGetMessageByConversationId(currentChat._id);
        setMessages(response);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    getMessages();
  }, [currentChat]);

  useEffect(() => {
    if (!currentChat) return;
  
    const markMessagesAsSeen = async () => {
      try {
        let response = await ApiMarkMessagesAsSeen(currentChat._id);
        console.log(response);
  
        // Gửi socket thông báo đến người gửi là đã xem
        const senderId = currentChat.members.find(m => m !== user.account.id);
        socket.current.emit("seenMessage", {
          senderId,
          conversationId: currentChat._id,
        });
      } catch (err) {
        console.error("Error marking messages as seen:", err);
      }
    };
  
    markMessagesAsSeen();
  }, [currentChat]);
  
  useEffect(() => {
    socket.current.on("messageSeen", ({ conversationId }) => {
      if (currentChat && currentChat._id === conversationId) {
        // Cập nhật trạng thái tất cả các tin nhắn là seen
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.sender._id === user.account.id ? { ...msg, seen: true } : msg
          )
        );
      }
    });
  }, [currentChat]);
  
  return (
    <>
      {/* <Topbar /> */}
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input placeholder="Search for friends" className="chatMenuInput" />
            {conversations && Array.isArray(conversations) ? conversations.map((c) => (
              <div key={c._id} onClick={() => setCurrentChat(c)}>
                <Conversation conversation={c} currentUser={user.account} />
              </div>
            )) : <p>Loading conversations...</p>}


          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((m, index) => {
                    const isLastMessage = index === messages.length - 1;
                    const isOwnMessage = m.sender._id === user.account.id;

                    return (
                      <div key={m._id || index} ref={isLastMessage ? scrollRef : null}>
                        <Message
                          message={m}
                          own={isOwnMessage}
                          sender={m.sender}
                        />
                        {isLastMessage && isOwnMessage && (
                          m.seen === false ? (
                            <div className="not-seen-text">Not seen yet</div>
                          ) : (
                            <div className="not-seen-text">Seen</div>
                          )
                        )}

                      </div>
                    );
                  })}
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
              <span className="noConversationText">
                Open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          {/* <div className="chatOnlineWrapper">
            <ChatOnline
              onlineUsers={onlineUsers}
              currentId={user._id}
              setCurrentChat={setCurrentChat}
            />
          </div> */}
        </div>
      </div>
    </>
  )
}
export default Messenger
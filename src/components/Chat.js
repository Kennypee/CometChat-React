import React, { Component } from "react";
import "../Chat.css";
import config from "../config";
import ChatManager from '../components/ChatManager'
import App from '../App'

class Chat extends Component {
constructor(props){
  super(props)
  this.state = {
    messages: [],
    message: null,
    user:{},
    isLoggedIn:this.props.isLoggedIn
  };
  this.GUID = config.GUID
}

  handleChange = e => {
    this.setState({ message: e.target.value });
    
  };

  sendMessage = () => {
    ChatManager.sendGroupMessage(this.GUID, this.state.message).then(
      message => {
        console.log("Message sent successfully:", message);
        this.setState({ message: '' });
      },
      error => {
        if (error.code === "ERR_NOT_A_MEMBER") {
          ChatManager.joinGroup(this.GUID).then(response => {
            this.sendMessage();
            
          });
        }
      }
    );
  };

getUser = () => {
  ChatManager.getLoggedinUser().then(user => {
      console.log("user details:", { user });
      this.setState({ user });
    })
    .catch(({ error }) => {
      if (error.code === "USER_NOT_LOGED_IN") {
        this.setState({
          userAuth: false
        });
      }
    });
};

messageListener = () => {
  ChatManager.addMessageListener((data, error) => {
    if (error) return console.log(`error: ${error}`);
    this.setState(
      prevState => ({
        messages: [...prevState.messages, data]
      }),
      () => {
        
      }
    );
  });
};

componentDidMount() {
  this.getUser();
  this.messageListener();
  // chat.joinGroup(this.GUID)
}

  render() {
    const {isLoggedIn} = this.state
    console.log(this.props);
    console.log(isLoggedIn);

    if(!isLoggedIn){
      return(
        <App/>
      )
    }
    return (
      <div className="App">
        <h3>Chat Group</h3>
        <p>Welcome to the group: {this.props.username}</p>
        <div className="chatWindow">
          <ul className="chat" id="chatList">
            {this.state.messages.map(data => (
              <div key={data.id}>
                {this.state.user.uid === data.sender.uid ? (
                  <li className="self">
                    <div className="msg">
                      <p>{data.sender.uid}</p>
                      <div className="message">{data.data.text}</div>
                    </div>
                  </li>
                ) : (
                  <li className="other">
                    <div className="msg">
                      <p>{data.sender.uid}</p>
                      <div className="message">{data.data.text}</div>
                    </div>
                  </li>
                )}
              </div>
            ))}
          </ul>
        </div>
        <div className="chatInputWrapper">
          <input
            className="textarea input"
            type="text"
            value={this.state.message}
            placeholder="Enter your message here ..."
            onChange={this.handleChange}
          />
        </div>
        <div><button onClick={this.sendMessage} className="btn btn-primary mt-5">
            Send Message
          </button></div>
      </div>
    )
  }
}
export default Chat;
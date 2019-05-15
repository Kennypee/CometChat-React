import React, {Component } from "react";
import "./App.css";
import { CometChat } from "@cometchat-pro/chat";
import Chat from './components/Chat'
import ChatManager from './components/ChatManager'

class App extends Component {
  state = {
    username: "",
    isLoggedIn: false,
    user: "",
    error:"",
    isLoggingIn:"none",
    joinChat: ""
  };
componentDidMount(){
  return CometChat.init(ChatManager.appId)
}
  handleUsername = e => {
    this.setState({ username: e.target.value });
  };

  signInToChat = (e) => {
    this.setState({isLoggingIn:"", joinChat:"none"})
    e.preventDefault()
    if(this.state.username!==""){
      ChatManager.login(this.state.username).then(user => {
        
        this.setState({
          user,
          isLoggedIn: true,
          isLoggingIn:"none"

        });
      })
      .catch(error => {
          this.setState({
            error: "User doesn't exist, Please enter a valid username"
          });
          console.log(error);
      });      
    }
  };

  render() {

    if(!this.state.isLoggedIn){
    return (
        <div className="App">
        <div style={{ display: this.state.joinChat}}>
          <form className="mt-5 ml-5 mr-5">
            <h3>Sign in to chat</h3>
            <div className="form-group">
              <label>Username:</label>
              <input
                onChange={this.handleUsername}
                value={this.state.username}
                type="text"
                className="form-control"
                id="username"
              />
            </div>
            <button onClick={this.signInToChat} className="btn btn-primary">
              Join Chat
            </button>
          </form>
          </div>
          <div className="mt-5" style={{ display: this.state.isLoggingIn}}>
            <h3>Joining chat ...</h3>
          </div>
        </div>
    );
    }else{
      return (
        <div className="App">
         <Chat username={this.state.username} isLoggedIn={this.state.isLoggedIn}/>
        </div>
    
    );

    }
  }
}
export default App;

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class ChatMessage extends Component {
  render() {
    const message = this.props.message;
    const type = (this.props.type === "self") ? "Self-message" : "Friend-message";
    return(
        <tr>
          <td className={type}> {message} </td>
        </tr>
    );
  }
}

class ChatView extends Component {
  render() {
    const rows = [];
    let lastMessage = null;

    this.props.messages.forEach((message) => {
      if (message.content !== lastMessage){
        rows.push(
            <ChatMessage
                message={message.content}
                type={message.type} 
                key={message.content} />
          );
      }
    });

    return(
      <table className="Chat-view">
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

const CHAT_LOG = [
  {content: 'Hey Ben!', type: 'self'},
  {content: 'Hey Ryan!', type: 'friend'},
  {content: 'How is it going?', type: 'self'},
  {content: 'Well thanks, hbu?', type: 'friend'}
];

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">
            Smooth Connect
          </h1>
        </header>
        <p className="App-intro">
          Hello world
        </p>
        <ChatView messages={CHAT_LOG} />
      </div>
    );
  }
}

export default App;

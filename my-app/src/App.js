import React, { Component } from 'react';
import ReactDOM from 'react-dom';
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


class InputChat extends Component {
  constructor(props){
    super(props);
    this.state = {value: '', messages:props.chatHistory};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    this.setState({
      messages: this.state.messages.concat([{content:this.state.value, type:'self'}])
    }, () => {
      ReactDOM.findDOMNode(this.refs.msg).value ="";
    });
    event.preventDefault();
  }

    render() {
    return (
      <div>
        <ChatView messages={this.state.messages} />
        <form onSubmit={this.handleSubmit}>
          <label>
            Message:
            <input type="text" value={this.state.value} onChange={this.handleChange} ref="msg"/>
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
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
        <InputChat chatHistory={CHAT_LOG}/>
      </div>
    );
  }
}

export default App;

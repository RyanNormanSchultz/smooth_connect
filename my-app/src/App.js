import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import './App.css';

class ChatMessage extends Component {
  render() {
    const message = this.props.message;
    const type = (this.props.type === "self") ? "Self-message" : "Friend-message";
    return(
        <tr>
          <td className={type} > {message} </td>
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
        if(message.thread == this.props.thread){
          rows.push(
              <ChatMessage
                  message={message.content}
                  type={message.type} 
                  key={message.content} />
            );
        }
      }
    });

    return(
      <div className="Chat-Container">
        <table className="Chat-Table">
          <tbody>{rows}</tbody>
        </table>
      </div>
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
      messages: this.state.messages.concat([{content:this.state.value, type:'self', thread:this.props.thread}]),value:''
    }, () => {
      ReactDOM.findDOMNode(this.refs.msg).value ="";
    });
    event.preventDefault();
  }

    render() {
    return (
      <div>
        <ChatView messages={this.state.messages} thread={this.props.thread}/>
        <form onSubmit={this.handleSubmit}>
          <label>
            <input type="text" value={this.state.value} onChange={this.handleChange} ref="msg"/>
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

class ThreadController extends Component {
  constructor(props){
    super(props);
    this.state = {active_threads: 0, current_thread: 0};

    this.handleThreadChangeLeft = this.handleThreadChangeLeft.bind(this);
    this.handleThreadChangeRight = this.handleThreadChangeRight.bind(this);
  }

  handleThreadChangeLeft(event){
      this.setState({current_thread: this.state.current_thread + 1})
  }

  handleThreadChangeRight(event){
    if(this.state.current_thread > 0 ){
      this.setState({current_thread: this.state.current_thread - 1})
    }
  }

  render() {
    return(
      <div >
        <p> Thread: {this.state.current_thread}, Active Threads: {this.state.active_threads} </p>
        <button onClick={this.handleThreadChangeLeft}>
          Thread+
        </button>
        <button onClick={this.handleThreadChangeRight}>
          Thread-
        </button>
        <KeyboardEventHandler 
          handleKeys={['right']}
          onKeyEvent={(key,e) => this.handleThreadChangeLeft(e)}/>
        <KeyboardEventHandler 
          handleKeys={['left']}
          onKeyEvent={(key,e) => this.handleThreadChangeRight(e)}/>
        <InputChat chatHistory={CHAT_LOG} thread={this.state.current_thread}/>
      </div>
    );
  }
}

class ThreadInterpreter extends Component {
  constructor(props){
    super(props);
    this.state = {active_threads: 1}
  }
  render() {
    return(
        <ThreadController />
      );
  }
}

  const CHAT_LOG = [
    {content: 'Hey Ben!', type: 'self', thread: '0'},
    {content: 'Hey Ryan!', type: 'friend', thread:'0'},
    {content: 'How is it going?', type: 'self', thread:'0'},
    {content: 'Well thanks, hbu?', type: 'friend', thread:'0'}
  ];

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-Container">
          <h1 className="App-title">
            Smooth Connect
          </h1>
          <ThreadInterpreter />
        </div>
      </div>
    );
  }
}

export default App;

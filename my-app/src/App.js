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

    var calc_width=0;
    var calc_display='none';
    if(this.props.thread <= this.props.active_threads) {
      calc_width=100/(this.props.active_threads+1) + "%";
      calc_display='table-cell';
    }
    var calc_border = '0px solid black';
    if(this.props.thread == this.props.current_thread && this.props.active_threads > 0) { //apply a active (so you know what lane)
      calc_border = '5px solid #707F8C';
    }
    const tdStyle = {
      width: calc_width,
      display: calc_display,
      border: calc_border,
    };

    return(
          <td className="Thread-Col" style={tdStyle}>
            <table className="Chat-Table">
              <tbody>{rows}</tbody>
            </table>
          </td>
    );
  }
}

class ThreadView extends Component {
  render() {
    return(
        <div className="Chat-Container">
          <table className="Chat-Table">
            <tbody>
              <tr>        
               <ChatView messages={this.props.messages} thread={0} active_threads={this.props.active_threads} current_thread={this.props.current_thread}/>
               <ChatView messages={this.props.messages} thread={1} active_threads={this.props.active_threads} current_thread={this.props.current_thread}/>
               <ChatView messages={this.props.messages} thread={2} active_threads={this.props.active_threads} current_thread={this.props.current_thread}/>
               </tr>
            </tbody>
          </table>
        </div>
      );
  }
}

class InputChat extends Component {
  constructor(props){
    super(props);
    this.state = {value: '', messages:props.chatHistory, thread: 0, active_threads: 0, person: 'self'};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.myRef = React.createRef();
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    var regex_new_thread = /\?\?/;
    var thread = this.myRef.current.state.current_thread;
    if(regex_new_thread.test(this.state.value)){
      thread = this.state.active_threads+1;
      this.setState({active_threads: this.state.active_threads + 1});
    }

    if(this.state.person === 'self'){ //just flip flop states for now
      this.setState({person: 'friend'});
    } else{
      this.setState({person: 'self'});
    }
    const new_message = [{content:this.state.value, type:this.state.person, thread:thread}];
    this.setState({
      messages: this.state.messages.concat(new_message),value:''
    }, () => {
      ReactDOM.findDOMNode(this.refs.msg).value ="";
    });
    event.preventDefault();
  }
    render() {
      var width_size = 400 + 150*(this.state.active_threads) + 'px';

    return (
      <div className="App-Container" style={{width:width_size}}>
          <h1 className="App-title">
            Smooth Connect
          </h1>
        <div>
          <ThreadController messages={this.state.messages} ref={this.myRef} active_threads={this.state.active_threads} />
          <form onSubmit={this.handleSubmit}>
            <label>
              <input type="text" value={this.state.value} onChange={this.handleChange} ref="msg"/>
            </label>
            <input type="submit" value="Submit" />
          </form>
        </div>
      </div>
    );
  }
}

class ThreadController extends Component {
  constructor(props){
    super(props);
    this.state = {current_thread: 0};

    this.handleThreadChangeLeft = this.handleThreadChangeLeft.bind(this);
    this.handleThreadChangeRight = this.handleThreadChangeRight.bind(this);
  }

  handleThreadChangeLeft(event){
      if(this.state.current_thread < this.props.active_threads){
        this.setState({current_thread: this.state.current_thread + 1})
      }
  }

  handleThreadChangeRight(event){
    if(this.state.current_thread > 0 ){
      this.setState({current_thread: this.state.current_thread - 1})
    }
  }

  render() {
    return(
      <div >
        <p> Thread: {this.state.current_thread}, Active Threads: {this.props.active_threads} </p>
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
        <ThreadView messages={this.props.messages} active_threads={this.props.active_threads} current_thread={this.state.current_thread}/>
      </div>
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
          <InputChat chatHistory={CHAT_LOG} />
      </div>
    );
  }
}

export default App;

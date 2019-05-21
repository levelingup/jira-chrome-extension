import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      ticket: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      ticket: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const paramsTicket = this.state.ticket;
    const url = `https://revolve.atlassian.net/browse/${paramsTicket}`;
    const win = window.open(url, '_blank');
    win.focus();
  }

  render(){
    return(
      <div className="App">
        <h1>Enter Jira Ticket</h1>
        <form className="App-form" onSubmit={this.handleSubmit}>
          <input autoFocus
                 className="App-input"
                 type = "text"
                 name = "ticket"
                 value = {this.state.ticket}
                 onChange = {this.handleChange}
                 placeholder = "Enter: ux-7290, mar-3245, etc..." />
          <button className="App-submit" type="submit">Submit</button>
        </form>
      </div>
    );
  }
};

export default App;

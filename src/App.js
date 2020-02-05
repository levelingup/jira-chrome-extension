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

  prefix = () => {

  }

  handleChange(event) {
    this.setState({
      ticket: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    const prefix = ['ac-', 'al-', 'an-', 'andro-' , 'cs-', 'data-', 'dev-', 'exal-', 'gen-', 'in-' , 'ip-', 'ipf-', 'klar-', 'mar-', 'mer-', 'op-' , 'grap-', 'qa-', 'ruzirwzin', 'tec-', 'temp-', 'tr-', 'tri-', 'trm-', 'ux-']
    const paramsTicket = this.state.ticket;
    //https://revolve.atlassian.net/issues/?jql=text%20~%20%22fdafasdsa%22
    // checks to see if its 1 word (most likely jira ticket)

    let url = '';
    if(paramsTicket.split(' ').length === 1){
      
      // check if the word is within our jira ticket #s
      if (prefix.some(v => paramsTicket.includes(v))) {
        url = `https://revolve.atlassian.net/browse/${paramsTicket}`;
      } else {
        url = `https://revolve.atlassian.net/secure/QuickSearch.jspa?searchString=${paramsTicket}`
      }

    } else {
      url = `https://revolve.atlassian.net/secure/QuickSearch.jspa?searchString=${paramsTicket}`
    }
    const win = window.open(url, '_blank');
    win.focus();
    
  }

  render(){
    return(
      <div className="App">
        <h1>Enter Jira Ticket or Search</h1>
        <form className="App-form" onSubmit={this.handleSubmit}>
          <input autoFocus
                 className="App-input"
                 type = "text"
                 name = "ticket"
                 value = {this.state.ticket}
                 onChange = {this.handleChange}
                 placeholder = "Enter: ux-7290, mar-3245, shopping bag recs" />
          <button className="App-submit" type="submit">Submit</button>
        </form>
        <a href="mailto:andrew.liu@revolve.com?subject=Google Chrome Extension Bug Report" target="_blank" rel="noopener noreferrer">report a bug</a>
      </div>
    );
  }
};

export default App;

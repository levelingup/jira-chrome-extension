/*global chrome*/

import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ticket: '',
      abTestGroup: '',
      activeTab: 'jira-tickets'

    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeAbTestGroup = this.handleChangeAbTestGroup.bind(this);
    this.handleSubmitAbTest = this.handleSubmitAbTest.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);
  }


  prefix = () => {

  }

  handleChange(event) {
    this.setState({
      ticket: event.target.value
    });
  }

  handleChangeAbTestId(event) {
    this.setState({
      abTestId: event.target.value
    });
  }
  handleChangeAbTestGroup(event) {
    this.setState({
      abTestGroup: event.target.value
    });
  }
  handleSubmit(event) {
    event.preventDefault();

    const prefix = ['ab-', 'ac-', 'al-', 'an-', 'andro-', 'cs-', 'data-', 'dev-', 'exal-', 'gen-', 'in-', 'ip-', 'ipf-', 'mar-', 'mer-', 'op-', 'grap-', 'qa-', 'tec-', 'temp-', 'tr-', 'tri-', 'trm-', 'ux-']
    const paramsTicket = this.state.ticket;
    //https://revolve.atlassian.net/issues/?jql=text%20~%20%22fdafasdsa%22
    // checks to see if its 1 word (most likely jira ticket)

    let url = '';
    if (paramsTicket.split(' ').length === 1) {

      // check if the word is within our jira ticket #s
      if (prefix.some(v => paramsTicket.includes(v))) {
        url = `https://revolve.atlassian.net/browse/${paramsTicket}`;
      } else {
        url = `https://revolve.atlassian.net/issues/?jql=text~"${paramsTicket}"`
      }

    } else {
      url = `https://revolve.atlassian.net/issues/?jql=text~"${paramsTicket}"`
    }
    const win = window.open(url, '_blank');
    win.focus();

  }

  handleSubmitAbTest(event) {
    event.preventDefault();
  
    const input = this.state.abTestGroup.trim(); // Get the user input and remove leading/trailing whitespace
  
    const abTestId = input.slice(0, -1); // Extract the number by removing the last character
    const abTestGroup = input.slice(-1); // Extract the letter
  
    // Get the current tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs.length > 0) {
        const tab = tabs[0];
  
        // Modify the URL of the current tab
        const url = new URL(tab.url);
        url.searchParams.set('abtest', abTestId);
        url.searchParams.set('group', abTestGroup);
  
        // Update the URL of the current tab
        chrome.tabs.update(tab.id, { url: url.href });
      }
    });
  }

  handleTabClick(tab) {
    this.setState({
      activeTab: tab
    });
  }

  render() {
    const { activeTab } = this.state;

    return (
      <div className="App">
        <div className='App-tab'>
          <button
            className={`App-tab-header ${activeTab === 'jira-tickets' ? 'active' : ''}`}
            onClick={() => this.handleTabClick('jira-tickets')}
          >
            Jira Tickets
          </button>
          <button
            className={`App-tab-header ${activeTab === 'ab-tests' ? 'active' : ''}`}
            onClick={() => this.handleTabClick('ab-tests')}
          >
            AB Tests
          </button>
        </div>
        {/* Jira Tickets */}
        {activeTab === 'jira-tickets' && (
          <div className='App-main jira-tickets'>
            <h1>Search Jira Tickets</h1>
            <form className="App-form" onSubmit={this.handleSubmit}>
              <label htmlFor='jira-ticket'>enter jira number or search keywords</label>
              <input autoFocus
                className="App-input"
                id='jira-ticket'
                type="text"
                name="ticket"
                value={this.state.ticket}
                onChange={this.handleChange}
                placeholder="ux-7290, mar-3245, shopping bag recs" />
              <button className="App-submit" type="submit">Search</button>
            </form>
            <p className="App-jira-info">
              Currently support projects with suffix:
              'ab-', 'ac-', 'al-', 'an-', 'andro-', 'cs-', 'data-', 'dev-', 'exal-', 'gen-', 'in-', 'ip-', 'ipf-', 'mar-', 'mer-', 'op-', 'grap-', 'qa-', 'tec-', 'temp-', 'tr-', 'tri-', 'trm-', 'ux-'
            </p>
          </div>
        )}
        {activeTab === 'ab-tests' && (
          <div className='App-main ab-tests'>
            <h1>AB Tickets</h1>
            <div className='App-ab-info'>
            <p>You can switch between group A and B by just typing in the AB test number followed by the group letter, then press enter</p>
            <p>Example:</p>
            <p>1234b</p>
            </div>
            <form className="App-form" onSubmit={this.handleSubmitAbTest}>
              <input autoFocus
                className="App-input"
                type="text"
                name="abtest-group"
                value={this.state.abTestGroup}
                onChange={this.handleChangeAbTestGroup}
                placeholder="1234b" />
              <button className="App-submit" type="submit">Submit</button>
            </form>
          </div>
        )}

        <a href="mailto:andrew.liu@revolve.com?subject=Google Chrome Extension" target="_blank" rel="noopener noreferrer" className="App-report-link">got an idea? or bug? let me know!</a>
      </div>
    );
  }
};
export default App;

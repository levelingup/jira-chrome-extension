/*global chrome*/

import React from "react";
import "./App.css";

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			ticket: "",
			abTestInput: "",
			activeTab: "jira-tickets",
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChangeABTest = this.handleChangeABTest.bind(this);
		this.handleSubmitAbTest = this.handleSubmitAbTest.bind(this);
		this.handleTabClick = this.handleTabClick.bind(this);
		this.handleSplitScreen = this.handleSplitScreen.bind(this);
		this.handleAllTestsGroup = this.handleAllTestsGroup.bind(this);
	}

	handleChange(event) {
		this.setState({
			ticket: event.target.value,
		});
	}

	handleChangeABTest(event) {
		this.setState({
			abTestInput: event.target.value,
		});
	}
	handleSubmit(event) {
		event.preventDefault();

		const prefix = [
			"ab-",
			"ac-",
			"al-",
			"an-",
			"andro-",
			"cs-",
			"data-",
			"dev-",
			"exal-",
			"gen-",
			"in-",
			"ip-",
			"ipf-",
			"mar-",
			"mer-",
			"op-",
			"grap-",
			"qa-",
			"tec-",
			"temp-",
			"tr-",
			"tri-",
			"trm-",
			"ux-",
			"ga-",
		];
		const paramsTicket = this.state.ticket;
		//https://revolve.atlassian.net/issues/?jql=text%20~%20%22fdafasdsa%22
		// checks to see if its 1 word (most likely jira ticket)

		let url = "";
		if (paramsTicket.split(" ").length === 1) {
			// check if the word is within our jira ticket #s
			if (prefix.some((v) => paramsTicket.toLowerCase().includes(v))) {
				url = `https://revolve.atlassian.net/browse/${paramsTicket}`;
			} else {
				url = `https://revolve.atlassian.net/issues/?jql=text~"${paramsTicket}"`;
			}
		} else {
			url = `https://revolve.atlassian.net/issues/?jql=text~"${paramsTicket}"`;
		}
		const win = window.open(url, "_blank");
		win.focus();
	}

	handleSubmitAbTest(event) {
		event.preventDefault();

		const input = this.state.abTestInput.trim(); // Get the user input and remove leading/trailing whitespace

		const abTestId = input.slice(0, -1); // Extract the number by removing the last character
		const abTestGroup = input.slice(-1); // Extract the letter

		// Get the current tab
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			if (tabs && tabs.length > 0) {
				const tab = tabs[0];

				// Modify the URL of the current tab
				const url = new URL(tab.url);
				url.searchParams.set("abtest", abTestId);
				url.searchParams.set("group", abTestGroup);

				// Update the URL of the current tab
				chrome.tabs.update(tab.id, { url: url.href });
			}
		});
	}

	handleTabClick(tab) {
		this.setState({
			activeTab: tab,
		});
	}

	handleSplitScreen() {
		const abTestInput = this.state.abTestInput.trim(); // Remove leading/trailing whitespace
		const abTestId = abTestInput.slice(0, -1); // Extract the AB test ID
		const group = abTestInput.slice(-1).toLowerCase(); // Extract the group (a or b)

		if (abTestId && (group === "a" || group === "b")) {
			const oppositeGroup = group === "a" ? "b" : "a"; // Determine the opposite group

			// Get the current window
			chrome.windows.getCurrent({ populate: true }, (currentWindow) => {
				// Calculate the dimensions for the new windows
				const screenWidth = window.screen.availWidth;
				const screenHeight = window.screen.availHeight;
				const windowWidth = Math.floor(screenWidth / 2);
				const windowHeight = screenHeight;

				// Calculate the positions for the new windows
				const leftWindowPosition = {
					left: 0,
					top: 0,
					width: windowWidth,
					height: windowHeight,
				};
				const rightWindowPosition = {
					left: windowWidth,
					top: 0,
					width: windowWidth,
					height: windowHeight,
				};

				// Update the URL of the current window
				const currentTab = currentWindow.tabs.find((tab) => tab.active);
				const url = new URL(currentTab.url);
				url.searchParams.set("abtest", abTestId);
				url.searchParams.set("group", group);

				// Update the URL of the current tab
				chrome.tabs.update(currentTab.id, { url: url.href });

				// Modify the position of the current window
				chrome.windows.update(
					currentWindow.id,
					{ ...leftWindowPosition },
					() => {
						// Create the right window
						const rightUrl = new URL(currentTab.url);
						rightUrl.searchParams.set("abtest", abTestId);
						rightUrl.searchParams.set("group", oppositeGroup);
						chrome.windows.create({
							url: rightUrl.href,
							...rightWindowPosition,
							type: "normal",
						});
					}
				);
			});
		} else {
			console.log("Invalid input format");
		}
	}

	handleAllTestsGroup(group) {
		// Get the current tab
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			if (tabs && tabs.length > 0) {
				const tab = tabs[0];

				// Modify the URL of the current tab
				const url = new URL(tab.url);
				url.searchParams.set("allTestsToGroup", group);

				// Update the URL of the current tab
				chrome.tabs.update(tab.id, { url: url.href });
			}
		});
	}

	render() {
		const { activeTab } = this.state;

		return (
			<div className="App">
				<div className="App-tab">
					<button
						className={`App-tab-header ${
							activeTab === "jira-tickets" ? "active" : ""
						}`}
						onClick={() => this.handleTabClick("jira-tickets")}
					>
						Jira Tickets
					</button>
					<button
						className={`App-tab-header ${
							activeTab === "ab-tests" ? "active" : ""
						}`}
						onClick={() => this.handleTabClick("ab-tests")}
					>
						AB Tests
					</button>
				</div>
				{/* Jira Tickets */}
				{activeTab === "jira-tickets" && (
					<div className="App-main jira-tickets">
						<h1>Search Jira Tickets</h1>
						<form className="App-form" onSubmit={this.handleSubmit}>
							<label htmlFor="jira-ticket">
								enter jira number or search keywords
							</label>
							<input
								autoFocus
								autoComplete="off"
								className="App-input"
								id="jira-ticket"
								type="text"
								name="ticket"
								value={this.state.ticket}
								onChange={this.handleChange}
								placeholder="ux-7290, mar-3245, shopping bag recs"
							/>
							<button className="App-submit" type="submit">
								Search
							</button>
						</form>
						<p className="App-jira-info">
							Currently support projects with prefix: 'ab-', 'ac-', 'al-',
							'an-', 'andro-', 'cs-', 'data-', 'dev-', 'exal-', 'gen-', 'in-',
							'ip-', 'ipf-', 'mar-', 'mer-', 'op-', 'grap-', 'qa-', 'tec-',
							'temp-', 'tr-', 'tri-', 'trm-', 'ux-', 'ga-'
						</p>
					</div>
				)}
				{activeTab === "ab-tests" && (
					<div className="App-main ab-tests">
						<h1>AB Test</h1>
						<div className="App-ab-info">
							<p>
								You can switch between group A and B by just typing in the AB
								test number followed by the group letter, then press enter. You
								can also split screen by pressing the split screen link.
							</p>
						</div>
						<div>Set All Tests to Group:</div>
						<div className="App-group-test-wrap">
							<button onClick={() => this.handleAllTestsGroup("a")}>A</button>
							<button onClick={() => this.handleAllTestsGroup("b")}>B</button>
						</div>
						<form className="App-form" onSubmit={this.handleSubmitAbTest}>
							<input
								autoFocus
								autoComplete="off"
								className="App-input"
								type="text"
								name="abtest-group"
								value={this.state.abTestInput}
								onChange={this.handleChangeABTest}
								placeholder="E.g. 1234b"
							/>
							<div className="App-cta-wrap">
								<div className="App-split-block">
									<button
										className="App-submit-split-screen"
										onClick={this.handleSplitScreen}
									>
										Split Screen
									</button>
								</div>
								<button className="App-submit" type="submit">
									Submit
								</button>
							</div>
						</form>
					</div>
				)}

				<a
					href="mailto:andrew.liu@revolve.com?subject=Google Chrome Extension"
					target="_blank"
					rel="noopener noreferrer"
					className="App-report-link"
				>
					got an idea? or bug? let me know!
				</a>
			</div>
		);
	}
}
export default App;

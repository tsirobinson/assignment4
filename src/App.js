import * as React from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";

import Debits from "./components/Debits";
import Credits from "./components/Credits";

import axios from "axios";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accountBalance: 0,
      debits: [],
      credits: []
    }
  }

  async componentDidMount() {
    let debits = await axios.get("https://moj-api.herokuapp.com/debits");
    let credits = await axios.get("https://moj-api.herokuapp.com/credits");

    debits = debits.data;
    credits = credits.data;

    let debitSum = 0, creditSum = 0;
    debits.forEach((debit) => {
      debitSum += debit.amount;
    })
    credits.forEach((credit) => {
      creditSum += credit.amount;
    })

    let accountBalance = creditSum - debitSum;
    this.setState({accountBalance: accountBalance, debits: debits, credits: credits});
  }

  addDebit = (e) => {
    e.preventDefault();

    let debitsList = this.state.debits;
    let balance = this.state.accountBalance;

    const description = e.target[0].value;
    const amount = Number(e.target[1].value);
    const today = new Date();

    const month = today.getMonth() + 1;
    const date = today.getFullYear() + "-" + month.toString() + "-" + today.getDate().toString();

    const newDebit = {description, amount, date};
    balance = balance - amount;
    debitsList = [...debitsList, newDebit];
    this.setState({accountBalance: balance, debits: debitsList});
  }

  addCredit = (e) => {
    e.preventDefault();
    let creditsList = this.state.credits;
    let balance = this.state.accountBalance;

    const description = e.target[0].value;
    const amount = Number(e.target[1].value);
    const today = new Date();

    const month = today.getMonth() + 1;
    const date = today.getFullYear() + "-" + month.toString() + "-" + today.getDate().toString();

    const newCredit = {description, amount, date};
    balance = balance - amount;
    creditsList = [...creditsList, newCredit];
    this.setState({accountBalance: balance, credits: creditsList});
  }

  render() {
    return(
      <div className="App">
        <h1>Welcome to the React Router!</h1>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/debits" element={<Debits addDebit={this.addDebit} debits={this.state.debits} />} />
          <Route path="/credits" element={<Credits addCredit={this.addCredit} credits={this.state.credits} />} />
        </Routes>
      </div>
    );
  }
 
}

function Home() {
  return (
    <div>
      <h2>Welcome to the Bank Homepage</h2>
      <Link to="/debits">Debits</Link>
      <Link to="/credits">Credits</Link>
    </div>
  );
}

export default App;

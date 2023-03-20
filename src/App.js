
import { useState } from 'react';
import { 
  BrowserRouter as Router,
  Switch,
  Route, } from 'react-router-dom';
import Home from './pages/Home';
import Mint from './pages/Mint';

function App() {
  const [accounts, setAccounts] = useState([]);

  return (
    <Router>
      <div className='root'>
        <Switch>
          <Route exact path='/'>
            <Home accounts={accounts} setAccounts={setAccounts}/>
          </Route>
          <Route exact path='/mint'>
            <Mint accounts={accounts} setAccounts={setAccounts}/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

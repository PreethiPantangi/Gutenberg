import './App.css';
import { HashRouter, Route, Switch } from 'react-router-dom';
import HomePageComponent from './HomePage/HomePage'
import BookDetailsComponent from './BookDetails/BookDetails'

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Switch>
          <Route exact path='/' component={HomePageComponent} />
          <Route exact path='category/:name' component={BookDetailsComponent} />
        </Switch>
      </HashRouter>
    </div>
  );
}

export default App;

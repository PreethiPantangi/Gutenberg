import './App.css';
import { HashRouter, Switch, Route } from 'react-router-dom';
import HomePageComponent from './components/HomePage/HomePage'
import BookDetailsComponent from './components/BookDetails/BookDetails'

function App() {
  return (
    <div>
      <HashRouter>
        <Switch>
          <Route exact path="/" component={HomePageComponent} />
          <Route exact path="/category/:name" component={BookDetailsComponent} />
        </Switch>
      </HashRouter>
    </div>
  );
}

export default App;

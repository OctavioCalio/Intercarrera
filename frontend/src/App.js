import logo from './logo.svg';
import './App.css';
import Nambar from './components/Nambar';
import Content from './components/Content';

function App() {
  return (
    <div className="App">
      <Nambar></Nambar>

      <div className="content-box">
      <Content/>
      </div>
           
    </div>
  );
}

export default App;

import logo from './logo.svg';
import './App.scss';
import Background from './components/Intro/Background/Background';
import Footer from './components/Footer/Footer';
import TimelinePage from './components/Content/Timeline/TimelinePage';

function App() {
  return (
    <div className="App">
      <Background />
      <TimelinePage />
      <Footer />
    </div>
  );
}

export default App;

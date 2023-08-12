import { useEffect, useState } from 'react';
import './App.css';

function App() {

  const [time,setTime] = useState({hr:0,min:0,sec:0});
  const [isRunning,setRunning] = useState(false);

  // useEffect(() => {
  //   fetch('http://localhost:3000/api/timer')
  //   .then(res => res.json())
  //   .then(timer => console.log(timer));
  // },[])
  useEffect(()=>{
    let timerId;
    if(isRunning){
        timerId = setInterval(() => {
        setTime({...time,sec:time.sec+=1})
        if(time.sec === 60) {
          setTime({...time, min:time.min+=1, sec:0});
          clearInterval(timerId)
        }

        if(time.min === 60){
          setTime({...time, hr:time.hr += 1, min:0});
        }
      },980)

      return () => {
        clearInterval(timerId);
      }
    }
  },[isRunning,time])

  const startHandler = () => {
    setRunning(!isRunning);
  }

  const resetHandler = () => {
    setRunning(false);
    setTime({hr:0,min:0,sec:0});
    const secondHand = document.querySelector('.sec');
    secondHand.style.animation = 'none';
    setTimeout(() => {
      secondHand.style.animation = '';
      secondHand.style.animationPlayState = 'paused'
    }, 10);
  };
  
  return (
    <div className="container">
      <div className='counter'>
      <div className='clock'>
        <span className='hand sec animate' 
        style={{color:'blue', animationPlayState: isRunning ? 'running' : 'paused'}}></span>
        <span className='pin'></span>
      </div>
        <p>{time.hr.toString().padStart(2, '0')}:{time.min.toString().padStart(2, '0')}:{time.sec.toString().padStart(2, '0')}</p>
      </div>
      <div className='btns'>
        <button className='btn1' style={{color:isRunning ? 'red' : 'mediumspringgreen'}} 
        onClick={startHandler}>{isRunning ? 'Pause' : 'Start'}</button>
        <button className='btn2' onClick={resetHandler}>Reset</button>
      </div>
    </div>
  );
}

export default App;
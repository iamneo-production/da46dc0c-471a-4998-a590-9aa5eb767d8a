const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8080;

let isRunning = false,startTime = 0,history = [];
app.use(cors());
app.use(express.json());

app.get('/api/timer', (req, res) => {
    if (isRunning) {
      const elapsedTime = Date.now() - startTime;
      res.json({
        status: 'running',
        elapsedTime: formatTime(elapsedTime),
        history: history.map(entry => ({
          startTime: entry.startTime,
          endTime: entry.endTime,
          duration: formatTime(entry.endTime - entry.startTime)
        }))
      });
    } else {
      res.json({ status: 'stopped', elapsedTime: '00:00:00', history: [] });
    }
  });
  
  // Route to start the timer
  app.post('/api/timer/start', (req, res) => {
    if (!isRunning) {
      startTime = Date.now();
      isRunning = true;
      res.json({ status: 'running', elapsedTime: '00:00:00' });
    } else {
      res.json({ status: 'running', elapsedTime: formatTime(Date.now() - startTime) });
    }
  });
  
  // Route to stop the timer
  app.post('/api/timer/stop', (req, res) => {
    if (isRunning) {
      const endTime = Date.now();
      const elapsedTime = endTime - startTime;
      isRunning = false;
      history.push({ startTime, endTime });
      res.json({
        status: 'stopped',
        elapsedTime: formatTime(elapsedTime),
        history: history.map(entry => ({
          startTime: entry.startTime,
          endTime: entry.endTime,
          duration: formatTime(entry.endTime - entry.startTime)
        }))
      });
    } else {
      res.json({ status: 'stopped', elapsedTime: '00:00:00', history: [] });
    }
  });
  
  // Route to reset the timer
  app.post('/api/timer/reset', (req, res) => {
    isRunning = false;
    startTime = 0;
    history = [];
    res.json({ status: 'stopped', elapsedTime: '00:00:00', history: [] });
  });
  
  // Route to get timer history
  app.get('/api/timer/history', (req, res) => {
    res.json(history.map(entry => ({
      startTime: entry.startTime,
      endTime: entry.endTime,
      duration: formatTime(entry.endTime - entry.startTime)
    })));
  });
  
  // Helper function to format time in HH:mm:ss format
  function formatTime(timeInMilliseconds) {
    const totalSeconds = Math.floor(timeInMilliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

// 1. Create the timer element
const timerDiv = document.createElement('div');
timerDiv.id = 'my-extension-timer';
timerDiv.innerText = 'Time on page: 0s';

// 2. Style it via JS (so it's always visible)
Object.assign(timerDiv.style, {
  position: 'fixed',
  top: '20px',
  right: '20px',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  color: 'white',
  padding: '10px 15px',
  borderRadius: '8px',
  zIndex: '9999',
  fontSize: '16px',
  fontFamily: 'sans-serif',
  pointerEvents: 'none' // Click "through" the timer
});

// 3. Add it to the page
document.body.appendChild(timerDiv);

// 4. Start the clock
let seconds = 0;
setInterval(() => {
  seconds++;
  timerDiv.innerText = `Time on page: ${seconds}s`;
}, 1000);
(() => {
  const timeEl = document.getElementById('clock-time');
  const dateEl = document.getElementById('clock-date');

  const updateClock = () => {
    const now = new Date();
    timeEl.textContent = new Intl.DateTimeFormat('uk-UA', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(now);

    const raw = new Intl.DateTimeFormat('uk-UA', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    }).format(now);

    dateEl.textContent = raw.charAt(0).toUpperCase() + raw.slice(1);
  };

  updateClock();
  setInterval(updateClock, 1000 * 30);
})();

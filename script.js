document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('booking-form');
  const bookingsList = document.getElementById('bookings-list');

  let bookings = JSON.parse(localStorage.getItem('bookings')) || [];

  function saveBookings() {
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }

  function renderBookings() {
    bookingsList.innerHTML = '';
    bookings.forEach((booking, index) => {
      const li = document.createElement('li');
      li.textContent = `${booking.venue} - ${booking.date} at ${booking.time}`;
      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = 'Cancel';
      cancelBtn.addEventListener('click', () => {
        bookings.splice(index, 1);
        saveBookings();
        renderBookings();
      });
      li.appendChild(cancelBtn);
      bookingsList.appendChild(li);
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const venue = document.getElementById('venue').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    if (venue && date && time) {
      bookings.push({ venue, date, time });
      saveBookings();
      renderBookings();
      form.reset();
    }
  });

  renderBookings();
});

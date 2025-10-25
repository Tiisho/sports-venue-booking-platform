document.addEventListener('DOMContentLoaded', () => {
  // Navigation elements
  const navBooking = document.getElementById('nav-booking');
  const navManage = document.getElementById('nav-manage');
  const bookingSection = document.getElementById('booking-section');
  const manageSection = document.getElementById('manage-section');

  // Forms and lists
  const bookingForm = document.getElementById('booking-form');
  const propertyForm = document.getElementById('property-form');
  const bookingPropertySelect = document.getElementById('booking-property');
  const bookingList = document.getElementById('booking-list');
  const propertyList = document.getElementById('property-list');
  const ownerBookingList = document.getElementById('owner-booking-list');

  // Load data from localStorage
  let properties = JSON.parse(localStorage.getItem('properties')) || [];
  let bookings = JSON.parse(localStorage.getItem('bookings')) || [];

  function saveData() {
    localStorage.setItem('properties', JSON.stringify(properties));
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }

  // Navigation event handlers
  navBooking.addEventListener('click', (e) => {
    e.preventDefault();
    navBooking.classList.add('active');
    navManage.classList.remove('active');
    bookingSection.classList.add('active-section');
    manageSection.classList.remove('active-section');
  });

  navManage.addEventListener('click', (e) => {
    e.preventDefault();
    navManage.classList.add('active');
    navBooking.classList.remove('active');
    manageSection.classList.add('active-section');
    bookingSection.classList.remove('active-section');
    renderOwnerBookings();
  });

  // Render property options and list
  function renderProperties() {
    // Populate select for booking
    bookingPropertySelect.innerHTML = '';
    properties.forEach((prop, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = `${prop.name} (${prop.location}) - Capacity: ${prop.capacity}, $${prop.price}/hr`;
      bookingPropertySelect.appendChild(option);
    });

    // Populate property list for owners
    propertyList.innerHTML = '';
    properties.forEach((prop, index) => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${prop.name}</strong> - ${prop.location} (Capacity ${prop.capacity}, $${prop.price}/hr)`;
      const delBtn = document.createElement('button');
      delBtn.textContent = 'Delete';
      delBtn.addEventListener('click', () => {
        // Remove property
        properties.splice(index, 1);
        // Remove bookings referencing this property index
        bookings = bookings.filter(b => b.propertyIndex !== index);
        // Adjust booking property indices after removal
        bookings.forEach(b => {
          if (b.propertyIndex > index) {
            b.propertyIndex -= 1;
          }
        });
        saveData();
        renderProperties();
        renderBookings();
        renderOwnerBookings();
      });
      li.appendChild(delBtn);
      propertyList.appendChild(li);
    });
  }

  function renderBookings() {
    bookingList.innerHTML = '';
    bookings.forEach((booking, index) => {
      const prop = properties[booking.propertyIndex];
      if (!prop) return;
      const li = document.createElement('li');
      li.textContent = `${prop.name} on ${booking.date} at ${booking.time}`;
      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = 'Cancel';
      cancelBtn.addEventListener('click', () => {
        bookings.splice(index, 1);
        saveData();
        renderBookings();
        renderOwnerBookings();
      });
      li.appendChild(cancelBtn);
      bookingList.appendChild(li);
    });
  }

  function renderOwnerBookings() {
    ownerBookingList.innerHTML = '';
    bookings.forEach((booking, index) => {
      const prop = properties[booking.propertyIndex];
      if (!prop) return;
      const li = document.createElement('li');
      li.textContent = `${prop.name} - ${booking.date} at ${booking.time}`;
      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = 'Cancel';
      cancelBtn.addEventListener('click', () => {
        bookings.splice(index, 1);
        saveData();
        renderBookings();
        renderOwnerBookings();
      });
      li.appendChild(cancelBtn);
      ownerBookingList.appendChild(li);
    });
  }

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const propertyIndex = parseInt(bookingPropertySelect.value);
    const date = document.getElementById('booking-date').value;
    const time = document.getElementById('booking-time').value;
    if (!isNaN(propertyIndex) && date && time) {
      bookings.push({ propertyIndex, date, time });
      saveData();
      renderBookings();
      bookingForm.reset();
    }
  });

  propertyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('property-name').value;
    const location = document.getElementById('property-location').value;
    const capacity = parseInt(document.getElementById('property-capacity').value);
    const price = parseFloat(document.getElementById('property-price').value);
    if (name && location && !isNaN(capacity) && !isNaN(price)) {
      properties.push({ name, location, capacity, price });
      saveData();
      renderProperties();
      propertyForm.reset();
    }
  });

  // Initial render
  renderProperties();
  renderBookings();
});

// Reservation Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const reservationForm = document.getElementById('reservationForm');
    const successMessage = document.getElementById('successMessage');
    const dateInput = document.getElementById('date');
    
    // Set minimum date to today
    if (dateInput) {
        const today = new Date();
        const minDate = today.toISOString().split('T')[0];
        dateInput.setAttribute('min', minDate);
        
        // Set maximum date to 3 months from now
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        dateInput.setAttribute('max', maxDate.toISOString().split('T')[0]);
    }
    
    // Form submission handler
    if (reservationForm) {
        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                fullName: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                date: document.getElementById('date').value,
                time: document.getElementById('time').value,
                guests: document.getElementById('guests').value,
                occasion: document.getElementById('occasion').value,
                specialRequests: document.getElementById('specialRequests').value,
                newsletter: document.getElementById('newsletter').checked
            };
            
            // Validate form
            if (validateForm(formData)) {
                // Store reservation data
                storeReservation(formData);
                
                // Show success message
                showSuccessMessage(formData);
                
                // Hide form
                reservationForm.style.display = 'none';
                
                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }
});

// Form validation
function validateForm(data) {
    let isValid = true;
    let errorMessage = '';
    
    // Validate name
    if (data.fullName.trim().length < 2) {
        errorMessage += 'Please enter a valid name.\n';
        isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        errorMessage += 'Please enter a valid email address.\n';
        isValid = false;
    }
    
    // Validate phone
    const phoneRegex = /^[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(data.phone) || data.phone.length < 10) {
        errorMessage += 'Please enter a valid phone number.\n';
        isValid = false;
    }
    
    // Validate date
    const selectedDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        errorMessage += 'Please select a future date.\n';
        isValid = false;
    }
    
    // Validate time
    if (!data.time) {
        errorMessage += 'Please select a time.\n';
        isValid = false;
    }
    
    // Validate guests
    if (!data.guests) {
        errorMessage += 'Please select number of guests.\n';
        isValid = false;
    }
    
    if (!isValid) {
        alert(errorMessage);
    }
    
    return isValid;
}

// Store reservation in localStorage
function storeReservation(data) {
    // Get existing reservations
    let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    
    // Add timestamp and unique ID
    const reservation = {
        ...data,
        id: Date.now(),
        createdAt: new Date().toISOString()
    };
    
    // Add new reservation
    reservations.push(reservation);
    
    // Store in localStorage
    localStorage.setItem('reservations', JSON.stringify(reservations));
    
    // Also store the latest reservation separately for easy access
    localStorage.setItem('latestReservation', JSON.stringify(reservation));
    
    console.log('Reservation stored:', reservation);
}

// Show success message with reservation details
function showSuccessMessage(data) {
    const successMessage = document.getElementById('successMessage');
    const confirmEmail = document.getElementById('confirmEmail');
    const confirmDate = document.getElementById('confirmDate');
    const confirmTime = document.getElementById('confirmTime');
    const confirmGuests = document.getElementById('confirmGuests');
    
    // Format date
    const dateObj = new Date(data.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    // Format time
    const timeFormatted = formatTime(data.time);
    
    // Update success message
    confirmEmail.textContent = data.email;
    confirmDate.textContent = formattedDate;
    confirmTime.textContent = timeFormatted;
    confirmGuests.textContent = data.guests + (data.guests === '1' ? ' Guest' : ' Guests');
    
    // Show success message
    successMessage.style.display = 'block';
    
    // Send confirmation email (simulation)
    sendConfirmationEmail(data);
}

// Format time from 24h to 12h format
function formatTime(time) {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

// Simulate sending confirmation email
function sendConfirmationEmail(data) {
    console.log('Sending confirmation email to:', data.email);
    console.log('Reservation details:', data);
    
    // In a real application, this would send an actual email via backend API
    // For now, we'll just log it to console
    
    // You could integrate with services like:
    // - EmailJS
    // - SendGrid
    // - AWS SES
    // - Mailgun
    // etc.
}

// Reset form function
function resetForm() {
    const reservationForm = document.getElementById('reservationForm');
    const successMessage = document.getElementById('successMessage');
    
    // Reset form
    reservationForm.reset();
    
    // Hide success message
    successMessage.style.display = 'none';
    
    // Show form
    reservationForm.style.display = 'flex';
    
    // Scroll to form
    reservationForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Phone number formatting (optional enhancement)
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('phone');
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 10) {
                value = value.slice(0, 10);
            }
            
            if (value.length >= 6) {
                value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
            } else if (value.length >= 3) {
                value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            }
            
            e.target.value = value;
        });
    }
});

// View all reservations (for admin/debug purposes)
function viewAllReservations() {
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    console.log('All reservations:', reservations);
    return reservations;
}

// Clear all reservations (for testing purposes)
function clearAllReservations() {
    localStorage.removeItem('reservations');
    localStorage.removeItem('latestReservation');
    console.log('All reservations cleared');
}

// Date picker enhancement - disable past dates and closed days
document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('date');
    
    if (dateInput) {
        dateInput.addEventListener('change', function(e) {
            const selectedDate = new Date(e.target.value);
            const dayOfWeek = selectedDate.getDay();
            
            // Example: If you want to disable certain days (e.g., closed on Mondays)
            // if (dayOfWeek === 1) {
            //     alert('Sorry, we are closed on Mondays. Please select another date.');
            //     e.target.value = '';
            // }
        });
    }
});

// Real-time validation feedback
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('reservationForm');
    
    if (form) {
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.value.trim() === '') {
                    this.style.borderColor = '#e74c3c';
                } else {
                    this.style.borderColor = '#4caf50';
                }
            });
            
            input.addEventListener('focus', function() {
                this.style.borderColor = 'var(--primary-color)';
            });
        });
    }
});

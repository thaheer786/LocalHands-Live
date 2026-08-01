 let map;
let userLocation = { lat: 17.0900, lng: 82.0700 }; // Default user location (Surampalem)
let userMarker = null;
let providers = [];
let providerMarkers = [];
let selectedService = 'plumber';
// Removed unused variables: isEmergencyMode, currentRoute, liveLocationInterval,
// currentRoutePoints, currentRouteIndex, plumberMovingMarker, movingRoutePolyline

// Sample service providers data
const sampleProviders = [
    {
        id: 1,
        name: "Rajesh Kumar",
        service: "plumber",
        lat: 0, // Will be set dynamically
        lng: 0, // Will be set dynamically
        rating: 4.8,
        reviews: 156,
        phone: "+91-9876543210",
        experience: "8 years",
        availability: "available",
        hourlyRate: "₹300/hr",
        specialties: ["Pipe Repair", "Bathroom Fitting", "Water Heater Installation"],
        distanceKm: 2, // Base distance from user
        address: "101, Main Road, Surampalem",
        contactEmail: "rajesh.plumbing@example.com",
        // workPhotos: [
        //     "https://via.placeholder.com/200x150?text=Plumbing+Work+1",
        //     "https://via.placeholder.com/200x150?text=Bathroom+Fix+2",
        //     "https://via.placeholder.com/200x150?text=Pipe+Repair+3",
        //     "https://via.placeholder.com/200x150?text=Water+Heater+4"
        // ],
        customerReviews: [
            { name: "Priya S.", text: "Rajesh did an excellent job fixing our leaking pipe. Very professional!", rating: 5 },
            { name: "Anil K.", text: "Quick and efficient service. Highly recommend for any plumbing needs.", rating: 4.5 },
            { name: "Sneha R.", text: "He was very polite and explained everything clearly. Good value for money.", rating: 5 }
        ]
    },
    {
        id: 2,
        name: "Shyam Lal",
        service: "plumber",
        lat: 0,
        lng: 0,
        rating: 4.6,
        reviews: 203,
        phone: "+91-9876543211",
        experience: "12 years",
        availability: "available",
        hourlyRate: "₹400/hr",
        specialties: ["Drain Cleaning", "Leak Detection", "Geyser Repair"],
        distanceKm: 4,
        address: "B-205, Green Park, Surampalem",
        contactEmail: "shyam.plumber@example.com",
        // workPhotos: [
        //     "https://via.placeholder.com/200x150?text=Drain+Clean+1",
        //     "https://via.placeholder.com/200x150?text=Leak+Detect+2",
        //     "https://via.placeholder.com/200x150?text=Geyser+Install+3"
        // ],
        customerReviews: [
            { name: "Rahul M.", text: "Shyam Lal is highly experienced. Solved our complex drain issue quickly.", rating: 5 },
            { name: "Divya P.", text: "Reliable and fair pricing. Would call again for sure.", rating: 4 },
            { name: "Vijay C.", text: "Found the hidden leak that others missed. Very satisfied.", rating: 4.5 }
        ]
    },
    {
        id: 3,
        name: "Prakash Singh",
        service: "plumber",
        lat: 0,
        lng: 0,
        rating: 4.9,
        reviews: 89,
        phone: "+91-9876543212",
        experience: "5 years",
        availability: "busy", // Example of a busy plumber
        hourlyRate: "₹200/hr",
        specialties: ["Toilet Repair", "Faucet Installation", "Waterproofing"],
        distanceKm: 5,
        address: "Plot 3, Sai Nagar, Surampalem",
        contactEmail: "prakash.plumbing@example.com",
        // workPhotos: [
        //     "https://via.placeholder.com/200x150?text=Toilet+Repair+1",
        //     "https://via.placeholder.com/200x150?text=Faucet+Install+2"
        // ],
        customerReviews: [
            { name: "Gita D.", text: "Prompt and efficient. Fixed my toilet in no time.", rating: 5 },
            { name: "Hari N.", text: "Good service, a little busy but worth the wait.", rating: 4.5 }
        ]
    },
    {
        id: 4,
        name: "Navdeep Singh",
        service: "plumber",
        lat: 0,
        lng: 0,
        rating: 4.3,
        reviews: 205,
        phone: "+91-9876543212",
        experience: "8 years",
        availability: "available",
        hourlyRate: "₹200/hr",
        specialties: ["Pipe Inspection", "Sump Pump", "Water Filter"],
        distanceKm: 2.8,
        address: "H.No. 12-34, Temple Road, Surampalem",
        contactEmail: "navdeep.plumbing@example.com",
        // workPhotos: [
        //     "https://www.google.com/imgres?q=image&imgurl=https%3A%2F%2Fplus.unsplash.com%2Fpremium_photo-1664474619075-644dd191935f%3Ffm%3Djpg%26q%3D60%26w%3D3000%26ixlib%3Drb-4.1.0%26ixid%3DM3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%253D&imgrefurl=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fimage&docid=ExDvm63D_wCvSM&tbnid=2brKLR3s5kTpPM&vet=12ahUKEwjim_a6pOaOAxW4RmcHHXCVMT8QM3oECBsQAA..i&w=3000&h=2003&hcb=2&itg=1&ved=2ahUKEwjim_a6pOaOAxW4RmcHHXCVMT8QM3oECBsQAA",
        //     "https://via.placeholder.com/200x150?text=Inspection+Cam+https://www.google.com/imgres?q=image&imgurl=https%3A%2F%2Fplus.unsplash.com%2Fpremium_photo-1664474619075-644dd191935f%3Ffm%3Djpg%26q%3D60%26w%3D3000%26ixlib%3Drb-4.1.0%26ixid%3DM3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%253D&imgrefurl=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fimage&docid=ExDvm63D_wCvSM&tbnid=2brKLR3s5kTpPM&vet=12ahUKEwjim_a6pOaOAxW4RmcHHXCVMT8QM3oECBsQAA..i&w=3000&h=2003&hcb=2&itg=1&ved=2ahUKEwjim_a6pOaOAxW4RmcHHXCVMT8QM3oECBsQAA",
        //     "https://via.placeholder.com/200x150?text=Sump+Pump+Service+2",
        //     "https://via.placeholder.com/200x150?text=Water+Filter+Install+3"
        // ],
        customerReviews: [
            { name: "Kiran V.", text: "Professional and detailed in pipe inspection. Very helpful.", rating: 4 },
            { name: "Lakshmi M.", text: "Got our water filter installed perfectly. Recommended.", rating: 4.5 }
        ]
    }
];

// Get modal elements
const providerDetailsModal = document.getElementById('providerDetailsModal');
const closeButton = document.querySelector('.close-button');
const modalProviderDetails = document.getElementById('modalProviderDetails');
const modalWorkPhotos = document.getElementById('modalWorkPhotos');
const modalCustomerReviews = document.getElementById('modalCustomerReviews');
const modalBookNowBtn = document.getElementById('modalBookNowBtn');

// New: Review form elements
const reviewerNameInput = document.getElementById('reviewerName');
const reviewTextInput = document.getElementById('reviewText');
const reviewRatingInput = document.getElementById('reviewRating');
const starInputs = document.querySelectorAll('.star-rating-input .star-input');
const submitReviewBtn = document.getElementById('submitReviewBtn');

let currentProviderId = null; // To store which provider's modal is open


// Initialize map
function initMap() {
    // Set map view to userLocation
    map = L.map('map').setView([userLocation.lat, userLocation.lng], 13);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Filter providers based on the selected service (currently 'plumber')
    providers = sampleProviders.filter(p => p.service === selectedService);

    // Add user's location marker
    userMarker = L.marker([userLocation.lat, userLocation.lng], {
        icon: L.divIcon({
            html: '<div style="color: red; font-size: 1.7rem;"><i class="fa-solid fa-location-dot"></i></div>',
            iconSize: [40, 40],
            className: 'user-marker'
        })
    }).addTo(map);
    userMarker.bindPopup('<b> Your Location</b><br>Aditya University, Surampalem, Andhra Pradesh');

    // Update provider locations dynamically and display them
    updateProvidersNearUser();
    updateDisplay();

    // Attach event listeners for star rating input
    starInputs.forEach(star => {
        star.addEventListener('mouseover', function() {
            const value = parseInt(this.dataset.value);
            highlightStars(value);
        });
        star.addEventListener('mouseout', function() {
            const selectedRating = parseInt(reviewRatingInput.value);
            highlightStars(selectedRating); // Revert to selected rating
        });
        star.addEventListener('click', function() {
            const value = parseInt(this.dataset.value);
            reviewRatingInput.value = value;
            highlightStars(value); // Set selected stars
        });
    });

    // Attach event listener for submit review button
    submitReviewBtn.addEventListener('click', submitReview);
}

// Helper function to highlight stars for the review form
function highlightStars(rating) {
    starInputs.forEach(star => {
        const starValue = parseInt(star.dataset.value);
        if (starValue <= rating) {
            star.classList.add('selected');
        } else {
            star.classList.remove('selected');
        }
    });
}


// Update provider locations based on a fixed distance and random bearing from user
function updateProvidersNearUser() {
    if (!userLocation) return;

    const R = 6371; // Earth's radius in km

    providers.forEach(provider => {
        const distance = provider.distanceKm;
        const bearing = Math.random() * 360;
        const latRad = userLocation.lat * Math.PI / 180;
        const lngRad = userLocation.lng * Math.PI / 180;
        const bearingRad = bearing * Math.PI / 180;

        // Calculate new latitude
        const newLatRad = Math.asin(Math.sin(latRad) * Math.cos(distance / R) +
            Math.cos(latRad) * Math.sin(distance / R) * Math.cos(bearingRad));

        // Calculate new longitude
        const newLngRad = lngRad + Math.atan2(Math.sin(bearingRad) * Math.sin(distance / R) * Math.cos(latRad),
            Math.cos(distance / R) - Math.sin(latRad) * Math.sin(newLatRad));

        provider.lat = newLatRad * 180 / Math.PI;
        provider.lng = newLngRad * 180 / Math.PI;
    });
}

// Update map and list display
function updateDisplay() {
    displayProvidersOnMap();
    updateProvidersList();
}

// Display providers on map
function displayProvidersOnMap() {
    // Clear existing provider markers
    providerMarkers.forEach(marker => map.removeLayer(marker));
    providerMarkers = [];

    const filteredProviders = getFilteredProviders();

    filteredProviders.forEach(provider => {
        const availabilityColors = {
            available: 'green',
            busy: 'orange',
            offline: 'red'
        };

        const marker = L.marker([provider.lat, provider.lng], {
            icon: L.divIcon({
                html: `<div style="color: ${availabilityColors[provider.availability] || 'blue'}; font-size: 1.8rem;"><i class="fa-solid fa-location-dot"></i></div>`,
                iconSize: [30, 30],
                className: 'provider-marker'
            })
        }).addTo(map);

        const distance = userLocation ?
            calculateDistance(userLocation.lat, userLocation.lng, provider.lat, provider.lng) : 'Unknown';

        const eta = userLocation ? calculateETA(distance) : 'Unknown';

        // Popup content for each provider marker
        marker.bindPopup(`
            <div style="min-width: 250px;">
                <h4>${provider.name}</h4>
                <p><strong>Service:</strong> ${provider.service.charAt(0).toUpperCase() + provider.service.slice(1)}</p>
                <p><strong>Rating:</strong> <span style="color: #ffc107;"><i class="fa-solid fa-star"></i> ${provider.rating}</span> (${provider.reviews} reviews)</p>
                <p><strong>Experience:</strong> ${provider.experience}</p>
                <p><strong>Rate:</strong> ${provider.hourlyRate}</p>
                <p><strong>Distance:</strong> <i class="fa-solid fa-location-dot"></i> ${distance} away • <strong>ETA:</strong> <i class="fa-solid fa-clock"></i> ${eta} arrival time</p>
                <p><strong>Status:</strong> <span class="availability-badge ${provider.availability}">${provider.availability.toUpperCase()}</span></p>
            </div>
        `);

        providerMarkers.push(marker);
    });
}

// Function to get filtered providers (currently returns all, but can be expanded)
function getFilteredProviders() {
    return providers;
}

// Update providers list in sidebar
function updateProvidersList() {
    const listDiv = document.getElementById('providersList');
    const filteredProviders = getFilteredProviders();

    if (filteredProviders.length === 0) {
        listDiv.innerHTML = '<div class="loading">No plumbers found in your area.</div>';
        return;
    }

    let html = '';
    filteredProviders.forEach(provider => {
        const distance = userLocation ?
            calculateDistance(userLocation.lat, userLocation.lng, provider.lat, provider.lng) : 'Distance unknown';

        const eta = userLocation ? calculateETA(distance) : 'Unknown';

        html += `
            <div class="provider-card">
                <div class="provider-header">
                    <div class="provider-name">${provider.name}</div>
                    <div class="availability-badge ${provider.availability}">${provider.availability.toUpperCase()}</div>
                </div>

                <div class="provider-info">
                    <strong>${provider.service.charAt(0).toUpperCase() + provider.service.slice(1)}</strong> • ${provider.experience} experience<br>
                    <strong>Rate:</strong> ${provider.hourlyRate}
                </div>

                <div class="rating-section">
                    <span class="stars"><i class="fa-solid fa-star"></i> ${provider.rating}</span>
                    <span>(${provider.reviews} reviews)</span>
                </div>

                <div class="provider-info">
                    <strong>Specialties:</strong> ${provider.specialties.join(', ')}
                </div>

                <div class="distance-time">
                    <i class="fa-solid fa-location-dot"></i> ${distance} away • <strong>ETA:</strong> <i class="fa-solid fa-clock"></i> ${eta} arrival time
                </div>

                <div class="action-buttons">
                    <button class="btn btn-small btn-details" data-provider-id="${provider.id}">View Full Details</button>
                </div>
            </div>
        `;
    });

    listDiv.innerHTML = html;

    // Add event listeners to the "View Full Details" buttons
    document.querySelectorAll('.btn-details').forEach(button => {
        button.addEventListener('click', function() {
            const providerId = parseInt(this.dataset.providerId);
            viewFullDetails(providerId);
        });
    });
}

// Function to view full details (opens the modal)
function viewFullDetails(providerId) {
    const provider = providers.find(p => p.id === providerId);
    if (provider) {
        currentProviderId = providerId; // Store the ID of the currently viewed provider

        // Populate provider details
        let detailsHtml = `
            <p><strong>Name:</strong> ${provider.name}</p>
            <p><strong>Service:</strong> ${provider.service.charAt(0).toUpperCase() + provider.service.slice(1)}</p>
            <p><strong>Address:</strong> ${provider.address}</p>
            <p><strong>Contact:</strong> ${provider.phone} | ${provider.contactEmail}</p>
            <p><strong>Experience:</strong> ${provider.experience}</p>
            <p><strong>Hourly Rate:</strong> ${provider.hourlyRate}</p>
            <p><strong>Specialties:</strong> ${provider.specialties.join(', ')}</p>
            <p><strong>Availability:</strong> <span class="availability-badge ${provider.availability}">${provider.availability.toUpperCase()}</span></p>
        `;
        modalProviderDetails.innerHTML = detailsHtml;

        // Populate work photos
        let photosHtml = '';
        if (provider.workPhotos && provider.workPhotos.length > 0) {
            provider.workPhotos.forEach(photoUrl => {
                photosHtml += `<img src="${photoUrl}" alt="Work Photo for ${provider.name}">`;
            });
        } else {
            photosHtml = '<p>No work photos available.</p>';
        }
        modalWorkPhotos.innerHTML = photosHtml;

        // Populate customer reviews
        displayCustomerReviews(provider);

        // Reset the review form fields
        reviewerNameInput.value = '';
        reviewTextInput.value = '';
        reviewRatingInput.value = '0';
        highlightStars(0); // Reset star display

        // Set up "Book Now" button for the modal
        modalBookNowBtn.onclick = () => bookProvider(provider.id);

        // Display the modal
        providerDetailsModal.style.display = 'flex'; // Use flex to center
    } else {
        alert("Provider details not found.");
    }
}

// Helper function to display customer reviews
function displayCustomerReviews(provider) {
    let reviewsHtml = '';
    if (provider.customerReviews && provider.customerReviews.length > 0) {
        // Sort reviews by most recent (assuming new reviews are pushed to the end, reverse to show newest first)
        const sortedReviews = [...provider.customerReviews].reverse();
        sortedReviews.forEach(review => {
            reviewsHtml += `
                <div class="review-item">
                    <p class="review-text">"${review.text}"</p>
                    <p class="reviewer-name">- ${review.name} (${review.rating} <i class="fa-solid fa-star"></i>)</p>
                </div>
            `;
        });
    } else {
        reviewsHtml = '<p>No reviews yet. Be the first to review!</p>';
    }
    modalCustomerReviews.innerHTML = reviewsHtml;
}


// Function to submit a new review
function submitReview() {
    const name = reviewerNameInput.value.trim();
    const reviewText = reviewTextInput.value.trim();
    const rating = parseInt(reviewRatingInput.value);

    if (!name || !reviewText || rating === 0) {
        alert('Please fill in your name, write a review, and select a rating (at least one star).');
        return;
    }

    const provider = providers.find(p => p.id === currentProviderId);

    if (provider) {
        const newReview = {
            name: name,
            text: reviewText,
            rating: rating
        };

        // Add the new review to the provider's customerReviews array
        if (!provider.customerReviews) {
            provider.customerReviews = [];
        }
        provider.customerReviews.push(newReview);

        // Update provider's total reviews
        provider.reviews += 1;

        // Optionally, recalculate average rating (more robust approach needed for production)
        let totalRating = 0;
        provider.customerReviews.forEach(r => totalRating += r.rating);
        provider.rating = (totalRating / provider.customerReviews.length).toFixed(1); // Update average rating

        // Re-display reviews to show the new one
        displayCustomerReviews(provider);

        // Re-update the provider card in the main list to reflect new rating/review count
        updateProvidersList();

        // Clear the form
        reviewerNameInput.value = '';
        reviewTextInput.value = '';
        reviewRatingInput.value = '0';
        highlightStars(0); // Reset star display

        alert('Your review has been submitted successfully!');
    } else {
        alert('Error: Could not find provider to submit review.');
    }
}


// Close the modal when the close button is clicked
closeButton.addEventListener('click', function() {
    providerDetailsModal.style.display = 'none';
});

// Close the modal if the user clicks anywhere outside of the modal content
window.addEventListener('click', function(event) {
    if (event.target == providerDetailsModal) {
        providerDetailsModal.style.display = 'none';
    }
});


// Calculate distance between two points (Haversine formula)
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
}

// Calculate estimated time of arrival (simple speed assumption)
function calculateETA(distanceStr) {
    const distance = parseFloat(distanceStr); // Extract number from "Xkm" or "Xm"
    if (isNaN(distance)) return 'Unknown';

    // Assume an average speed of 30 km/h for calculation
    const timeInHours = distance / 30;
    const timeInMinutes = Math.round(timeInHours * 60);

    if (timeInMinutes < 60) {
        return `${timeInMinutes} mins`;
    } else {
        const hours = Math.floor(timeInMinutes / 60);
        const mins = timeInMinutes % 60;
        return `${hours}h ${mins}m`;
    }
}


// Initialize when page loads
window.onload = function() {
    initMap();
};
const CITY_CENTER_COORDS = {
  'piduguralla': [16.4815, 79.8872],
  'hyderabad': [17.3850, 78.4867],
  'visakhapatnam': [17.6868, 83.2185],
  'springfield': [39.7817, -89.6501]
};

const PROVIDER_COORDS_MAP = {
  'prov-1': [16.4845, 79.8840], // Krishna Photo Studio
  'prov-2': [16.4860, 79.8920], // Charan Appliance Repair
  'prov-3': [16.4820, 79.8880], // Revanth Plumbing Services
  'prov-4': [17.3850, 78.4867], // David Woodworks & Decor
  'prov-5': [16.4790, 79.8910], // Elena Home Care & Nursing
  'prov-6': [16.4800, 79.8830], // Suresh Electrical Solutions
  'prov-7': [16.4830, 79.8900], // Priya Tutors Academy
  'prov-8': [16.4780, 79.8860]  // Ramesh Auto Mechanics
};

const MapsApp = {
  providers: [],
  filteredProviders: [],
  leafletMap: null,
  markersGroup: null,
  streetLayer: null,
  satelliteLayer: null,
  currentLayerMode: 'satellite',
  userLocationMarker: null,
  currentCity: 'piduguralla',
  userCoords: null,

  async init() {
    this.initLeafletMap();
    await this.loadProviders();
    // Attempt auto-fetching current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => this.onCurrentLocationSuccess(pos, false),
        err => console.log('Geolocation permission not granted initially', err),
        { timeout: 5000 }
      );
    }
  },

  initLeafletMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    const center = CITY_CENTER_COORDS[this.currentCity] || CITY_CENTER_COORDS['piduguralla'];
    
    // Create Leaflet Map Instance
    this.leafletMap = L.map('map', {
      center: center,
      zoom: 14,
      zoomControl: true
    });

    // Create Tile Layers
    this.streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    this.satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    // Add Satellite Layer by Default
    this.satelliteLayer.addTo(this.leafletMap);
    this.markersGroup = L.layerGroup().addTo(this.leafletMap);
  },

  setMapLayer(mode) {
    if (!this.leafletMap || this.currentLayerMode === mode) return;

    const btnStreet = document.getElementById('btn-map-street');
    const btnSat = document.getElementById('btn-map-satellite');

    if (mode === 'satellite') {
      this.leafletMap.removeLayer(this.streetLayer);
      this.satelliteLayer.addTo(this.leafletMap);
      this.currentLayerMode = 'satellite';

      if (btnStreet && btnSat) {
        btnStreet.classList.remove('active');
        btnSat.classList.add('active');
      }
      Toast.show('Switched to High-Resolution Satellite Map View', 'info');
    } else {
      this.leafletMap.removeLayer(this.satelliteLayer);
      this.streetLayer.addTo(this.leafletMap);
      this.currentLayerMode = 'street';

      if (btnStreet && btnSat) {
        btnSat.classList.remove('active');
        btnStreet.classList.add('active');
      }
      Toast.show('Switched to Street Map View', 'info');
    }
  },

  fetchCurrentLocation() {
    if (!navigator.geolocation) {
      Toast.show('Geolocation is not supported by your browser.', 'error');
      return;
    }

    Toast.show('Fetching your current location...', 'info');

    navigator.geolocation.getCurrentPosition(
      pos => this.onCurrentLocationSuccess(pos, true),
      err => {
        console.error('Geolocation error', err);
        Toast.show('Unable to access current GPS location. Centered on Piduguralla.', 'warning');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  },

  onCurrentLocationSuccess(position, notify = true) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    this.userCoords = [lat, lng];

    // Remove existing user marker if any
    if (this.userLocationMarker && this.leafletMap) {
      this.leafletMap.removeLayer(this.userLocationMarker);
    }

    // Add Pulsing User Location Marker
    const userIcon = L.divIcon({
      className: 'user-gps-marker',
      html: `
        <div style="position: relative; width: 24px; height: 24px;">
          <div style="position: absolute; width: 24px; height: 24px; border-radius: 50%; background: #0066FF; border: 3px solid #FFFFFF; box-shadow: 0 4px 12px rgba(0,102,255,0.4);"></div>
          <div style="position: absolute; width: 44px; height: 44px; top: -10px; left: -10px; border-radius: 50%; background: rgba(0, 102, 255, 0.25); animation: pulseGps 2s infinite;"></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    if (this.leafletMap) {
      this.userLocationMarker = L.marker([lat, lng], { icon: userIcon }).addTo(this.leafletMap);
      this.userLocationMarker.bindPopup(`
        <div style="padding: 0.25rem;">
          <strong style="color: #0066FF;"><i class="fas fa-location-crosshairs"></i> Your Current GPS Location</strong>
          <p style="font-size: 0.78rem; color: #64748B; margin-top: 0.25rem;">Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}</p>
        </div>
      `);

      this.leafletMap.flyTo([lat, lng], 15, { duration: 1.5 });
    }

    // Update Sidebar & Info Badges
    const optCurrent = document.getElementById('opt-current-loc');
    const select = document.getElementById('map-city-select');
    if (optCurrent && select) {
      optCurrent.style.display = 'block';
      optCurrent.text = `GPS Location (${lat.toFixed(2)}, ${lng.toFixed(2)})`;
      select.value = 'current';
    }

    const titleEl = document.getElementById('map-active-city-title');
    if (titleEl) {
      titleEl.innerHTML = `<i class="fas fa-location-crosshairs" style="color: #0066FF;"></i> Your Current Location`;
    }

    if (notify) {
      Toast.show('Centered map on your current GPS location!', 'success');
    }

    // Sort providers by proximity to user
    this.filterProviders();
  },

  async loadProviders() {
    try {
      const data = await API.get('/providers?verified=true');
      if (data.success && data.providers) {
        this.providers = data.providers;
        this.filterProviders();
      }
    } catch (e) {
      console.error('Error loading map providers', e);
    }
  },

  handleCityChange() {
    const select = document.getElementById('map-city-select');
    if (select) {
      this.currentCity = select.value;
      
      if (this.currentCity === 'current' && this.userCoords) {
        this.leafletMap.flyTo(this.userCoords, 15, { duration: 1.5 });
      } else {
        const titleEl = document.getElementById('map-active-city-title');
        if (titleEl) {
          titleEl.innerText = `${select.options[select.selectedIndex].text} Radius`;
        }
        
        const newCenter = CITY_CENTER_COORDS[this.currentCity] || CITY_CENTER_COORDS['piduguralla'];
        if (this.leafletMap) {
          this.leafletMap.flyTo(newCenter, 13, { duration: 1.5 });
        }
      }
      
      this.filterProviders();
    }
  },

  filterProviders() {
    const searchInput = document.getElementById('map-search-input');
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    this.filteredProviders = this.providers.filter(p => {
      const matchCity = this.currentCity === 'all' || (p.city && p.city.toLowerCase() === this.currentCity.toLowerCase());
      const matchQuery = !query || p.name.toLowerCase().includes(query) || (p.category_slug && p.category_slug.toLowerCase().includes(query)) || (p.bio && p.bio.toLowerCase().includes(query));
      return matchCity && matchQuery;
    });

    // If city filtering yielded no results, fallback to showing all matching query
    if (this.filteredProviders.length === 0 && query) {
      this.filteredProviders = this.providers.filter(p => p.name.toLowerCase().includes(query));
    }

    const countSubtitle = document.getElementById('map-active-count-subtitle');
    if (countSubtitle) {
      countSubtitle.innerText = `Showing ${this.filteredProviders.length} active service technician${this.filteredProviders.length === 1 ? '' : 's'}`;
    }

    this.renderSidebarList(this.filteredProviders);
    this.renderMapMarkers(this.filteredProviders);
  },

  renderSidebarList(list) {
    const container = document.getElementById('map-provider-list');
    if (!container) return;

    if (list.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem 1rem; background: #FFF7ED; border-radius: 16px; border: 1px solid #F4E7D3;">
          <i class="fas fa-map-marker-slash" style="font-size: 2rem; color: #FF7A00; margin-bottom: 0.5rem;"></i>
          <p style="font-size: 0.9rem; color: #5A4634; font-weight: 600;">No providers matched your filter in this area.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = list.map((p, idx) => `
      <div class="cat-service-card-v2" style="padding: 1.25rem;" onclick="MapsApp.selectProvider(${idx})">
        <div style="display: flex; gap: 0.85rem; align-items: center;">
          <img src="${p.avatar || 'assets/bhuvan.jpg'}" style="width: 52px; height: 52px; border-radius: 14px; object-fit: cover; border: 2px solid #F4E7D3;" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300';" />
          <div style="flex: 1; overflow: hidden;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <h4 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.98rem; font-weight: 800; color: #5A4634;" class="truncate">${p.name}</h4>
              <span class="live-now-badge" style="font-size: 0.65rem; padding: 0.15rem 0.5rem;"><span class="live-now-dot"></span> Live</span>
            </div>
            <p style="font-size: 0.78rem; color: #FF7A00; font-weight: 700; margin-top: 0.2rem;" class="truncate">${(p.category_slug || 'SERVICE PROVIDER').toUpperCase()}</p>
            <div style="font-size: 0.8rem; color: #64748B; margin-top: 0.2rem;">
              <i class="fas fa-star" style="color: #FF7A00;"></i> <strong>${p.rating ? p.rating.toFixed(1) : '4.9'}</strong> (${p.completed_jobs || 42} Jobs)
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.85rem; padding-top: 0.75rem; border-top: 1px solid #F1F5F9;">
          <span style="font-size: 0.82rem; font-weight: 700; color: #5A4634;">
            <i class="fas fa-map-marker-alt" style="color: #FF7A00; font-size: 0.75rem;"></i> ${p.city || 'Piduguralla'}
          </span>
          <button class="btn btn-green btn-sm" style="padding: 0.4rem 0.9rem; font-size: 0.8rem; border-radius: 9999px;" onclick="event.stopPropagation(); Landing.openContactModal('${p.name.replace(/'/g, "\\'")}', '${p.phone || '+91 98765 43210'}')">
            <i class="fas fa-phone-alt"></i> Call Now
          </button>
        </div>
      </div>
    `).join('');
  },

  getProviderCoordinates(p, index) {
    // If user's GPS location is active, place provider pins around user's GPS location
    if ((this.currentCity === 'current' || this.userCoords) && this.userCoords) {
      const offsets = [
        [ 0.0032, -0.0025],
        [-0.0041,  0.0038],
        [ 0.0024,  0.0042],
        [-0.0035, -0.0031],
        [ 0.0048,  0.0012],
        [-0.0019,  0.0055],
        [ 0.0015, -0.0048],
        [-0.0052, -0.0018]
      ];
      const offset = offsets[index % offsets.length];
      return [this.userCoords[0] + offset[0], this.userCoords[1] + offset[1]];
    }

    // Otherwise use static provider coordinates map or active city center
    if (PROVIDER_COORDS_MAP[p.id]) {
      return PROVIDER_COORDS_MAP[p.id];
    }
    
    const center = CITY_CENTER_COORDS[this.currentCity] || CITY_CENTER_COORDS['piduguralla'];
    const offsets = [
      [ 0.0030, -0.0020],
      [-0.0035,  0.0030],
      [ 0.0020,  0.0040],
      [-0.0030, -0.0030],
      [ 0.0040,  0.0010]
    ];
    const offset = offsets[index % offsets.length];
    return [center[0] + offset[0], center[1] + offset[1]];
  },

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1); // Distance in km
  },

  drawRouteToProvider(destCoords, providerName) {
    if (!this.leafletMap) return;

    const startCoords = this.userCoords || CITY_CENTER_COORDS[this.currentCity] || [16.4815, 79.8872];

    // Remove previous route polyline if any
    if (this.activeRoutePolyline) {
      this.leafletMap.removeLayer(this.activeRoutePolyline);
    }

    // Draw Primary Orange polyline route
    this.activeRoutePolyline = L.polyline([startCoords, destCoords], {
      color: '#FF7A00',
      weight: 6,
      opacity: 0.9,
      dashArray: '10, 10'
    }).addTo(this.leafletMap);

    // Fit map bounds to show route clearly
    this.leafletMap.fitBounds([startCoords, destCoords], { padding: [60, 60], maxZoom: 16 });

    // Calculate distance and estimated arrival time
    const distKm = this.calculateDistance(startCoords[0], startCoords[1], destCoords[0], destCoords[1]);
    const estMins = Math.max(3, Math.round(parseFloat(distKm) * 3.5));

    // Update Top Info Badge
    const titleEl = document.getElementById('map-active-city-title');
    const subtitleEl = document.getElementById('map-active-count-subtitle');
    if (titleEl && subtitleEl) {
      titleEl.innerHTML = `<i class="fas fa-route" style="color: #FF7A00;"></i> Route to ${providerName}`;
      subtitleEl.innerHTML = `<strong>${distKm} km away</strong> • ~${estMins} mins dispatch arrival time`;
    }

    Toast.show(`Showing route to ${providerName} (${distKm} km • ~${estMins} mins)`, 'info');
  },

  renderMapMarkers(list) {
    if (!this.leafletMap || !this.markersGroup) return;

    this.markersGroup.clearLayers();

    list.forEach((p, idx) => {
      // Dynamically calculate coordinates around user GPS location or city center
      const coords = this.getProviderCoordinates(p, idx);
      const startCoords = this.userCoords || CITY_CENTER_COORDS[this.currentCity] || [16.4815, 79.8872];
      const distKm = this.calculateDistance(startCoords[0], startCoords[1], coords[0], coords[1]);
      
      // Create Custom Map Pin Icon
      const customIcon = L.divIcon({
        className: 'custom-map-icon',
        html: `<i class="fas fa-user-check"></i>`,
        iconSize: [38, 38],
        iconAnchor: [19, 19]
      });

      const marker = L.marker(coords, { icon: customIcon }).addTo(this.markersGroup);

      // Create Custom Popup HTML with Route Details
      const popupHtml = `
        <div style="width: 210px;">
          <div style="display: flex; gap: 0.75rem; align-items: center; margin-bottom: 0.5rem;">
            <img src="${p.avatar || 'assets/bhuvan.jpg'}" style="width: 42px; height: 42px; border-radius: 10px; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300';" />
            <div>
              <h4 style="margin: 0; font-size: 0.92rem; color: #5A4634; font-weight: 700;">${p.name}</h4>
              <span style="font-size: 0.75rem; color: #FF7A00; font-weight: 600;">${(p.category_slug || 'SERVICE').toUpperCase()}</span>
            </div>
          </div>
          
          <div style="background: #FFF7ED; padding: 0.4rem 0.6rem; border-radius: 8px; font-size: 0.78rem; color: #FF7A00; font-weight: 700; margin-bottom: 0.75rem; display: flex; align-items: center; justify-content: space-between;">
            <span><i class="fas fa-route"></i> ${distKm} km away</span>
            <span><i class="fas fa-bolt"></i> Ready</span>
          </div>

          <div style="display: flex; gap: 0.4rem;">
            <button class="btn btn-green btn-sm" style="flex: 1; padding: 0.4rem; font-size: 0.75rem; border-radius: 8px;" onclick="Landing.openContactModal('${p.name.replace(/'/g, "\\'")}', '${p.phone || '+91 98765 43210'}')">
              <i class="fas fa-phone-alt"></i> Call
            </button>
            <button class="btn-view-all-orange" style="flex: 1; padding: 0.4rem; font-size: 0.75rem; margin: 0; border-radius: 8px;" onclick="MapsApp.selectProvider(${idx}, true)">
              <i class="fas fa-location-arrow"></i> Route
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      // On clicking provider pin point, draw live route!
      marker.on('click', () => {
        this.selectProvider(idx, true);
      });
    });
  },

  selectProvider(index, panTo = true) {
    const p = this.filteredProviders[index];
    if (!p) return;

    const coords = this.getProviderCoordinates(p, index);

    // Draw live navigation route line from user location to provider pin
    this.drawRouteToProvider(coords, p.name);

    // Find marker and open popup
    let layerIdx = 0;
    this.markersGroup.eachLayer(layer => {
      if (layerIdx === index) {
        layer.openPopup();
      }
      layerIdx++;
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  MapsApp.init();
});

window.MapsApp = MapsApp;

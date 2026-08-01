const services = [
  { label: 'Plumber Repairs', category: 'appliance', serviceId: 'Plumber', image: 'https://scoutnetworkblog.com/wp-content/uploads/2018/11/Plumber-Sink-201709-003.jpg' },
  { label: 'AC Repair & Services', category: 'appliance', serviceId: 'AC and Services', image: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHliazFzNWoyMG5yeHlkYjR5dnF2c2phMWN4cTdqOGNuc2V1cmJ1ZiZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/Y26VHuLX8RkVZh7BIh/giphy.gif' },
  { label: 'Car', category: 'vehicle', serviceId: 'Car Mechanic', image: 'https://media.giphy.com/media/3idkNxShn9kUHgMsJt/giphy.gif' },
  { label: 'Laptop', category: 'electronics', serviceId: 'Electronics', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqQr4x1z6AyJI84nctJajALluIulWqTMKZurcbgUL_O-BNnxJjmQaqZJVryWxZUic_wRI&usqp=CAU' },
  { label: 'Mobile', category: 'electronics', serviceId: 'Electronics', image: 'https://timestech.in/wp-content/uploads/2022/07/mobile-phone-repair.jpg' },
  { label: 'Refrigerator', category: 'appliance', serviceId: 'Appliances', image: 'https://t3.ftcdn.net/jpg/02/55/57/22/360_F_255572256_oIMCf8pbQLCBydVURwejdq0iPEcbUVE9.jpg' },
  { label: 'TV', category: 'electronics', serviceId: 'Electronics', image: 'https://www.digimanthan.com/wp-content/uploads/2021/02/Digimanthan.jpg' },
  { label: 'Camera', category: 'electronics', serviceId: 'Electronics', image: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGFycjE3NzUxNmgyemJvOHo0MXBrZzVqNDhqbnk3aWZiODdjd2F3eiZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/laXfRdPF7B8dM7ytTH/giphy.gif'},
  { label: 'Fan', category: 'other', serviceId: 'Other Services', image: 'https://i.ytimg.com/vi/CHHseuotyS0/hqdefault.jpg' },
  { label: 'Printer', category: 'electronics', serviceId: 'Electronics', image: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGVjNGx3NnlkYXFzcDdxZzNzajR5M3lzdW96aGd1cGw4c3RidmY1MiZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/ugHLUTuQl1F77bb9dt/giphy.gif' },
  { label: 'Elevator', category: 'appliance', serviceId: 'Appliances', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1yJabr01hTLjk5SobfeHXkmyvgGC1dTIpLR5g1jMK8mbNwWJ38Pni33Hbr5ji_5XCZCU&usqp=CAU' },
];

function loadCards(category = 'all') {
  const grid = document.getElementById('cardGrid');
  if (!grid) {
    console.error('cardGrid container not found.');
    return;
  }

  grid.innerHTML = '';
  const filteredServices = services.filter(service => category === 'all' || service.category === category);

  filteredServices.forEach(service => {
    const card = document.createElement('div');
    card.classList.add('card', service.category);
    card.innerHTML = `
      <div class="card-img" style="background-image: url('${service.image}');"></div>
      <div class="card-label">${service.label}</div>
    `;
    card.addEventListener('click', () => {
      window.location.href = `./maps.html?service=${encodeURIComponent(service.serviceId)}`;
    });
    grid.appendChild(card);
  });
}

function filterCards(event, category) {
  const buttons = document.querySelectorAll('.filter-buttons button');
  buttons.forEach(btn => btn.classList.remove('active'));
  if (event && event.target) {
    event.target.classList.add('active');
  }
  loadCards(category);
}

window.onload = () => {
  loadCards(); // Load all by default

  const defaultButton = document.querySelector('.filter-buttons button');
  if (defaultButton) {
    defaultButton.classList.add('active');
  }
};

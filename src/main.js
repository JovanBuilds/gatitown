import './style.css'

// Mock Data
const cats = [
  {
    id: 1,
    name: 'Luna',
    age: '2 años',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    badges: ['Esterilizado', 'Vacunado']
  },
  {
    id: 2,
    name: 'Simba',
    age: '6 meses',
    image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    badges: ['Juguetón']
  },
  {
    id: 3,
    name: 'Milo',
    age: '1 año',
    image: 'https://images.unsplash.com/photo-1495360019602-e001921678fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    badges: ['Esterilizado']
  },
  {
    id: 4,
    name: 'Nala',
    age: '3 meses',
    image: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    badges: []
  },
  {
    id: 5,
    name: 'Leo',
    age: '4 años',
    image: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    badges: ['Tranquilo', 'Vacunado']
  },
  {
    id: 6,
    name: 'Bella',
    age: '1.5 años',
    image: 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    badges: ['Esterilizado']
  }
];

const stories = [
  {
    id: 1,
    title: 'El rescate de Oliver',
    excerpt: 'Oliver fue encontrado bajo la lluvia y ahora vive como un rey...',
    image: 'https://images.unsplash.com/photo-1511044568932-338cba0fb803?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    title: 'Una segunda oportunidad',
    excerpt: 'Cómo una familia adoptó a tres hermanos inseparables.',
    image: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    title: 'Voluntariado en GatiTown',
    excerpt: 'La experiencia de ayudar a los que no tienen voz.',
    image: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];

let pendingCats = [
  {
    id: 101,
    name: 'Garfield',
    location: 'Col. Centro',
    image: 'https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 102,
    name: 'Sombra',
    location: 'Playas de Tijuana',
    image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];

// DOM Elements
const catsGrid = document.getElementById('cats-grid');
const storiesGrid = document.getElementById('stories-grid');
const adminTable = document.getElementById('admin-table');
const publishForm = document.getElementById('publish-form');
const adminPanel = document.getElementById('admin-panel');
const adminLink = document.getElementById('admin-link');

// Render Functions
function renderCats() {
  catsGrid.innerHTML = cats.map(cat => `
    <div class="cat-card">
      <img src="${cat.image}" alt="${cat.name}" class="cat-image">
      <div class="cat-info">
        <h3 class="cat-name">${cat.name}</h3>
        <p class="cat-age">${cat.age}</p>
        <div class="cat-badges">
          ${cat.badges.map(badge => `<span class="badge">${badge}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

function renderStories() {
  storiesGrid.innerHTML = stories.map(story => `
    <div class="story-card">
      <img src="${story.image}" alt="${story.title}" class="story-image">
      <div class="story-content">
        <h3 class="story-title">${story.title}</h3>
        <p class="story-excerpt">${story.excerpt}</p>
        <a href="#" class="story-link">Leer más →</a>
      </div>
    </div>
  `).join('');
}

function renderAdminTable() {
  if (pendingCats.length === 0) {
    adminTable.innerHTML = '<p style="text-align:center; padding: 20px;">No hay gatitos pendientes.</p>';
    return;
  }
  
  adminTable.innerHTML = pendingCats.map(cat => `
    <div class="admin-row" data-id="${cat.id}">
      <img src="${cat.image}" alt="${cat.name}" class="admin-thumb">
      <div><strong>${cat.name}</strong></div>
      <div>${cat.location}</div>
      <div class="admin-actions">
        <button class="btn-approve" onclick="approveCat(${cat.id})">Aprobar</button>
        <button class="btn-reject" onclick="rejectCat(${cat.id})">Rechazar</button>
      </div>
    </div>
  `).join('');
}

// Global functions for inline onclick handlers (simpler for this setup)
window.approveCat = (id) => {
  const cat = pendingCats.find(c => c.id === id);
  if (cat) {
    // Add to main cats list (simulated)
    cats.unshift({
      id: cat.id,
      name: cat.name,
      age: 'Desconocida', // Placeholder
      image: cat.image,
      badges: ['Nuevo']
    });
    pendingCats = pendingCats.filter(c => c.id !== id);
    renderAdminTable();
    renderCats();
    alert(`¡${cat.name} ha sido aprobado y añadido a la galería!`);
  }
};

window.rejectCat = (id) => {
  if(confirm('¿Estás seguro de rechazar esta solicitud?')) {
    pendingCats = pendingCats.filter(c => c.id !== id);
    renderAdminTable();
  }
};

// Event Listeners
publishForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('cat-name').value;
  const age = document.getElementById('cat-age').value;
  
  // Simulate submission
  alert(`¡Gracias! La solicitud para ${name} ha sido enviada para revisión.`);
  publishForm.reset();
  
  // Add to pending (simulated)
  pendingCats.push({
    id: Date.now(),
    name: name,
    location: 'Tijuana (Pendiente)',
    image: 'https://images.unsplash.com/photo-1501820488136-72669149e0d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' // Placeholder
  });
  renderAdminTable();
});

adminLink.addEventListener('click', () => {
  adminPanel.classList.toggle('hidden');
  if (!adminPanel.classList.contains('hidden')) {
    adminPanel.scrollIntoView({ behavior: 'smooth' });
  }
});

// Initialize
renderCats();
renderStories();
renderAdminTable();

// Mobile Menu Toggle
const mobileBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('nav');

mobileBtn.addEventListener('click', () => {
    const isVisible = nav.style.display === 'flex';
    nav.style.display = isVisible ? 'none' : 'flex';
    
    if (!isVisible) {
        nav.style.position = 'absolute';
        nav.style.top = '64px';
        nav.style.left = '0';
        nav.style.width = '100%';
        nav.style.backgroundColor = 'white';
        nav.style.flexDirection = 'column';
        nav.style.padding = '20px';
        nav.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
    } else {
        nav.style = ''; // Reset inline styles
    }
});

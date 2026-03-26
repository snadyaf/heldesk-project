/**
 * HelpDesk Pro - Sistema de Chamados
 * Vanilla JavaScript com localStorage
 */

// ========== STATE ==========
let tickets = JSON.parse(localStorage.getItem('helpdesk_tickets') || '[]');
let deleteTargetId = null;

// ========== DOM ELEMENTS ==========
const $ = (sel) => document.querySelector(sel);
const ticketList = $('#ticket-list');
const emptyState = $('#empty-state');
const modalOverlay = $('#modal-overlay');
const confirmOverlay = $('#confirm-overlay');
const ticketForm = $('#ticket-form');
const searchInput = $('#search-input');
const filterStatus = $('#filter-status');
const filterPriority = $('#filter-priority');
const filterCategory = $('#filter-category');
const toast = $('#toast');

// ========== UTILS ==========
function generateId() {
  return 'TK-' + String(Date.now()).slice(-6) + String(Math.floor(Math.random() * 100)).padStart(2, '0');
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function save() {
  localStorage.setItem('helpdesk_tickets', JSON.stringify(tickets));
}

function showToast(message, type = 'success') {
  toast.textContent = message;
  toast.className = `toast toast--${type}`;
  toast.classList.remove('hidden');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.add('hidden'), 3000);
}

// ========== STATUS LABELS ==========
const statusLabels = {
  aberto: '🟡 Aberto',
  em_andamento: '🔵 Em Andamento',
  concluido: '🟢 Concluído',
};

const priorityLabels = {
  alta: '🔴 Alta',
  media: '🟠 Média',
  baixa: '🟢 Baixa',
};

const categoryLabels = {
  bug: '🐛 Bug',
  feature: '✨ Feature',
  suporte: '💬 Suporte',
  infraestrutura: '🖥️ Infra',
};

// ========== RENDER ==========
function render() {
  const filtered = getFilteredTickets();
  updateCounters();

  if (filtered.length === 0) {
    ticketList.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  ticketList.innerHTML = filtered.map(t => `
    <article class="ticket-card" data-id="${t.id}" tabindex="0" aria-label="Chamado ${t.id}">
      <div class="ticket-card__top">
        <div>
          <span class="ticket-card__id">${t.id}</span>
          <h3 class="ticket-card__title">${escapeHtml(t.title)}</h3>
          <p class="ticket-card__desc">${escapeHtml(t.description)}</p>
        </div>
        <div class="ticket-card__actions">
          <button class="btn--icon" data-action="edit" data-id="${t.id}" title="Editar" aria-label="Editar chamado ${t.id}">✏️</button>
          <button class="btn--icon" data-action="delete" data-id="${t.id}" title="Excluir" aria-label="Excluir chamado ${t.id}">🗑️</button>
        </div>
      </div>
      <div class="ticket-card__meta">
        <span class="badge badge--${t.status}">${statusLabels[t.status]}</span>
        <span class="badge badge--${t.priority}">${priorityLabels[t.priority]}</span>
        <span class="badge badge--category">${categoryLabels[t.category]}</span>
        <span class="ticket-card__date">👤 ${escapeHtml(t.requester)} · ${formatDate(t.createdAt)}</span>
      </div>
    </article>
  `).join('');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function getFilteredTickets() {
  const search = searchInput.value.toLowerCase().trim();
  const status = filterStatus.value;
  const priority = filterPriority.value;
  const category = filterCategory.value;

  return tickets
    .filter(t => {
      if (status !== 'todos' && t.status !== status) return false;
      if (priority !== 'todos' && t.priority !== priority) return false;
      if (category !== 'todos' && t.category !== category) return false;
      if (search && !t.title.toLowerCase().includes(search) && !t.id.toLowerCase().includes(search) && !t.requester.toLowerCase().includes(search)) return false;
      return true;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function updateCounters() {
  $('#count-open').textContent = tickets.filter(t => t.status === 'aberto').length;
  $('#count-progress').textContent = tickets.filter(t => t.status === 'em_andamento').length;
  $('#count-done').textContent = tickets.filter(t => t.status === 'concluido').length;
}

// ========== MODAL ==========
function openModal(ticket = null) {
  ticketForm.reset();
  hideAllErrors();

  if (ticket) {
    $('#modal-title').textContent = 'Editar Chamado';
    $('#btn-submit').textContent = 'Salvar Alterações';
    $('#ticket-id').value = ticket.id;
    $('#ticket-title').value = ticket.title;
    $('#ticket-description').value = ticket.description;
    $('#ticket-category').value = ticket.category;
    $('#ticket-priority').value = ticket.priority;
    $('#ticket-requester').value = ticket.requester;
    $('#ticket-status').value = ticket.status;
    $('#status-group').style.display = 'block';
  } else {
    $('#modal-title').textContent = 'Novo Chamado';
    $('#btn-submit').textContent = 'Criar Chamado';
    $('#ticket-id').value = '';
    $('#status-group').style.display = 'none';
  }

  modalOverlay.classList.remove('hidden');
  $('#ticket-title').focus();
}

function closeModal() {
  modalOverlay.classList.add('hidden');
}

function hideAllErrors() {
  document.querySelectorAll('.form-error').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.input--invalid').forEach(el => el.classList.remove('input--invalid'));
}

// ========== VALIDATION ==========
function validateForm() {
  let valid = true;
  hideAllErrors();

  const title = $('#ticket-title');
  const desc = $('#ticket-description');
  const cat = $('#ticket-category');
  const prio = $('#ticket-priority');
  const req = $('#ticket-requester');

  if (title.value.trim().length < 3 || title.value.trim().length > 120) {
    showError('title', title);
    valid = false;
  }
  if (desc.value.trim().length < 10 || desc.value.trim().length > 2000) {
    showError('description', desc);
    valid = false;
  }
  if (!cat.value) {
    showError('category', cat);
    valid = false;
  }
  if (!prio.value) {
    showError('priority', prio);
    valid = false;
  }
  if (req.value.trim().length < 2 || req.value.trim().length > 80) {
    showError('requester', req);
    valid = false;
  }

  return valid;
}

function showError(field, input) {
  $(`#error-${field}`).classList.remove('hidden');
  input.classList.add('input--invalid');
}

// ========== CRUD ==========
function createTicket(data) {
  const ticket = {
    id: generateId(),
    title: data.title.trim(),
    description: data.description.trim(),
    category: data.category,
    priority: data.priority,
    requester: data.requester.trim(),
    status: 'aberto',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tickets.push(ticket);
  save();
  render();
  showToast(`Chamado ${ticket.id} criado com sucesso!`);
}

function updateTicket(id, data) {
  const idx = tickets.findIndex(t => t.id === id);
  if (idx === -1) return;
  tickets[idx] = {
    ...tickets[idx],
    title: data.title.trim(),
    description: data.description.trim(),
    category: data.category,
    priority: data.priority,
    requester: data.requester.trim(),
    status: data.status,
    updatedAt: new Date().toISOString(),
  };
  save();
  render();
  showToast(`Chamado ${id} atualizado!`, 'info');
}

function deleteTicket(id) {
  tickets = tickets.filter(t => t.id !== id);
  save();
  render();
  showToast(`Chamado excluído.`, 'error');
}

// ========== EVENT LISTENERS ==========

// New ticket button
$('#btn-new-ticket').addEventListener('click', () => openModal());

// Close modal
$('#btn-close-modal').addEventListener('click', closeModal);
$('#btn-cancel').addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

// Form submit
ticketForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  const data = {
    title: $('#ticket-title').value,
    description: $('#ticket-description').value,
    category: $('#ticket-category').value,
    priority: $('#ticket-priority').value,
    requester: $('#ticket-requester').value,
    status: $('#ticket-status').value,
  };

  const editId = $('#ticket-id').value;
  if (editId) {
    updateTicket(editId, data);
  } else {
    createTicket(data);
  }
  closeModal();
});

// Ticket actions (delegation)
ticketList.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  e.stopPropagation();

  const id = btn.dataset.id;
  const action = btn.dataset.action;

  if (action === 'edit') {
    const ticket = tickets.find(t => t.id === id);
    if (ticket) openModal(ticket);
  }

  if (action === 'delete') {
    deleteTargetId = id;
    confirmOverlay.classList.remove('hidden');
  }
});

// Confirm delete
$('#btn-confirm-delete').addEventListener('click', () => {
  if (deleteTargetId) {
    deleteTicket(deleteTargetId);
    deleteTargetId = null;
  }
  confirmOverlay.classList.add('hidden');
});

$('#btn-confirm-cancel').addEventListener('click', () => {
  deleteTargetId = null;
  confirmOverlay.classList.add('hidden');
});

confirmOverlay.addEventListener('click', (e) => {
  if (e.target === confirmOverlay) {
    deleteTargetId = null;
    confirmOverlay.classList.add('hidden');
  }
});

// Filters
searchInput.addEventListener('input', render);
filterStatus.addEventListener('change', render);
filterPriority.addEventListener('change', render);
filterCategory.addEventListener('change', render);

// Keyboard: ESC to close modals
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    confirmOverlay.classList.add('hidden');
  }
});

// ========== SEED DATA (first visit) ==========
function seedData() {
  if (tickets.length > 0) return;
  const seed = [
    {
      id: generateId(),
      title: 'Botão de login não funciona no mobile',
      description: 'Ao clicar no botão de login em dispositivos móveis (iOS Safari), nada acontece. O botão não responde ao toque. Testado em iPhone 14 e iPhone SE.',
      category: 'bug',
      priority: 'alta',
      requester: 'Maria Silva',
      status: 'aberto',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: generateId(),
      title: 'Adicionar modo escuro na dashboard',
      description: 'Implementar toggle de dark mode na área do dashboard do usuário. Deve seguir as preferências do sistema operacional como padrão.',
      category: 'feature',
      priority: 'media',
      requester: 'João Santos',
      status: 'em_andamento',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 43200000).toISOString(),
    },
    {
      id: generateId(),
      title: 'Atualizar certificado SSL do servidor de staging',
      description: 'O certificado SSL do servidor de staging expira em 5 dias. Necessário renovar para evitar interrupções nos testes automatizados.',
      category: 'infraestrutura',
      priority: 'alta',
      requester: 'Carlos Oliveira',
      status: 'aberto',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: generateId(),
      title: 'Dúvida sobre exportação de relatórios',
      description: 'Cliente reporta que não consegue encontrar a opção de exportar relatórios em PDF. Verificar se a funcionalidade está disponível no plano atual.',
      category: 'suporte',
      priority: 'baixa',
      requester: 'Ana Costa',
      status: 'concluido',
      createdAt: new Date(Date.now() - 604800000).toISOString(),
      updatedAt: new Date(Date.now() - 259200000).toISOString(),
    },
  ];
  tickets = seed;
  save();
}

// ========== INIT ==========
seedData();
render();

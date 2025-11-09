// Este archivo contiene TODAS las funciones JS de tu aplicación.

// --- Variable para guardar el rol actual ---
let currentUserRole = null; // null = no logueado

// --- Variables Globales Calendario ---
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

// --- FUNCIÓN DE LOGIN ---
function login() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMsg = document.getElementById('login-error');
    const loginScreen = document.getElementById('login-screen');
    const mainContainer = document.querySelector('.container');

    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    let role = null;

    // Simulación de autenticación
    if (username === 'admin' && password === '12345') role = 'admin';
    else if (username === 'usuario' && password === '12345') role = 'usuario';

    if (role) {
        currentUserRole = role;
        if(errorMsg) errorMsg.style.display = 'none';
        if(loginScreen) loginScreen.style.display = 'none';
        if(mainContainer) mainContainer.style.display = 'flex';
        setupUIForRole(currentUserRole); // Configurar UI después del login
    } else {
        if(errorMsg) errorMsg.style.display = 'block';
        currentUserRole = null;
    }
}

// --- FUNCIÓN DE LOGOUT ---
function logout() {
    const loginScreen = document.getElementById('login-screen');
    const mainContainer = document.querySelector('.container');
    const errorMsg = document.getElementById('login-error');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    currentUserRole = null;
    if(mainContainer) mainContainer.style.display = 'none';
    if(loginScreen) loginScreen.style.display = 'flex';
    if(errorMsg) errorMsg.style.display = 'none';
    if(usernameInput) usernameInput.value = '';
    if(passwordInput) passwordInput.value = '';
    console.log("Sesión cerrada.");
}

// --- AJUSTAR UI SEGÚN ROL ---
function setupUIForRole(role) {
    const menuItems = {
        admin: ['nav-dashboard', 'nav-programar', 'nav-mistareas', 'nav-clientes', 'nav-perfil'],
        usuario: ['nav-mistareas', 'nav-perfil']
    };

    document.querySelectorAll('.sidebar nav li[id]').forEach(item => item.style.display = 'none'); // Ocultar todos

    if (menuItems[role]) {
        menuItems[role].forEach(itemId => { // Mostrar permitidos
            const item = document.getElementById(itemId);
            if (item) item.style.display = 'flex';
        });

        // Seleccionar página y menú por defecto
        const defaultPageId = role === 'admin' ? 'page-dashboard' : 'page-mistareas';
        const defaultNavId = role === 'admin' ? 'nav-dashboard' : 'nav-mistareas';
        const defaultNavElement = document.getElementById(defaultNavId);

        // Resetear activos
        document.querySelectorAll('.sidebar nav li.active').forEach(li => li.classList.remove('active'));
        document.querySelectorAll('.page-content.active').forEach(page => page.classList.remove('active'));

        // Activar por defecto
        if (defaultNavElement) {
             defaultNavElement.classList.add('active');
             const pageToShow = document.getElementById(defaultPageId);
             if(pageToShow) pageToShow.classList.add('active');

             // Cargar datos iniciales según rol y página
             if (defaultPageId === 'page-programar' && role === 'admin') renderCalendar();
             // Cargar pendientes solo si es admin y la sección existe
             if (role === 'admin' && document.getElementById('pendientes-programar')) cargarPendientesDeProgramar();
             // Asegurarse que el calendario se renderice si la página activa es programar
             else if (defaultPageId === 'page-programar' && document.getElementById('calendar-container')) renderCalendar();


        } else console.error("Item/página por defecto no encontrado:", role);
    } else {
        console.error("Rol desconocido:", role);
        logout(); // Forzar logout si el rol es inválido
    }
}


// --- MENÚ COLAPSABLE (ESCRITORIO) ---
function toggleSidebar() {
    const container = document.querySelector('.container');
    const toggleBtn = document.getElementById('toggle-sidebar-btn');
    if (!toggleBtn) return;
    const icon = toggleBtn.querySelector('.material-icons-outlined');
    const isCollapsed = container.classList.toggle('sidebar-collapsed');
    if (isCollapsed) {
        toggleBtn.style.left = '90px';
        if(icon) icon.textContent = 'menu';
    } else {
        toggleBtn.style.left = '270px';
        if(icon) icon.textContent = 'menu_open';
    }
}

// --- MENÚ (MÓVIL) ---
function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) sidebar.classList.toggle('open');
}

// --- CAMBIAR ENTRE PÁGINAS ---
function showPage(pageId, navElement) {
    // Comprobación de Permisos
    const allowedPages = {
        admin: ['page-dashboard', 'page-programar', 'page-mistareas', 'page-clientes', 'page-perfil', 'page-generar-acta'],
        usuario: ['page-mistareas', 'page-perfil', 'page-generar-acta']
    };
    if (!currentUserRole || !allowedPages[currentUserRole] || !allowedPages[currentUserRole].includes(pageId)) {
        alert('Acceso denegado.'); return;
    }
    // Lógica para mostrar/ocultar páginas
     document.querySelectorAll('.page-content').forEach(page => page.classList.remove('active'));
    const pageToShow = document.getElementById(pageId);
    if(pageToShow) pageToShow.classList.add('active');
    if (navElement) {
        document.querySelectorAll('.sidebar nav li').forEach(li => li.classList.remove('active'));
        navElement.classList.add('active');
    }
    // Colapso automático y cierre móvil
    const container = document.querySelector('.container');
    const toggleBtn = document.getElementById('toggle-sidebar-btn');
    if (toggleBtn && !container.classList.contains('sidebar-collapsed')) {
        container.classList.add('sidebar-collapsed');
        const icon = toggleBtn.querySelector('.material-icons-outlined');
        toggleBtn.style.left = '90px';
        if (icon) icon.textContent = 'menu';
    }
    const sidebar = document.querySelector('.sidebar');
    if (sidebar && sidebar.classList.contains('open')) sidebar.classList.remove('open');
    // Renderizar calendario si es necesario y si el rol es admin
    if (pageId === 'page-programar' && currentUserRole === 'admin') {
        renderCalendar();
    }
}

// --- FUNCIONES MODALES ---
function openModal(modalId) { const modal = document.getElementById(modalId); if (modal) modal.style.display = 'flex'; }
function closeModal(modalId) { const modal = document.getElementById(modalId); if (modal) modal.style.display = 'none'; }

// --- SUBMIT NUEVO CLIENTE ---
function submitNuevoCliente() {
    const nombre = document.getElementById('cliente_nombre').value; console.log(`Guardando cliente: ${nombre}`); alert(`Cliente "${nombre}" guardado (simulación).`); closeModal('modal-nuevo-cliente'); document.getElementById('form-nuevo-cliente').reset();
}

// --- BUSCAR COMODATO ---
function buscarComodato() {
    const cmdId = document.getElementById('comodato_id').value;
    if (cmdId.toUpperCase() === 'CMD25001') {
        document.getElementById('asig_cliente').value = "IREN NORTE"; document.getElementById('asig_unidad_negocio').value = "BANCO DE SANGRE"; document.getElementById('asig_ubicacion').value = "LA LIBERTAD";
        const equipoSelect = document.getElementById('asig_equipo');
        equipoSelect.innerHTML = `<option value="">-- Seleccionar --</option><option value="I1000SR-1" selected>ARCHITECT I1000SR</option><option value="CELLDYN-2">CELL-DYN Ruby</option>`;
        alert('Datos cargados.');
    } else if(cmdId) alert('CMD no encontrado.'); else alert('Ingrese código.');
}

// --- FUNCIONES GENERAR ACTA (ARTÍCULOS) ---
const REPUESTOS_DB = [
    { codigo: 'BAT-UPS-001', descripcion: 'BATERIAS DE UPS - Reemplazo' }, { codigo: 'FIL-AIRE-005', descripcion: 'FILTRO DE AIRE HEPA - Limpieza/Cambio' },
    { codigo: 'CP-001', descripcion: 'Conector de Potencia C13' }, { codigo: '10002', descripcion: 'BATERIA UPS 12V 9AH' },
    { codigo: '20002', descripcion: 'BATERIA UPS 12V 7AH' }, { codigo: '20003', descripcion: 'BATERIA ESTABILIZADOR' },
    { codigo: '40001', descripcion: 'JERINGA DESCARTABLE 10ML' }, { codigo: '40004', descripcion: 'JERINGA DESCARTABLE 5ML' },
    { codigo: '40005', descripcion: 'JERINGA DESCARTABLE 20ML' }
];
function addArticleToList(codigo, descripcion, cantidad) {
    const articlesList = document.querySelector('.articles-list'); if (!articlesList) return false;
    if (document.getElementById(`qty_${codigo}`)) { alert(`Artículo ${codigo} ya añadido.`); return false; }
    const newItem = document.createElement('div'); newItem.classList.add('article-item');
    newItem.innerHTML = `<p><strong>Código:</strong> ${codigo} | <strong>Desc:</strong> ${descripcion}</p><label for="qty_${codigo}">Cant:</label><input type="number" id="qty_${codigo}" value="${cantidad}" min="1"><button type="button" class="button button-danger" onclick="this.closest('.article-item').remove()"><span class="material-icons-outlined" style="font-size:1em">delete</span></button>`;
    articlesList.appendChild(newItem); return true;
}
function addArticle(barcode) { if (barcode) { const item = REPUESTOS_DB.find(r => r.codigo === barcode); addArticleToList(barcode, item ? item.descripcion : `Desconocido (${barcode})`, 1); } }
function filtrarCodigosPorDescripcion() {
    const filtro = document.getElementById('manual_descripcion').value.toLowerCase(); const select = document.getElementById('manual_codigo'); select.innerHTML = '';
    if (filtro.length < 3) { select.innerHTML = '<option value="">-- Mín 3 letras --</option>'; return; }
    const res = REPUESTOS_DB.filter(i => i.descripcion.toLowerCase().includes(filtro));
    if (res.length === 0) { select.innerHTML = '<option value="">-- Sin resultados --</option>'; return; }
    res.forEach(i => { const opt = document.createElement('option'); opt.value = i.codigo; opt.textContent = `${i.codigo} | ${i.descripcion}`; select.appendChild(opt); });
    // actualizarDescripcionPorCodigo(); // Descomentar si quieres autocompletar descripción al filtrar
}
function actualizarDescripcionPorCodigo() {
    const select = document.getElementById('manual_codigo'); if (select.selectedOptions.length > 0 && select.value !== "") { const txt = select.selectedOptions[0].textContent; document.getElementById('manual_descripcion').value = txt.split('|')[1].trim(); }
}
function submitArticuloManual() {
    const codigo = document.getElementById('manual_codigo').value; const cant = document.getElementById('manual_cantidad').value;
    if (!codigo) { alert('Seleccione un código válido.'); return; }
    const select = document.getElementById('manual_codigo'); const desc = select.options[select.selectedIndex].textContent.split('|')[1].trim();
    if (addArticleToList(codigo, desc, cant)) { closeModal('modal-add-article'); document.getElementById('form-add-article').reset(); document.getElementById('manual_codigo').innerHTML = '<option value="">-- Escriba desc --</option>'; }
}
function handleImageUpload(event) {
    const gallery = document.querySelector('.image-gallery'); if (!gallery) return; gallery.innerHTML = ''; const files = event.target.files;
    if (files) { Array.from(files).forEach(f => { if (f.type.startsWith('image/')) { const reader = new FileReader(); reader.onload = e => { const img = document.createElement('img'); img.src = e.target.result; gallery.appendChild(img); }; reader.readAsDataURL(f); } }); }
}
let html5QrcodeScanner; // Escáner

// --- LÓGICA DE TAREAS PENDIENTES ---
const TAREAS_PENDIENTES_DB = [
    { id: 'TP001', cliente: 'Hosp Central', uN: 'UCI', ubicacion: 'Lima', equipo: 'Ventilador', act: 'CORRECTIVO', prio: 'alta', fecha: '2025-11-10', desc: 'No enciende' },
    { id: 'TP002', cliente: 'Clin SB', uN: 'Lab', ubicacion: 'San Borja', equipo: 'Analizador H', act: 'PREVENTIVO', prio: 'media', fecha: '2025-11-15', desc: 'MP Anual' },
    { id: 'TP003', cliente: 'IREN N', uN: 'Banco S', ubicacion: 'La Libertad', equipo: 'Architect', act: 'REVISIÓN', prio: 'baja', fecha: '2025-11-20', desc: 'Calibración' }
];
function cargarPendientesDeProgramar() {
    const lista = document.getElementById('lista-pendientes'); const cont = document.getElementById('contador-pendientes'); if (!lista || !cont) return; lista.innerHTML = '';
    if (TAREAS_PENDIENTES_DB.length === 0) { lista.innerHTML = '<p>No hay pendientes.</p>'; cont.textContent = '0'; return; }
    cont.textContent = TAREAS_PENDIENTES_DB.length;
    TAREAS_PENDIENTES_DB.forEach(t => { const card = document.createElement('div'); card.className = 'task-details'; card.style.cssText = 'padding:10px; border-bottom:1px solid #eee; cursor:pointer;'; card.innerHTML = `<p style="margin:2px 0"><strong>${t.cliente}</strong> (${t.act})</p><p style="margin:2px 0"><small>${t.equipo} - ${t.desc.substring(0,30)}...</small></p>`; card.onclick = () => seleccionarTareaPendiente(t.id); lista.appendChild(card); });
}
function seleccionarTareaPendiente(id) {
    const t = TAREAS_PENDIENTES_DB.find(task => task.id === id); if (!t) { alert('Tarea no encontrada.'); return; }
    document.getElementById('tarea_pendiente_id').value = t.id; document.getElementById('comodato_id').value = '';
    document.getElementById('asig_cliente').value = t.cliente; document.getElementById('asig_unidad_negocio').value = t.uN; document.getElementById('asig_ubicacion').value = t.ubicacion;
    document.getElementById('asig_equipo').innerHTML = `<option value="${t.equipo}" selected>${t.equipo}</option>`; document.getElementById('asig_actividad').value = t.act; document.getElementById('asig_prioridad').value = t.prio; document.getElementById('asig_fecha_ini').value = t.fecha; document.getElementById('asig_descripcion').value = t.desc; document.getElementById('asig_responsable').value = '';
    document.getElementById('card-detalles-asignacion')?.scrollIntoView({ behavior: 'smooth' });
}
function limpiarFormularioAsignacion() { document.getElementById('form-asignacion')?.reset(); document.getElementById('tarea_pendiente_id').value = ''; document.getElementById('asig_equipo').innerHTML = '<option value="">-- Seleccionar --</option>'; }
function submitAsignacion() {
    const form = document.getElementById('form-asignacion'); const data = new FormData(form); const datos = Object.fromEntries(data.entries());
    console.log("Datos:", datos); alert(`Tarea para ${datos.asig_cliente} asignada (simulación).`);
    if (datos.tarea_pendiente_id) { const idx = TAREAS_PENDIENTES_DB.findIndex(t => t.id === datos.tarea_pendiente_id); if (idx > -1) { TAREAS_PENDIENTES_DB.splice(idx, 1); cargarPendientesDeProgramar(); } }
    limpiarFormularioAsignacion();
}

// --- LÓGICA DEL CALENDARIO ---
const TAREAS_ASIGNADAS_DB = [
     { id: 'TA001', fecha: '2025-11-29', ingeniero: 'ing1', cliente: 'Hosp Santa Rosa', actividad: 'Preventivo', equipo: 'i1000sr', estado: 'Programado', uNegocio: 'Banco S', ubicacion: 'Ancash', prioridad: 'Media', descripcion: 'MP' },
     { id: 'TA002', fecha: '2025-11-30', ingeniero: 'ing2', cliente: 'Hosp Rebagliati', actividad: 'Preventivo', equipo: 'i2000sr', estado: 'Programado', uNegocio: 'Banco S', ubicacion: 'Lima', prioridad: 'Media', descripcion: 'MP' },
     { id: 'TA003', fecha: '2025-11-05', ingeniero: 'ing3', cliente: 'Essalud Arequipa', actividad: 'Instalacion', equipo: 'Alinity I', estado: 'Programado', uNegocio: 'Banco S', ubicacion: 'Arequipa', prioridad: 'Alta', descripcion: 'Instalación' },
     { id: 'TA004', fecha: '2025-11-18', ingeniero: 'ing1', cliente: 'Seg Social Huanuco', actividad: 'Preventivo', equipo: 'i1000sr', estado: 'Programado', uNegocio: 'Banco S', ubicacion: 'Huanuco', prioridad: 'Media', descripcion: 'MP' },
     { id: 'TA005', fecha: '2025-11-19', ingeniero: 'ing2', cliente: 'Hosp Valdizan', actividad: 'Preventivo', equipo: 'i1000sr', estado: 'Programado', uNegocio: 'Banco S', ubicacion: 'Lima', prioridad: 'Media', descripcion: 'MP' },
     { id: 'TA006', fecha: '2025-11-30', ingeniero: 'ing1', cliente: 'Otro Cliente', actividad: 'Correctivo', equipo: 'Otro Equipo', estado: 'Programado', uNegocio: 'Emergencia', ubicacion: 'Callao', prioridad: 'Urgente', descripcion: 'Revisión Urgente' },
];
function renderCalendar() {
    const calBody = document.getElementById('calendar-body'); const monthYear = document.getElementById('calendar-month-year'); const monthInput = document.getElementById('calendar-month'); const engFilter = document.getElementById('calendar-engineer')?.value;
    if (!calBody || !monthYear || !monthInput) return;
    const monthStr = String(currentMonth + 1).padStart(2, '0'); monthInput.value = `${currentYear}-${monthStr}`;
    monthYear.textContent = `${["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"][currentMonth]} ${currentYear}`; calBody.innerHTML = '';
    const firstDay = new Date(currentYear, currentMonth, 1).getDay(); const days = new Date(currentYear, currentMonth + 1, 0).getDate(); let date = 1;
    for (let i = 0; i < 6; i++) { const row = document.createElement('tr'); for (let j = 0; j < 7; j++) { const cell = document.createElement('td'); if (i === 0 && j < firstDay || date > days) cell.classList.add('outside-month'); else { cell.innerHTML = `<span class="day-number">${date}</span>`; const dStr = `${currentYear}-${monthStr}-${String(date).padStart(2, '0')}`; const tasks = TAREAS_ASIGNADAS_DB.filter(t => t.fecha === dStr && (engFilter === 'todos' || t.ingeniero === engFilter)); tasks.forEach(t => { const el = document.createElement('div'); el.className = `calendar-task task-${t.actividad.toLowerCase()}`; el.textContent = `${t.equipo} (${t.cliente.substring(0,6)}..)`; el.title = `${t.actividad} - ${t.cliente}`; el.onclick = () => openTaskDetailsModal(t.id); cell.appendChild(el); }); date++; } row.appendChild(cell); } calBody.appendChild(row); if (date > days && i < 5) break; }
}
function changeMonth(dir) { currentMonth += dir; if (currentMonth < 0) { currentMonth = 11; currentYear--; } else if (currentMonth > 11) { currentMonth = 0; currentYear++; } renderCalendar(); }
function openTaskDetailsModal(id) {
    const t = TAREAS_ASIGNADAS_DB.find(task => task.id === id); if (!t) return;
    document.getElementById('modal-task-title').textContent = `${t.actividad} - ${t.equipo}`; document.getElementById('modal-task-unegocio').textContent = t.uNegocio || 'N/A';
    const actSpan = document.getElementById('modal-task-actividad'); actSpan.textContent = t.actividad; actSpan.className = 'status'; actSpan.classList.add(t.actividad); // Usa la actividad como clase
    document.getElementById('modal-task-ubicacion').textContent = t.ubicacion || 'N/A'; document.getElementById('modal-task-cliente').textContent = t.cliente;
    let resp = 'N/A'; if(t.ingeniero === 'ing1') resp = 'C Mendoza'; else if(t.ingeniero === 'ing2') resp = 'A Gutiérrez'; else if(t.ingeniero === 'ing3') resp = 'L Torres'; document.getElementById('modal-task-responsables').textContent = resp;
    const estSpan = document.getElementById('modal-task-estado'); estSpan.textContent = t.estado; estSpan.className = 'status'; estSpan.classList.add(t.estado); // Usa estado como clase
    document.getElementById('modal-task-fechaini').textContent = t.fecha;
    const prioSpan = document.getElementById('modal-task-prioridad'); prioSpan.textContent = t.prioridad; prioSpan.className = 'status'; prioSpan.classList.add(t.prioridad); // Usa prioridad como clase
    document.getElementById('modal-task-descripcion').textContent = t.descripcion || 'N/A';
    openModal('modal-task-details');
}


// --- INICIALIZACIÓN ---
document.addEventListener("DOMContentLoaded", function() {
    const toggleBtn = document.getElementById('toggle-sidebar-btn'); if (toggleBtn) toggleBtn.addEventListener('click', toggleSidebar);
    const mobileToggleBtn = document.getElementById('menu-toggle-btn'); if(mobileToggleBtn) mobileToggleBtn.addEventListener('click', toggleMobileMenu);

    // No llamar setupUIForRole aquí, se llama después del login
    // No cargar pendientes ni calendario aquí inicialmente

    const startScanBtn = document.getElementById('start-scan-btn');
    if (startScanBtn) { startScanBtn.addEventListener('click', () => { /* ... escáner ... */ }); }
    const today = new Date(); const y = today.getFullYear(); const m = String(today.getMonth()+1).padStart(2,'0'); const d = String(today.getDate()).padStart(2,'0');
    const actaFecha = document.getElementById('acta-fecha-atencion'); if (actaFecha) actaFecha.textContent = `${d}/${m}/${y}`;
    // Precargar artículo solo si la sección está disponible (se chequea dentro de addArticleToList)
    addArticleToList('BAT-UPS-001','BATERIAS DE UPS - Reemplazo', 1);
    const fotosInput = document.getElementById('fotos_evidencia'); if (fotosInput) fotosInput.addEventListener('change', handleImageUpload);

    // Mostrar login al inicio
    const loginScreen = document.getElementById('login-screen'); const mainContainer = document.querySelector('.container');
    if(loginScreen) loginScreen.style.display = 'flex'; if(mainContainer) mainContainer.style.display = 'none';
});
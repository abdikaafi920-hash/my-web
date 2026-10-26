/* ========================================================
   Kaafi Academy - JavaScript (Math & Physics Academy)
   ======================================================== */

// Default Teacher Profile Info
const DEFAULT_TEACHER = {
  name: "Ustaad Kaafi",
  degree: "Aasaasaha Kaafi Academy & M.Sc in Theoretical Physics & Applied Mathematics",
  bio: "\"Ku soo dhowow Kaafi Academy. Waxaan aaminsanahay in Xisaabtu tahay furaha koonka, Fiisigiskuna yahay sharciga dabiiciga ah ee wax kasta ku socdaan. Hadafkaygu waa inaan arday kasta ka saaro cabsida maadooyinkan Sayniska ah, una beddelo faham qoto-dheer iyo natiijooyin heersare ah.\"",
  phone: "+252 61 5000000",
  email: "kaafi@kaafiacademy.com"
};

// Initial Sample Students
const INITIAL_STUDENTS = [
  {
    id: "STD-1001",
    name: "Faarax Maxamed Nuur",
    phone: "+252 61 5123456",
    email: "farah.m@gmail.com",
    subject: "Mathematics",
    level: "Fasalka 4aad Shahaadiga (Form 4)",
    classType: "Online (Zoom / Google Meet)",
    shift: "Habeennimo (7:30 PM - 9:30 PM)",
    date: "2026-10-22",
    notes: "Waxaan u baahanahay diyaarinta imtixaanka shahaadiga ee Xisaabta gaar ahaan Calculus."
  },
  {
    id: "STD-1002",
    name: "Hani Cabdullaahi Cismaan",
    phone: "+252 61 7890123",
    email: "hani.ab@gmail.com",
    subject: "Physics",
    level: "Heer Jaamacadeed (University)",
    classType: "Online (Zoom / Google Meet)",
    shift: "Galabnimo (2:00 PM - 4:00 PM)",
    date: "2026-10-23",
    notes: "Waxaan jaamacadda ku bartaa Engineering waxaana doonayaa Classical Mechanics."
  },
  {
    id: "STD-1003",
    name: "Khaalid Jaamac Warsame",
    phone: "+252 61 3456789",
    email: "khalid.j@yahoo.com",
    subject: "Labadaba (Math & Physics)",
    level: "Fasalka 3aad Dugsiga Sare (Form 3)",
    classType: "Koorso Gaar ah (1-on-1 VIP)",
    shift: "Subaxnimo (8:00 AM - 10:00 AM)",
    date: "2026-10-24",
    notes: "Casharro gaar ah labada maado."
  },
  {
    id: "STD-1004",
    name: "Safiya Yuusuf Xasan",
    phone: "+252 61 9012345",
    email: "safia.y@gmail.com",
    subject: "Mathematics",
    level: "Fasalka 2aad Dugsiga Sare (Form 2)",
    classType: "Fasalka Caadiga ah (Physical)",
    shift: "Galabnimo (2:00 PM - 4:00 PM)",
    date: "2026-10-25",
    notes: "Trigonometry iyo Algebra xoojin."
  }
];

// App State
let students = [];
let currentUser = null; // null or { role: 'teacher'|'student', name: string, email: string }

// DOM Elements Initialization
document.addEventListener('DOMContentLoaded', () => {
  initStorage();
  initTheme();
  initTeacherProfile();
  renderStudentsTable();
  updateStats();
  setupEventListeners();
  checkAuthSession();
});

/* ==================== STORAGE & INITIALIZATION ==================== */
function initStorage() {
  const storedStudents = localStorage.getItem('ustaad_students');
  if (!storedStudents) {
    students = [...INITIAL_STUDENTS];
    localStorage.setItem('ustaad_students', JSON.stringify(students));
  } else {
    try {
      students = JSON.parse(storedStudents);
    } catch (e) {
      students = [...INITIAL_STUDENTS];
    }
  }

  const storedTeacher = localStorage.getItem('ustaad_teacher_profile');
  if (!storedTeacher) {
    localStorage.setItem('ustaad_teacher_profile', JSON.stringify(DEFAULT_TEACHER));
  }
}

function getStoredTeacher() {
  try {
    const data = localStorage.getItem('ustaad_teacher_profile');
    return data ? JSON.parse(data) : DEFAULT_TEACHER;
  } catch (e) {
    return DEFAULT_TEACHER;
  }
}

function initTeacherProfile() {
  const teacher = getStoredTeacher();
  const nameElems = [
    document.getElementById('previewTeacherName'),
    document.getElementById('displayTeacherName')
  ];
  nameElems.forEach(el => {
    if (el) el.textContent = teacher.name;
  });

  const degreeEl = document.getElementById('displayTeacherDegree');
  if (degreeEl) degreeEl.textContent = teacher.degree;

  const bioEl = document.getElementById('displayTeacherBio');
  if (bioEl) bioEl.textContent = teacher.bio;

  const phoneEl = document.getElementById('displayTeacherPhone');
  if (phoneEl) phoneEl.textContent = teacher.phone;

  const emailEl = document.getElementById('displayTeacherEmail');
  if (emailEl) emailEl.textContent = teacher.email;

  const contactPhoneEl = document.getElementById('contactPhoneDisplay');
  if (contactPhoneEl) contactPhoneEl.textContent = teacher.phone;

  const contactEmailEl = document.getElementById('contactEmailDisplay');
  if (contactEmailEl) contactEmailEl.textContent = teacher.email;
}

/* ==================== THEME MANAGEMENT ==================== */
function initTheme() {
  const savedTheme = localStorage.getItem('ustaad_theme') || 'dark';
  const toggleBtn = document.getElementById('themeToggleBtn');

  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    if (toggleBtn) toggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
  } else {
    document.body.classList.remove('light-mode');
    if (toggleBtn) toggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
  }
}

function toggleTheme() {
  const isLight = document.body.classList.toggle('light-mode');
  const toggleBtn = document.getElementById('themeToggleBtn');
  if (isLight) {
    localStorage.setItem('ustaad_theme', 'light');
    if (toggleBtn) toggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    showToast("Muuqaalka Cad (Light Mode) ayaa la daartay", "info");
  } else {
    localStorage.setItem('ustaad_theme', 'dark');
    if (toggleBtn) toggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    showToast("Muuqaalka Madow (Dark Mode) ayaa la daartay", "info");
  }
}

/* ==================== EVENT LISTENERS SETUP ==================== */
function setupEventListeners() {
  // Mobile Menu
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('active'));
    });
  }

  // Theme Toggle
  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }

  // Course Card Selection Buttons
  document.querySelectorAll('.select-course-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const subject = btn.getAttribute('data-subject');
      const subjectSelect = document.getElementById('subjectSelect');
      if (subjectSelect) {
        subjectSelect.value = subject;
      }
      // Scroll to registration
      const regSection = document.getElementById('register');
      if (regSection) {
        regSection.scrollIntoView({ behavior: 'smooth' });
      }
      showToast(`Waxaad dooratay maadada: ${subject}`, "info");
    });
  });

  // Student Registration Form
  const regForm = document.getElementById('studentRegistrationForm');
  if (regForm) {
    regForm.addEventListener('submit', handleStudentRegistration);
  }

  // Search & Filter
  const searchInput = document.getElementById('studentSearchInput');
  const filterSubject = document.getElementById('filterSubject');
  const filterClassType = document.getElementById('filterClassType');
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');

  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (filterSubject) filterSubject.addEventListener('change', applyFilters);
  if (filterClassType) filterClassType.addEventListener('change', applyFilters);
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (filterSubject) filterSubject.value = 'all';
      if (filterClassType) filterClassType.value = 'all';
      renderStudentsTable();
      showToast("Filtaradii waa la nadiifiyay", "info");
    });
  }

  // Export CSV
  const exportCsvBtn = document.getElementById('exportCsvBtn');
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', exportStudentsToCSV);
  }

  // Print List
  const printListBtn = document.getElementById('printListBtn');
  if (printListBtn) {
    printListBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Quick Contact Form
  const quickForm = document.getElementById('quickContactForm');
  if (quickForm) {
    quickForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const senderName = document.getElementById('contactSenderName').value;
      showToast(`Mahadsanid ${senderName}! Fariintaadu si guul leh ayay u gaartay macallinka.`, "success");
      quickForm.reset();
    });
  }

  // Login Modal Controls
  setupLoginModal();

  // Profile Edit Modal Controls
  setupEditProfileModal();

  // Student Detail Modal Close
  const closeDetailBtn = document.getElementById('closeDetailModalBtn');
  const studentDetailModal = document.getElementById('studentDetailModal');
  if (closeDetailBtn && studentDetailModal) {
    closeDetailBtn.addEventListener('click', () => {
      studentDetailModal.classList.remove('active');
    });
    studentDetailModal.addEventListener('click', (e) => {
      if (e.target === studentDetailModal) studentDetailModal.classList.remove('active');
    });
  }
}

/* ==================== LOGIN & AUTHENTICATION ==================== */
function setupLoginModal() {
  const loginModal = document.getElementById('loginModal');
  const openLoginBtn = document.getElementById('openLoginBtn');
  const closeLoginBtn = document.getElementById('closeLoginModalBtn');
  const loginForm = document.getElementById('loginForm');
  const roleTabs = document.querySelectorAll('.auth-tab-btn');
  const togglePassBtn = document.getElementById('togglePasswordBtn');
  const passInput = document.getElementById('loginPassword');
  const demoStudentHint = document.querySelector('.demo-student-hint');

  let activeRole = 'teacher';

  if (openLoginBtn && loginModal) {
    openLoginBtn.addEventListener('click', () => {
      loginModal.classList.add('active');
    });
  }

  if (closeLoginBtn && loginModal) {
    closeLoginBtn.addEventListener('click', () => {
      loginModal.classList.remove('active');
    });
    loginModal.addEventListener('click', (e) => {
      if (e.target === loginModal) loginModal.classList.remove('active');
    });
  }

  // Role Tab Switching
  roleTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      roleTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeRole = tab.getAttribute('data-role');

      const emailInput = document.getElementById('loginEmail');
      if (activeRole === 'teacher') {
        if (emailInput) emailInput.placeholder = "kaafi@kaafiacademy.com";
        if (demoStudentHint) demoStudentHint.style.display = 'none';
      } else {
        if (emailInput) emailInput.placeholder = "arday@kaafiacademy.com";
        if (demoStudentHint) demoStudentHint.style.display = 'block';
      }
    });
  });

  // Toggle Password
  if (togglePassBtn && passInput) {
    togglePassBtn.addEventListener('click', () => {
      const type = passInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passInput.setAttribute('type', type);
      togglePassBtn.innerHTML = type === 'password' ? '<i class="fa-solid fa-eye"></i>' : '<i class="fa-solid fa-eye-slash"></i>';
    });
  }

  // Forgot password
  const forgotLink = document.getElementById('forgotPasswordLink');
  if (forgotLink) {
    forgotLink.addEventListener('click', (e) => {
      e.preventDefault();
      alert("Haddii aad ilowday furahaaga, fadlan kala xiriir maamulka Kaafi Academy WhatsApp: +252 61 5000000 ama isticmaal Demo credentials: admin123");
    });
  }

  // Form Submit
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim().toLowerCase();
      const password = document.getElementById('loginPassword').value.trim();

      if (activeRole === 'teacher') {
        if ((email === 'kaafi@kaafiacademy.com' || email === 'admin@kaafiacademy.com' || email === 'macallin@mathphys.edu' || email === 'admin@mathphys.edu') && password === 'admin123') {
          loginSuccess({
            role: 'teacher',
            name: 'Ustaad Kaafi',
            email: email
          });
        } else {
          showToast("Email-ka ama Furaha macallinka ma saxna! Fiiri Demo credentials: kaafi@kaafiacademy.com / admin123", "error");
        }
      } else {
        // Student login
        if (email && password.length >= 4) {
          loginSuccess({
            role: 'student',
            name: email.split('@')[0],
            email: email
          });
        } else {
          showToast("Fadlan geli email sax ah iyo fure ugu yaraan 4 xaraf ah.", "error");
        }
      }
    });
  }
}

function loginSuccess(user) {
  currentUser = user;
  sessionStorage.setItem('ustaad_user', JSON.stringify(user));

  const loginModal = document.getElementById('loginModal');
  if (loginModal) loginModal.classList.remove('active');

  renderAuthArea();
  showToast(`Ku soo dhowow, ${user.role === 'teacher' ? 'Macallin ' : 'Arday '} ${user.name}!`, "success");
}

function checkAuthSession() {
  const session = sessionStorage.getItem('ustaad_user');
  if (session) {
    try {
      currentUser = JSON.parse(session);
      renderAuthArea();
    } catch (e) {
      currentUser = null;
    }
  }
}

function renderAuthArea() {
  const authArea = document.getElementById('authArea');
  if (!authArea) return;

  if (currentUser) {
    authArea.innerHTML = `
      <div class="user-badge-nav">
        <i class="fa-solid fa-circle-user" style="color: var(--accent-red);"></i>
        <span>${currentUser.name}</span>
        <span class="role-tag-pill">${currentUser.role === 'teacher' ? 'Macallin' : 'Arday'}</span>
        <button id="logoutBtn" class="icon-btn" title="Ka bax (Logout)" style="width: 28px; height: 28px; font-size: 0.75rem; margin-left: 0.3rem;">
          <i class="fa-solid fa-power-off"></i>
        </button>
      </div>
    `;

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', logout);
    }
  } else {
    authArea.innerHTML = `
      <button class="btn btn-outline" id="openLoginBtn">
        <i class="fa-solid fa-right-to-bracket"></i> Galitaanka (Login)
      </button>
    `;
    const openLoginBtn = document.getElementById('openLoginBtn');
    if (openLoginBtn) {
      openLoginBtn.addEventListener('click', () => {
        const loginModal = document.getElementById('loginModal');
        if (loginModal) loginModal.classList.add('active');
      });
    }
  }
}

function logout() {
  currentUser = null;
  sessionStorage.removeItem('ustaad_user');
  renderAuthArea();
  showToast("Si guul leh ayaad uga baxday nidaamka.", "info");
}

/* ==================== TEACHER PROFILE EDIT ==================== */
function setupEditProfileModal() {
  const editModal = document.getElementById('editProfileModal');
  const openEditBtn = document.getElementById('editProfileTrigger');
  const closeEditBtn = document.getElementById('closeEditProfileBtn');
  const editForm = document.getElementById('editProfileForm');

  if (openEditBtn && editModal) {
    openEditBtn.addEventListener('click', () => {
      const teacher = getStoredTeacher();
      document.getElementById('inputTeacherName').value = teacher.name;
      document.getElementById('inputTeacherDegree').value = teacher.degree;
      document.getElementById('inputTeacherBio').value = teacher.bio;
      document.getElementById('inputTeacherPhone').value = teacher.phone;
      document.getElementById('inputTeacherEmail').value = teacher.email;
      editModal.classList.add('active');
    });
  }

  if (closeEditBtn && editModal) {
    closeEditBtn.addEventListener('click', () => {
      editModal.classList.remove('active');
    });
    editModal.addEventListener('click', (e) => {
      if (e.target === editModal) editModal.classList.remove('active');
    });
  }

  if (editForm && editModal) {
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const updatedTeacher = {
        name: document.getElementById('inputTeacherName').value.trim(),
        degree: document.getElementById('inputTeacherDegree').value.trim(),
        bio: document.getElementById('inputTeacherBio').value.trim(),
        phone: document.getElementById('inputTeacherPhone').value.trim(),
        email: document.getElementById('inputTeacherEmail').value.trim()
      };

      localStorage.setItem('ustaad_teacher_profile', JSON.stringify(updatedTeacher));
      initTeacherProfile();
      editModal.classList.remove('active');
      showToast("Profile-ka macallinka si guul leh ayaa loo cusbooneysiiyay!", "success");
    });
  }
}

/* ==================== STUDENT REGISTRATION ==================== */
function handleStudentRegistration(e) {
  e.preventDefault();

  const fullName = document.getElementById('fullName').value.trim();
  const phone = document.getElementById('phoneNumber').value.trim();
  const email = document.getElementById('emailAddress').value.trim();
  const subject = document.getElementById('subjectSelect').value;
  const level = document.getElementById('educationLevel').value;
  const classType = document.getElementById('classType').value;
  const shift = document.getElementById('shiftSelect').value;
  const notes = document.getElementById('studentNotes').value.trim();

  // Reset errors
  let hasError = false;
  const clearError = (id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  };
  const setError = (id, msg) => {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
    hasError = true;
  };

  clearError('nameError');
  clearError('phoneError');
  clearError('subjectError');
  clearError('levelError');
  clearError('classTypeError');
  clearError('shiftError');

  if (!fullName || fullName.length < 3) {
    setError('nameError', 'Fadlan qor magacaaga oo buuxa.');
  }

  if (!phone || phone.length < 6) {
    setError('phoneError', 'Fadlan qor lambar taleefan sax ah.');
  }

  if (!subject) {
    setError('subjectError', 'Fadlan dooro maaddo.');
  }

  if (!level) {
    setError('levelError', 'Fadlan dooro heerkaaga waxbarasho.');
  }

  if (!classType) {
    setError('classTypeError', 'Fadlan dooro habka fasalka.');
  }

  if (!shift) {
    setError('shiftError', 'Fadlan dooro waqtiga fasalka.');
  }

  if (hasError) {
    showToast("Fadlan sax khaladaadka foomka ku jira.", "error");
    return;
  }

  // Create new student record
  const newStudent = {
    id: "STD-" + Math.floor(1000 + Math.random() * 9000),
    name: fullName,
    phone: phone,
    email: email || "Lama Bixin",
    subject: subject,
    level: level,
    classType: classType,
    shift: shift,
    date: new Date().toISOString().split('T')[0],
    notes: notes || "Qoraal dheeraad ah ma jiro."
  };

  students.unshift(newStudent);
  localStorage.setItem('ustaad_students', JSON.stringify(students));

  renderStudentsTable();
  updateStats();

  // Reset form
  document.getElementById('studentRegistrationForm').reset();

  showToast(`Hambalyo! Ardayga ${fullName} si toos ah ayaa loo diiwaangeliyay.`, "success");

  // Scroll to table smoothly to show newly registered student
  setTimeout(() => {
    const studentsSec = document.getElementById('students');
    if (studentsSec) {
      studentsSec.scrollIntoView({ behavior: 'smooth' });
    }
  }, 500);
}

/* ==================== TABLE RENDERING & FILTERING ==================== */
function renderStudentsTable(recordsToRender = students) {
  const tbody = document.getElementById('studentsTableBody');
  const noStudentsMsg = document.getElementById('noStudentsMsg');
  const table = document.getElementById('studentsTable');

  if (!tbody) return;

  tbody.innerHTML = '';

  if (recordsToRender.length === 0) {
    if (noStudentsMsg) noStudentsMsg.style.display = 'block';
    if (table) table.style.display = 'none';
    return;
  }

  if (noStudentsMsg) noStudentsMsg.style.display = 'none';
  if (table) table.style.display = 'table';

  recordsToRender.forEach(std => {
    const tr = document.createElement('tr');

    // Subject badge class
    let badgeClass = 'badge-both';
    if (std.subject.includes('Math') && !std.subject.includes('Physics')) {
      badgeClass = 'badge-math';
    } else if (std.subject.includes('Physics') && !std.subject.includes('Math')) {
      badgeClass = 'badge-physics';
    }

    const initials = std.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

    tr.innerHTML = `
      <td><strong>${std.id}</strong></td>
      <td>
        <div class="student-name-cell">
          <div class="student-avatar-badge">${initials}</div>
          <div>
            <div>${std.name}</div>
            <small style="color: var(--text-muted); font-size: 0.75rem;">${std.email !== 'Lama Bixin' ? std.email : ''}</small>
          </div>
        </div>
      </td>
      <td>${std.phone}</td>
      <td><span class="subject-badge ${badgeClass}">${std.subject}</span></td>
      <td>${std.level}</td>
      <td>${std.classType}</td>
      <td><small>${std.shift}</small></td>
      <td><small>${std.date}</small></td>
      <td>
        <div class="action-btns">
          <button class="action-btn view-btn" data-id="${std.id}" title="Faahfaahin">
            <i class="fa-solid fa-eye"></i>
          </button>
          <button class="action-btn delete-btn" data-id="${std.id}" title="Tirtir">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </td>
    `;

    tbody.appendChild(tr);
  });

  // Attach event listeners for actions
  tbody.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      viewStudentDetails(id);
    });
  });

  tbody.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      deleteStudent(id);
    });
  });
}

function applyFilters() {
  const searchTerm = (document.getElementById('studentSearchInput')?.value || '').toLowerCase();
  const subjectFilter = document.getElementById('filterSubject')?.value || 'all';
  const classFilter = document.getElementById('filterClassType')?.value || 'all';

  const filtered = students.filter(std => {
    // Search match
    const matchSearch =
      std.name.toLowerCase().includes(searchTerm) ||
      std.phone.includes(searchTerm) ||
      std.subject.toLowerCase().includes(searchTerm) ||
      std.id.toLowerCase().includes(searchTerm);

    // Subject match
    let matchSubject = true;
    if (subjectFilter === 'Mathematics') {
      matchSubject = std.subject === 'Mathematics';
    } else if (subjectFilter === 'Physics') {
      matchSubject = std.subject === 'Physics';
    } else if (subjectFilter === 'Labadaba') {
      matchSubject = std.subject.includes('Labadaba');
    }

    // Class type match
    let matchClass = true;
    if (classFilter === 'Online') {
      matchClass = std.classType.includes('Online');
    } else if (classFilter === 'Physical') {
      matchClass = std.classType.includes('Physical');
    } else if (classFilter === 'VIP') {
      matchClass = std.classType.includes('VIP');
    }

    return matchSearch && matchSubject && matchClass;
  });

  renderStudentsTable(filtered);
}

function viewStudentDetails(studentId) {
  const std = students.find(s => s.id === studentId);
  if (!std) return;

  const content = document.getElementById('studentDetailContent');
  const title = document.getElementById('detailModalTitle');
  const modal = document.getElementById('studentDetailModal');

  if (!content || !modal) return;

  if (title) title.textContent = `Faahfaahinta: ${std.name}`;

  content.innerHTML = `
    <div class="detail-row">
      <span class="label">ID-ga Ardayga:</span>
      <span class="val">${std.id}</span>
    </div>
    <div class="detail-row">
      <span class="label">Magaca oo Buuxa:</span>
      <span class="val">${std.name}</span>
    </div>
    <div class="detail-row">
      <span class="label">Lambarka WhatsApp:</span>
      <span class="val"><a href="https://wa.me/${std.phone.replace(/[^0-9]/g, '')}" target="_blank" style="color: var(--whatsapp-green);"><i class="fa-brands fa-whatsapp"></i> ${std.phone}</a></span>
    </div>
    <div class="detail-row">
      <span class="label">Email-ka:</span>
      <span class="val">${std.email}</span>
    </div>
    <div class="detail-row">
      <span class="label">Maadada Dooqda ah:</span>
      <span class="val"><strong>${std.subject}</strong></span>
    </div>
    <div class="detail-row">
      <span class="label">Heerka Waxbarashada:</span>
      <span class="val">${std.level}</span>
    </div>
    <div class="detail-row">
      <span class="label">Habka Fasalka:</span>
      <span class="val">${std.classType}</span>
    </div>
    <div class="detail-row">
      <span class="label">Waqtiga Fasalka:</span>
      <span class="val">${std.shift}</span>
    </div>
    <div class="detail-row">
      <span class="label">Taariikhda Diiwaangelinta:</span>
      <span class="val">${std.date}</span>
    </div>
    <div style="margin-top: 1rem; padding: 1rem; background: var(--bg-primary); border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
      <strong style="font-size: 0.85rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem;">Qoraalka Ardayga:</strong>
      <p style="font-size: 0.92rem; color: var(--text-secondary); margin: 0;">${std.notes}</p>
    </div>
    <div style="margin-top: 1rem; display: flex; gap: 0.5rem; justify-content: flex-end;">
      <a href="https://wa.me/${std.phone.replace(/[^0-9]/g, '')}" target="_blank" class="btn btn-whatsapp btn-sm">
        <i class="fa-brands fa-whatsapp"></i> Farriin WhatsApp ah u dir
      </a>
    </div>
  `;

  modal.classList.add('active');
}

function deleteStudent(studentId) {
  const std = students.find(s => s.id === studentId);
  if (!std) return;

  const confirmed = confirm(`Ma hubtaa inaad tirtirto ardayga: ${std.name} (${std.id})?`);
  if (confirmed) {
    students = students.filter(s => s.id !== studentId);
    localStorage.setItem('ustaad_students', JSON.stringify(students));
    applyFilters();
    updateStats();
    showToast(`Ardaygii ${std.name} waa laga saaray liiska.`, "info");
  }
}

function updateStats() {
  const total = students.length;
  let math = 0;
  let physics = 0;
  let both = 0;

  students.forEach(s => {
    if (s.subject === 'Mathematics') math++;
    else if (s.subject === 'Physics') physics++;
    else if (s.subject.includes('Labadaba')) both++;
  });

  const totalEl = document.getElementById('totalStudentsCount');
  const mathEl = document.getElementById('mathCount');
  const physicsEl = document.getElementById('physicsCount');
  const bothEl = document.getElementById('bothCount');
  const heroCountEl = document.getElementById('heroStudentCount');

  if (totalEl) totalEl.textContent = total;
  if (mathEl) mathEl.textContent = math;
  if (physicsEl) physicsEl.textContent = physics;
  if (bothEl) bothEl.textContent = both;
  if (heroCountEl) heroCountEl.textContent = `${1250 + total}+`;
}

/* ==================== EXPORT TO CSV ==================== */
function exportStudentsToCSV() {
  if (students.length === 0) {
    showToast("Ma jiraan arday la soo dejiyo!", "error");
    return;
  }

  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "ID,Magaca,Taleefanka,Email,Maadada,Heerka,Nooca Fasalka,Waqtiga,Taariikhda\r\n";

  students.forEach(s => {
    const row = [
      `"${s.id}"`,
      `"${s.name}"`,
      `"${s.phone}"`,
      `"${s.email}"`,
      `"${s.subject}"`,
      `"${s.level}"`,
      `"${s.classType}"`,
      `"${s.shift}"`,
      `"${s.date}"`
    ].join(",");
    csvContent += row + "\r\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `ardayda_ustaad_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast("Faylka CSV ee ardayda si guul leh ayaa loo soo dejiyay!", "success");
}

/* ==================== TOAST NOTIFICATION UTILITY ==================== */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let icon = '<i class="fa-solid fa-circle-info toast-icon"></i>';
  let title = 'Ogeysiis';

  if (type === 'success') {
    icon = '<i class="fa-solid fa-circle-check toast-icon"></i>';
    title = 'Guul';
  } else if (type === 'error') {
    icon = '<i class="fa-solid fa-circle-xmark toast-icon"></i>';
    title = 'Khalad';
  }

  toast.innerHTML = `
    ${icon}
    <div class="toast-text">
      <h5>${title}</h5>
      <p>${message}</p>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

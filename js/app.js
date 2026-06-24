// app.js - AI教师研训 超管端交互逻辑

const app = {
  // ========== State ==========
  currentPage: 'dashboard',
  editingCourseId: null,
  courses: [...MOCK_COURSES],
  courseTypes: [...MOCK_COURSE_TYPES],
  organizations: [...MOCK_ORGANIZATION],
  catalogMap: { ...MOCK_COURSE_CATALOG },
  courseStats: { ...MOCK_COURSE_STATS },
  sectionStats: { ...MOCK_SECTION_STATS },
  teacherStats: { ...MOCK_TEACHER_STATS },
  teacherDetail: { ...MOCK_TEACHER_DETAIL },

  // Modal / action state
  deleteTargetId: null,
  toggleTargetId: null,
  toggleTargetStatus: null,
  editingChapterId: null,
  editingSectionId: null,
  currentSectionType: 'text',
  tempCatalog: [],

  // Activity module state
  activities: [...MOCK_ACTIVITIES],
  activityCourses: { ...MOCK_ACTIVITY_COURSES },
  activityParticipants: { ...MOCK_ACTIVITY_PARTICIPANTS },
  activityLearningRecords: { ...MOCK_ACTIVITY_LEARNING_RECORDS },
  editingActivityId: null,
  tempActivityCourses: [],
  tempActivityTeachers: [],
  tempActivityAttachments: [],
  currentActivityTab: 'activity-basic',
  currentFollowTab: 'follow-student',
  followActivityId: null,

  // Pagination
  listPage: 1,
  listPageSize: 10,
  listTotal: 0,
  activityListPage: 1,
  activityListTotal: 0,

  // Select modal pagination
  teacherSelectPage: 1,
  teacherSelectPageSize: 10,
  courseSelectPage: 1,
  courseSelectPageSize: 10,

  // ========== Init ==========
  init() {
    this.renderTypeFilter();
    this.renderCourseTable();
    this.renderCourseTypeSelect();
    this.renderOrgSelector();
    this.renderAbilityOptions();
    this.bindSidebar();
    this.bindNameCount();
    this.bindInstructorCount();
    this.bindDescInput();
    this.goTo('dashboard');
  },

  // ========== Navigation ==========
  goTo(page) {
    document.querySelectorAll('.page-section').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.submenu-item').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));

    const target = document.getElementById('page-' + page);
    if (target) target.classList.add('active');

    // 高亮菜单：dashboard 归属 AI研训；course-form 归属 研训课程；activity-form / activity-follow 归属 研训活动
    let menuPage = page;
    if (page === 'dashboard') menuPage = 'dashboard';
    if (page === 'course-form') menuPage = 'course-list';
    if (page === 'activity-form' || page === 'activity-follow') menuPage = 'activity-list';
    const menuItem = document.querySelector(`.submenu-item[data-page="${menuPage}"]`);
    if (menuItem) menuItem.classList.add('active');
    // 同时高亮父级 menu-item
    if (page === 'dashboard') {
      const parentMenu = document.querySelector('.menu-item[data-page="course-list"]');
      if (parentMenu) parentMenu.classList.add('active');
    } else {
      const parentMenu = document.querySelector(`.menu-item[data-page="${menuPage}"]`);
      if (parentMenu) parentMenu.classList.add('active');
    }

    this.currentPage = page;
    document.getElementById('header-title').textContent = this.getPageTitle(page);

    if (page === 'activity-list') this.renderActivityTable();
    if (page === 'dashboard') this.renderDashboard();
    if (page !== 'dashboard') this.disposeDashboardCharts();
  },

  getPageTitle(page) {
    const titles = {
      'dashboard': 'AI研训驾驶舱',
      'course-list': '研训课程',
      'course-form': '新建/编辑课程',
      'course-data': '课程数据',
      'teacher-detail': '教师学习详情',
      'activity-list': '研训活动',
      'activity-form': '新建/编辑活动',
      'activity-follow': '活动跟进'
    };
    return titles[page] || '研训课程';
  },

  goToList() {
    this.goTo('course-list');
    this.renderCourseTable();
  },

  goToCourseData() {
    this.goTo('course-data');
  },

  goToActivityList() {
    this.goTo('activity-list');
    this.renderActivityTable();
  },

  bindSidebar() {
    // 子菜单点击
    document.querySelectorAll('.submenu-item').forEach(item => {
      item.addEventListener('click', () => {
        const page = item.dataset.page;
        if (page) this.goTo(page);
      });
    });
    // 顶级菜单点击（如 AI研训驾驶舱）
    document.querySelectorAll('.menu-item').forEach(item => {
      item.addEventListener('click', () => {
        const page = item.dataset.page;
        if (page) this.goTo(page);
      });
    });
  },

  // ========== Toast ==========
  toast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const iconMap = {
      success: '✓',
      error: '✕',
      warning: '!',
      info: 'i'
    };
    toast.innerHTML = `<span style="font-weight:700">${iconMap[type] || 'i'}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  },

  // ========== Modal Helpers ==========
  openModal(id) {
    document.getElementById(id).classList.add('active');
  },

  closeModal(id) {
    document.getElementById(id).classList.remove('active');
  },

  openTypeDrawer() {
    this.renderTypeTree();
    document.getElementById('drawer-overlay').classList.add('active');
    document.getElementById('drawer-type-manage').classList.add('active');
  },

  closeTypeDrawer() {
    document.getElementById('drawer-overlay').classList.remove('active');
    document.getElementById('drawer-type-manage').classList.remove('active');
  },

  // ========== Generic Confirm/Prompt ==========
  genericConfirmCallback: null,
  genericPromptCallback: null,

  showConfirm(title, text, callback, btnText = '确认') {
    this.genericConfirmCallback = callback;
    document.getElementById('generic-confirm-title').textContent = title;
    document.getElementById('generic-confirm-text').textContent = text;
    document.getElementById('generic-confirm-btn').textContent = btnText;
    this.openModal('modal-generic-confirm');
  },

  execGenericConfirm() {
    this.closeModal('modal-generic-confirm');
    if (this.genericConfirmCallback) {
      this.genericConfirmCallback();
      this.genericConfirmCallback = null;
    }
  },

  showPrompt(title, desc, placeholder, defaultValue, callback) {
    this.genericPromptCallback = callback;
    document.getElementById('generic-prompt-title').textContent = title;
    document.getElementById('generic-prompt-desc').textContent = desc;
    const input = document.getElementById('generic-prompt-input');
    input.placeholder = placeholder || '';
    input.value = defaultValue || '';
    this.openModal('modal-generic-prompt');
    setTimeout(() => input.focus(), 100);
  },

  execGenericPrompt() {
    const value = document.getElementById('generic-prompt-input').value.trim();
    this.closeModal('modal-generic-prompt');
    if (this.genericPromptCallback) {
      this.genericPromptCallback(value);
      this.genericPromptCallback = null;
    }
  },

  // ========== Course List ==========
  renderTypeFilter() {
    const container = document.getElementById('type-options');
    const buildOptions = (types, level = 0) => {
      let html = '';
      types.forEach(t => {
        const indent = level * 16;
        html += `
          <label class="multi-select-option" style="padding-left:${12 + indent}px">
            <input type="checkbox" value="${t.id}" data-name="${t.name}" onchange="app.onTypeCheckboxChange()">
            <span>${t.name}</span>
          </label>`;
        if (t.children && t.children.length) {
          html += buildOptions(t.children, level + 1);
        }
      });
      return html;
    };
    container.innerHTML = buildOptions(this.courseTypes);
    this.updateTypeSelectLabel();
  },

  toggleTypeDropdown(e) {
    e.stopPropagation();
    const dropdown = document.getElementById('type-dropdown');
    dropdown.classList.toggle('active');
    if (dropdown.classList.contains('active')) {
      document.addEventListener('click', this.closeTypeDropdownOnClickOutside, { once: true });
    }
  },

  closeTypeDropdownOnClickOutside(e) {
    const wrapper = document.getElementById('type-multi-select');
    if (wrapper && !wrapper.contains(e.target)) {
      document.getElementById('type-dropdown').classList.remove('active');
    }
  },

  onTypeCheckboxChange() {
    this.updateTypeSelectLabel();
  },

  updateTypeSelectLabel() {
    const checked = Array.from(document.querySelectorAll('#type-options input[type="checkbox"]:checked'));
    const label = document.getElementById('type-select-label');
    if (checked.length === 0) {
      label.textContent = '全部类型';
    } else if (checked.length <= 2) {
      label.textContent = checked.map(cb => cb.dataset.name).join('、');
    } else {
      label.textContent = `已选 ${checked.length} 项`;
    }
  },

  filterTypeOptions(keyword) {
    const kw = keyword.toLowerCase();
    document.querySelectorAll('#type-options .multi-select-option').forEach(el => {
      const text = el.textContent.toLowerCase();
      el.style.display = text.includes(kw) ? 'flex' : 'none';
    });
  },

  clearTypeSelection() {
    document.querySelectorAll('#type-options input[type="checkbox"]').forEach(cb => cb.checked = false);
    this.updateTypeSelectLabel();
    this.filterCourses();
  },

  confirmTypeSelection() {
    document.getElementById('type-dropdown').classList.remove('active');
    this.filterCourses();
  },

  getSelectedTypeIds() {
    return Array.from(document.querySelectorAll('#type-options input[type="checkbox"]:checked')).map(cb => cb.value);
  },

  getFilteredCourses() {
    const keyword = (document.getElementById('list-search').value || '').toLowerCase();
    const selectedTypeIds = this.getSelectedTypeIds();
    const status = document.getElementById('list-status-filter').value;
    const dateFrom = document.getElementById('list-date-from').value;
    const dateTo = document.getElementById('list-date-to').value;

    return this.courses.filter(c => {
      if (keyword && !c.name.toLowerCase().includes(keyword)) return false;
      if (selectedTypeIds.length > 0 && !selectedTypeIds.some(id => c.type.includes(id))) return false;
      if (status && c.status !== status) return false;
      if (dateFrom && c.updateTime < dateFrom + ' 00:00:00') return false;
      if (dateTo && c.updateTime > dateTo + ' 23:59:59') return false;
      return true;
    });
  },

  renderCourseTable() {
    const filtered = this.getFilteredCourses();
    this.listTotal = filtered.length;
    const start = (this.listPage - 1) * this.listPageSize;
    const pageData = filtered.slice(start, start + this.listPageSize);

    const statusMap = {
      published: { label: '已上架', cls: 'tag-success' },
      draft: { label: '草稿', cls: 'tag-info' },
      off: { label: '已下架', cls: 'tag-default' }
    };

    const getToggleLabel = (status) => {
      if (status === 'published') return '下架';
      return '上架';
    };

    const getTypeNames = (typeIds) => {
      const names = [];
      const seen = new Set();
      for (const tid of typeIds) {
        for (const root of this.courseTypes) {
          if (root.id === tid && !seen.has(root.name)) {
            names.push(root.name);
            seen.add(root.name);
          }
          for (const child of root.children) {
            if (child.id === tid && !seen.has(root.name)) {
              names.push(root.name);
              seen.add(root.name);
            }
          }
        }
      }
      return names.length > 0 ? names : [typeIds[0] || ''];
    };

    const html = `
      <table class="data-table">
        <thead>
          <tr>
            <th>序号</th>
            <th>课程名称</th>
            <th>课程类型</th>
            <th>课程状态</th>
            <th>课程讲师/机构</th>
            <th>课程节数</th>
            <th>课程评分</th>
            <th>学习人数</th>
            <th>课程更新时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          ${pageData.map((c, i) => {
            const st = statusMap[c.status] || statusMap.draft;
            const typeNames = getTypeNames(c.type);
            const typeLabels = typeNames.map(n => `<span class="tag tag-default">${n}</span>`).join('');
            const typeTooltip = typeNames.join('、');
            return `
              <tr>
                <td>${start + i + 1}</td>
                <td><strong>${c.name}</strong></td>
                <td>
                  <div class="tooltip-wrap">
                    <div class="type-tags">${typeLabels}</div>
                    <span class="tooltip-text">${typeTooltip}</span>
                  </div>
                </td>
                <td><span class="tag ${st.cls}">${st.label}</span></td>
                <td>${c.instructor}</td>
                <td>${c.sections}</td>
                <td>${c.rating || '-'}</td>
                <td>${c.learners || 0}</td>
                <td>${c.updateTime}</td>
                <td class="actions">
                  <button class="btn btn-ghost btn-sm" onclick="app.editCourse('${c.id}')">编辑</button>
                  <button class="btn btn-ghost btn-sm" onclick="app.toggleStatus('${c.id}')">${getToggleLabel(c.status)}</button>
                  <button class="btn btn-ghost btn-sm" onclick="app.viewCourseData('${c.id}')">课程数据</button>
                  <button class="btn btn-ghost btn-sm" style="color:var(--danger)" onclick="app.deleteCourse('${c.id}')">删除</button>
                </td>
              </tr>
            `;
          }).join('') || '<tr><td colspan="10"><div class="empty-state">暂无数据</div></td></tr>'}
        </tbody>
      </table>
    `;

    document.getElementById('course-table-container').innerHTML = html;
    this.renderPagination();
  },

  renderPagination() {
    const totalPages = Math.max(1, Math.ceil(this.listTotal / this.listPageSize));
    let html = `
      <button class="page-btn" ${this.listPage === 1 ? 'disabled' : ''} onclick="app.changePage(${this.listPage - 1})">上一页</button>
    `;
    for (let i = 1; i <= totalPages; i++) {
      html += `<button class="page-btn ${i === this.listPage ? 'active' : ''}" onclick="app.changePage(${i})">${i}</button>`;
    }
    html += `<button class="page-btn" ${this.listPage === totalPages ? 'disabled' : ''} onclick="app.changePage(${this.listPage + 1})">下一页</button>`;
    html += `<span class="text-sm text-stone-500 ml-2">共 ${this.listTotal} 条</span>`;
    document.getElementById('course-pagination').innerHTML = html;
  },

  changePage(p) {
    const totalPages = Math.ceil(this.listTotal / this.listPageSize);
    if (p < 1 || p > totalPages) return;
    this.listPage = p;
    this.renderCourseTable();
  },

  filterCourses() {
    this.listPage = 1;
    this.renderCourseTable();
  },

  // ========== Course CRUD ==========
  createCourse() {
    this.editingCourseId = null;
    this.tempCatalog = [];
    this.resetForm();
    document.getElementById('form-breadcrumb-title').textContent = '新建课程';
    this.goTo('course-form');
    this.switchFormTab('basic');
    this.renderCatalog();
    this.updateCatalogTabState();
  },

  editCourse(id) {
    const course = this.courses.find(c => c.id === id);
    if (!course) return;
    this.editingCourseId = id;
    document.getElementById('form-breadcrumb-title').textContent = '编辑课程';
    document.getElementById('course-name').value = course.name;
    document.getElementById('name-count').textContent = course.name.length;

    // Rich text description
    const descEl = document.getElementById('course-desc');
    if (descEl) descEl.innerHTML = course.description || '';

    // Cover
    const cover = document.getElementById('cover-preview');
    cover.innerHTML = `<img src="${course.cover}" alt=""><div class="cover-reupload">点击重新上传</div>`;
    cover.classList.add('has-image');

    // Type form multi-select
    document.querySelectorAll('#type-form-options input[type="checkbox"]').forEach(cb => {
      cb.checked = course.type.includes(cb.value);
    });
    this.updateTypeFormSelectLabel();

    // Ability multi-select
    this.setSelectedAbilityIds(course.abilities || []);

    // Org multi-select
    document.querySelectorAll('#org-options input[type="checkbox"]').forEach(cb => {
      cb.checked = course.departments.includes(cb.value);
    });
    this.updateOrgSelectLabel();

    // Instructor
    const instructorInput = document.getElementById('course-instructor');
    if (instructorInput) {
      instructorInput.value = course.instructor || '';
      document.getElementById('instructor-count').textContent = (course.instructor || '').length;
    }

    const catalog = this.catalogMap[id] || { chapters: [] };
    this.tempCatalog = JSON.parse(JSON.stringify(catalog.chapters || []));

    this.goTo('course-form');
    this.switchFormTab('basic');
    this.renderCatalog();
    this.updateCatalogTabState();
  },

  resetForm() {
    document.getElementById('course-name').value = '';
    document.getElementById('name-count').textContent = '0';
    const descEl = document.getElementById('course-desc');
    if (descEl) descEl.innerHTML = '';
    const cover = document.getElementById('cover-preview');
    cover.innerHTML = '<span class="cover-placeholder">点击上传封面</span>';
    cover.classList.remove('has-image');
    document.querySelectorAll('#type-form-options input[type="checkbox"]').forEach(cb => cb.checked = false);
    this.updateTypeFormSelectLabel();
    this.clearAbilitySelection();
    document.querySelectorAll('#org-options input[type="checkbox"]').forEach(cb => cb.checked = false);
    this.updateOrgSelectLabel();
    const instructorInput = document.getElementById('course-instructor');
    if (instructorInput) {
      instructorInput.value = '';
      document.getElementById('instructor-count').textContent = '0';
    }
    document.getElementById('cover-file-input').value = '';
  },

  bindNameCount() {
    const input = document.getElementById('course-name');
    if (input) {
      input.addEventListener('input', () => {
        document.getElementById('name-count').textContent = input.value.length;
        this.updateCatalogTabState();
      });
    }
  },

  bindInstructorCount() {
    const input = document.getElementById('course-instructor');
    if (input) {
      input.addEventListener('input', () => {
        document.getElementById('instructor-count').textContent = input.value.length;
        this.updateCatalogTabState();
      });
    }
  },

  bindDescInput() {
    const descEl = document.getElementById('course-desc');
    if (descEl) {
      descEl.addEventListener('input', () => {
        this.updateCatalogTabState();
      });
    }
  },

  // ========== Cover Upload ==========
  handleCoverUpload(input) {
    const file = input.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.toast('请选择图片文件', 'error');
      input.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.toast('图片大小不能超过5MB', 'error');
      input.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = document.getElementById('cover-preview');
      preview.innerHTML = `<img src="${e.target.result}" alt=""><div class="cover-reupload">点击重新上传</div>`;
      preview.classList.add('has-image');
      this.updateCatalogTabState();
    };
    reader.readAsDataURL(file);
  },

  // ========== Rich Text Editor ==========
  execRichCommand(command) {
    document.execCommand(command, false, null);
    document.getElementById('course-desc').focus();
  },

  execSectionRichCommand(command) {
    document.execCommand(command, false, null);
    document.getElementById('section-text-content').focus();
  },

  // ========== Course Type Form Multi Select ==========
  renderCourseTypeSelect() {
    const container = document.getElementById('type-form-options');
    const buildOptions = (types, level = 0) => {
      let html = '';
      types.forEach(t => {
        const indent = level * 16;
        html += `
          <label class="org-multi-option" style="padding-left:${12 + indent}px" data-name="${t.name}">
            <input type="checkbox" value="${t.id}" data-name="${t.name}" onchange="app.onTypeFormCheckboxChange()">
            <span>${t.name}</span>
          </label>`;
        if (t.children && t.children.length) {
          html += buildOptions(t.children, level + 1);
        }
      });
      return html;
    };
    container.innerHTML = buildOptions(this.courseTypes);
    this.updateTypeFormSelectLabel();
  },

  toggleTypeFormDropdown(e) {
    e.stopPropagation();
    const dropdown = document.getElementById('type-form-dropdown');
    dropdown.classList.toggle('active');
    if (dropdown.classList.contains('active')) {
      document.addEventListener('click', this.closeTypeFormDropdownOnClickOutside, { once: true });
    }
  },

  closeTypeFormDropdownOnClickOutside(e) {
    const wrapper = document.getElementById('type-form-multi-select');
    if (wrapper && !wrapper.contains(e.target)) {
      document.getElementById('type-form-dropdown').classList.remove('active');
    }
  },

  onTypeFormCheckboxChange() {
    this.updateTypeFormSelectLabel();
    this.updateCatalogTabState();
  },

  updateTypeFormSelectLabel() {
    const checked = Array.from(document.querySelectorAll('#type-form-options input[type="checkbox"]:checked'));
    const label = document.getElementById('type-form-select-label');
    if (checked.length === 0) {
      label.innerHTML = '<span class="trigger-placeholder">请选择课程类型</span>';
    } else {
      label.innerHTML = checked.map(cb =>
        `<span class="trigger-tag">${cb.dataset.name}<span class="remove" onclick="app.removeTypeFormTag('${cb.value}', event)">×</span></span>`
      ).join('');
    }
  },

  removeTypeFormTag(id, event) {
    if (event) event.stopPropagation();
    const cb = document.querySelector(`#type-form-options input[type="checkbox"][value="${id}"]`);
    if (cb) {
      cb.checked = false;
      this.updateTypeFormSelectLabel();
    }
  },

  filterTypeFormOptions(keyword) {
    const kw = keyword.toLowerCase();
    document.querySelectorAll('#type-form-options .org-multi-option').forEach(el => {
      const text = el.dataset.name.toLowerCase();
      el.style.display = text.includes(kw) ? 'flex' : 'none';
    });
  },

  clearTypeFormSelection() {
    document.querySelectorAll('#type-form-options input[type="checkbox"]').forEach(cb => cb.checked = false);
    this.updateTypeFormSelectLabel();
  },

  confirmTypeFormSelection() {
    document.getElementById('type-form-dropdown').classList.remove('active');
  },

  getSelectedTypeFormIds() {
    return Array.from(document.querySelectorAll('#type-form-options input[type="checkbox"]:checked')).map(cb => cb.value);
  },

  // ========== Ability Multi Select ==========
  abilityDimensions: [...MOCK_ABILITY_DIMENSIONS],

  renderAbilityOptions() {
    const container = document.getElementById('ability-options');
    if (!container) return;
    container.innerHTML = this.abilityDimensions.map(a => `
      <label class="ability-multi-option" data-name="${a.name}">
        <input type="checkbox" value="${a.id}" data-name="${a.name}" onchange="app.onAbilityCheckboxChange()">
        <span>${a.name}</span>
      </label>
    `).join('');
  },

  toggleAbilityDropdown(e) {
    e.stopPropagation();
    const dropdown = document.getElementById('ability-dropdown');
    dropdown.classList.toggle('active');
    if (dropdown.classList.contains('active')) {
      document.addEventListener('click', this.closeAbilityDropdownOnClickOutside, { once: true });
    }
  },

  closeAbilityDropdownOnClickOutside(e) {
    const wrapper = document.getElementById('ability-multi-select');
    if (wrapper && !wrapper.contains(e.target)) {
      document.getElementById('ability-dropdown').classList.remove('active');
    }
  },

  onAbilityCheckboxChange() {
    this.updateAbilitySelectLabel();
  },

  updateAbilitySelectLabel() {
    const checked = Array.from(document.querySelectorAll('#ability-options input[type="checkbox"]:checked'));
    const label = document.getElementById('ability-select-label');
    if (checked.length === 0) {
      label.innerHTML = '<span class="trigger-placeholder">请选择能力维度（可多选）</span>';
    } else {
      label.innerHTML = checked.map(cb =>
        `<span class="trigger-tag">${cb.dataset.name}<span class="remove" onclick="app.removeAbilityTag('${cb.value}', event)">×</span></span>`
      ).join('');
    }
  },

  removeAbilityTag(id, event) {
    if (event) event.stopPropagation();
    const cb = document.querySelector(`#ability-options input[type="checkbox"][value="${id}"]`);
    if (cb) {
      cb.checked = false;
      this.updateAbilitySelectLabel();
    }
  },

  clearAbilitySelection() {
    document.querySelectorAll('#ability-options input[type="checkbox"]').forEach(cb => cb.checked = false);
    this.updateAbilitySelectLabel();
  },

  confirmAbilitySelection() {
    document.getElementById('ability-dropdown').classList.remove('active');
  },

  getSelectedAbilityIds() {
    return Array.from(document.querySelectorAll('#ability-options input[type="checkbox"]:checked')).map(cb => cb.value);
  },

  setSelectedAbilityIds(ids) {
    document.querySelectorAll('#ability-options input[type="checkbox"]').forEach(cb => {
      cb.checked = ids.includes(cb.value);
    });
    this.updateAbilitySelectLabel();
  },

  // ========== Ability Dimension Management ==========
  openAbilityDrawer() {
    this.renderAbilityList();
    document.getElementById('drawer-overlay-ability').classList.add('active');
    document.getElementById('drawer-ability-manage').classList.add('active');
  },
  closeAbilityDrawer() {
    document.getElementById('drawer-overlay-ability').classList.remove('active');
    document.getElementById('drawer-ability-manage').classList.remove('active');
  },
  renderAbilityList() {
    const container = document.getElementById('ability-list-container');
    if (!container) return;
    container.innerHTML = this.abilityDimensions.map(a => `
      <div class="py-2 border-b border-stone-100 flex items-center justify-between">
        <span class="text-sm font-medium">${a.name}${a.system ? ' <span class="text-xs text-stone-400">(系统)</span>' : ''}</span>
        <div class="flex gap-1">
          ${a.system ? '' : `<button class="btn btn-ghost btn-sm" onclick="app.editAbilityName('${a.id}')">编辑</button><button class="btn btn-ghost btn-sm" style="color:var(--danger)" onclick="app.deleteAbility('${a.id}')">删除</button>`}
        </div>
      </div>
    `).join('');
  },
  addAbilityDimension() {
    const name = document.getElementById('new-ability-name').value.trim();
    if (!name) { this.toast('请输入维度名称', 'error'); return; }
    this.abilityDimensions.push({ id: 'ability-' + Date.now(), name, system: false });
    document.getElementById('new-ability-name').value = '';
    this.renderAbilityList();
    this.renderAbilityOptions();
    this.toast('能力维度添加成功', 'success');
  },
  editAbilityName(id) {
    const item = this.abilityDimensions.find(a => a.id === id);
    if (!item || item.system) return;
    this.showPrompt('重命名维度', '请输入新的维度名称', '维度名称', item.name, (name) => {
      if (!name) return;
      item.name = name;
      this.renderAbilityList();
      this.renderAbilityOptions();
      this.toast('维度已重命名', 'success');
    });
  },
  deleteAbility(id) {
    const item = this.abilityDimensions.find(a => a.id === id);
    if (!item || item.system) { this.toast('系统维度不可删除', 'error'); return; }
    const hasCourses = this.courses.some(c => c.abilities && c.abilities.includes(id));
    if (hasCourses) {
      this.toast('该维度已被课程关联，无法删除', 'error');
      return;
    }
    this.showConfirm('确认删除', '确定删除该能力维度吗？', () => {
      this.abilityDimensions = this.abilityDimensions.filter(a => a.id !== id);
      this.renderAbilityList();
      this.renderAbilityOptions();
      this.toast('维度已删除', 'success');
    });
  },

  // ========== AI Smart Import ==========
  aiImportFiles: [],
  aiImportMatches: [],
  aiImportPhase: 'upload', // upload | analyzing | results

  openAIImportModal() {
    this.aiImportFiles = [];
    this.aiImportMatches = [];
    this.aiImportPhase = 'upload';
    this.renderAIImportUpload();
    this.setAIImportPhase('upload');
    this.openModal('modal-ai-import');
  },
  closeAIImportModal() {
    this.closeModal('modal-ai-import');
    this.aiImportFiles = [];
    this.aiImportMatches = [];
    this.aiImportPhase = 'upload';
  },
  setAIImportPhase(phase) {
    this.aiImportPhase = phase;
    document.getElementById('ai-import-phase-upload').style.display = phase === 'upload' ? '' : 'none';
    document.getElementById('ai-import-phase-analyzing').style.display = phase === 'analyzing' ? '' : 'none';
    document.getElementById('ai-import-phase-results').style.display = phase === 'results' ? '' : 'none';
    document.getElementById('ai-import-btn-analyze').style.display = phase === 'upload' ? '' : 'none';
    document.getElementById('ai-import-btn-confirm').style.display = phase === 'results' ? '' : 'none';
    if (phase === 'upload') {
      document.getElementById('ai-import-btn-analyze').disabled = this.aiImportFiles.length === 0;
    }
  },
  renderAIImportUpload() {
    const container = document.getElementById('ai-import-file-list');
    if (!container) return;
    container.innerHTML = this.aiImportFiles.map((f, idx) => `
      <div class="ai-import-file-item">
        <div class="ai-import-file-icon ${f.type}">${f.type === 'video' ? '视' : '档'}</div>
        <div class="ai-import-file-name">${f.name}</div>
        <div class="ai-import-file-size">${this.formatFileSize(f.size)}</div>
        <div class="ai-import-file-remove" onclick="app.removeAIImportFile(${idx})">×</div>
      </div>
    `).join('');
    const btn = document.getElementById('ai-import-btn-analyze');
    if (btn) btn.disabled = this.aiImportFiles.length === 0;
  },
  formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  },
  handleAIImportUpload(input) {
    const files = Array.from(input.files || []);
    if (!files.length) return;
    const videoExts = ['mp4', 'wmv', 'avi', 'mov', 'flv', 'rmvb', '3gp', 'm4v', 'mkv'];
    const docExts = ['pdf', 'pptx', 'ppt', 'docx', 'doc', 'xlsx', 'xls', 'jpg', 'jpeg', 'png'];
    files.forEach(file => {
      const ext = file.name.split('.').pop().toLowerCase();
      let type = null;
      if (videoExts.includes(ext)) type = 'video';
      else if (docExts.includes(ext)) type = 'document';
      if (!type) return;
      this.aiImportFiles.push({ name: file.name, size: file.size, type, ext });
    });
    this.renderAIImportUpload();
    input.value = '';
  },
  removeAIImportFile(idx) {
    this.aiImportFiles.splice(idx, 1);
    this.renderAIImportUpload();
  },
  startAIAnalysis() {
    if (this.aiImportFiles.length === 0) return;
    this.setAIImportPhase('analyzing');
    setTimeout(() => {
      this.performAIMatching();
      this.setAIImportPhase('results');
      this.renderAIImportResults();
    }, 1500);
  },
  performAIMatching() {
    const existingChapters = (this.tempCatalog || []).filter(c => c.children);
    const normalizeChNum = (str) => {
      const cnNums = { '一':1,'二':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9,'十':10 };
      let m = str.match(/第\s*([一二三四五六七八九十0-9]+)\s*章/);
      if (!m) m = str.match(/Chapter\s*([0-9]+)/i);
      if (!m) m = str.match(/^\s*([0-9]+)[\.\-_]/);
      if (!m) return null;
      let n = m[1];
      if (cnNums[n]) return cnNums[n];
      let sum = 0;
      for (let ch of n) {
        if (cnNums[ch]) {
          if (ch === '十') sum = sum === 0 ? 10 : sum + 10;
          else sum += cnNums[ch];
        }
      }
      return sum || parseInt(m[1], 10) || null;
    };
    const extractCoreName = (name) => {
      return name.replace(/^第\s*[一二三四五六七八九十0-9]+\s*章[\.\-_\s]*/, '').replace(/^Chapter\s*[0-9]+[\.\-_\s]*/i, '').trim().toLowerCase();
    };
    this.aiImportMatches = this.aiImportFiles.map((f, idx) => {
      const nameWithoutExt = f.name.replace(/\.[^.]+$/, '');
      let matchedChapter = null;
      let bestScore = 0;
      const fileChNum = normalizeChNum(nameWithoutExt);
      const fileCore = extractCoreName(nameWithoutExt);
      // Try to match against existing chapters
      for (const ch of existingChapters) {
        let score = 0;
        const chNum = normalizeChNum(ch.name);
        const chCore = extractCoreName(ch.name);
        // Number match is strong signal
        if (fileChNum !== null && chNum !== null && fileChNum === chNum) {
          score += 100;
        }
        // Name containment match
        if (chCore && fileCore.includes(chCore)) {
          score += 50;
        }
        if (fileCore && chCore.includes(fileCore)) {
          score += 40;
        }
        // Direct name similarity (fuzzy)
        if (chCore === fileCore) {
          score += 30;
        }
        if (score > bestScore) {
          bestScore = score;
          matchedChapter = ch;
        }
      }
      let chapterName, sectionName;
      if (matchedChapter && bestScore >= 50) {
        chapterName = matchedChapter.name;
        sectionName = fileCore || nameWithoutExt;
      } else {
        // Fallback: parse chapter from filename
        const chMatch = nameWithoutExt.match(/第[一二三四五六七八九十0-9]+章/);
        const numMatch = nameWithoutExt.match(/^[0-9]+[\.\-_]/);
        const chEnMatch = nameWithoutExt.match(/Chapter\s+[0-9]+/i);
        if (chMatch) {
          chapterName = chMatch[0];
          sectionName = nameWithoutExt.replace(chMatch[0], '').replace(/^[\.\-_\s]+/, '');
        } else if (numMatch) {
          const num = numMatch[0].replace(/[\.\-_]$/, '');
          chapterName = '第' + num + '章';
          sectionName = nameWithoutExt.replace(numMatch[0], '').replace(/^[\.\-_\s]+/, '');
        } else if (chEnMatch) {
          chapterName = chEnMatch[0];
          sectionName = nameWithoutExt.replace(chEnMatch[0], '').replace(/^[\.\-_\s]+/, '');
        } else {
          chapterName = '导入内容';
          sectionName = nameWithoutExt;
        }
      }
      // Clean up section name
      sectionName = sectionName.replace(/^[\.\-_\s]+/, '').replace(/[\.\-_\s]+$/, '');
      if (!sectionName) sectionName = f.name.replace(/\.[^.]+$/, '');
      return {
        idx,
        name: f.name,
        type: f.type,
        chapterName,
        sectionName,
        chapterId: matchedChapter ? matchedChapter.id : null
      };
    });
  },
  renderAIImportResults() {
    const tbody = document.getElementById('ai-import-result-body');
    const countEl = document.getElementById('ai-import-result-count');
    if (!tbody) return;
    countEl.textContent = this.aiImportMatches.length;
    const existingChapters = (this.tempCatalog || []).filter(c => c.children);
    const datalistId = 'ai-import-chapter-datalist';
    tbody.innerHTML = `
      <datalist id="${datalistId}">
        ${existingChapters.map(ch => `<option value="${ch.name}"></option>`).join('')}
      </datalist>
    ` + this.aiImportMatches.map(m => {
      const isExisting = m.chapterId && existingChapters.some(c => c.id === m.chapterId);
      return `
      <tr>
        <td>
          <div class="flex items-center gap-2">
            <span class="section-type-icon ${m.type}">${m.type === 'video' ? '视' : '档'}</span>
            <span class="text-sm">${m.name}</span>
          </div>
        </td>
        <td><span class="text-sm">${m.type === 'video' ? '视频' : '文档'}</span></td>
        <td>
          <div class="flex items-center gap-2">
            <input type="text" class="ai-import-input" style="flex:1" value="${m.chapterName}" list="${datalistId}" onchange="app.updateAIMatchChapter(${m.idx}, this.value)">
            ${isExisting ? '<span class="text-xs px-1.5 py-0.5 rounded bg-primary-lighter text-primary" style="white-space:nowrap">已有</span>' : '<span class="text-xs px-1.5 py-0.5 rounded bg-stone-100 text-stone-500" style="white-space:nowrap">新建</span>'}
          </div>
        </td>
        <td><input type="text" class="ai-import-input" value="${m.sectionName}" onchange="app.updateAIMatchSectionName(${m.idx}, this.value)"></td>
        <td><button class="btn btn-ghost btn-sm" style="color:var(--danger)" onclick="app.removeAIMatch(${m.idx})">删除</button></td>
      </tr>
    `;
    }).join('');
  },
  updateAIMatchChapter(idx, value) {
    const match = this.aiImportMatches.find(m => m.idx === idx);
    if (!match) return;
    const trimmed = value.trim();
    match.chapterName = trimmed;
    // Check if the typed name matches an existing chapter
    const existing = (this.tempCatalog || []).find(c => c.children && c.name === trimmed);
    if (existing) {
      match.chapterId = existing.id;
    } else {
      match.chapterId = null;
    }
    this.renderAIImportResults();
  },
  updateAIMatchSectionName(idx, value) {
    const match = this.aiImportMatches.find(m => m.idx === idx);
    if (match) match.sectionName = value.trim();
  },
  removeAIMatch(idx) {
    this.aiImportMatches = this.aiImportMatches.filter(m => m.idx !== idx);
    this.renderAIImportResults();
  },
  confirmAIImport() {
    if (this.aiImportMatches.length === 0) {
      this.toast('没有可导入的内容', 'error');
      return;
    }
    // Group by chapter (use chapterId as key if matched, otherwise use chapterName)
    const chapterMap = {};
    this.aiImportMatches.forEach(m => {
      const chKey = m.chapterId || (m.chapterName || '导入内容');
      if (!chapterMap[chKey]) {
        chapterMap[chKey] = { name: m.chapterName || '导入内容', id: m.chapterId, sections: [] };
      }
      chapterMap[chKey].sections.push(m);
    });
    // Create or update chapters
    Object.values(chapterMap).forEach(({ name, id, sections }) => {
      let chapter = null;
      if (id) {
        chapter = this.tempCatalog.find(c => c.children && c.id === id);
      }
      if (!chapter) {
        chapter = this.tempCatalog.find(c => c.children && c.name === name);
      }
      if (!chapter) {
        chapter = {
          id: 'ch' + Date.now() + Math.random().toString(36).substr(2, 5),
          name: name,
          sort: this.tempCatalog.length + 1,
          children: []
        };
        this.tempCatalog.push(chapter);
      }
      sections.forEach(s => {
        chapter.children.push({
          id: 's' + Date.now() + Math.random().toString(36).substr(2, 5),
          name: s.sectionName || s.name.replace(/\.[^.]+$/, ''),
          type: s.type,
          resources: [],
          materials: 0
        });
      });
    });
    this.renderCatalog();
    this.updateCatalogTabState();
    this.closeAIImportModal();
    this.toast(`成功导入 ${this.aiImportMatches.length} 个课件到 ${Object.keys(chapterMap).length} 个章节`, 'success');
  },

  // ========== Org Multi Select ==========
  renderOrgSelector() {
    const container = document.getElementById('org-options');
    const buildOptions = (orgs, level = 0) => {
      let html = '';
      orgs.forEach(o => {
        const indent = level * 16;
        html += `
          <label class="org-multi-option" style="padding-left:${12 + indent}px" data-name="${o.name}">
            <input type="checkbox" value="${o.id}" data-name="${o.name}" onchange="app.onOrgCheckboxChange()">
            <span>${o.name}</span>
          </label>`;
        if (o.children && o.children.length) {
          html += buildOptions(o.children, level + 1);
        }
      });
      return html;
    };
    container.innerHTML = buildOptions(this.organizations);
    this.updateOrgSelectLabel();
  },

  toggleOrgDropdown(e) {
    e.stopPropagation();
    const dropdown = document.getElementById('org-dropdown');
    dropdown.classList.toggle('active');
    if (dropdown.classList.contains('active')) {
      document.addEventListener('click', this.closeOrgDropdownOnClickOutside, { once: true });
    }
  },

  closeOrgDropdownOnClickOutside(e) {
    const wrapper = document.getElementById('org-multi-select');
    if (wrapper && !wrapper.contains(e.target)) {
      document.getElementById('org-dropdown').classList.remove('active');
    }
  },

  onOrgCheckboxChange() {
    this.updateOrgSelectLabel();
    this.updateCatalogTabState();
  },

  updateOrgSelectLabel() {
    const checked = Array.from(document.querySelectorAll('#org-options input[type="checkbox"]:checked'));
    const label = document.getElementById('org-select-label');
    if (checked.length === 0) {
      label.innerHTML = '<span class="trigger-placeholder">请选择部门</span>';
    } else {
      label.innerHTML = checked.map(cb =>
        `<span class="trigger-tag">${cb.dataset.name}<span class="remove" onclick="app.removeOrgTag('${cb.value}', event)">×</span></span>`
      ).join('');
    }
  },

  removeOrgTag(id, event) {
    if (event) event.stopPropagation();
    const cb = document.querySelector(`#org-options input[type="checkbox"][value="${id}"]`);
    if (cb) {
      cb.checked = false;
      this.updateOrgSelectLabel();
    }
  },

  filterOrgOptions(keyword) {
    const kw = keyword.toLowerCase();
    document.querySelectorAll('#org-options .org-multi-option').forEach(el => {
      const text = el.dataset.name.toLowerCase();
      el.style.display = text.includes(kw) ? 'flex' : 'none';
    });
  },

  clearOrgSelection() {
    document.querySelectorAll('#org-options input[type="checkbox"]').forEach(cb => cb.checked = false);
    this.updateOrgSelectLabel();
  },

  confirmOrgSelection() {
    document.getElementById('org-dropdown').classList.remove('active');
  },

  getSelectedOrgIds() {
    return Array.from(document.querySelectorAll('#org-options input[type="checkbox"]:checked')).map(cb => cb.value);
  },

  saveCourse(targetStatus) {
    const name = document.getElementById('course-name').value.trim();
    const descEl = document.getElementById('course-desc');
    const desc = descEl ? descEl.innerHTML.trim() : '';
    const coverEl = document.querySelector('#cover-preview img');
    const cover = coverEl ? coverEl.src : '';
    const instructor = document.getElementById('course-instructor').value.trim();

    const selectedTypes = this.getSelectedTypeFormIds();
    const selectedDepts = this.getSelectedOrgIds();
    const selectedAbilities = this.getSelectedAbilityIds();

    if (!name) { this.toast('请输入课程名称', 'error'); return; }
    if (!cover) { this.toast('请上传课程封面', 'error'); return; }
    if (!desc || desc === '<br>') { this.toast('请输入课程介绍', 'error'); return; }
    if (selectedTypes.length === 0) { this.toast('请选择课程类型', 'error'); return; }
    if (selectedAbilities.length === 0) { this.toast('请选择能力维度', 'error'); return; }
    if (selectedDepts.length === 0) { this.toast('请选择课程提供部门', 'error'); return; }
    if (!instructor) { this.toast('请输入课程讲师/机构', 'error'); return; }

    const typeNames = [];
    this.courseTypes.forEach(t => {
      if (selectedTypes.includes(t.id)) typeNames.push(t.name);
      t.children.forEach(c => {
        if (selectedTypes.includes(c.id)) typeNames.push(t.name + ' / ' + c.name);
      });
    });

    const rootTypeName = this.getRootTypeName(selectedTypes);
    const now = new Date();
    const timeStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0') + ':00';

    if (this.editingCourseId) {
      const idx = this.courses.findIndex(c => c.id === this.editingCourseId);
      if (idx >= 0) {
        this.courses[idx] = {
          ...this.courses[idx],
          name,
          description: desc,
          cover,
          type: selectedTypes,
          typeName: typeNames[0] || '',
          rootTypeName,
          departments: selectedDepts,
          abilities: selectedAbilities,
          instructor,
          status: targetStatus,
          updateTime: timeStr,
          sections: this.countSections()
        };
        this.catalogMap[this.editingCourseId] = { chapters: this.tempCatalog };
      }
      this.toast('课程更新成功', 'success');
    } else {
      const newId = 'c' + (Date.now() % 10000);
      this.courses.unshift({
        id: newId,
        name,
        type: selectedTypes,
        typeName: typeNames[0] || '',
        rootTypeName,
        status: targetStatus,
        instructor,
        sections: this.countSections(),
        rating: 0,
        learners: 0,
        updateTime: timeStr,
        cover,
        description: desc,
        departments: selectedDepts,
        abilities: selectedAbilities,
        creator: '当前用户',
        creatorPhone: '13800000000'
      });
      this.catalogMap[newId] = { chapters: this.tempCatalog };
      this.toast('课程创建成功', 'success');
    }

    this.goToList();
  },

  countSections() {
    let count = 0;
    this.tempCatalog.forEach(item => {
      if (item.children) {
        count += item.children.length;
      } else {
        count += 1;
      }
    });
    return count;
  },

  getRootTypeName(selectedTypes) {
    for (const typeId of selectedTypes) {
      for (const root of this.courseTypes) {
        if (root.id === typeId) return root.name;
        for (const child of root.children) {
          if (child.id === typeId) return root.name;
        }
      }
    }
    return '';
  },

  deleteCourse(id) {
    const course = this.courses.find(c => c.id === id);
    if (!course) return;
    if (course.status === 'published') {
      this.toast('请先下架课程再删除', 'warning');
      return;
    }
    this.deleteTargetId = id;
    document.getElementById('delete-course-name').textContent = course.name;
    this.openModal('modal-delete');
  },

  confirmDelete() {
    if (this.deleteTargetId) {
      this.courses = this.courses.filter(c => c.id !== this.deleteTargetId);
      delete this.catalogMap[this.deleteTargetId];
      this.toast('课程已删除', 'success');
      this.deleteTargetId = null;
      this.closeModal('modal-delete');
      this.renderCourseTable();
    }
  },

  toggleStatus(id) {
    const course = this.courses.find(c => c.id === id);
    if (!course) return;
    this.toggleTargetId = id;
    const action = course.status === 'published' ? '下架' : '上架';
    document.getElementById('toggle-status-text').textContent = `确定要${action}该课程吗？`;
    this.openModal('modal-toggle-status');
  },

  confirmToggleStatus() {
    if (this.toggleTargetId) {
      const course = this.courses.find(c => c.id === this.toggleTargetId);
      if (course) {
        course.status = course.status === 'published' ? 'off' : 'published';
        const action = course.status === 'published' ? '上架' : '下架';
        this.toast(`课程已${action}`, 'success');
      }
      this.toggleTargetId = null;
      this.closeModal('modal-toggle-status');
      this.renderCourseTable();
    }
  },

  // ========== Course Form Tabs ==========
  checkBasicFormValid() {
    const name = document.getElementById('course-name').value.trim();
    const coverEl = document.querySelector('#cover-preview img');
    const descEl = document.getElementById('course-desc');
    const desc = descEl ? descEl.innerHTML.trim() : '';
    const instructor = document.getElementById('course-instructor').value.trim();
    const selectedTypes = this.getSelectedTypeFormIds();
    const selectedDepts = this.getSelectedOrgIds();
    return !!name && !!coverEl && !!desc && desc !== '<br>' && selectedTypes.length > 0 && selectedDepts.length > 0 && !!instructor;
  },

  updateCatalogTabState() {
    const tab = document.querySelector('#page-course-form .tab[data-tab="catalog"]');
    if (!tab) return;
    if (this.checkBasicFormValid()) {
      tab.classList.remove('disabled');
    } else {
      tab.classList.add('disabled');
    }
  },

  switchFormTab(tab) {
    if (tab === 'catalog') {
      if (!this.checkBasicFormValid()) {
        this.toast('请先完善基本信息', 'warning');
        return;
      }
    }
    document.querySelectorAll('#page-course-form .tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('#page-course-form .tab-content').forEach(t => t.classList.remove('active'));
    document.querySelector(`#page-course-form .tab[data-tab="${tab}"]`).classList.add('active');
    document.getElementById('tab-' + tab).classList.add('active');
  },

  // ========== Type & Dept Selectors ==========
  // Replaced by renderCourseTypeSelect() and renderOrgSelector()

  // ========== Course Catalog ==========
  renderCatalog() {
    const container = document.getElementById('catalog-container');
    const empty = document.getElementById('catalog-empty');

    if (this.tempCatalog.length === 0) {
      container.innerHTML = '';
      empty.style.display = 'block';
      return;
    }
    empty.style.display = 'none';

    container.innerHTML = this.tempCatalog.map((item) => {
      if (item.children) {
        const hasChildren = item.children && item.children.length > 0;
        return `
        <div class="chapter-item">
          <div class="chapter-header">
            <div class="chapter-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              ${item.name}
            </div>
            <div class="chapter-actions">
              <button class="btn btn-ghost btn-sm" onclick="app.editChapter('${item.id}')">重命名</button>
              <button class="btn btn-ghost btn-sm" onclick="app.deleteChapter('${item.id}')">删除</button>
              <button class="btn btn-primary btn-sm" onclick="app.addSection('${item.id}')">+ 添加课件</button>
            </div>
          </div>
          <div class="section-list">
            ${hasChildren ? item.children.map((s) => `
              <div class="section-item" draggable="true" data-chapter-id="${item.id}" data-section-id="${s.id}"
                ondragstart="app.handleSectionDragStart(event,'${item.id}','${s.id}')"
                ondragover="app.handleSectionDragOver(event)"
                ondrop="app.handleSectionDrop(event)"
                ondragenter="app.handleSectionDragEnter(event)"
                ondragleave="app.handleSectionDragLeave(event)">
                <div class="section-info">
                  <span class="section-drag-handle" title="拖拽排序">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>
                  </span>
                  <span class="section-type-icon ${s.type}">${s.type === 'text' ? '文' : s.type === 'video' ? '视' : '档'}</span>
                  <span>${s.name}</span>
                </div>
                <div class="actions">
                  <button class="btn btn-ghost btn-sm" onclick="app.editSection('${item.id}','${s.id}')">编辑</button>
                  <button class="btn btn-ghost btn-sm" style="color:var(--danger)" onclick="app.deleteSection('${item.id}','${s.id}')">删除</button>
                </div>
              </div>
            `).join('') : '<div class="text-sm text-stone-400 py-2">暂无内容</div>'}
          </div>
        </div>
        `;
      } else {
        return `
        <div class="section-item" style="margin-bottom:8px;">
          <div class="section-info">
            <span class="section-type-icon ${item.type}">${item.type === 'text' ? '文' : item.type === 'video' ? '视' : '档'}</span>
            <span>${item.name}</span>
          </div>
          <div class="actions">
            <button class="btn btn-ghost btn-sm" onclick="app.editRootSection('${item.id}')">编辑</button>
            <button class="btn btn-ghost btn-sm" style="color:var(--danger)" onclick="app.deleteRootSection('${item.id}')">删除</button>
          </div>
        </div>
        `;
      }
    }).join('');
  },

  // ========== Section Drag & Drop Sorting ==========
  handleSectionDragStart(e, chapterId, sectionId) {
    e.dataTransfer.setData('text/plain', JSON.stringify({ chapterId, sectionId }));
    e.dataTransfer.effectAllowed = 'move';
    const item = e.target.closest('.section-item');
    if (item) item.classList.add('dragging');
  },

  handleSectionDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  },

  handleSectionDragEnter(e) {
    const item = e.target.closest('.section-item');
    if (item && !item.classList.contains('dragging')) {
      item.classList.add('drag-over');
    }
  },

  handleSectionDragLeave(e) {
    const item = e.target.closest('.section-item');
    if (item) item.classList.remove('drag-over');
  },

  handleSectionDrop(e) {
    e.preventDefault();
    document.querySelectorAll('.section-item.dragging').forEach(el => el.classList.remove('dragging'));
    document.querySelectorAll('.section-item.drag-over').forEach(el => el.classList.remove('drag-over'));

    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      const dropItem = e.target.closest('.section-item');
      if (!dropItem) return;

      const targetChapterId = dropItem.dataset.chapterId;
      const targetSectionId = dropItem.dataset.sectionId;

      // 只允许同一章内拖拽排序
      if (data.chapterId !== targetChapterId) return;

      const chapter = this.tempCatalog.find(c => c.id === data.chapterId);
      if (!chapter || !chapter.children) return;

      const fromIndex = chapter.children.findIndex(s => s.id === data.sectionId);
      const toIndex = chapter.children.findIndex(s => s.id === targetSectionId);
      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return;

      const [moved] = chapter.children.splice(fromIndex, 1);
      chapter.children.splice(toIndex, 0, moved);
      this.renderCatalog();
    } catch (err) {
      // ignore
    }
  },

  addChapter() {
    this.showPrompt('添加章', '请输入章名称', '章名称', '', (name) => {
      if (!name) return;
      this.tempCatalog.push({
        id: 'ch' + Date.now(),
        name,
        sort: this.tempCatalog.length + 1,
        children: []
      });
      this.renderCatalog();
    });
  },

  editChapter(chId) {
    const ch = this.tempCatalog.find(c => c.id === chId);
    if (!ch) return;
    this.showPrompt('重命名章', '请输入新的章名称', '章名称', ch.name, (name) => {
      if (!name) return;
      ch.name = name;
      this.renderCatalog();
    });
  },

  deleteChapter(chId) {
    const ch = this.tempCatalog.find(c => c.id === chId);
    if (ch.children && ch.children.length > 0) {
      this.toast('该章下已有内容，不支持删除', 'warning');
      return;
    }
    this.showConfirm('确认删除', '确定删除该章吗？', () => {
      this.tempCatalog = this.tempCatalog.filter(c => c.id !== chId);
      this.renderCatalog();
    });
  },

  addSection(chId) {
    this.editingChapterId = chId;
    this.editingSectionId = null;
    document.getElementById('section-modal-title').textContent = '添加课件';
    document.getElementById('section-name').value = '';
    document.getElementById('section-text-content').innerHTML = '';
    document.getElementById('video-file-name').textContent = '';
    document.getElementById('document-file-name').textContent = '';
    document.getElementById('video-file-input').value = '';
    document.getElementById('document-file-input').value = '';
    document.querySelectorAll('input[name="section-type"]').forEach(r => {
      r.checked = false;
      r.disabled = false;
      const label = r.closest('label');
      if (label) label.classList.remove('section-type-disabled');
    });
    document.querySelector('input[name="section-type"][value="text"]').checked = true;
    this.changeSectionType('text');
    document.getElementById('materials-list').innerHTML = '';
    this.openModal('modal-section');
  },

  editSection(chId, sId) {
    const ch = this.tempCatalog.find(c => c.id === chId);
    const s = ch.children.find(x => x.id === sId);
    if (!s) return;
    this.editingChapterId = chId;
    this.editingSectionId = sId;
    document.getElementById('section-modal-title').textContent = '编辑课件';
    document.getElementById('section-name').value = s.name;
    document.getElementById('section-text-content').innerHTML = s.description || '';
    document.getElementById('video-file-name').textContent = s.videoFile || '';
    document.getElementById('document-file-name').textContent = s.docFile || '';
    document.querySelectorAll('input[name="section-type"]').forEach(r => {
      r.checked = r.value === s.type;
      r.disabled = true;
      const label = r.closest('label');
      if (label) label.classList.add('section-type-disabled');
    });
    this.changeSectionType(s.type);
    this.openModal('modal-section');
  },

  deleteSection(chId, sId) {
    this.showConfirm('确认删除', '确定删除该课件吗？', () => {
      const ch = this.tempCatalog.find(c => c.id === chId);
      ch.children = ch.children.filter(s => s.id !== sId);
      this.renderCatalog();
    });
  },

  addRootSection() {
    this.editingChapterId = null;
    this.editingSectionId = null;
    document.getElementById('section-modal-title').textContent = '添加课件';
    document.getElementById('section-name').value = '';
    document.getElementById('section-text-content').innerHTML = '';
    document.getElementById('video-file-name').textContent = '';
    document.getElementById('document-file-name').textContent = '';
    document.getElementById('video-file-input').value = '';
    document.getElementById('document-file-input').value = '';
    document.querySelectorAll('input[name="section-type"]').forEach(r => {
      r.checked = false;
      r.disabled = false;
      const label = r.closest('label');
      if (label) label.classList.remove('section-type-disabled');
    });
    document.querySelector('input[name="section-type"][value="text"]').checked = true;
    this.changeSectionType('text');
    document.getElementById('materials-list').innerHTML = '';
    this.openModal('modal-section');
  },

  editRootSection(sId) {
    const s = this.tempCatalog.find(x => x.id === sId);
    if (!s) return;
    this.editingChapterId = null;
    this.editingSectionId = sId;
    document.getElementById('section-modal-title').textContent = '编辑课件';
    document.getElementById('section-name').value = s.name;
    document.getElementById('section-text-content').innerHTML = s.description || '';
    document.getElementById('video-file-name').textContent = s.videoFile || '';
    document.getElementById('document-file-name').textContent = s.docFile || '';
    document.querySelectorAll('input[name="section-type"]').forEach(r => {
      r.checked = r.value === s.type;
    });
    this.changeSectionType(s.type);
    this.openModal('modal-section');
  },

  deleteRootSection(sId) {
    this.showConfirm('确认删除', '确定删除该课件吗？', () => {
      this.tempCatalog = this.tempCatalog.filter(s => s.id !== sId);
      this.renderCatalog();
    });
  },

  changeSectionType(type) {
    this.currentSectionType = type;
    document.getElementById('section-fields-text').style.display = type === 'text' ? 'block' : 'none';
    document.getElementById('section-fields-video').style.display = type === 'video' ? 'block' : 'none';
    document.getElementById('section-fields-document').style.display = type === 'document' ? 'block' : 'none';
  },

  saveSection() {
    const name = document.getElementById('section-name').value.trim();
    if (!name) { this.toast('请输入课件名称', 'error'); return; }

    const description = document.getElementById('section-text-content').innerHTML;
    const videoFile = document.getElementById('video-file-name').textContent.replace('已选择：', '');
    const docFile = document.getElementById('document-file-name').textContent.replace('已选择：', '');

    const baseData = {
      name,
      type: this.currentSectionType,
      resources: [],
      materials: 0
    };
    if (this.currentSectionType === 'text') baseData.description = description;
    if (this.currentSectionType === 'video' && videoFile) baseData.videoFile = videoFile;
    if (this.currentSectionType === 'document' && docFile) baseData.docFile = docFile;

    if (this.editingChapterId) {
      const ch = this.tempCatalog.find(c => c.id === this.editingChapterId);
      if (!ch) return;
      if (!ch.children) ch.children = [];
      if (this.editingSectionId) {
        const s = ch.children.find(x => x.id === this.editingSectionId);
        if (s) {
          Object.assign(s, baseData);
        }
      } else {
        ch.children.push({ id: 's' + Date.now(), ...baseData });
      }
    } else {
      if (this.editingSectionId) {
        const s = this.tempCatalog.find(x => x.id === this.editingSectionId);
        if (s) {
          Object.assign(s, baseData);
        }
      } else {
        this.tempCatalog.push({ id: 's' + Date.now(), ...baseData });
      }
    }

    this.closeModal('modal-section');
    this.renderCatalog();
    this.toast('课件保存成功', 'success');
  },

  handleVideoUpload(input) {
    const file = input.files[0];
    if (!file) return;
    const validExts = ['mp4', 'wmv', 'avi', 'mov', 'flv', 'rmvb', '3gp', 'm4v', 'mkv'];
    const ext = file.name.split('.').pop().toLowerCase();
    if (!validExts.includes(ext)) {
      this.toast('视频格式不支持，请上传mp4、wmv、avi、mov、flv、rmvb、3gp、m4v、mkv格式', 'error');
      input.value = '';
      document.getElementById('video-file-name').textContent = '';
      return;
    }
    if (file.size > 2 * 1024 * 1024 * 1024) {
      this.toast('视频大小不能超过2GB', 'error');
      input.value = '';
      document.getElementById('video-file-name').textContent = '';
      return;
    }
    document.getElementById('video-file-name').textContent = '已选择：' + file.name;
    this.toast('视频已选择', 'success');
  },

  handleDocumentUpload(input) {
    const file = input.files[0];
    if (!file) return;
    const validExts = ['pdf', 'jpg', 'jpeg', 'png', 'pptx', 'ppt', 'docx', 'doc', 'xlsx', 'xls'];
    const ext = file.name.split('.').pop().toLowerCase();
    if (!validExts.includes(ext)) {
      this.toast('文档格式不支持，请上传pdf、jpg、jpeg、png、pptx、ppt、docx、doc、xlsx、xls格式', 'error');
      input.value = '';
      document.getElementById('document-file-name').textContent = '';
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      this.toast('文档大小不能超过100MB', 'error');
      input.value = '';
      document.getElementById('document-file-name').textContent = '';
      return;
    }
    document.getElementById('document-file-name').textContent = '已选择：' + file.name;
    this.toast('文档已选择', 'success');
  },

  uploadMaterials() { this.toast('模拟上传拓展资料成功', 'success'); },
  selectCover() {
    document.getElementById('cover-file-input').click();
  },


  // ========== Course Data ==========
  viewCourseData(id) {
    this.editingCourseId = id;
    const course = this.courses.find(c => c.id === id);
    if (!course) return;

    document.getElementById('data-course-cover').src = course.cover;
    document.getElementById('data-course-name').textContent = course.name;
    document.getElementById('data-course-creator').textContent = `${course.creator}（${course.creatorPhone}）`;

    const stats = this.courseStats[id] || { totalSections: 0, totalMaterials: 0, totalLearners: 0, completedLearners: 0, completionRate: 0 };
    document.getElementById('data-stats-grid').innerHTML = `
      <div class="stat-card"><div class="stat-label">课件总数</div><div class="stat-value primary">${stats.totalSections}</div></div>
      <div class="stat-card"><div class="stat-label">课程资料总数</div><div class="stat-value success">${stats.totalMaterials}</div></div>
      <div class="stat-card"><div class="stat-label">课程学习人数</div><div class="stat-value info">${stats.totalLearners}</div></div>
      <div class="stat-card"><div class="stat-label">已完课人数占比</div><div class="stat-value warning">${stats.completionRate}%</div></div>
    `;

    this.renderSectionDetailTable(id);
    this.renderTeacherDetailTable(id);

    this.switchDataTab('section-detail');
    this.goTo('course-data');
  },

  switchDataTab(tab) {
    document.querySelectorAll('#page-course-data .tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('#page-course-data .tab-content').forEach(t => t.classList.remove('active'));
    document.querySelector(`#page-course-data .tab[data-tab="${tab}"]`).classList.add('active');
    document.getElementById('data-tab-' + tab).classList.add('active');
  },

  renderSectionDetailTable(courseId) {
    const data = this.sectionStats[courseId] || [];
    const html = `
      <table class="data-table">
        <thead><tr>
          <th>章节名称</th><th>课件名称</th><th>课件拓展资料（个）</th><th>类型</th><th>课件学习人数</th><th>课件学习人数占比</th>
        </tr></thead>
        <tbody>
          ${data.map(row => `
            <tr>
              <td>${row.chapterName}</td>
              <td>${row.sectionName}</td>
              <td>${row.materials}</td>
              <td><span class="tag tag-info">${row.type}</span></td>
              <td>${row.learners}</td>
              <td>${row.rate}%</td>
            </tr>
          `).join('') || '<tr><td colspan="6"><div class="empty-state">暂无数据</div></td></tr>'}
        </tbody>
      </table>
    `;
    document.getElementById('section-detail-table').innerHTML = html;
  },

  renderTeacherDetailTable(courseId) {
    const data = this.teacherStats[courseId] || [];
    const statusFilter = document.getElementById('teacher-status-filter')?.value || '';
    const keyword = (document.getElementById('teacher-search')?.value || '').toLowerCase();

    const filtered = data.filter(t => {
      if (statusFilter && t.status !== statusFilter) return false;
      if (keyword && !t.name.includes(keyword) && !t.phone.includes(keyword)) return false;
      return true;
    });

    const html = `
      <table class="data-table">
        <thead><tr>
          <th>序号</th><th>教师</th><th>所属组织</th><th>所属学段</th><th>所属年级</th>
          <th>所属学科</th><th>课程学习情况</th><th>课程最新学习时间</th><th>操作</th>
        </tr></thead>
        <tbody>
          ${filtered.map((t, i) => `
            <tr>
              <td>${i + 1}</td>
              <td>${t.name}（${t.phone}）</td>
              <td>${t.org}</td>
              <td>${t.stage}</td>
              <td>${t.grade}</td>
              <td>${t.subject}</td>
              <td>${t.progress}</td>
              <td>${t.lastLearnTime}</td>
              <td class="actions">
                <button class="btn btn-ghost btn-sm" onclick="app.viewTeacherDetail('${courseId}','${t.id}')">查看详情</button>
              </td>
            </tr>
          `).join('') || '<tr><td colspan="9"><div class="empty-state">暂无数据</div></td></tr>'}
        </tbody>
      </table>
    `;
    document.getElementById('teacher-detail-table').innerHTML = html;
  },

  filterTeachers() {
    this.renderTeacherDetailTable(this.editingCourseId);
  },

  exportSectionDetail() {
    this.toast('章节详情导出成功（模拟）', 'success');
  },

  exportTeacherDetail() {
    this.toast('教师学习详情导出成功（模拟）', 'success');
  },

  // ========== Teacher Detail Page ==========
  viewTeacherDetail(courseId, teacherId) {
    const data = this.teacherDetail[teacherId];
    if (!data) { this.toast('暂无该教师数据', 'warning'); return; }

    document.getElementById('teacher-detail-name').textContent = data.name;
    document.getElementById('teacher-total-sections').textContent = data.totalSections;
    document.getElementById('teacher-learned-sections').textContent = data.learnedSections;
    document.getElementById('teacher-completion-rate').textContent = data.completionRate + '%';
    document.getElementById('teacher-total-materials').textContent = data.totalMaterials;

    this.renderProgressTable(data.sectionDetails);
    this.goTo('teacher-detail');
  },

  renderProgressTable(details) {
    const keyword = (document.getElementById('progress-search')?.value || '').toLowerCase();
    const statusFilter = document.getElementById('progress-status-filter')?.value || '';

    const filtered = details.filter(d => {
      if (keyword && !d.sectionName.includes(keyword)) return false;
      if (statusFilter && d.status !== statusFilter) return false;
      return true;
    });

    const html = `
      <table class="data-table">
        <thead><tr>
          <th>章节名称</th><th>课件名称</th><th>课件拓展资料（个）</th><th>完成状态</th><th>最新学习时间</th><th>累计学习时长</th>
        </tr></thead>
        <tbody>
          ${filtered.map(row => `
            <tr>
              <td>${row.chapterName}</td>
              <td>${row.sectionName}</td>
              <td>${row.materials}</td>
              <td><span class="tag ${row.status === 'completed' ? 'tag-success' : 'tag-default'}">${row.status === 'completed' ? '已完成' : '未完成'}</span></td>
              <td>${row.lastTime}</td>
              <td>${row.duration}</td>
            </tr>
          `).join('') || '<tr><td colspan="6"><div class="empty-state">暂无数据</div></td></tr>'}
        </tbody>
      </table>
    `;
    document.getElementById('progress-detail-table').innerHTML = html;
  },

  filterProgress() {
    const name = document.getElementById('teacher-detail-name').textContent;
    const tId = Object.keys(this.teacherDetail).find(k => this.teacherDetail[k].name === name);
    if (tId) this.renderProgressTable(this.teacherDetail[tId].sectionDetails);
  },

  // ========== Course Type Management ==========
  renderTypeTree() {
    const container = document.getElementById('type-tree-container');
    const renderNode = (node, level = 0) => {
      const indent = level * 20;
      let html = `<div class="py-2 border-b border-stone-100" style="padding-left:${indent}px">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium">${node.name} <span class="text-xs text-stone-400">(${node.courseCount || 0}门课)</span></span>
          <div class="flex gap-1">
            <button class="btn btn-ghost btn-sm" onclick="app.showInlineAddSubType('${node.id}')">添加下级</button>
            <button class="btn btn-ghost btn-sm" onclick="app.editTypeName('${node.id}')">编辑</button>
            <button class="btn btn-ghost btn-sm" style="color:var(--danger)" onclick="app.deleteType('${node.id}')">删除</button>
          </div>
        </div>
        <div class="type-inline-add" id="inline-add-${node.id}" style="display:none;margin-top:8px;">
          <div class="flex items-center gap-2">
            <input type="text" class="form-input form-input-sm" id="inline-add-input-${node.id}" placeholder="请输入课程类型名称" style="flex:1;font-size:13px;padding:4px 8px;" onkeydown="if(event.key==='Enter')app.saveInlineSubType('${node.id}')">
            <button class="btn btn-primary btn-sm" onclick="app.saveInlineSubType('${node.id}')">确认</button>
            <button class="btn btn-secondary btn-sm" onclick="app.hideInlineAddSubType('${node.id}')">取消</button>
          </div>
        </div>
      </div>`;
      node.children.forEach(child => {
        html += renderNode(child, level + 1);
      });
      return html;
    };
    container.innerHTML = MOCK_COURSE_TYPE_TREE.map(t => renderNode(t)).join('');
  },

  addCourseType() {
    const name = document.getElementById('new-type-name').value.trim();
    if (!name) { this.toast('请输入类型名称', 'error'); return; }
    MOCK_COURSE_TYPE_TREE.push({ id: 'ct' + Date.now(), name, courseCount: 0, children: [] });
    document.getElementById('new-type-name').value = '';
    this.renderTypeTree();
    this.renderTypeFilter();
    this.renderCourseTypeSelect();
    this.toast('类型添加成功', 'success');
  },

  showInlineAddSubType(parentId) {
    document.querySelectorAll('.type-inline-add').forEach(el => el.style.display = 'none');
    const wrap = document.getElementById('inline-add-' + parentId);
    if (wrap) {
      wrap.style.display = 'block';
      const input = document.getElementById('inline-add-input-' + parentId);
      if (input) {
        input.value = '';
        input.focus();
      }
    }
  },

  hideInlineAddSubType(parentId) {
    const wrap = document.getElementById('inline-add-' + parentId);
    if (wrap) wrap.style.display = 'none';
  },

  saveInlineSubType(parentId) {
    const input = document.getElementById('inline-add-input-' + parentId);
    if (!input) return;
    const name = input.value.trim();
    if (!name) { this.toast('请输入课程类型名称', 'error'); return; }

    const add = (arr) => {
      for (let node of arr) {
        if (node.id === parentId) {
          node.children.push({ id: 'ct' + Date.now(), name, courseCount: 0, children: [] });
          return true;
        }
        if (add(node.children)) return true;
      }
      return false;
    };
    add(MOCK_COURSE_TYPE_TREE);
    this.hideInlineAddSubType(parentId);
    this.renderTypeTree();
    this.renderTypeFilter();
    this.renderCourseTypeSelect();
    this.toast('下级类型添加成功', 'success');
  },

  editTypeName(id) {
    const findNode = (arr) => {
      for (let node of arr) {
        if (node.id === id) return node;
        const found = findNode(node.children);
        if (found) return found;
      }
      return null;
    };
    const node = findNode(MOCK_COURSE_TYPE_TREE);
    if (!node) return;
    this.showPrompt('重命名类型', '请输入新的类型名称', '类型名称', node.name, (name) => {
      if (!name) return;
      node.name = name;
      this.renderTypeTree();
      this.renderTypeFilter();
      this.renderCourseTypeSelect();
    });
  },

  deleteType(id) {
    const findNode = (arr) => {
      for (let node of arr) {
        if (node.id === id) return node;
        const found = findNode(node.children);
        if (found) return found;
      }
      return null;
    };
    const node = findNode(MOCK_COURSE_TYPE_TREE);
    if (!node) return;

    // 检查是否有关联课程
    const hasCourses = this.courses.some(c => c.type.includes(id));
    if (hasCourses) {
      this.toast('该类型下已有课程关联，无法删除', 'error');
      return;
    }

    // 检查子类型是否有关联课程
    const checkChildren = (n) => {
      for (let child of n.children || []) {
        if (this.courses.some(c => c.type.includes(child.id))) return true;
        if (checkChildren(child)) return true;
      }
      return false;
    };
    if (checkChildren(node)) {
      this.toast('该类型的下级类型已有课程关联，无法删除', 'error');
      return;
    }

    this.showConfirm('确认删除', `确定删除类型"${node.name}"吗？`, () => {
      const del = (arr) => {
        const idx = arr.findIndex(n => n.id === id);
        if (idx >= 0) { arr.splice(idx, 1); return true; }
        for (let node of arr) {
          if (del(node.children)) return true;
        }
        return false;
      };
      del(MOCK_COURSE_TYPE_TREE);
      this.renderTypeTree();
      this.renderTypeFilter();
      this.renderCourseTypeSelect();
      this.toast('类型已删除', 'success');
    });
  },

  // ========== Activity List ==========
  renderActivityTable() {
    const search = (document.getElementById('activity-search')?.value || '').toLowerCase();
    const statusFilter = document.getElementById('activity-status-filter')?.value || '';
    const dateFrom = document.getElementById('activity-date-from')?.value || '';
    const dateTo = document.getElementById('activity-date-to')?.value || '';

    let list = this.activities.filter(a => {
      if (search && !a.name.toLowerCase().includes(search)) return false;
      if (statusFilter && a.status !== statusFilter) return false;
      if (dateFrom && a.startTime < dateFrom) return false;
      if (dateTo && a.endTime > dateTo) return false;
      return true;
    });

    this.activityListTotal = list.length;
    const totalPages = Math.max(1, Math.ceil(list.length / this.listPageSize));
    if (this.activityListPage > totalPages) this.activityListPage = totalPages;
    const start = (this.activityListPage - 1) * this.listPageSize;
    const pageItems = list.slice(start, start + this.listPageSize);

    const statusMap = {
      upcoming: { label: '未开始', class: 'tag-info' },
      ongoing: { label: '进行中', class: 'tag-success' },
      ended: { label: '已结束', class: 'tag-gray' }
    };

    let html = `
      <table class="data-table">
        <thead>
          <tr>
            <th style="width:60px">序号</th>
            <th style="width:160px">研训活动名称</th>
            <th style="width:200px">活动时间</th>
            <th style="width:90px">活动状态</th>
            <th style="width:100px">需修满学时</th>
            <th style="width:100px">活动参与人数</th>
            <th style="width:120px">已修满学时教师数</th>
            <th style="width:140px">逾期未修满学时教师数</th>
            <th style="width:180px">操作</th>
          </tr>
        </thead>
        <tbody>
    `;

    if (pageItems.length === 0) {
      html += `<tr><td colspan="9" class="text-center text-stone-400 py-8">暂无活动数据</td></tr>`;
    } else {
      pageItems.forEach((a, idx) => {
        const participants = this.activityParticipants[a.id] || [];
        const status = statusMap[a.status] || statusMap.upcoming;
        const completedCount = participants.filter(p => p.completed).length;
        const overdueCount = a.status === 'ended' ? participants.filter(p => !p.completed).length : 0;
        const overdueDisplay = a.status === 'ended' ? (overdueCount > 0 ? `<span style="color:var(--danger)">${overdueCount}</span>` : '0') : '-';
        html += `
          <tr>
            <td class="text-center">${start + idx + 1}</td>
            <td><div class="font-medium">${a.name}</div></td>
            <td><div class="text-sm text-stone-500" style="white-space:nowrap">${a.startTime} 至 ${a.endTime}</div></td>
            <td style="white-space:nowrap"><span class="tag ${status.class}">${status.label}</span></td>
            <td class="text-center">${a.hasHours ? a.requireHours + ' 学时' : '-'}</td>
            <td class="text-center">${a.participants.length}</td>
            <td class="text-center">${completedCount}</td>
            <td class="text-center">${overdueDisplay}</td>
            <td>
              <div class="flex gap-1">
                <button class="btn btn-ghost btn-sm" onclick="app.editActivity('${a.id}')">编辑</button>
                <button class="btn btn-ghost btn-sm" onclick="app.goToActivityFollow('${a.id}')">活动跟进</button>
                <button class="btn btn-ghost btn-sm" style="color:var(--danger)" onclick="app.deleteActivity('${a.id}')">删除</button>
              </div>
            </td>
          </tr>
        `;
      });
    }

    html += '</tbody></table>';
    document.getElementById('activity-table-container').innerHTML = html;
    this.renderActivityPagination(totalPages);
  },

  renderActivityPagination(totalPages) {
    let html = '';
    if (totalPages <= 1) {
      document.getElementById('activity-pagination').innerHTML = html;
      return;
    }

    const maxVisible = 7;
    let start = Math.max(1, this.activityListPage - 3);
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);

    html += `<button class="page-btn" onclick="app.goActivityPage(${this.activityListPage - 1})" ${this.activityListPage === 1 ? 'disabled' : ''}>上一页</button>`;
    for (let i = start; i <= end; i++) {
      html += `<button class="page-btn ${i === this.activityListPage ? 'active' : ''}" onclick="app.goActivityPage(${i})">${i}</button>`;
    }
    html += `<button class="page-btn" onclick="app.goActivityPage(${this.activityListPage + 1})" ${this.activityListPage === totalPages ? 'disabled' : ''}>下一页</button>`;
    document.getElementById('activity-pagination').innerHTML = html;
  },

  goActivityPage(p) {
    this.activityListPage = p;
    this.renderActivityTable();
  },

  filterActivities() {
    this.activityListPage = 1;
    this.renderActivityTable();
  },

  createActivity() {
    this.editingActivityId = null;
    this.tempActivityCourses = [];
    this.tempActivityTeachers = [];
    this.tempActivityAttachments = [];
    document.getElementById('activity-form-breadcrumb-title').textContent = '新建活动';
    document.getElementById('activity-name').value = '';
    document.getElementById('activity-cover-preview').innerHTML = '<span class="cover-placeholder">点击上传封面</span>';
    document.getElementById('activity-objective').value = '';
    this.renderActivityAttachments();
    const startInput = document.getElementById('activity-start-time');
    startInput.value = '';
    startInput.disabled = false;
    document.getElementById('activity-end-time').value = '';
    document.getElementById('activity-teacher-count').textContent = '已选择 0 位教师';
    document.getElementById('activity-selected-teachers').innerHTML = '';
    const hoursCheckbox = document.getElementById('activity-has-hours');
    hoursCheckbox.checked = true;
    hoursCheckbox.disabled = false;
    document.getElementById('activity-hours-detail').style.display = 'block';
    document.getElementById('activity-hours-label').textContent = '是';
    document.querySelectorAll('input[name="activity-study-mode"]').forEach(el => {
      el.checked = el.value === 'view';
      el.disabled = false;
    });
    document.getElementById('activity-require-hours').value = '0.0';
    document.getElementById('activity-total-hours-display').style.display = '';
    document.getElementById('activity-batch-hours-btn').style.display = '';
    this.renderActivityCoursesTable();
    this.goTo('activity-form');
  },

  editActivity(id) {
    const a = this.activities.find(x => x.id === id);
    if (!a) return;
    this.editingActivityId = id;
    this.tempActivityTeachers = [...a.participants];
    this.tempActivityCourses = [...(this.activityCourses[id] || [])];
    document.getElementById('activity-form-breadcrumb-title').textContent = '编辑活动';
    document.getElementById('activity-name').value = a.name;
    document.getElementById('activity-cover-preview').innerHTML = `<img src="${a.cover}" style="width:100%;height:100%;object-fit:cover;border-radius:8px">`;
    document.getElementById('activity-objective').value = a.objective || '';
    this.tempActivityAttachments = a.attachments ? [...a.attachments] : [];
    this.renderActivityAttachments();
    const startInput = document.getElementById('activity-start-time');
    startInput.value = a.startTime;
    startInput.disabled = true;
    document.getElementById('activity-end-time').value = a.endTime;
    this.updateSelectedTeachersDisplay();
    const hoursCheckbox = document.getElementById('activity-has-hours');
    hoursCheckbox.checked = a.hasHours;
    hoursCheckbox.disabled = true;
    document.getElementById('activity-hours-detail').style.display = a.hasHours ? 'block' : 'none';
    document.getElementById('activity-hours-label').textContent = a.hasHours ? '是' : '否';
    document.querySelectorAll('input[name="activity-study-mode"]').forEach(el => {
      el.checked = el.value === a.studyMode;
      el.disabled = true;
    });
    document.getElementById('activity-require-hours').value = a.hasHours ? a.requireHours : '0.0';
    const totalHoursDisplay = document.getElementById('activity-total-hours-display');
    const batchBtn = document.getElementById('activity-batch-hours-btn');
    if (a.hasHours) {
      totalHoursDisplay.style.display = '';
      batchBtn.style.display = '';
    } else {
      totalHoursDisplay.style.display = 'none';
      batchBtn.style.display = 'none';
    }
    this.renderActivityCoursesTable();
    this.goTo('activity-form');
  },

  deleteActivity(id) {
    const a = this.activities.find(x => x.id === id);
    if (!a) return;
    this.showConfirm('确认删除', `删除研训活动后，学员在此活动下获得的学时会被清除，请慎重操作！`, () => {
      this.activities = this.activities.filter(x => x.id !== id);
      delete this.activityCourses[id];
      delete this.activityParticipants[id];
      delete this.activityLearningRecords[id];
      this.renderActivityTable();
      this.toast('活动已删除', 'success');
    });
  },

  // ========== Activity Form ==========
  switchActivityTab(tab) {
    this.currentActivityTab = tab;
    document.querySelectorAll('#page-activity-form .tab').forEach(el => {
      if (el.dataset.tab === tab) el.classList.add('active');
      else el.classList.remove('active');
    });
    document.querySelectorAll('#page-activity-form .tab-content').forEach(el => {
      if (el.id === 'tab-' + tab) el.classList.add('active');
      else el.classList.remove('active');
    });
  },

  handleActivityCoverUpload(input) {
    const file = input.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.toast('请上传图片文件', 'error');
      return;
    }
    const url = URL.createObjectURL(file);
    document.getElementById('activity-cover-preview').innerHTML = `<img src="${url}" style="width:100%;height:100%;object-fit:cover;border-radius:8px">`;
  },

  toggleHoursSetting() {
    const checked = document.getElementById('activity-has-hours').checked;
    document.getElementById('activity-hours-detail').style.display = checked ? 'block' : 'none';
    document.getElementById('activity-hours-label').textContent = checked ? '是' : '否';
    document.getElementById('activity-total-hours-display').style.display = checked ? '' : 'none';
    document.getElementById('activity-batch-hours-btn').style.display = checked ? '' : 'none';
    const total = this.tempActivityCourses.reduce((s, c) => s + (parseFloat(c.hours) || 0), 0);
    document.getElementById('activity-total-hours').textContent = total.toFixed(1);
    if (!checked) {
      document.getElementById('activity-require-hours').value = '0.0';
    }
    this.renderActivityCoursesTable();
  },

  saveActivity(status) {
    const name = document.getElementById('activity-name').value.trim();
    const startTime = document.getElementById('activity-start-time').value;
    const endTime = document.getElementById('activity-end-time').value;
    const coverPreview = document.getElementById('activity-cover-preview').querySelector('img');
    const cover = coverPreview ? coverPreview.src : '';

    if (!name) { this.toast('请输入活动名称', 'error'); return; }
    if (!cover) { this.toast('请上传活动封面', 'error'); return; }
    if (!startTime) { this.toast('请选择开始时间', 'error'); return; }
    if (!endTime) { this.toast('请选择结束时间', 'error'); return; }
    if (this.tempActivityTeachers.length === 0) { this.toast('请选择参与教师', 'error'); return; }

    const hasHours = document.getElementById('activity-has-hours').checked;
    const totalCourseHours = this.tempActivityCourses.reduce((s, c) => s + (parseFloat(c.hours) || 0), 0);
    let requireHours = 0;
    if (hasHours) {
      requireHours = parseFloat(document.getElementById('activity-require-hours').value) || 0;
      if (requireHours > totalCourseHours) {
        this.toast(`需修满学时不能大于课程学时之和（${totalCourseHours.toFixed(1)} 学时）`, 'error');
        return;
      }
    }

    const now = new Date().toISOString().slice(0, 10);
    let activityStatus = 'upcoming';
    if (now >= startTime && now <= endTime) activityStatus = 'ongoing';
    if (now > endTime) activityStatus = 'ended';

    const objective = document.getElementById('activity-objective').value.trim();
    const studyModeEl = document.querySelector('input[name="activity-study-mode"]:checked');

    const payload = {
      name, cover, startTime, endTime,
      status: activityStatus,
      requireHours, hasHours,
      studyMode: studyModeEl ? studyModeEl.value : 'view',
      participants: [...this.tempActivityTeachers],
      objective,
      attachments: [...this.tempActivityAttachments]
    };

    if (this.editingActivityId) {
      const idx = this.activities.findIndex(a => a.id === this.editingActivityId);
      if (idx >= 0) {
        this.activities[idx] = { ...this.activities[idx], ...payload };
        this.activityCourses[this.editingActivityId] = [...this.tempActivityCourses];
      }
      this.toast('活动已更新', 'success');
    } else {
      const id = 'a' + (Date.now());
      this.activities.unshift({ id, ...payload });
      this.activityCourses[id] = [...this.tempActivityCourses];
      this.activityParticipants[id] = [];
      this.activityLearningRecords[id] = [];
      this.toast('活动已创建', 'success');
    }

    this.goToActivityList();
  },

  renderActivityCoursesTable() {
    const container = document.getElementById('activity-courses-table');
    const empty = document.getElementById('activity-courses-empty');
    const hasHours = document.getElementById('activity-has-hours')?.checked || false;
    if (!container) return;

    if (this.tempActivityCourses.length === 0) {
      container.innerHTML = '';
      if (empty) empty.style.display = 'flex';
      return;
    }
    if (empty) empty.style.display = 'none';

    let html = `
      <table class="data-table">
        <thead>
          <tr>
            <th style="width:60px">序号</th>
            <th>课程名称</th>
            <th>课程体系</th>
            <th>讲师/机构</th>
            ${hasHours ? '<th style="width:120px">可得学时</th>' : ''}
            <th style="width:100px">操作</th>
          </tr>
        </thead>
        <tbody>
    `;
    this.tempActivityCourses.forEach((c, i) => {
      const actionLabel = hasHours ? '删除' : '移除';
      html += `
        <tr>
          <td class="text-center">${i + 1}</td>
          <td>${c.name}</td>
          <td>${c.typeName}</td>
          <td>${c.instructor}</td>
          ${hasHours ? `<td><input type="number" class="form-input" style="width:80px;padding:4px 8px" min="0" step="0.1" value="${c.hours || 0}" onchange="app.updateCourseHours(${i}, this.value)"></td>` : ''}
          <td>
            <button class="btn btn-ghost btn-sm" style="color:var(--danger)" onclick="app.removeActivityCourse(${i})">${actionLabel}</button>
          </td>
        </tr>
      `;
    });
    html += '</tbody></table>';
    container.innerHTML = html;
    const total = this.tempActivityCourses.reduce((s, c) => s + (parseFloat(c.hours) || 0), 0);
    document.getElementById('activity-total-hours').textContent = total.toFixed(1);
  },

  updateCourseHours(index, value) {
    const v = parseFloat(value) || 0;
    this.tempActivityCourses[index].hours = v;
    const total = this.tempActivityCourses.reduce((s, c) => s + (parseFloat(c.hours) || 0), 0);
    document.getElementById('activity-total-hours').textContent = total.toFixed(1);
  },

  removeActivityCourse(index) {
    const hasHours = document.getElementById('activity-has-hours')?.checked || false;
    if (hasHours) {
      this.showConfirm('确认移除', '移除后，学员在此课程已获得的学时会被清除，请慎重操作！', () => {
        this.tempActivityCourses.splice(index, 1);
        this.renderActivityCoursesTable();
      });
    } else {
      this.tempActivityCourses.splice(index, 1);
      this.renderActivityCoursesTable();
    }
  },

  handleObjectiveAttachment(input) {
    const files = Array.from(input.files);
    if (files.length === 0) return;
    files.forEach(file => {
      this.tempActivityAttachments.push({ name: file.name, size: file.size });
    });
    this.renderActivityAttachments();
    input.value = '';
  },

  renderActivityAttachments() {
    const container = document.getElementById('activity-attachments-list');
    if (!container) return;
    container.innerHTML = this.tempActivityAttachments.map((att, idx) => `
      <span class="tag" style="display:inline-flex;align-items:center;gap:4px">${att.name}
        <span style="cursor:pointer" onclick="app.removeAttachment(${idx})" title="删除">&times;</span>
      </span>
    `).join('');
  },

  removeAttachment(index) {
    this.tempActivityAttachments.splice(index, 1);
    this.renderActivityAttachments();
  },

  batchSetHours() {
    if (this.tempActivityCourses.length === 0) { this.toast('请先添加课程', 'warning'); return; }
    this.showPrompt('批量设置学时', '请输入每门课程的默认学时（支持一位小数）：', '学时', '0.0', (value) => {
      const v = parseFloat(value);
      if (isNaN(v) || v < 0) { this.toast('请输入有效的学时', 'error'); return; }
      this.tempActivityCourses.forEach(c => c.hours = v);
      this.renderActivityCoursesTable();
      const total = this.tempActivityCourses.reduce((s, c) => s + (parseFloat(c.hours) || 0), 0);
      document.getElementById('activity-total-hours').textContent = total.toFixed(1);
    });
  },

  // ========== Teacher Select ==========
  openTeacherSelect() {
    this.teacherSelectOrg = '';
    this.teacherSelectSearch = '';
    this.teacherSelectPage = 1;
    this.tempTeacherSelections = new Set([...this.tempActivityTeachers]);
    this.renderTeacherTree();
    this.renderTeacherSelectList();
    this.openModal('modal-teacher-select');
  },

  renderTeacherTree() {
    const container = document.getElementById('teacher-select-tree');
    const build = (nodes, level = 0) => {
      let html = '';
      nodes.forEach(n => {
        const padding = level * 12;
        const active = this.teacherSelectOrg === n.id ? 'color:var(--primary);font-weight:600;background:var(--primary-light);border-radius:4px' : '';
        html += `<div class="cursor-pointer text-sm py-1 px-1 hover:text-primary transition-colors" style="padding-left:${padding + 4}px;${active}" onclick="app.selectTeacherOrg('${n.id}')">${n.name}</div>`;
        if (n.children && n.children.length) {
          html += `<div>${build(n.children, level + 1)}</div>`;
        }
      });
      return html;
    };
    container.innerHTML = build(this.organizations);
  },

  selectTeacherOrg(orgId) {
    this.teacherSelectOrg = this.teacherSelectOrg === orgId ? '' : orgId;
    this.teacherSelectPage = 1;
    this.renderTeacherTree();
    this.renderTeacherSelectList();
  },

  filterTeacherSelect() {
    this.teacherSelectSearch = document.getElementById('teacher-select-search').value.toLowerCase();
    this.teacherSelectPage = 1;
    this.renderTeacherSelectList();
  },

  renderTeacherSelectList() {
    const search = this.teacherSelectSearch || '';
    const org = this.teacherSelectOrg || '';
    let list = MOCK_TEACHERS.filter(t => {
      if (search && !t.name.toLowerCase().includes(search) && !t.phone.includes(search)) return false;
      if (org && t.org !== org && !t.org.startsWith(org + '-')) return false;
      return true;
    });

    const total = list.length;
    const totalPages = Math.max(1, Math.ceil(total / this.teacherSelectPageSize));
    const page = Math.min(this.teacherSelectPage, totalPages);
    const start = (page - 1) * this.teacherSelectPageSize;
    const pageList = list.slice(start, start + this.teacherSelectPageSize);

    const tbody = document.getElementById('teacher-select-list');
    let html = '';
    pageList.forEach(t => {
      const checked = this.tempTeacherSelections.has(t.id) ? 'checked' : '';
      html += `
        <tr>
          <td class="text-center"><input type="checkbox" ${checked} onchange="app.toggleTeacherSelect('${t.id}', this.checked)"></td>
          <td>${t.name}</td>
          <td>${t.phone}</td>
          <td>${t.orgName}</td>
          <td>${t.grade}</td>
          <td>${t.subject}</td>
        </tr>
      `;
    });
    tbody.innerHTML = html;
    this.renderTeacherSelectPagination(total);
    this.renderTeacherSelectedPreview();
  },

  renderTeacherSelectPagination(total) {
    const totalPages = Math.max(1, Math.ceil(total / this.teacherSelectPageSize));
    let html = `
      <button class="page-btn" ${this.teacherSelectPage === 1 ? 'disabled' : ''} onclick="app.changeTeacherSelectPage(${this.teacherSelectPage - 1})">上一页</button>
    `;
    for (let i = 1; i <= totalPages; i++) {
      html += `<button class="page-btn ${i === this.teacherSelectPage ? 'active' : ''}" onclick="app.changeTeacherSelectPage(${i})">${i}</button>`;
    }
    html += `<button class="page-btn" ${this.teacherSelectPage === totalPages ? 'disabled' : ''} onclick="app.changeTeacherSelectPage(${this.teacherSelectPage + 1})">下一页</button>`;
    html += `<span class="text-sm text-stone-500 ml-2">共 ${total} 条</span>`;
    document.getElementById('teacher-select-pagination').innerHTML = html;
  },

  changeTeacherSelectPage(p) {
    const totalPages = Math.ceil(MOCK_TEACHERS.length / this.teacherSelectPageSize);
    if (p < 1 || p > totalPages) return;
    this.teacherSelectPage = p;
    this.renderTeacherSelectList();
  },

  renderTeacherSelectedPreview() {
    document.getElementById('teacher-select-count').textContent = this.tempTeacherSelections.size;
    const container = document.getElementById('teacher-selected-preview');
    const teachers = MOCK_TEACHERS.filter(t => this.tempTeacherSelections.has(t.id));
    container.innerHTML = teachers.map(t => `
      <span class="tag" style="display:inline-flex;align-items:center;gap:4px;background:var(--primary-light);color:var(--primary);border-color:var(--primary-light)"">${t.name}
        <span style="cursor:pointer" onclick="app.toggleTeacherSelect('${t.id}', false)" title="移除">&times;</span>
      </span>
    `).join('');
  },

  toggleTeacherSelect(id, checked) {
    if (checked) this.tempTeacherSelections.add(id);
    else this.tempTeacherSelections.delete(id);
    this.renderTeacherSelectList();
  },

  toggleSelectAllTeachers() {
    const search = this.teacherSelectSearch || '';
    const org = this.teacherSelectOrg || '';
    let list = MOCK_TEACHERS.filter(t => {
      if (search && !t.name.toLowerCase().includes(search) && !t.phone.includes(search)) return false;
      if (org && t.org !== org && !t.org.startsWith(org + '-')) return false;
      return true;
    });
    const totalPages = Math.max(1, Math.ceil(list.length / this.teacherSelectPageSize));
    const page = Math.min(this.teacherSelectPage, totalPages);
    const start = (page - 1) * this.teacherSelectPageSize;
    const pageList = list.slice(start, start + this.teacherSelectPageSize);
    const allSelected = pageList.every(t => this.tempTeacherSelections.has(t.id));
    pageList.forEach(t => {
      if (allSelected) this.tempTeacherSelections.delete(t.id);
      else this.tempTeacherSelections.add(t.id);
    });
    this.renderTeacherSelectList();
  },

  confirmTeacherSelect() {
    this.tempActivityTeachers = Array.from(this.tempTeacherSelections);
    this.updateSelectedTeachersDisplay();
    this.closeModal('modal-teacher-select');
  },

  updateSelectedTeachersDisplay() {
    const count = this.tempActivityTeachers.length;
    document.getElementById('activity-teacher-count').textContent = `已选择 ${count} 位教师`;
    const container = document.getElementById('activity-selected-teachers');
    const teachers = MOCK_TEACHERS.filter(t => this.tempActivityTeachers.includes(t.id));
    container.innerHTML = teachers.map(t => `
      <span class="tag" style="display:inline-flex;align-items:center;gap:4px">${t.name}
        <span style="cursor:pointer" onclick="app.removeSelectedTeacher('${t.id}')">&times;</span>
      </span>
    `).join('');
  },

  removeSelectedTeacher(id) {
    this.tempActivityTeachers = this.tempActivityTeachers.filter(x => x !== id);
    this.updateSelectedTeachersDisplay();
  },

  // ========== Course Select ==========
  openCourseSelect() {
    this.courseSelectSearch = '';
    this.courseTypeSearch = '';
    this.courseSelectPage = 1;
    this.tempCourseTypeSelections = new Set();
    this.tempCourseSelections = new Map();
    this.tempActivityCourses.forEach((c, i) => {
      this.tempCourseSelections.set(c.courseId, { ...c, index: i });
    });
    document.getElementById('course-type-search').value = '';
    this.renderCourseTypeTree();
    this.renderCourseSelectList();
    this.openModal('modal-course-select');
  },

  filterCourseTypeTree() {
    this.courseTypeSearch = document.getElementById('course-type-search').value.toLowerCase();
    this.renderCourseTypeTree();
  },

  renderCourseTypeTree() {
    const container = document.getElementById('course-type-tree');
    const search = this.courseTypeSearch || '';
    const build = (nodes, level = 0) => {
      let html = '';
      nodes.forEach(n => {
        const padding = level * 12;
        const checked = this.tempCourseTypeSelections.has(n.id) ? 'checked' : '';
        const matches = !search || n.name.toLowerCase().includes(search);
        let childrenHtml = '';
        if (n.children && n.children.length) {
          childrenHtml = build(n.children, level + 1);
        }
        if (matches || childrenHtml) {
          html += `<label class="flex items-center gap-1 py-1 cursor-pointer" style="padding-left:${padding}px">
            <input type="checkbox" ${checked} onchange="app.toggleCourseTypeSelect('${n.id}', this.checked)">
            <span class="text-sm">${n.name}</span>
          </label>${childrenHtml}`;
        }
      });
      return html;
    };
    container.innerHTML = build(this.courseTypes);
  },

  toggleCourseTypeSelect(id, checked) {
    if (checked) this.tempCourseTypeSelections.add(id);
    else this.tempCourseTypeSelections.delete(id);
    this.courseSelectPage = 1;
    this.renderCourseTypeTree();
    this.renderCourseSelectList();
  },

  filterCourseSelect() {
    this.courseSelectSearch = document.getElementById('course-select-search').value.toLowerCase();
    this.courseSelectPage = 1;
    this.renderCourseSelectList();
  },

  _matchCourseType(course) {
    if (this.tempCourseTypeSelections.size === 0) return true;
    if (!course.type) return false;
    return course.type.some(tid => {
      for (const selId of this.tempCourseTypeSelections) {
        if (tid === selId || tid.startsWith(selId + '-')) return true;
      }
      return false;
    });
  },

  renderCourseSelectList() {
    const search = this.courseSelectSearch || '';
    let list = this.courses.filter(c => {
      if (search && !c.name.toLowerCase().includes(search)) return false;
      if (!this._matchCourseType(c)) return false;
      return true;
    });

    const total = list.length;
    const totalPages = Math.max(1, Math.ceil(total / this.courseSelectPageSize));
    const page = Math.min(this.courseSelectPage, totalPages);
    const start = (page - 1) * this.courseSelectPageSize;
    const pageList = list.slice(start, start + this.courseSelectPageSize);

    const tbody = document.getElementById('course-select-list');
    let html = '';
    pageList.forEach(c => {
      const sel = this.tempCourseSelections.get(c.id);
      const checked = sel ? 'checked' : '';
      html += `
        <tr>
          <td class="text-center"><input type="checkbox" ${checked} onchange="app.toggleCourseSelect('${c.id}', this.checked)"></td>
          <td>${c.name}</td>
          <td>${c.typeName || c.type}</td>
          <td>${c.instructor}</td>
          <td class="text-center">${c.sections || 0}</td>
        </tr>
      `;
    });
    tbody.innerHTML = html;
    document.getElementById('course-select-count').textContent = this.tempCourseSelections.size;
    this.renderCourseSelectPagination(total);
  },

  renderCourseSelectPagination(total) {
    const totalPages = Math.max(1, Math.ceil(total / this.courseSelectPageSize));
    let html = `
      <button class="page-btn" ${this.courseSelectPage === 1 ? 'disabled' : ''} onclick="app.changeCourseSelectPage(${this.courseSelectPage - 1})">上一页</button>
    `;
    for (let i = 1; i <= totalPages; i++) {
      html += `<button class="page-btn ${i === this.courseSelectPage ? 'active' : ''}" onclick="app.changeCourseSelectPage(${i})">${i}</button>`;
    }
    html += `<button class="page-btn" ${this.courseSelectPage === totalPages ? 'disabled' : ''} onclick="app.changeCourseSelectPage(${this.courseSelectPage + 1})">下一页</button>`;
    html += `<span class="text-sm text-stone-500 ml-2">共 ${total} 条</span>`;
    document.getElementById('course-select-pagination').innerHTML = html;
  },

  changeCourseSelectPage(p) {
    const totalPages = Math.ceil(this.courses.length / this.courseSelectPageSize);
    if (p < 1 || p > totalPages) return;
    this.courseSelectPage = p;
    this.renderCourseSelectList();
  },

  toggleCourseSelect(id, checked) {
    if (checked) {
      const course = this.courses.find(c => c.id === id);
      if (course) {
        this.tempCourseSelections.set(id, { courseId: id, name: course.name, typeName: course.typeName || course.type, instructor: course.instructor, hours: 0 });
      }
    } else {
      this.tempCourseSelections.delete(id);
    }
    this.renderCourseSelectList();
  },

  updateSelectCourseHours(id, value) {
    const sel = this.tempCourseSelections.get(id);
    if (sel) sel.hours = parseFloat(value) || 0;
  },

  toggleSelectAllCourses() {
    const search = this.courseSelectSearch || '';
    let list = this.courses.filter(c => {
      if (search && !c.name.toLowerCase().includes(search)) return false;
      if (!this._matchCourseType(c)) return false;
      return true;
    });
    const totalPages = Math.max(1, Math.ceil(list.length / this.courseSelectPageSize));
    const page = Math.min(this.courseSelectPage, totalPages);
    const start = (page - 1) * this.courseSelectPageSize;
    const pageList = list.slice(start, start + this.courseSelectPageSize);
    const allSelected = pageList.every(c => this.tempCourseSelections.has(c.id));
    pageList.forEach(c => {
      if (allSelected) this.tempCourseSelections.delete(c.id);
      else this.tempCourseSelections.set(c.id, { courseId: c.id, name: c.name, typeName: c.typeName || c.type, instructor: c.instructor, hours: 0 });
    });
    this.renderCourseSelectList();
  },

  confirmCourseSelect() {
    this.tempActivityCourses = Array.from(this.tempCourseSelections.values());
    this.renderActivityCoursesTable();
    const total = this.tempActivityCourses.reduce((s, c) => s + (parseFloat(c.hours) || 0), 0);
    document.getElementById('activity-total-hours').textContent = total.toFixed(1);
    this.closeModal('modal-course-select');
  },

  // ========== Activity Follow ==========
  goToActivityFollow(id) {
    this.followActivityId = id;
    this.currentFollowTab = 'follow-student';
    const a = this.activities.find(x => x.id === id);
    if (!a) return;
    document.getElementById('activity-follow-title').textContent = a.name;
    document.getElementById('follow-activity-cover').src = a.cover;
    document.getElementById('follow-activity-name').textContent = a.name;
    document.getElementById('follow-activity-time').textContent = `${a.startTime} 至 ${a.endTime}`;
    const courses = this.activityCourses[id] || [];
    document.getElementById('follow-course-count').textContent = courses.length;
    document.getElementById('follow-teacher-count').textContent = a.participants.length;
    const hoursWrap = document.getElementById('follow-require-hours-wrap');
    if (a.hasHours) {
      hoursWrap.style.display = '';
      document.getElementById('follow-require-hours').textContent = a.requireHours + ' 学时';
    } else {
      hoursWrap.style.display = 'none';
    }
    const modeMap = { view: '浏览即算', complete: '完成课程下所有课时学习', feedback: '完成+反馈' };
    document.getElementById('follow-study-mode').textContent = modeMap[a.studyMode] || a.studyMode;

    document.querySelectorAll('#page-activity-follow .tab').forEach(el => {
      if (el.dataset.tab === 'follow-student') el.classList.add('active');
      else el.classList.remove('active');
    });
    document.querySelectorAll('#page-activity-follow .tab-content').forEach(el => {
      if (el.id === 'tab-follow-student') el.classList.add('active');
      else el.classList.remove('active');
    });

    this.renderFollowStudentTable();
    this.renderFollowCourseTable();
    this.goTo('activity-follow');
  },

  switchFollowTab(tab) {
    this.currentFollowTab = tab;
    document.querySelectorAll('#page-activity-follow .tab').forEach(el => {
      if (el.dataset.tab === tab) el.classList.add('active');
      else el.classList.remove('active');
    });
    document.querySelectorAll('#page-activity-follow .tab-content').forEach(el => {
      if (el.id === 'tab-' + tab) el.classList.add('active');
      else el.classList.remove('active');
    });
  },

  renderFollowStudentTable() {
    const id = this.followActivityId;
    const a = this.activities.find(x => x.id === id);
    if (!a) return;
    const search = (document.getElementById('follow-student-search')?.value || '').toLowerCase();
    const participants = this.activityParticipants[id] || [];
    const teachers = MOCK_TEACHERS.filter(t => a.participants.includes(t.id));

    let html = `
      <table class="data-table">
        <thead>
          <tr>
            <th style="width:50px">序号</th>
            <th>教师姓名</th>
            <th>所属组织</th>
            <th>所在年级</th>
            <th>所授学科</th>
            <th>已学习课程</th>
            <th>获得学时</th>
            <th style="width:100px">操作</th>
          </tr>
        </thead>
        <tbody>
    `;

    let idx = 0;
    teachers.forEach(t => {
      if (search && !t.name.toLowerCase().includes(search) && !t.phone.includes(search)) return;
      idx++;
      const p = participants.find(x => x.teacherId === t.id) || { learnedCourses: 0, earnedHours: 0, completed: false, lastLearnTime: '-' };
      html += `
        <tr>
          <td class="text-center">${idx}</td>
          <td>${t.name}</td>
          <td>${t.orgName}</td>
          <td>${t.grade}</td>
          <td>${t.subject}</td>
          <td class="text-center">${p.learnedCourses}</td>
          <td class="text-center">${p.earnedHours}</td>
          <td><button class="btn btn-ghost btn-sm" onclick="app.showStudentDetail('${t.id}')">查看详情</button></td>
        </tr>
      `;
    });

    if (idx === 0) {
      html += '<tr><td colspan="8" class="text-center text-stone-400 py-8">暂无数据</td></tr>';
    }

    html += '</tbody></table>';
    document.getElementById('follow-student-table').innerHTML = html;
  },

  filterFollowStudents() {
    this.renderFollowStudentTable();
  },

  renderFollowCourseTable() {
    const id = this.followActivityId;
    const a = this.activities.find(x => x.id === id);
    if (!a) return;
    const search = (document.getElementById('follow-course-search')?.value || '').toLowerCase();
    const courses = this.activityCourses[id] || [];
    const records = this.activityLearningRecords[id] || [];

    let html = `
      <table class="data-table">
        <thead>
          <tr>
            <th style="width:50px">序号</th>
            <th>课程名称</th>
            <th>课时数</th>
            <th>完成学习人数/参与人数</th>
            <th style="width:100px">操作</th>
          </tr>
        </thead>
        <tbody>
    `;

    let idx = 0;
    courses.forEach(c => {
      if (search && !c.name.toLowerCase().includes(search)) return;
      idx++;
      const learned = records.filter(r => r.courseName === c.name).length;
      const total = a.participants.length;
      const originCourse = this.courses.find(x => x.id === c.courseId);
      const sections = originCourse ? originCourse.sections : 0;
      html += `
        <tr>
          <td class="text-center">${idx}</td>
          <td>${c.name}</td>
          <td class="text-center">${sections}</td>
          <td class="text-center">${learned}/${total}</td>
          <td><button class="btn btn-ghost btn-sm" onclick="app.showCourseDetail('${c.courseId}')">查看详情</button></td>
        </tr>
      `;
    });

    if (idx === 0) {
      html += '<tr><td colspan="5" class="text-center text-stone-400 py-8">暂无数据</td></tr>';
    }

    html += '</tbody></table>';
    document.getElementById('follow-course-table').innerHTML = html;
  },

  filterFollowCourses() {
    this.renderFollowCourseTable();
  },

  showStudentDetail(teacherId) {
    const id = this.followActivityId;
    const a = this.activities.find(x => x.id === id);
    const teacher = MOCK_TEACHERS.find(t => t.id === teacherId);
    if (!a || !teacher) return;
    document.getElementById('student-detail-title').textContent = `${teacher.name}老师 - 学习详情`;

    const courses = this.activityCourses[id] || [];
    const records = this.activityLearningRecords[id] || [];
    const teacherRecords = records.filter(r => r.teacherId === teacherId);
    const totalHours = teacherRecords.reduce((s, r) => s + (r.hours || 0), 0);
    const learnedCount = teacherRecords.length;

    // Render hours chart
    setTimeout(() => {
      const hoursDom = document.getElementById('student-detail-hours-chart');
      if (!hoursDom) return;
      const hoursChart = echarts.init(hoursDom);
      hoursChart.setOption({
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: ['需修满学时', '已获得学时'], axisLabel: { fontSize: 12 } },
        yAxis: { type: 'value', name: '学时' },
        series: [{
          data: [
            { value: a.hasHours ? a.requireHours : 0, itemStyle: { color: '#ccc' } },
            { value: totalHours, itemStyle: { color: '#C8000C' } }
          ],
          type: 'bar',
          barWidth: '40%',
          label: { show: true, position: 'top' }
        }],
        grid: { left: '3%', right: '4%', bottom: '5%', top: '15%', containLabel: true }
      });

      const coursesDom = document.getElementById('student-detail-courses-chart');
      if (!coursesDom) return;
      const coursesChart = echarts.init(coursesDom);
      coursesChart.setOption({
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: ['总课程数', '已学习课程'], axisLabel: { fontSize: 12 } },
        yAxis: { type: 'value', name: '门' },
        series: [{
          data: [
            { value: courses.length, itemStyle: { color: '#ccc' } },
            { value: learnedCount, itemStyle: { color: '#C8000C' } }
          ],
          type: 'bar',
          barWidth: '40%',
          label: { show: true, position: 'top' }
        }],
        grid: { left: '3%', right: '4%', bottom: '5%', top: '15%', containLabel: true }
      });
    }, 100);

    let html = `
      <table class="data-table">
        <thead>
          <tr>
            <th style="width:50px">序号</th>
            <th>课程名称</th>
            <th>获得学时</th>
            <th>完成时间</th>
            <th>反馈</th>
          </tr>
        </thead>
        <tbody>
    `;
    courses.forEach((c, idx) => {
      const r = teacherRecords.find(tr => tr.courseName === c.name);
      html += `
        <tr>
          <td class="text-center">${idx + 1}</td>
          <td>${c.name}</td>
          <td class="text-center">${r ? (r.hours || 0) : '-'}</td>
          <td class="text-center">${r ? r.completeTime : '-'}</td>
          <td>${r ? (r.feedback || '-') : '-'}</td>
        </tr>
      `;
    });
    if (courses.length === 0) {
      html += '<tr><td colspan="5" class="text-center text-stone-400 py-6">暂无学习记录</td></tr>';
    }
    html += '</tbody></table>';
    document.getElementById('student-detail-table').innerHTML = html;
    this.openModal('modal-student-detail');
  },

  showCourseDetail(courseId) {
    const id = this.followActivityId;
    const a = this.activities.find(x => x.id === id);
    const course = (this.activityCourses[id] || []).find(c => c.courseId === courseId);
    if (!a || !course) return;
    document.getElementById('course-detail-title').textContent = `${course.name} - 课件学习详情`;

    const records = this.activityLearningRecords[id] || [];
    const courseRecords = records.filter(r => r.courseName === course.name);
    const learnedCount = courseRecords.length;

    // Generate courseware entries based on sections count
    const originCourse = this.courses.find(x => x.id === courseId);
    const sections = originCourse ? originCourse.sections : 0;
    let html = `
      <table class="data-table">
        <thead>
          <tr>
            <th style="width:50px">序号</th>
            <th>课件名称</th>
            <th>学习人数</th>
            <th>学习次数</th>
          </tr>
        </thead>
        <tbody>
    `;
    for (let i = 1; i <= sections; i++) {
      // Deterministic "random" based on section index so it's stable
      const times = learnedCount > 0 ? learnedCount + (i % 3) : 0;
      html += `
        <tr>
          <td class="text-center">${i}</td>
          <td>第${i}课时</td>
          <td class="text-center">${learnedCount}</td>
          <td class="text-center">${times}</td>
        </tr>
      `;
    }
    if (sections === 0) {
      html += `<tr><td colspan="4" class="text-center text-stone-400 py-6">暂无课件数据</td></tr>`;
    }
    html += '</tbody></table>';
    document.getElementById('course-detail-table').innerHTML = html;
    this.openModal('modal-course-detail');
  },

  // ========== Export ==========
  exportStudentData() {
    const id = this.followActivityId;
    const a = this.activities.find(x => x.id === id);
    if (!a) return;
    const participants = this.activityParticipants[id] || [];
    const teachers = MOCK_TEACHERS.filter(t => a.participants.includes(t.id));
    const data = teachers.map((t, idx) => {
      const p = participants.find(x => x.teacherId === t.id) || { learnedCourses: 0, earnedHours: 0 };
      return {
        '序号': idx + 1,
        '教师姓名': t.name,
        '所属组织': t.orgName,
        '所在年级': t.grade,
        '所授学科': t.subject,
        '已学习课程': p.learnedCourses,
        '获得学时': p.earnedHours
      };
    });
    this.exportToExcel(data, `${a.name}_学员学习情况`);
  },

  exportCourseData() {
    const id = this.followActivityId;
    const a = this.activities.find(x => x.id === id);
    if (!a) return;
    const courses = this.activityCourses[id] || [];
    const records = this.activityLearningRecords[id] || [];
    const data = courses.map((c, idx) => {
      const learned = records.filter(r => r.courseName === c.name).length;
      const total = a.participants.length;
      return {
        '序号': idx + 1,
        '课程名称': c.name,
        '课时数': c.sections || 0,
        '完成学习人数/参与人数': `${learned}/${total}`
      };
    });
    this.exportToExcel(data, `${a.name}_课程学习情况`);
  },

  exportDetailData() {
    const id = this.followActivityId;
    const a = this.activities.find(x => x.id === id);
    if (!a) return;
    const courses = this.activityCourses[id] || [];
    const records = this.activityLearningRecords[id] || [];
    // Find the teacher whose detail modal is currently open (if any)
    const modalTitle = document.getElementById('student-detail-title')?.textContent || '';
    const teacherName = modalTitle.split('老师 - ')[0];
    const teacher = MOCK_TEACHERS.find(t => t.name === teacherName);
    const teacherRecords = teacher ? records.filter(r => r.teacherId === teacher.id) : records;
    const data = teacherRecords.map((r, idx) => ({
      '序号': idx + 1,
      '课程名称': r.courseName,
      '获得学时': r.hours || 0,
      '完成时间': r.completeTime,
      '反馈': r.feedback || '-'
    }));
    this.exportToExcel(data, `${a.name}_${teacherName || '学习明细'}`);
  },

  exportToExcel(data, filename) {
    if (!data || data.length === 0) {
      this.toast('暂无数据可导出', 'warning');
      return;
    }
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${filename}.xlsx`);
  },

  // ========== Cockpit / AI研训驾驶舱 数据大屏 ==========
  dashboardCharts: {},
  cockpitTimer: null,

  disposeDashboardCharts() {
    Object.values(this.dashboardCharts).forEach(chart => {
      if (chart && chart.dispose) chart.dispose();
    });
    this.dashboardCharts = {};
    if (this.cockpitTimer) {
      clearInterval(this.cockpitTimer);
      this.cockpitTimer = null;
    }
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  },

  renderDashboard() {
    this.disposeDashboardCharts();

    const courses = this.courses || [];
    const activities = this.activities || [];
    const teachers = MOCK_TEACHERS || [];

    // 1. 核心指标
    const totalCourses = courses.length;
    const totalActivities = activities.length;
    const totalTeachers = teachers.length;

    let totalParticipants = 0;
    let completedParticipants = 0;
    Object.values(this.activityParticipants || {}).forEach(list => {
      totalParticipants += list.length;
      completedParticipants += list.filter(p => p.completed).length;
    });
    const completionRate = totalParticipants > 0 ? Math.round((completedParticipants / totalParticipants) * 100) : 0;

    // 能力维度平均分（mock 计算）
    const abilityScores = this.abilityDimensions.map(() => Math.round(50 + Math.random() * 50));
    const avgAbility = Math.round(abilityScores.reduce((a, b) => a + b, 0) / abilityScores.length);

    // 数字滚动动画
    const animateNumber = (elId, target, suffix = '') => {
      const el = document.getElementById(elId);
      if (!el) return;
      let current = 0;
      const duration = 800;
      const step = Math.max(1, Math.ceil(target / (duration / 16)));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = current + suffix;
      }, 16);
    };
    animateNumber('dash-total-courses', totalCourses);
    animateNumber('dash-total-activities', totalActivities);
    animateNumber('dash-total-teachers', totalTeachers);
    animateNumber('dash-completed-teachers', completedParticipants);
    animateNumber('dash-completion-rate', completionRate, '%');
    animateNumber('dash-avg-ability', avgAbility);

    // 实时时钟
    const timeEl = document.getElementById('cockpit-time');
    const updateTime = () => {
      const now = new Date();
      timeEl.textContent = now.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };
    updateTime();
    this.cockpitTimer = setInterval(updateTime, 1000);

    // 2. 教师能力维度分布 - 雷达图
    const radarChart = echarts.init(document.getElementById('cockpit-radar-chart'));
    radarChart.setOption({
      tooltip: { trigger: 'item' },
      radar: {
        indicator: this.abilityDimensions.map(a => ({ name: a.name, max: 100 })),
        radius: '60%',
        axisName: { color: '#A8A29E', fontSize: 11 },
        splitArea: { areaStyle: { color: ['rgba(168, 162, 158, 0.06)', 'rgba(168, 162, 158, 0.12)', 'rgba(168, 162, 158, 0.06)', 'rgba(168, 162, 158, 0.12)', 'rgba(168, 162, 158, 0.06)'] } },
        splitLine: { lineStyle: { color: 'rgba(168, 162, 158, 0.3)' } },
        axisLine: { lineStyle: { color: 'rgba(168, 162, 158, 0.4)' } }
      },
      series: [{
        type: 'radar',
        data: [{
          value: abilityScores,
          name: '教师平均能力',
          areaStyle: { color: 'rgba(200, 0, 12, 0.35)' },
          lineStyle: { color: '#C8000C', width: 2 },
          itemStyle: { color: '#C8000C' }
        }]
      }]
    });
    this.dashboardCharts.radar = radarChart;

    // 3. 学科参训分布排行 - 横向柱状图
    const subjectMap = {};
    teachers.forEach(t => { subjectMap[t.subject] = (subjectMap[t.subject] || 0) + 1; });
    const subjectData = Object.entries(subjectMap).map(([name, value]) => ({ name, value })).sort((a, b) => a.value - b.value);
    const subjectChart = echarts.init(document.getElementById('cockpit-subject-chart'));
    subjectChart.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: '3%', right: '10%', bottom: '3%', top: '3%', containLabel: true },
      xAxis: { type: 'value', axisLabel: { color: '#A8A29E', fontSize: 10 }, splitLine: { lineStyle: { color: 'rgba(200, 0, 12,0.06)' } } },
      yAxis: { type: 'category', data: subjectData.map(d => d.name), axisLabel: { color: '#FAFAF9', fontSize: 11 } },
      series: [{
        type: 'bar',
        data: subjectData.map(d => ({ value: d.value, itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: '#9A0009' }, { offset: 1, color: '#C8000C' }] }, borderRadius: [0, 4, 4, 0] } })),
        barWidth: '55%',
        label: { show: true, position: 'right', color: '#C8000C', fontSize: 11 }
      }]
    });
    this.dashboardCharts.subject = subjectChart;

    // 4. 活动参与完成情况 - 堆叠柱状图（显示前10个活动）
    const top10Activities = activities.slice(0, 10);
    const activityNames = top10Activities.map(a => a.name.replace(/（.+?）/g, ''));
    const completedData = [];
    const incompleteData = [];
    top10Activities.forEach(a => {
      const list = this.activityParticipants[a.id] || [];
      const completed = list.filter(p => p.completed).length;
      completedData.push(completed);
      incompleteData.push(list.length - completed);
    });

    const activityChart = echarts.init(document.getElementById('cockpit-activity-completion-chart'));
    activityChart.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { textStyle: { color: '#A8A29E', fontSize: 11 }, bottom: 28 },
      grid: { left: '3%', right: '4%', bottom: '22%', top: '8%', containLabel: true },
      dataZoom: [{ type: 'slider', show: true, xAxisIndex: 0, startValue: 0, endValue: 5, height: 18, bottom: 4, borderColor: 'transparent', backgroundColor: 'rgba(200, 0, 12,0.06)', fillerColor: 'rgba(200, 0, 12,0.2)', handleStyle: { color: '#C8000C' }, textStyle: { color: '#A8A29E', fontSize: 10 }, brushSelect: false }],
      xAxis: { type: 'category', data: activityNames, axisLabel: { color: '#A8A29E', fontSize: 10, width: 110, overflow: 'truncate', ellipsis: '...', hideOverlap: true } },
      yAxis: { type: 'value', axisLabel: { color: '#A8A29E', fontSize: 10 }, splitLine: { lineStyle: { color: 'rgba(200, 0, 12,0.06)' } } },
      series: [
        { name: '已完成', type: 'bar', stack: 'total', data: completedData, itemStyle: { color: '#C8000C', borderRadius: [4, 4, 0, 0] } },
        { name: '未完成', type: 'bar', stack: 'total', data: incompleteData, itemStyle: { color: 'rgba(200, 0, 12,0.35)', borderRadius: [4, 4, 0, 0] } }
      ]
    });
    this.dashboardCharts.activity = activityChart;

    // 5. 教师学习时长趋势 - 折线图
    const hoursMap = {};
    Object.values(this.activityLearningRecords || {}).forEach(list => {
      list.forEach(r => {
        if (r.completeTime && r.completeTime !== '-') {
          const date = r.completeTime.split(' ')[0].substring(5);
          hoursMap[date] = (hoursMap[date] || 0) + (r.hours || 0);
        }
      });
    });
    const sortedDates = Object.keys(hoursMap).sort();
    const hoursTrend = sortedDates.map(d => hoursMap[d]);

    const hoursChart = echarts.init(document.getElementById('cockpit-learning-hours-chart'));
    hoursChart.setOption({
      tooltip: { trigger: 'axis', backgroundColor: 'rgba(15,10,10,0.9)', borderColor: 'rgba(200, 0, 12,0.2)', textStyle: { color: '#FAFAF9' } },
      grid: { left: '3%', right: '4%', bottom: '5%', top: '10%', containLabel: true },
      xAxis: { type: 'category', data: sortedDates, axisLabel: { color: '#A8A29E', fontSize: 10 } },
      yAxis: { type: 'value', axisLabel: { color: '#A8A29E', fontSize: 10 }, splitLine: { lineStyle: { color: 'rgba(200, 0, 12,0.06)' } } },
      series: [{
        type: 'line',
        data: hoursTrend,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: '#A8A29E', width: 2 },
        itemStyle: { color: '#A8A29E' },
        areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(168, 162, 158,0.2)' }, { offset: 1, color: 'rgba(168, 162, 158,0.02)' }] } }
      }]
    });
    this.dashboardCharts.hours = hoursChart;

    // 6. 热门课程 TOP5
    const topCourses = [...courses].sort((a, b) => (b.learners || 0) - (a.learners || 0)).slice(0, 5);
    const maxLearners = topCourses[0]?.learners || 1;
    document.getElementById('cockpit-top-courses').innerHTML = topCourses.map((c, i) => `
      <div class="cockpit-rank-item" style="cursor:pointer;" onclick="app.viewCourseData('${c.id}')">
        <div class="cockpit-rank-num">${i + 1}</div>
        <div class="cockpit-rank-name" title="${c.name}">${c.name}</div>
        <div class="cockpit-rank-bar-wrap">
          <div class="cockpit-rank-bar" style="width: ${(c.learners / maxLearners) * 100}%;"></div>
        </div>
        <div class="cockpit-rank-value">${c.learners}</div>
      </div>
    `).join('');

    // 8. 活跃教师 TOP5
    const teacherHoursMap = {};
    Object.values(this.activityParticipants || {}).forEach(list => {
      list.forEach(p => { teacherHoursMap[p.teacherId] = (teacherHoursMap[p.teacherId] || 0) + (p.earnedHours || 0); });
    });
    const teacherHoursList = Object.entries(teacherHoursMap)
      .map(([tid, hours]) => ({ teacherId: tid, hours, name: (MOCK_TEACHERS.find(t => t.id === tid)?.name || tid) }))
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 5);
    const maxHours = teacherHoursList[0]?.hours || 1;
    document.getElementById('cockpit-top-teachers').innerHTML = teacherHoursList.map((t, i) => `
      <div class="cockpit-rank-item">
        <div class="cockpit-rank-num">${i + 1}</div>
        <div class="cockpit-rank-name">${t.name}</div>
        <div class="cockpit-rank-bar-wrap">
          <div class="cockpit-rank-bar" style="width: ${(t.hours / maxHours) * 100}%;"></div>
        </div>
        <div class="cockpit-rank-value">${t.hours}h</div>
      </div>
    `).join('');

    // 9. 热门活动 TOP5（按参与人数排序）
    const topActivities = [...activities].sort((a, b) => (b.participants?.length || 0) - (a.participants?.length || 0)).slice(0, 5);
    const maxParticipants = topActivities[0]?.participants?.length || 1;
    document.getElementById('cockpit-top-activities').innerHTML = topActivities.map((a, i) => `
      <div class="cockpit-rank-item" style="cursor:pointer;" onclick="app.goToActivityFollow('${a.id}')">
        <div class="cockpit-rank-num">${i + 1}</div>
        <div class="cockpit-rank-name" title="${a.name}">${a.name}</div>
        <div class="cockpit-rank-bar-wrap">
          <div class="cockpit-rank-bar" style="width: ${((a.participants?.length || 0) / maxParticipants) * 100}%;"></div>
        </div>
        <div class="cockpit-rank-value">${a.participants?.length || 0}人</div>
      </div>
    `).join('');

    // 10. 高频词云
    const wordCloudChart = echarts.init(document.getElementById('cockpit-word-cloud'));
    wordCloudChart.setOption({
      tooltip: { show: true },
      series: [{
        type: 'wordCloud',
        shape: 'circle',
        left: 'center',
        top: 'center',
        width: '90%',
        height: '90%',
        right: null,
        bottom: null,
        sizeRange: [12, 32],
        rotationRange: [-45, 45],
        rotationStep: 45,
        gridSize: 8,
        drawOutOfBound: false,
        textStyle: {
          fontFamily: 'sans-serif',
          fontWeight: 'bold',
          color: function () {
            const colors = ['#C8000C', '#E85D6A', '#FAFAF9', '#A8A29E', '#FDE8E8'];
            return colors[Math.floor(Math.random() * colors.length)];
          }
        },
        emphasis: {
          focus: 'self',
          textStyle: { textShadowBlur: 10, textShadowColor: '#333' }
        },
        data: MOCK_HOT_WORDS
      }]
    });
    this.dashboardCharts.wordCloud = wordCloudChart;

    // 11. 热门问题 TOP5
    const topQuestions = [...MOCK_HOT_QUESTIONS].sort((a, b) => b.count - a.count).slice(0, 5);
    const maxQuestionCount = topQuestions[0]?.count || 1;
    document.getElementById('cockpit-top-questions').innerHTML = topQuestions.map((q, i) => `
      <div class="cockpit-rank-item">
        <div class="cockpit-rank-num">${i + 1}</div>
        <div class="cockpit-rank-name" title="${q.name}">${q.name}</div>
        <div class="cockpit-rank-bar-wrap">
          <div class="cockpit-rank-bar" style="width: ${(q.count / maxQuestionCount) * 100}%;"></div>
        </div>
        <div class="cockpit-rank-value">${q.count}</div>
      </div>
    `).join('');

    // 12. 实时刷新机制（每5秒刷新一次）
    if (this.refreshTimer) clearInterval(this.refreshTimer);
    this.refreshTimer = setInterval(() => {
      // 模拟数据微变，产生实时感
      const jitter = () => Math.random() > 0.5 ? 1 : -1;
      this.courses.forEach(c => { if (c.learners !== undefined) c.learners = Math.max(0, c.learners + jitter()); });
      Object.values(this.activityParticipants || {}).forEach(list => {
        list.forEach(p => { if (p.earnedHours !== undefined) p.earnedHours = Math.max(0, Math.round((p.earnedHours + jitter() * 0.5) * 10) / 10); });
      });
      // 重新渲染（不销毁图表，仅更新数据和option）
      this.renderDashboardRealtimeUpdate();
    }, 5000);
  },

  renderDashboardRealtimeUpdate() {
    const courses = this.courses || [];
    const activities = this.activities || [];

    let totalParticipants = 0;
    let completedParticipants = 0;
    Object.values(this.activityParticipants || {}).forEach(list => {
      totalParticipants += list.length;
      completedParticipants += list.filter(p => p.completed).length;
    });
    const completionRate = totalParticipants > 0 ? Math.round((completedParticipants / totalParticipants) * 100) : 0;

    document.getElementById('dash-completed-teachers').textContent = completedParticipants;
    document.getElementById('dash-completion-rate').textContent = completionRate + '%';

    // 更新折线图（学习时长）
    const hoursChart = this.dashboardCharts.hours;
    if (hoursChart) {
      const hoursMap = {};
      Object.values(this.activityLearningRecords || {}).forEach(list => {
        list.forEach(r => {
          if (r.completeTime && r.completeTime !== '-') {
            const date = r.completeTime.split(' ')[0].substring(5);
            hoursMap[date] = (hoursMap[date] || 0) + (r.hours || 0);
          }
        });
      });
      const sortedDates = Object.keys(hoursMap).sort();
      hoursChart.setOption({ xAxis: { data: sortedDates }, series: [{ data: sortedDates.map(d => hoursMap[d]) }] });
    }

    // 更新活动参与图
    const activityChart = this.dashboardCharts.activity;
    if (activityChart) {
      const completedData = [];
      const incompleteData = [];
      activities.forEach(a => {
        const list = this.activityParticipants[a.id] || [];
        const completed = list.filter(p => p.completed).length;
        completedData.push(completed);
        incompleteData.push(list.length - completed);
      });
      activityChart.setOption({ series: [{ data: completedData }, { data: incompleteData }] });
    }

    // 更新TOP5列表
    const topCourses = [...courses].sort((a, b) => (b.learners || 0) - (a.learners || 0)).slice(0, 5);
    const maxLearners = topCourses[0]?.learners || 1;
    document.getElementById('cockpit-top-courses').innerHTML = topCourses.map((c, i) => `
      <div class="cockpit-rank-item" style="cursor:pointer;" onclick="app.viewCourseData('${c.id}')">
        <div class="cockpit-rank-num">${i + 1}</div>
        <div class="cockpit-rank-name" title="${c.name}">${c.name}</div>
        <div class="cockpit-rank-bar-wrap">
          <div class="cockpit-rank-bar" style="width: ${(c.learners / maxLearners) * 100}%;"></div>
        </div>
        <div class="cockpit-rank-value">${c.learners}</div>
      </div>
    `).join('');

    const teacherHoursMap = {};
    Object.values(this.activityParticipants || {}).forEach(list => {
      list.forEach(p => { teacherHoursMap[p.teacherId] = (teacherHoursMap[p.teacherId] || 0) + (p.earnedHours || 0); });
    });
    const teacherHoursList = Object.entries(teacherHoursMap)
      .map(([tid, hours]) => ({ teacherId: tid, hours, name: (MOCK_TEACHERS.find(t => t.id === tid)?.name || tid) }))
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 5);
    const maxHours = teacherHoursList[0]?.hours || 1;
    document.getElementById('cockpit-top-teachers').innerHTML = teacherHoursList.map((t, i) => `
      <div class="cockpit-rank-item">
        <div class="cockpit-rank-num">${i + 1}</div>
        <div class="cockpit-rank-name">${t.name}</div>
        <div class="cockpit-rank-bar-wrap">
          <div class="cockpit-rank-bar" style="width: ${(t.hours / maxHours) * 100}%;"></div>
        </div>
        <div class="cockpit-rank-value">${t.hours}h</div>
      </div>
    `).join('');

    const topActivities = [...activities].sort((a, b) => (b.participants?.length || 0) - (a.participants?.length || 0)).slice(0, 5);
    const maxParticipants = topActivities[0]?.participants?.length || 1;
    document.getElementById('cockpit-top-activities').innerHTML = topActivities.map((a, i) => `
      <div class="cockpit-rank-item" style="cursor:pointer;" onclick="app.goToActivityFollow('${a.id}')">
        <div class="cockpit-rank-num">${i + 1}</div>
        <div class="cockpit-rank-name" title="${a.name}">${a.name}</div>
        <div class="cockpit-rank-bar-wrap">
          <div class="cockpit-rank-bar" style="width: ${((a.participants?.length || 0) / maxParticipants) * 100}%;"></div>
        </div>
        <div class="cockpit-rank-value">${a.participants?.length || 0}人</div>
      </div>
    `).join('');
  },

  toggleCockpitFullscreen() {
    const el = document.getElementById('page-dashboard');
    const btn = document.getElementById('cockpit-fullscreen-btn');
    if (!el || !btn) return;

    if (document.fullscreenElement) {
      document.exitFullscreen().then(() => {
        btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg><span>全屏</span>`;
      }).catch(() => {});
    } else {
      el.requestFullscreen().then(() => {
        btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg><span>退出</span>`;
      }).catch(() => {});
    }
  }
};

// ========== Boot ==========
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});

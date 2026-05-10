let currentData = {};

document.addEventListener('DOMContentLoaded', async () => {
    const loginScreen = document.getElementById('login-screen');
    const adminPanel = document.getElementById('admin-panel');
    const loginBtn = document.getElementById('login-btn');
    const passInput = document.getElementById('admin-pass');
    const errorMsg = document.getElementById('login-error');

    // Password simple
    const ADMIN_PASS = 'kevin123';

    loginBtn.addEventListener('click', () => {
        if (passInput.value === ADMIN_PASS) {
            localStorage.setItem('admin_logged', 'true');
            loginScreen.classList.add('hidden');
            showPanel();
        } else {
            errorMsg.classList.remove('hidden');
        }
    });

    if (localStorage.getItem('admin_logged') === 'true') {
        showPanel();
    }

    async function showPanel() {
        loginScreen.classList.add('hidden');
        adminPanel.classList.remove('hidden');
        await loadData();
    }

    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('admin_logged');
        location.reload();
    });

    async function loadData() {
        try {
            const response = await fetch('content.json');
            currentData = await response.json();
            fillForms();
        } catch (e) {
            console.error("Error loading JSON", e);
        }
    }

    function fillForms() {
        // Hero
        document.getElementById('hero-name').value = currentData.hero.name;
        document.getElementById('hero-subtitle').value = currentData.hero.subtitle;
        document.getElementById('hero-image').value = currentData.hero.image;

        // About
        document.getElementById('about-desc').value = currentData.about.description;

        // Skills
        const skillsList = document.getElementById('skills-list');
        skillsList.innerHTML = '';
        currentData.skills.forEach((skill, idx) => {
            const div = document.createElement('div');
            div.className = 'border border-secondary p-2 mb-2 rounded';
            div.innerHTML = `
                <input type="text" class="form-control bg-dark text-white mb-2" value="${skill.category}" onchange="updateSkill(${idx}, 'category', this.value)">
                <input type="text" class="form-control bg-dark text-white" value="${skill.items.join(', ')}" onchange="updateSkill(${idx}, 'items', this.value)">
                <button class="btn btn-sm btn-danger mt-1" onclick="removeItem('skills', ${idx})">Eliminar</button>
            `;
            skillsList.appendChild(div);
        });

        // Experience
        const expList = document.getElementById('experience-list');
        expList.innerHTML = '';
        currentData.experience.forEach((exp, idx) => {
            const div = document.createElement('div');
            div.className = 'border border-secondary p-2 mb-2 rounded';
            div.innerHTML = `
                <input type="text" class="form-control bg-dark text-white mb-2" value="${exp.title}" placeholder="Título" onchange="updateExp(${idx}, 'title', this.value)">
                <input type="text" class="form-control bg-dark text-white mb-2" value="${exp.period}" placeholder="Periodo" onchange="updateExp(${idx}, 'period', this.value)">
                <textarea class="form-control bg-dark text-white" onchange="updateExp(${idx}, 'description', this.value)">${exp.description}</textarea>
                <button class="btn btn-sm btn-danger mt-1" onclick="removeItem('experience', ${idx})">Eliminar</button>
            `;
            expList.appendChild(div);
        });

        // Projects (Carousels)
        const projList = document.getElementById('projects-list');
        projList.innerHTML = '';
        currentData.projectCarousels.forEach((carousel, cIdx) => {
            const div = document.createElement('div');
            div.className = 'border border-primary p-3 mb-3 rounded';
            div.innerHTML = `
                <input type="text" class="form-control bg-dark text-white mb-2" value="${carousel.title}" placeholder="Título del Grupo" onchange="currentData.projectCarousels[${cIdx}].title = this.value">
                <div id="items-${cIdx}">
                    ${carousel.items.map((item, iIdx) => `
                        <div class="ms-4 border-start border-secondary ps-3 mb-2">
                            <input type="text" class="form-control bg-dark text-white mb-1" value="${item.title}" placeholder="Título Proyecto" onchange="currentData.projectCarousels[${cIdx}].items[${iIdx}].title = this.value">
                            <input type="text" class="form-control bg-dark text-white mb-1" value="${item.image}" placeholder="Ruta Imagen" onchange="currentData.projectCarousels[${cIdx}].items[${iIdx}].image = this.value">
                            <input type="text" class="form-control bg-dark text-white mb-1" value="${item.link || ''}" placeholder="URL Proyecto (opcional)" onchange="currentData.projectCarousels[${cIdx}].items[${iIdx}].link = this.value">
                            <textarea class="form-control bg-dark text-white mb-1" onchange="currentData.projectCarousels[${cIdx}].items[${iIdx}].description = this.value">${item.description}</textarea>
                            <button class="btn btn-sm btn-danger" onclick="currentData.projectCarousels[${cIdx}].items.splice(${iIdx}, 1); fillForms()">Eliminar Item</button>
                        </div>
                    `).join('')}
                </div>
                <button class="btn btn-sm btn-outline-info mt-2" onclick="currentData.projectCarousels[${cIdx}].items.push({title: 'Nuevo', description: 'Desc', image: '', link: ''}); fillForms()">+ Añadir Item</button>
                <button class="btn btn-sm btn-danger mt-2 ms-2" onclick="currentData.projectCarousels.splice(${cIdx}, 1); fillForms()">Eliminar Grupo</button>
            `;
            projList.appendChild(div);
        });

        // Blog
        const blogList = document.getElementById('blog-list');
        blogList.innerHTML = '';
        currentData.blog.forEach((post, idx) => {
            const div = document.createElement('div');
            div.className = 'border border-secondary p-2 mb-2 rounded';
            div.innerHTML = `
                <input type="text" class="form-control bg-dark text-white mb-2" value="${post.title}" onchange="updateBlog(${idx}, 'title', this.value)">
                <input type="text" class="form-control bg-dark text-white mb-2" value="${post.image}" onchange="updateBlog(${idx}, 'image', this.value)">
                <textarea class="form-control bg-dark text-white mb-2" placeholder="Extracto" onchange="updateBlog(${idx}, 'excerpt', this.value)">${post.excerpt}</textarea>
                <textarea class="form-control bg-dark text-white" placeholder="Contenido Full (HTML permitido)" rows="5" onchange="updateBlog(${idx}, 'content', this.value)">${post.content}</textarea>
                <button class="btn btn-sm btn-danger mt-1" onclick="removeItem('blog', ${idx})">Eliminar</button>
            `;
            blogList.appendChild(div);
        });

        // Social
        document.getElementById('social-linkedin').value = currentData.social.linkedin;
        document.getElementById('social-github').value = currentData.social.github;
        document.getElementById('social-email').value = currentData.social.email;
        document.getElementById('meta-title-input').value = currentData.meta.title;

        // Settings
        document.getElementById('settings-heading-size').value = currentData.settings.headingFontSize;
        document.getElementById('settings-body-size').value = currentData.settings.bodyFontSize;
    }

    // Exportación
    document.getElementById('save-json-btn').addEventListener('click', () => {
        syncData();
        const blob = new Blob([JSON.stringify(currentData, null, 2)], {type: "application/json"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "content.json";
        a.click();
    });

    document.getElementById('copy-json-btn').addEventListener('click', () => {
        syncData();
        navigator.clipboard.writeText(JSON.stringify(currentData, null, 2)).then(() => {
            alert("Copiado al portapapeles. Pégalo en tu archivo content.json");
        });
    });

    function syncData() {
        currentData.hero.name = document.getElementById('hero-name').value;
        currentData.hero.subtitle = document.getElementById('hero-subtitle').value;
        currentData.hero.image = document.getElementById('hero-image').value;
        currentData.about.description = document.getElementById('about-desc').value;
        currentData.social.linkedin = document.getElementById('social-linkedin').value;
        currentData.social.github = document.getElementById('social-github').value;
        currentData.social.email = document.getElementById('social-email').value;
        currentData.meta.title = document.getElementById('meta-title-input').value;
        currentData.settings.headingFontSize = document.getElementById('settings-heading-size').value;
        currentData.settings.bodyFontSize = document.getElementById('settings-body-size').value;
    }

    // Funciones globales para botones dinámicos
    window.updateSkill = (idx, key, val) => {
        if (key === 'items') currentData.skills[idx].items = val.split(',').map(s => s.trim());
        else currentData.skills[idx].category = val;
    };
    window.updateExp = (idx, key, val) => currentData.experience[idx][key] = val;
    window.updateProj = (idx, key, val) => currentData.projects[idx][key] = val;
    window.updateBlog = (idx, key, val) => currentData.blog[idx][key] = val;
    
    window.removeItem = (key, idx) => {
        currentData[key].splice(idx, 1);
        fillForms();
    };

    window.addSkillCategory = () => {
        currentData.skills.push({ category: "Nueva", items: ["Item 1"] });
        fillForms();
    };

    window.addExperience = () => {
        currentData.experience.push({ title: "Título", period: "Fecha", description: "Desc" });
        fillForms();
    };

    window.addProject = () => {
        currentData.projectCarousels.push({ title: "Nuevo Grupo", items: [{ title: "Nuevo", description: "Desc", image: "" }] });
        fillForms();
    };

    window.addBlogPost = () => {
        currentData.blog.push({ title: "Nuevo Post", excerpt: "Extracto", content: "Contenido", image: "assets/img/..." });
        fillForms();
    };
});

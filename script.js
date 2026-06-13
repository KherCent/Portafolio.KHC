document.addEventListener('DOMContentLoaded', () => {
    // --- CARGA DE CONTENIDO DINÁMICO (CMS) ---
    async function loadContent() {
        try {
            const response = await fetch('content.json?t=' + Date.now());
            const data = await response.json();

            // Meta
            document.getElementById('meta-title').textContent = data.meta.title;
            document.getElementById('meta-desc').setAttribute('content', data.meta.description);

            // Hero
            const heroContainer = document.getElementById('hero-container');
            heroContainer.innerHTML = `
                <img src="${data.hero.image}" alt="Icono Hero" class="img-fluid mb-4 floating-animation">
                <h1 class="brand-heading">${data.hero.name}</h1>
                <p class="intro-text" id="typing-text"></p>
                <a class="btn-circle" role="button" href="#about" aria-label="Desplazarse hacia abajo">
                    <i class="fa fa-angle-double-down"></i>
                </a>
            `;

            // Typing Effect
            const text = data.hero.subtitle;
            let charIdx = 0;
            const typingEl = document.getElementById("typing-text");
            function typeWriter() {
                if (charIdx < text.length) {
                    typingEl.textContent += text.charAt(charIdx);
                    charIdx++;
                    setTimeout(typeWriter, 45);
                }
            }
            typeWriter();

            // About
            const aboutContainer = document.getElementById('about-container');
            aboutContainer.innerHTML = `
                <h2>${data.about.title}</h2>
                <p>${data.about.description}</p>
            `;

            // Skills
            const skillsContainer = document.getElementById('skills-container');
            skillsContainer.innerHTML = data.skills.map(skill => `
                <div class="col-lg-3 col-md-6 mb-4">
                    <div class="skill-card reveal">
                        <h4 class="text-primary">${skill.category}</h4>
                        <ul class="list-unstyled">
                            ${skill.items.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `).join('');

            // Experience
            const experienceContainer = document.getElementById('experience-container');
            experienceContainer.innerHTML = data.experience.map(exp => `
                <div class="timeline-item reveal">
                    <h4 class="text-primary">${exp.title}</h4>
                    <span class="text-muted">${exp.period}</span>
                    <p>${exp.description}</p>
                </div>
            `).join('');

            // Settings: Apply Font Sizes
            if (data.settings) {
                document.documentElement.style.setProperty('--heading-size', data.settings.headingFontSize);
                document.documentElement.style.setProperty('--body-size', data.settings.bodyFontSize);
                document.body.style.fontSize = data.settings.bodyFontSize;
            }

            // Projects (Carousel Style)
            const projectsContainer = document.getElementById('projects-container');
            projectsContainer.innerHTML = data.projectCarousels.map((carousel, cIdx) => `
                <div class="col-lg-6 mb-5">
                    <h4 class="text-primary mb-3">${carousel.title}</h4>
                    <div class="project-card reveal">
                        <div id="carousel-${cIdx}" class="carousel slide" data-bs-ride="carousel" data-bs-interval="false">
                            <div class="carousel-inner">
                                ${carousel.items.map((item, iIdx) => `
                                    <div class="carousel-item ${iIdx === 0 ? 'active' : ''}" style="--bg-img: url('${item.image}');">
                                        <img src="${item.image}" class="d-block img-fluid mx-auto" alt="${item.title}">
                                        <div class="carousel-caption d-md-block">
                                            <h5 class="text-primary">${item.title}</h5>
                                            <p>${item.description}</p>
                                            ${item.link ? `<a href="${item.link}" target="_blank" class="btn btn-primary btn-sm mt-2">Ver Proyecto</a>` : ''}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                            ${carousel.items.length > 1 ? `
                            <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${cIdx}" data-bs-slide="prev">
                                <span class="carousel-control-prev-icon"></span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#carousel-${cIdx}" data-bs-slide="next">
                                <span class="carousel-control-next-icon"></span>
                            </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `).join('');

            // Blog (Carousel Style)
            const blogContainer = document.getElementById('blog-container');
            blogContainer.innerHTML = `
                <div id="blogCarousel" class="carousel slide" data-bs-ride="carousel" data-bs-interval="false">
                    <div class="carousel-inner">
                        ${data.blog.map((post, index) => `
                            <div class="carousel-item ${index === 0 ? 'active' : ''}">
                                <div class="row justify-content-center">
                                    <div class="col-lg-8">
                                        <article class="blog-item reveal" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(0,229,255,0.1); border-radius: 15px; overflow: hidden; margin-bottom: 20px;">
                                            <div class="blog-img-container">
                                                <img src="${post.image}" alt="${post.title}" style="width: 100%; height: 350px; object-fit: cover;">
                                            </div>
                                            <div class="p-4">
                                                <h3 class="text-primary mb-3">${post.title}</h3>
                                                <p class="texto-destacado mb-3" style="font-size: 1.1rem; color: #fff;">${post.excerpt}</p>
                                                <a href="#" class="read-more btn btn-outline-primary btn-sm" data-index="${index}">Leer más...</a>
                                                <div class="blog-content-full mt-3" id="blog-content-${index}">
                                                    <div class="p-3" style="background: rgba(255,255,255,0.03); border-radius: 10px; color: var(--text-dim); text-align: left; line-height: 1.6;">
                                                        ${post.content.replace(/\n/g, '<br>')}
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#blogCarousel" data-bs-slide="prev" style="width: 5%;">
                        <span class="carousel-control-prev-icon"></span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#blogCarousel" data-bs-slide="next" style="width: 5%;">
                        <span class="carousel-control-next-icon"></span>
                    </button>
                    <div class="carousel-indicators" style="position: relative; margin-top: 20px;">
                        ${data.blog.map((_, i) => `
                            <button type="button" data-bs-target="#blogCarousel" data-bs-slide-to="${i}" class="${i === 0 ? 'active' : ''}"></button>
                        `).join('')}
                    </div>
                </div>
            `;

            // Social
            const socialContainer = document.getElementById('social-container');
            socialContainer.innerHTML = `
                <li class="list-inline-item">
                    <a href="${data.social.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">
                        <span class="fa-stack fa-lg">
                            <i class="fa fa-circle fa-stack-2x"></i>
                            <i class="fa fa-linkedin fa-stack-1x fa-inverse"></i>
                        </span>
                    </a>
                </li>
                <li class="list-inline-item">
                    <a href="${data.social.github}" target="_blank" rel="noopener" aria-label="GitHub Antiguo" title="GitHub Antiguo">
                        <span class="fa-stack fa-lg">
                            <i class="fa fa-circle fa-stack-2x"></i>
                            <i class="fa fa-github fa-stack-1x fa-inverse"></i>
                        </span>
                    </a>
                </li>
                <li class="list-inline-item">
                    <a href="${data.social.github_new}" target="_blank" rel="noopener" aria-label="GitHub Nuevo" title="GitHub Nuevo (Actual)">
                        <span class="fa-stack fa-lg">
                            <i class="fa fa-circle fa-stack-2x" style="color: var(--primary-main);"></i>
                            <i class="fa fa-github fa-stack-1x fa-inverse"></i>
                        </span>
                    </a>
                </li>
                <li class="list-inline-item">
                    <a href="mailto:${data.social.email}" aria-label="Email">
                        <span class="fa-stack fa-lg">
                            <i class="fa fa-circle fa-stack-2x"></i>
                            <i class="fa fa-envelope fa-stack-1x fa-inverse"></i>
                        </span>
                    </a>
                </li>
            `;

            // Education
            const educationContainer = document.getElementById('education-container');
            if (data.education && educationContainer) {
                educationContainer.innerHTML = `
                    <div class="row text-start reveal">
                        <div class="col-md-6 mb-4">
                            <h4 class="text-primary mb-4" style="font-size: 1.25rem;"><i class="fa fa-graduation-cap me-2"></i>Títulos Académicos</h4>
                            <div class="timeline-education">
                                ${data.education.map(edu => `
                                    <div class="mb-4 ps-3 border-start border-primary" style="border-width: 2px !important;">
                                        <h5 class="mb-1 text-white" style="font-size: 1.05rem;">${edu.degree}</h5>
                                        <p class="mb-0" style="color: var(--text-dim); font-size: 0.95rem;">${edu.institution}</p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        <div class="col-md-6 mb-4">
                            <h4 class="text-primary mb-4" style="font-size: 1.25rem;"><i class="fa fa-id-card-o me-2"></i>Licencias y Conducción</h4>
                            <ul class="list-unstyled">
                                ${data.licenses.map(lic => `
                                    <li style="color: var(--text-dim); font-size: 0.95rem;" class="mb-2">
                                        <i class="fa fa-check text-primary me-2"></i>${lic}
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                `;
            }

            // Blog read-more
            document.querySelectorAll('.read-more').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const idx = e.target.getAttribute('data-index');
                    const content = document.getElementById(`blog-content-${idx}`);
                    const isShowing = content.classList.toggle('show');
                    e.target.textContent = isShowing ? 'Leer menos' : 'Leer más...';
                });
            });

            // Reveal Animations
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    }
                });
            }, { threshold: 0.1 });
            document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

        } catch (error) {
            console.error("Error cargando contenido:", error);
            // Fallback: mostrar mensaje
            document.getElementById('hero-container').innerHTML = '<p class="text-danger">Error cargando contenido. Verifica content.json</p>';
        }
    }

    loadContent();

    // --- JUEGO DE LA VIDA ---
    const gridContainer = document.getElementById('juegoVida');
    let cells = [];
    let isPlaying = false;
    let intervalId;

    const numRows = 30;
    const numCols = 30;

    let isDrawing = false;
    let drawMode = null; // 'activate' o 'deactivate'

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            gridContainer.appendChild(cell);
            cells.push(cell);
        }
    }

    setDefaultAutomata();

    // Función para activar/desactivar una celda
    function setCellState(cell, active) {
        if (active) {
            cell.classList.add('active');
        } else {
            cell.classList.remove('active');
        }
    }

    // Función para manejar la celda bajo el cursor
    function handleCell(cell) {
        if (!cell || !cell.classList.contains('cell')) return;
        if (isPlaying) return;
        
        if (drawMode === 'activate') {
            cell.classList.add('active');
        } else if (drawMode === 'deactivate') {
            cell.classList.remove('active');
        }
    }

    // Prevenir menú contextual en el grid
    gridContainer.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    // Eventos de mouse en el grid
    gridContainer.addEventListener('mousedown', (e) => {
        if (isPlaying) return;
        e.preventDefault();
        
        const cell = e.target;
        if (!cell.classList.contains('cell')) return;

        // Mantener click (arrastrar) = ACTIVAR
        if (e.button === 0 && !e.ctrlKey) {
            setCellState(cell, true);
            drawMode = 'activate';
            isDrawing = true;
        }
        // Click izquierdo con Ctrl = DESACTIVAR
        else if ((e.button === 0 && e.ctrlKey) || e.button === 2) {
            setCellState(cell, false);
            drawMode = 'deactivate';
            isDrawing = true;
        }
    });

    gridContainer.addEventListener('mousemove', (e) => {
        if (!isDrawing || isPlaying) return;
        const cell = e.target;
        handleCell(cell);
    });

    gridContainer.addEventListener('mouseup', () => {
        isDrawing = false;
        drawMode = null;
    });

    gridContainer.addEventListener('mouseleave', () => {
        isDrawing = false;
        drawMode = null;
    });

    // Click simple (para cuando no se ha arrastrado)
    gridContainer.addEventListener('mouseup', (e) => {
        // El click simple ya se maneja en mousedown
    });

    function startGame() {
        isPlaying = !isPlaying;
        if (isPlaying) {
            intervalId = setInterval(updateCells, 500);
            document.getElementById('playButton').textContent = 'Pause';
        } else {
            clearInterval(intervalId);
            document.getElementById('playButton').textContent = 'Play';
        }
    }

    function setDefaultAutomata() {
        const gliderCoordinates = [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]];
        for (const [row, col] of gliderCoordinates) {
            const index = row * numCols + col;
            cells[index].classList.add('active');
        }
    }

    function getCellState(row, col) {
        if (row < 0 || row >= numRows || col < 0 || col >= numCols) return false;
        return cells[row * numCols + col].classList.contains('active');
    }

    function getActiveNeighbors(row, col) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                if (getCellState(row + i, col + j)) count++;
            }
        }
        return count;
    }

    function updateCells() {
        const newStates = cells.map((_, i) => {
            const row = Math.floor(i / numCols);
            const col = i % numCols;
            const isActive = getCellState(row, col);
            const neighbors = getActiveNeighbors(row, col);
            if (isActive && (neighbors < 2 || neighbors > 3)) return false;
            if (!isActive && neighbors === 3) return true;
            return isActive;
        });

        cells.forEach((cell, i) => {
            if (newStates[i]) cell.classList.add('active');
            else cell.classList.remove('active');
        });
    }

    document.getElementById('playButton').addEventListener('click', startGame);
    document.getElementById('resetButton').addEventListener('click', () => {
        clearInterval(intervalId);
        isPlaying = false;
        document.getElementById('playButton').textContent = 'Play';
        cells.forEach(c => c.classList.remove('active'));
        setDefaultAutomata();
    });
});
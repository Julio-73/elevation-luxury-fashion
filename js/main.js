/* ==========================================================================
   ÉLÉVATION — Haute Couture & Ready-to-Wear
   main.js · JavaScript moderno (ES6+) sin dependencias
   --------------------------------------------------------------------------
   Módulos
   01. Utilidades
   02. Bloqueo de scroll y gestión de foco
   03. Progreso de lectura
   04. Header (blur al scroll, auto-ocultar en desktop)
   05. Menú móvil (drawer)
   06. Navegación: scroll suave + scrollspy
   07. Revelado al hacer scroll
   08. Contadores animados
   09. Filtros de colección
   10. Modal de pieza
   11. Lightbox de lookbook
   12. Modal legal
   13. Formulario de contacto
   14. Newsletter VIP
   15. Volver arriba
   16. Halo del cursor
   17. Año dinámico
   ========================================================================== */

(() => {
  'use strict';

  /* ======================================================================
     01. UTILIDADES
     ====================================================================== */
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduceMotion = () => motionQuery.matches;

  const finePointer = () => window.matchMedia('(pointer: fine)').matches;

  const on = (target, event, handler, options) => {
    if (target) target.addEventListener(event, handler, options);
  };

  /** Limita la frecuencia de ejecución a un frame por evento. */
  const rafThrottle = (fn) => {
    let queued = false;
    return (...args) => {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(() => {
        queued = false;
        fn(...args);
      });
    };
  };

  const scrollBehavior = () => (reduceMotion() ? 'auto' : 'smooth');

  const headerOffset = () => {
    const header = document.querySelector('.site-header');
    if (header) return header.getBoundingClientRect().height + 10;
    return 90;
  };

  /** Desplazamiento suave teniendo en cuenta el header fijo. */
  const scrollToTarget = (target) => {
    const el = typeof target === 'string' ? $(target) : target;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - headerOffset() + 1;
    window.scrollTo({ top: Math.max(top, 0), behavior: scrollBehavior() });
  };

  const FOCUSABLE = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');

  const getFocusable = (container) =>
    $$(FOCUSABLE, container).filter(
      (el) => el.offsetParent !== null || el === document.activeElement || getComputedStyle(el).position === 'fixed'
    );

  /* ======================================================================
     02. BLOQUEO DE SCROLL Y GESTIÓN DE FOCO
     ====================================================================== */
  const ScrollLock = (() => {
    let depth = 0;
    let savedPadding = '';

    const lock = () => {
      depth += 1;
      if (depth > 1) return;
      const gap = window.innerWidth - document.documentElement.clientWidth;
      savedPadding = document.body.style.paddingRight;
      if (gap > 0) document.body.style.paddingRight = `${gap}px`;
      document.body.classList.add('is-locked');
    };

    const unlock = () => {
      if (depth === 0) return;
      depth -= 1;
      if (depth > 0) return;
      document.body.classList.remove('is-locked');
      document.body.style.paddingRight = savedPadding;
    };

    return { lock, unlock };
  })();

  /** Contenedor accesible tipo diálogo: foco atrapado, Escape y restauración. */
  class Overlay {
    constructor(root, { onClose } = {}) {
      this.root = root;
      this.onClose = onClose;
      this.isOpen = false;
      this.lastFocus = null;

      on(this.root, 'keydown', (event) => this.#handleKeydown(event));
      $$('[data-overlay-close]', this.root).forEach((el) =>
        on(el, 'click', () => this.close())
      );
    }

    #handleKeydown(event) {
      if (!this.isOpen) return;
      if (event.key === 'Escape') {
        event.stopPropagation();
        this.close();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusables = getFocusable(this.root);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    open(focusTarget) {
      if (this.isOpen) return;
      this.isOpen = true;
      this.lastFocus = document.activeElement;
      this.root.classList.add('is-open');
      this.root.setAttribute('aria-hidden', 'false');
      ScrollLock.lock();

      window.requestAnimationFrame(() => {
        const target = focusTarget || getFocusable(this.root)[0] || this.root;
        target.focus({ preventScroll: true });
      });
    }

    close() {
      if (!this.isOpen) return;
      this.isOpen = false;
      this.root.classList.remove('is-open');
      this.root.setAttribute('aria-hidden', 'true');
      ScrollLock.unlock();
      if (typeof this.onClose === 'function') this.onClose();

      if (this.lastFocus && document.contains(this.lastFocus)) {
        this.lastFocus.focus({ preventScroll: true });
      }
    }
  }

  /* ======================================================================
     03. PROGRESO DE LECTURA
     ====================================================================== */
  const initScrollProgress = () => {
    const bar = $('.scroll-progress');
    if (!bar) return;

    const update = rafThrottle(() => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
      bar.style.transform = `scaleX(${ratio.toFixed(4)})`;
    });

    on(window, 'scroll', update, { passive: true });
    on(window, 'resize', update);
    update();
  };

  /* ======================================================================
     04. HEADER
     ====================================================================== */
  const initHeader = () => {
    const header = $('.site-header');
    if (!header) return;

    const desktop = window.matchMedia('(min-width: 1024px)');
    let lastY = window.scrollY;

    const update = rafThrottle(() => {
      const y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 24);

      const scrollingDown = y > lastY + 4;
      const scrollingUp = y < lastY - 4;

      if (desktop.matches && !document.body.classList.contains('is-locked')) {
        if (scrollingDown && y > 620) header.classList.add('is-hidden');
        if (scrollingUp || y < 320) header.classList.remove('is-hidden');
      } else {
        header.classList.remove('is-hidden');
      }

      if (Math.abs(y - lastY) > 4) lastY = y;
    });

    on(window, 'scroll', update, { passive: true });
    on(window, 'resize', update);
    update();
  };

  /* ======================================================================
     05. MENÚ MÓVIL
     ====================================================================== */
  const initDrawer = () => {
    const drawer = $('#drawer');
    const toggle = $('.burger');
    if (!drawer || !toggle) return;

    const openDrawer = () => {
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Cerrar menú de navegación');
      ScrollLock.lock();
      window.requestAnimationFrame(() => {
        const first = getFocusable(drawer)[0];
        if (first) first.focus({ preventScroll: true });
      });
    };

    const closeDrawer = () => {
      if (!drawer.classList.contains('is-open')) return;
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menú de navegación');
      ScrollLock.unlock();
      toggle.focus({ preventScroll: true });
    };

    on(toggle, 'click', () => {
      if (drawer.classList.contains('is-open')) closeDrawer();
      else openDrawer();
    });

    on(drawer, 'keydown', (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        closeDrawer();
        return;
      }
      if (event.key === 'Tab') {
        const focusables = getFocusable(drawer);
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    $$('a[href^="#"]', drawer).forEach((link) =>
      on(link, 'click', () => closeDrawer())
    );

    on(window, 'resize', rafThrottle(() => {
      if (window.innerWidth >= 1024 && drawer.classList.contains('is-open')) closeDrawer();
    }));
  };

  /* ======================================================================
     06. NAVEGACIÓN: SCROLL SUAVE + SCROLLSPY
     ====================================================================== */
  const initNavigation = () => {
    $$('a[href^="#"]:not([href="#"])').forEach((link) => {
      on(link, 'click', (event) => {
        const id = link.getAttribute('href');
        const target = $(id);
        if (!target) return;
        event.preventDefault();
        scrollToTarget(target);

        if (history.replaceState) history.replaceState(null, '', id);

        // Tras el desplazamiento, llevar el foco al destino (accesibilidad).
        window.setTimeout(() => {
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
          target.removeAttribute('tabindex');
        }, reduceMotion() ? 0 : 620);
      });
    });

    const navLinks = $$('.nav__link[href^="#"]');
    const sections = navLinks
      .map((link) => ({ link, section: $(link.getAttribute('href')) }))
      .filter((entry) => entry.section);

    if (!sections.length) return;

    const update = rafThrottle(() => {
      const probe = window.scrollY + window.innerHeight * 0.34;
      let current = null;

      sections.forEach((entry) => {
        if (entry.section.offsetTop <= probe) current = entry;
      });

      sections.forEach((entry) => {
        const active = entry === current;
        if (active) entry.link.setAttribute('aria-current', 'true');
        else entry.link.removeAttribute('aria-current');
      });
    });

    on(window, 'scroll', update, { passive: true });
    on(window, 'resize', update);
    update();
  };

  /* ======================================================================
     07. REVELADO AL HACER SCROLL
     ====================================================================== */
  const initReveal = () => {
    const items = $$('[data-reveal]');
    if (!items.length) return;

    if (reduceMotion() || !('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const delay = el.dataset.revealDelay;
          if (delay) el.style.setProperty('--reveal-delay', `${delay}ms`);
          el.classList.add('is-visible');
          observer.unobserve(el);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    );

    items.forEach((item) => observer.observe(item));
  };

  /* ======================================================================
     08. CONTADORES ANIMADOS
     ====================================================================== */
  const initCounters = () => {
    const counters = $$('[data-count]');
    if (!counters.length) return;

    const render = (el, value) => {
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      el.textContent = `${prefix}${value}${suffix}`;
    };

    if (reduceMotion() || !('IntersectionObserver' in window)) {
      counters.forEach((el) => render(el, el.dataset.count));
      return;
    }

    const animate = (el) => {
      const target = Number(el.dataset.count);
      if (Number.isNaN(target)) return;
      const duration = 1500;
      const start = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        render(el, Math.round(target * eased));
        if (progress < 1) window.requestAnimationFrame(step);
      };

      window.requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animate(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((el) => {
      render(el, 0);
      observer.observe(el);
    });
  };

  /* ======================================================================
     09. FILTROS DE COLECCIÓN
     ====================================================================== */
  const initFilters = () => {
    const group = $('[data-filter-group]');
    const grid = $('[data-collection-grid]');
    if (!group || !grid) return;

    const buttons = $$('.filter', group);
    const cards = $$('.card', grid);
    const counter = $('[data-filter-count]');
    const empty = $('[data-collection-empty]');
    const isTouch = window.matchMedia('(hover: none)').matches;

    const apply = (filter) => {
      let visible = 0;

      cards.forEach((card, index) => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('is-hidden', !match);
        card.classList.remove('is-entering');

        if (match) {
          visible += 1;
          if (!isTouch && !reduceMotion()) {
            card.style.animationDelay = `${Math.min(index * 45, 320)}ms`;
            void card.offsetWidth; // fuerza reinicio de la animación
            card.classList.add('is-entering');
          }
        }
      });

      buttons.forEach((btn) => {
        const active = btn.dataset.filter === filter;
        btn.setAttribute('aria-pressed', String(active));
      });

      if (counter) {
        counter.textContent = `Mostrando ${String(visible).padStart(2, '0')} de ${String(cards.length).padStart(2, '0')} piezas`;
      }

      if (empty) empty.classList.toggle('is-visible', visible === 0);
    };

    buttons.forEach((btn) =>
      on(btn, 'click', () => apply(btn.dataset.filter || 'all'))
    );

    apply('all');
  };

  /* ======================================================================
     10. MODAL DE PIEZA
     ====================================================================== */
  const initProductModal = () => {
    const modal = $('#piece-modal');
    if (!modal) return;

    const overlay = new Overlay(modal);
    const media = $('[data-piece-image]', modal);
    const category = $('[data-piece-category]', modal);
    const index = $('[data-piece-index]', modal);
    const title = $('[data-piece-title]', modal);
    const price = $('[data-piece-price]', modal);
    const desc = $('[data-piece-desc]', modal);
    const materials = $('[data-piece-materials]', modal);
    const craft = $('[data-piece-craft]', modal);
    const delivery = $('[data-piece-delivery]', modal);
    const sizesWrap = $('[data-piece-sizes]', modal);
    const bookBtn = $('[data-piece-book]', modal);
    let current = null;

    const open = (card) => {
      const data = card.dataset;
      current = { name: data.title, size: '' };

      if (media) {
        media.src = data.image || '';
        media.alt = `Pieza ${data.title} — ${data.categoryLabel || ''}`.trim();
      }
      if (category) category.textContent = data.categoryLabel || '';
      if (index) index.textContent = `Nº ${data.index || ''}`.trim();
      if (title) title.textContent = data.title || '';
      if (price) price.textContent = data.price || '';
      if (desc) desc.textContent = data.desc || '';
      if (materials) materials.textContent = data.materials || '';
      if (craft) craft.textContent = data.craft || '';
      if (delivery) delivery.textContent = data.delivery || '';

      if (sizesWrap) {
        sizesWrap.innerHTML = '';
        (data.sizes || '')
          .split(',')
          .map((size) => size.trim())
          .filter(Boolean)
          .forEach((size, i) => {
            const chip = document.createElement('button');
            chip.type = 'button';
            chip.className = 'chip';
            chip.textContent = size;
            chip.setAttribute('aria-pressed', 'false');
            if (i === 0) {
              chip.setAttribute('aria-pressed', 'true');
              current.size = size;
            }
            on(chip, 'click', () => {
              $$('.chip', sizesWrap).forEach((c) => c.setAttribute('aria-pressed', 'false'));
              chip.setAttribute('aria-pressed', 'true');
              current.size = size;
            });
            sizesWrap.appendChild(chip);
          });
      }

      overlay.open();
    };

    $$('[data-piece-open]').forEach((btn) =>
      on(btn, 'click', () => {
        const card = btn.closest('.card');
        if (card) open(card);
      })
    );

    on(bookBtn, 'click', () => {
      const select = $('#contacto-asunto');
      const message = $('#contacto-mensaje');
      const name = $('#contacto-nombre');
      const note = current
        ? `Me interesa la pieza ${current.name}${current.size ? ` (talla ${current.size})` : ''}. Deseo concertar una cita privada en el atelier.`
        : 'Deseo concertar una cita privada en el atelier.';

      overlay.close();

      if (select) select.value = 'cita-privada';
      if (message) {
        message.value = note;
        message.dispatchEvent(new Event('input', { bubbles: true }));
      }

      scrollToTarget('#contacto');
      window.setTimeout(() => {
        const firstField = name || $('.field input', $('#contacto-form'));
        if (firstField) firstField.focus({ preventScroll: true });
      }, reduceMotion() ? 80 : 700);
    });
  };

  /* ======================================================================
     11. LIGHTBOX DE LOOKBOOK
     ====================================================================== */
  const initLightbox = () => {
    const modal = $('#lightbox');
    if (!modal) return;

    const items = $$('[data-gallery]').map((el) => {
      const img = $('img', el);
      return {
        src: img ? img.getAttribute('src') : '',
        alt: img ? img.getAttribute('alt') : '',
        caption: el.dataset.caption || (img ? img.getAttribute('alt') : ''),
      };
    });

    if (!items.length) return;

    const overlay = new Overlay(modal);
    const stage = $('[data-lightbox-image]', modal);
    const caption = $('[data-lightbox-caption]', modal);
    const counter = $('[data-lightbox-counter]', modal);
    let position = 0;

    const paint = (next) => {
      position = (next + items.length) % items.length;
      const item = items[position];
      if (stage) {
        stage.src = item.src;
        stage.alt = item.alt;
      }
      if (caption) caption.textContent = item.caption;
      if (counter) {
        counter.textContent = `${String(position + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
      }
    };

    $$('[data-gallery]').forEach((el, i) =>
      on(el, 'click', (event) => {
        event.preventDefault();
        paint(i);
        overlay.open($('[data-lightbox-next]', modal));
      })
    );

    on($('[data-lightbox-open]'), 'click', () => {
      paint(0);
      overlay.open($('[data-lightbox-next]', modal));
    });

    on($('[data-lightbox-next]', modal), 'click', () => paint(position + 1));
    on($('[data-lightbox-prev]', modal), 'click', () => paint(position - 1));

    on(modal, 'keydown', (event) => {
      if (!overlay.isOpen) return;
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        paint(position + 1);
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        paint(position - 1);
      }
    });
  };

  /* ======================================================================
     12. MODAL LEGAL
     ====================================================================== */
  const LEGAL = {
    aviso: {
      title: 'Aviso legal',
      body: `
        <h3>Titular del sitio</h3>
        <p>ÉLÉVATION Maison de Couture (en adelante, «la Maison»), con domicilio social en 8 Rue de Marbre, 75008 París, Francia. Registro mercantil RCS París 512 847 003. Correo de contacto: atelier@elevation-maison.com.</p>
        <h3>Objeto</h3>
        <p>Este sitio web presenta las colecciones de alta costura y prêt-à-porter de la Maison, así como sus servicios de atelier y su programa de membresía privada. La información publicada tiene carácter informativo y no constituye una oferta contractual vinculante.</p>
        <h3>Propiedad intelectual</h3>
        <p>Los diseños, patrones, fotografías, textos, logotipos y el conjunto de elementos gráficos son propiedad exclusiva de la Maison o se utilizan con licencia. Queda prohibida su reproducción, distribución o transformación sin autorización expresa y por escrito.</p>
        <h3>Responsabilidad</h3>
        <p>La Maison no se responsabiliza del uso indebido de los contenidos ni de las interrupciones del servicio ajenas a su control. Los precios indicados pueden variar según materiales, medidas y disponibilidad del atelier.</p>
      `,
    },
    privacidad: {
      title: 'Política de privacidad',
      body: `
        <h3>Responsable del tratamiento</h3>
        <p>ÉLÉVATION Maison de Couture trata tus datos con la única finalidad de atender solicitudes de cita, consultas de clientela y comunicaciones del Cercle Privé.</p>
        <h3>Datos que tratamos</h3>
        <p>Nombre, dirección de correo electrónico, asunto y contenido del mensaje, así como las medidas y preferencias que compartas voluntariamente en el atelier.</p>
        <h3>Base jurídica y conservación</h3>
        <p>El consentimiento expreso que otorgas al enviar el formulario. Los datos se conservan mientras exista relación comercial o durante el plazo legalmente exigible, y no se ceden a terceros salvo obligación legal.</p>
        <h3>Derechos</h3>
        <p>Puedes ejercer los derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a privacidad@elevation-maison.com. También puedes reclamar ante la autoridad de control competente.</p>
      `,
    },
    cookies: {
      title: 'Política de cookies',
      body: `
        <h3>Uso de cookies</h3>
        <p>Este sitio emplea únicamente almacenamiento técnico necesario para recordar tus preferencias de navegación, como el estado del menú o el filtro de colección activo.</p>
        <h3>Cookies analíticas</h3>
        <p>No se instalan cookies publicitarias ni de perfilado. Si en el futuro se incorporan métricas de audiencia, se solicitará consentimiento previo mediante un aviso específico.</p>
        <h3>Cómo desactivarlas</h3>
        <p>Puedes bloquear o eliminar el almacenamiento desde la configuración de tu navegador. La desactivación del almacenamiento técnico no impide la consulta del contenido editorial.</p>
      `,
    },
    condiciones: {
      title: 'Condiciones de venta',
      body: `
        <h3>Piezas de alta costura</h3>
        <p>Cada pieza se confecciona a medida en el Atelier 07 y se entrega numerada con su certificado de autenticidad. El plazo estimado de confección es de seis a diez semanas desde la validación del patrón.</p>
        <h3>Prêt-à-porter</h3>
        <p>Las series limitadas se producen en cantidades declaradas y no se reeditan. La disponibilidad se confirma en el momento de la reserva.</p>
        <h3>Pagos, envíos y devoluciones</h3>
        <p>La reserva se formaliza con un anticipo del treinta por ciento. Los envíos se realizan asegurados y con seguimiento a todo el mundo. Las piezas confeccionadas a medida no admiten devolución, si bien incluyen tres pruebas de ajuste sin coste adicional.</p>
      `,
    },
  };

  const initLegal = () => {
    const modal = $('#legal-modal');
    if (!modal) return;

    const overlay = new Overlay(modal);
    const title = $('[data-legal-title]', modal);
    const body = $('[data-legal-body]', modal);

    $$('[data-legal]').forEach((btn) =>
      on(btn, 'click', () => {
        const doc = LEGAL[btn.dataset.legal];
        if (!doc) return;
        if (title) title.textContent = doc.title;
        if (body) body.innerHTML = doc.body;
        overlay.open();
      })
    );
  };

  /* ======================================================================
     13. FORMULARIO DE CONTACTO
     ====================================================================== */
  const initContactForm = () => {
    const form = $('#contacto-form');
    if (!form) return;

    const status = $('#contacto-estado');
    const statusRef = $('[data-status-ref]', status || form);
    const emailEcho = $('[data-status-email]', status || form);
    const resetBtn = $('[data-status-reset]', status || form);
    const submit = $('button[type="submit"]', form);
    const message = $('#contacto-mensaje');
    const counter = $('[data-message-counter]', form);

    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    const NAME_RE = /^[\p{L}\p{M}\s'’.-]{2,60}$/u;

    const validators = {
      nombre: (value) => {
        const v = value.trim();
        if (!v) return 'Indica tu nombre para dirigirnos a ti correctamente.';
        if (!NAME_RE.test(v)) return 'Revisa el nombre: solo letras, espacios, guiones y apóstrofes.';
        return '';
      },
      email: (value) => {
        const v = value.trim();
        if (!v) return 'Necesitamos un correo electrónico de contacto.';
        if (!EMAIL_RE.test(v)) return 'El formato del correo no es válido (ejemplo: nombre@dominio.com).';
        return '';
      },
      asunto: (value) => (value ? '' : 'Selecciona el motivo de tu consulta.'),
      mensaje: (value) => {
        const v = value.trim();
        if (!v) return 'Cuéntanos qué necesitas.';
        if (v.length < 20) return `Amplía tu mensaje: faltan ${20 - v.length} caracteres.`;
        if (v.length > 800) return 'El mensaje supera los 800 caracteres permitidos.';
        return '';
      },
      consentimiento: (value, field) => {
        const input = $('input[type="checkbox"]', field);
        return input && input.checked ? '' : 'Debes aceptar la política de privacidad para continuar.';
      },
    };

    const setState = (field, messageText) => {
      const msg = $('.field__msg', field);
      const text = $('[data-msg-text]', field) || msg;
      const valid = !messageText;

      field.classList.toggle('is-invalid', !valid);
      field.classList.toggle('is-valid', valid && field.dataset.touched === 'true');

      const control = $('input, select, textarea', field);
      if (control) {
        control.setAttribute('aria-invalid', String(!valid));
        if (!valid) control.setAttribute('aria-describedby', `${control.id}-error`);
        else control.removeAttribute('aria-describedby');
      }

      if (msg && text) {
        if (messageText) {
          text.textContent = messageText;
          msg.classList.add('is-shown');
          msg.setAttribute('role', 'alert');
        } else {
          if (field.dataset.touched === 'true') {
            text.textContent = 'Correcto.';
            msg.classList.add('is-shown');
          } else {
            msg.classList.remove('is-shown');
          }
          msg.removeAttribute('role');
        }
      }
    };

    const validateField = (field) => {
      const name = field.dataset.field;
      const validator = validators[name];
      if (!validator) return true;
      const control = $('input:not([type="checkbox"]), select, textarea', field);
      const value = control ? control.value : '';
      const error = validator(value, field);
      setState(field, error);
      return !error;
    };

    const fields = $$('[data-field]', form);

    fields.forEach((field) => {
      const control = $('input, select, textarea', field);
      if (!control) return;

      on(control, 'blur', () => {
        field.dataset.touched = 'true';
        validateField(field);
      });

      on(control, 'input', () => {
        if (control.type === 'checkbox') field.dataset.touched = 'true';
        if (field.classList.contains('is-invalid') || control.type === 'checkbox') {
          validateField(field);
        }
      });

      on(control, 'change', () => {
        field.dataset.touched = 'true';
        if (control.tagName === 'SELECT' || control.type === 'checkbox') validateField(field);
      });
    });

    if (message && counter) {
      const updateCounter = () => {
        counter.textContent = `${message.value.length} / 800`;
      };
      on(message, 'input', updateCounter);
      updateCounter();
    }

    on(form, 'submit', (event) => {
      event.preventDefault();

      let firstInvalid = null;
      fields.forEach((field) => {
        field.dataset.touched = 'true';
        if (!validateField(field) && !firstInvalid) firstInvalid = field;
      });

      if (firstInvalid) {
        const control = $('input, select, textarea', firstInvalid);
        if (control) control.focus({ preventScroll: true });
        firstInvalid.scrollIntoView({ block: 'center', behavior: scrollBehavior() });
        return;
      }

      submit.classList.add('is-loading');
      submit.setAttribute('aria-busy', 'true');
      submit.setAttribute('aria-disabled', 'true');

      // Punto de integración: sustituir por el envío real (API, Formspree, CRM…).
      window.setTimeout(() => {
        submit.classList.remove('is-loading');
        submit.removeAttribute('aria-busy');
        submit.removeAttribute('aria-disabled');

        const reference = `ÉLV-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
        const email = $('#contacto-email');
        const name = $('#contacto-nombre');

        if (statusRef) statusRef.textContent = reference;
        if (emailEcho) {
          emailEcho.textContent = name && name.value.trim()
            ? `${name.value.trim()}, recibirás nuestra respuesta en ${email ? email.value.trim() : ''}.`
            : `Recibirás nuestra respuesta en ${email ? email.value.trim() : ''}.`;
        }

        form.hidden = true;
        if (status) {
          status.classList.add('is-visible');
          status.focus({ preventScroll: true });
        }
      }, reduceMotion() ? 200 : 1250);
    });

    on(resetBtn, 'click', () => {
      form.reset();
      fields.forEach((field) => {
        field.dataset.touched = 'false';
        field.classList.remove('is-valid', 'is-invalid');
        const msg = $('.field__msg', field);
        if (msg) {
          msg.classList.remove('is-shown');
          msg.removeAttribute('role');
        }
      });
      if (counter) counter.textContent = '0 / 800';
      if (status) status.classList.remove('is-visible');
      form.hidden = false;
      const firstControl = $('input, select, textarea', form);
      if (firstControl) firstControl.focus({ preventScroll: true });
      scrollToTarget(form);
    });
  };

  /* ======================================================================
     14. NEWSLETTER VIP
     ====================================================================== */
  const initVipForm = () => {
    const form = $('#vip-form');
    if (!form) return;

    const field = $('[data-field]', form);
    const input = $('input[type="email"]', form);
    const success = $('#vip-success');
    const emailEcho = $('[data-vip-email]', success || form);
    const submit = $('button[type="submit"]', form);
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

    const validate = () => {
      const value = input ? input.value.trim() : '';
      let error = '';
      if (!value) error = 'Introduce tu correo electrónico.';
      else if (!EMAIL_RE.test(value)) error = 'El formato del correo no es válido.';

      if (field) {
        field.classList.toggle('is-invalid', Boolean(error));
        const msg = $('.field__msg', field);
        if (msg) {
          const text = $('[data-msg-text]', field) || msg;
          text.textContent = error;
          msg.classList.toggle('is-shown', Boolean(error));
        }
        if (input) input.setAttribute('aria-invalid', String(Boolean(error)));
      }
      return !error;
    };

    on(input, 'blur', validate);
    on(input, 'input', () => {
      if (field && field.classList.contains('is-invalid')) validate();
    });

    on(form, 'submit', (event) => {
      event.preventDefault();
      if (!validate()) {
        if (input) input.focus({ preventScroll: true });
        return;
      }

      submit.classList.add('is-loading');
      submit.setAttribute('aria-busy', 'true');

      // Punto de integración: conectar con el proveedor de email marketing.
      window.setTimeout(() => {
        submit.classList.remove('is-loading');
        submit.removeAttribute('aria-busy');
        if (emailEcho) emailEcho.textContent = input.value.trim();
        form.hidden = true;
        if (success) {
          success.classList.add('is-visible');
          success.focus({ preventScroll: true });
        }
      }, reduceMotion() ? 180 : 950);
    });
  };

  /* ======================================================================
     15. ATAJOS DE ASUNTO (servicios y footer → formulario preconfigurado)
     ====================================================================== */
  const initSubjectShortcuts = () => {
    const shortcuts = $$('[data-subject]');
    if (!shortcuts.length) return;

    const select = $('#contacto-asunto');
    const message = $('#contacto-mensaje');
    const name = $('#contacto-nombre');
    const vipEmail = $('#vip-email');

    shortcuts.forEach((trigger) =>
      on(trigger, 'click', () => {
        const subject = trigger.dataset.subject;

        if (subject === 'vip') {
          scrollToTarget('#vip');
          window.setTimeout(() => {
            if (vipEmail) vipEmail.focus({ preventScroll: true });
          }, reduceMotion() ? 80 : 700);
          return;
        }

        if (select) {
          select.value = subject;
          select.dispatchEvent(new Event('change', { bubbles: true }));
        }

        scrollToTarget('#contacto');
        window.setTimeout(() => {
          const target = name && !name.value.trim() ? name : message || name;
          if (target) target.focus({ preventScroll: true });
        }, reduceMotion() ? 80 : 700);
      })
    );
  };

  /* ======================================================================
     16. VOLVER ARRIBA
     ====================================================================== */
  const initToTop = () => {
    const button = $('.to-top');
    if (!button) return;

    const update = rafThrottle(() => {
      button.classList.toggle('is-visible', window.scrollY > 900);
    });

    on(window, 'scroll', update, { passive: true });
    on(button, 'click', () => window.scrollTo({ top: 0, behavior: scrollBehavior() }));
    update();
  };

  /* ======================================================================
     17. HALO DEL CURSOR
     ====================================================================== */
  const initCursorGlow = () => {
    const glow = $('.cursor-glow');
    if (!glow || reduceMotion() || !finePointer()) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let currentX = x;
    let currentY = y;
    let active = false;

    on(window, 'pointermove', (event) => {
      x = event.clientX;
      y = event.clientY;
      if (!active) {
        active = true;
        glow.classList.add('is-active');
      }
    }, { passive: true });

    on(document, 'pointerleave', () => {
      active = false;
      glow.classList.remove('is-active');
    });

    const loop = () => {
      currentX += (x - currentX) * 0.09;
      currentY += (y - currentY) * 0.09;
      glow.style.transform = `translate3d(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px, 0)`;
      window.requestAnimationFrame(loop);
    };

    window.requestAnimationFrame(loop);
  };

  /* ======================================================================
     18. AÑO DINÁMICO
     ====================================================================== */
  const initYear = () => {
    $$('[data-year]').forEach((el) => {
      el.textContent = String(new Date().getFullYear());
    });
  };

  /* ======================================================================
     ARRANQUE
     ====================================================================== */
  const boot = () => {
    initScrollProgress();
    initHeader();
    initDrawer();
    initNavigation();
    initReveal();
    initCounters();
    initFilters();
    initProductModal();
    initLightbox();
    initLegal();
    initContactForm();
    initVipForm();
    initSubjectShortcuts();
    initToTop();
    initCursorGlow();
    initYear();

    on(motionQuery, 'change', () => {
      document.documentElement.dataset.reducedMotion = String(reduceMotion());
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();

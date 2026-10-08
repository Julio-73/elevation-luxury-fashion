<div align="center">

# ÉLÉVATION — Luxury Fashion

**Haute Couture &amp; Ready-to-Wear**

Landing page de alta costura con estética editorial *dark premium*: obsidiana, champán apagado y tipografía serif.

[![HTML5](https://img.shields.io/badge/HTML5-sem%C3%A1ntico-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/es/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-design%20system-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/es/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CDN-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Dependencias](https://img.shields.io/badge/dependencias-0-success?style=flat-square)](#-stack-técnico)
[![Accesibilidad](https://img.shields.io/badge/WCAG%202.2-AA%2FAAA-8a7343?style=flat-square)](#-accesibilidad)

</div>

---

## 📖 Descripción

**ÉLÉVATION** es una *maison* ficticia de alta costura y prêt-à-porter parisina. Este proyecto es su
landing page: una pieza de una sola página, sin *framework* ni build, pensada como escaparate
editorial donde la fotografía, el espacio negativo y el ritmo tipográfico sostienen la percepción de lujo.

El diseño parte de una dirección de arte documentada (ver [`brand-identity.md`](brand-identity.md)) en
lugar de una plantilla: cada color, curva de *easing* y micro-interacción responde a la misma idea —
**"el lujo como arquitectura, no como ornamento"**.

## 🖼️ Vista previa

<div align="center">

![Fotografía de portada utilizada en el hero](https://images.unsplash.com/photo-1554882195-8cf792f9a571?auto=format&fit=crop&w=1200&q=80)

<sub>Fotografía de pasarela usada como imagen principal del *hero* (Unsplash).</sub>

</div>

## 🚀 Cómo ejecutarlo

No requiere instalación, compilación ni dependencias.

```bash
# Opción 1 — abrir directamente
# Haz doble clic en index.html

# Opción 2 — servidor local (recomendado)
npx serve .
# o
python -m http.server 8000
```

Después abre `http://localhost:8000` (o el puerto que indique la herramienta).

> **Requiere conexión a internet** para Tailwind CSS (CDN), Google Fonts y las imágenes de Unsplash.
> El CSS propio es la fuente de verdad del diseño, por lo que la maquetación y la tipografía se
> mantienen aunque el CDN de Tailwind no cargue.

## ✨ Características

| Sección | Detalles implementados |
|---|---|
| **Header / Navbar** | Fijo con efecto vidrio esmerilado al hacer scroll, logo tipográfico, *scrollspy* con subrayado animado, CTA destacado y menú hamburguesa con *drawer* a pantalla completa |
| **Hero** | Imagen editorial a pantalla completa con overlay gradual, titular a tres líneas con animación escalonada, doble CTA, contadores animados e indicador de scroll |
| **Colección** | Grid responsive con **filtros funcionales** (Alta Costura · Ready-to-Wear · Accesorios · Atelier), tarjetas con zoom suave y revelación de detalles, y **modal** con ficha técnica y selector de tallas |
| **Lookbook & Manifiesto** | Composición asimétrica de 12 columnas, citas editoriales, 4 principios de marca y **lightbox** navegable con teclado |
| **Savoir-faire** | Tres servicios con atajos que precargan el asunto del formulario |
| **Contacto & VIP** | Formulario con validación visual en vivo, confirmación con referencia generada y bloque de membresía con contadores |
| **Footer** | Wordmark a escala gigante, redes sociales con iconos SVG, modales legales con contenido real y copyright dinámico |

**Detalles premium:** textura de grano (SVG `feTurbulence`), halo de cursor dorado, barra de progreso
de lectura, *selection* y *scrollbar* personalizadas, botón *volver arriba* y numeración editorial.

## 📁 Estructura del proyecto

```
.
├── index.html          # Estructura semántica completa (HTML5)
├── css/
│   └── style.css       # Design system: tokens, componentes, animaciones, responsive
├── js/
│   └── main.js         # Comportamiento: navegación, filtros, modales, validación (ES6+)
├── brand-identity.md   # Dirección de arte y design tokens (documentación)
├── README.md
└── .gitignore
```

## 🧱 Stack técnico

- **HTML5 semántico** — `header`, `nav`, `main`, `section`, `figure`, `footer`, landmarks y *skip link*.
- **CSS propio** — design tokens con variables CSS, escala tipográfica fluida (`clamp()`), grid asimétrico y animaciones.
- **Tailwind CSS (CDN)** — capa de utilidades configurada con los tokens de la marca.
- **JavaScript ES6+** — sin dependencias: `IntersectionObserver`, `requestAnimationFrame`, clases, módulos por responsabilidad.
- **Tipografías** — Cinzel (marca) · Playfair Display (titulares) · Inter (lectura).
- **Imágenes** — Unsplash en alta resolución con `srcset`, `sizes` y *lazy loading*.

## ♿ Accesibilidad

- `lang="es"`, un único `h1`, jerarquía de encabezados coherente, *skip link* y *landmarks*.
- Formularios con `label` visible, `aria-invalid`, `aria-describedby`, `role="alert"` y foco al primer error.
- Modales y menú móvil con *focus trap*, cierre con `Escape` y restauración del foco.
- Contraste AA/AAA (champán sobre obsidiana), foco visible dorado y áreas táctiles ≥ 44 px.
- Respeta `prefers-reduced-motion` (desactiva animaciones) y `prefers-contrast` (refuerza bordes y textos).

## ⚡ Rendimiento

- Imágenes con dimensiones explícitas para evitar *layout shift* (CLS) y `loading="lazy"` salvo en el *hero*.
- *Hero* con `fetchpriority="high"` y `preconnect` a los orígenes críticos.
- Animaciones limitadas a `transform` y `opacity` (composición GPU); nunca `width`/`height`/`top`/`left`.
- `scroll-behavior: smooth` nativo y `scroll-padding-top` para el header fijo, sin JavaScript extra.

## 🎨 Personalización

Todos los valores visuales viven en `:root` dentro de [`css/style.css`](css/style.css), en la sección
**00. Tokens de diseño**:

```css
:root {
  --obsidian:   #0b0b0b;   /* fondo base            */
  --gold:       #c8a96f;   /* acento champán        */
  --ivory:      #f4f0e8;   /* texto principal       */
  --ease:       cubic-bezier(.16, 1, .3, 1);  /* firma del movimiento */
  --text-3xl:   clamp(2.7rem, 1.4rem + 5.6vw, 6.6rem);
}
```

Cambiar estos tokens reajusta toda la página de forma coherente. La justificación de cada decisión
(color, tipografía, composición, movimiento) está en [`brand-identity.md`](brand-identity.md).

## 🔌 Puntos de integración

El front-end es totalmente funcional; los envíos de formularios se **simulan** y muestran la
confirmación en pantalla. Para producción:

| Qué | Dónde |
|---|---|
| Formulario de contacto | `js/main.js` → `initContactForm()`, dentro del `setTimeout` del `submit` |
| Newsletter VIP | `js/main.js` → `initVipForm()`, mismo patrón |
| Dominio canónico y metadatos | `index.html` → `<link rel="canonical">` y etiquetas Open Graph |
| Redes sociales | `index.html` → `href` de los enlaces `.social` |
| Datos estructurados | `index.html` → bloque JSON-LD (`ClothingStore`) |

## 📝 Notas y limitaciones

- Las imágenes provienen de **Unsplash** y se cargan por URL; para producción conviene alojarlas
  en el propio dominio (o un CDN) en formato AVIF/WebP.
- Tailwind se incluye vía **CDN**, adecuado para prototipos. Para producción se recomienda compilarlo
  (Tailwind CLI) y servir un CSS mínimo.
- Proyecto **estático de una sola página**: sin backend, sin base de datos y sin autenticación.
- Todo el contenido (piezas, precios, boutiques, textos legales) es **ficticio** y sirve como demostración.

## 🙏 Créditos

- Fotografía: [Unsplash](https://unsplash.com) — licencia Unsplash.
- Tipografías: [Google Fonts](https://fonts.google.com) — Cinzel, Playfair Display, Inter.

## 📄 Licencia

© 2026 ÉLÉVATION Maison de Couture. **Código propietario — todos los derechos reservados.**

El nombre, los textos y la dirección de arte son ficticios y se utilizan con fines de demostración.
Si deseas liberar este código, añade un archivo `LICENSE` con la licencia que prefieras (por ejemplo, MIT).

---

<div align="center">
<sub>Diseñado en París. Confeccionado en Francia e Italia.</sub>
</div>

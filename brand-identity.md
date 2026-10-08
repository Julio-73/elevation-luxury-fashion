# ÉLÉVATION — Dirección de Arte

> **Declaración:** *"Obsidiana, champán apagado y silencio tipográfico — el lujo como arquitectura, no como ornamento."*

---

## 0 · Brand Identity Canvas

```
Marca:        ÉLÉVATION — Haute Couture & Ready-to-Wear
Industria:    Moda de lujo / alta costura (París)
Personalidad: sobria · arquitectónica · silenciosa · autorizada sin gritar
Voz:          aspiracional · sentenciosa · editorial (frases cortas, mayúsculas espaciadas)
Valores:      artesanía · permanencia · exclusividad · materias nobles

Audiencia:    28–55 · alto poder adquisitivo · coleccionistas de diseño
              · compra meditada, no impulsiva · valora trazabilidad y autoría
Posicionamiento:
  Mercado:        global (París, Milán, Tokio, Nueva York)
  Competidores:   Chanel, Dior, The Row, Saint Laurent, Aesop (tono)
  Diferenciación: Atelier 07 · series numeradas no reeditadas · patronaje
                  arquitectónico · autoría con nombre propio
```

## 1 · Dirección de Arte

```
🎨 ESTILO VISUAL   editorial oscuro · minimalismo texturado · "brutal premium"
📐 COMPOSICIÓN     asimétrica sobre grid de 12 columnas + números/índices editoriales

🌈 PALETA
   Fondo obsidiana:  #0b0b0b
   Carbón elevado:   #111110 · #151513
   Champán (acento): #c8a96f · claro #e8d7b5 · profundo #8a7343
   Marfil texto:     #f4f0e8 · atenuado #9c968b · tenue #6d6961
   Borde:           rgba(255,255,255,.09) · dorado rgba(200,169,111,.35)
   Modo:            dark

🔤 TIPOGRAFÍA
   Display (marca):   Cinzel — 400/500/600, mayúsculas, tracking amplio
   Display (editorial): Playfair Display — 300/400/500 + itálica
   Texto:             Inter — 200/300/400/500/600
   Escala:            clamp() fluida

💡 ILUMINACIÓN      low-key · chiaroscuro · luz lateral dura
📷 FOTOGRAFÍA       editorial de moda · pasarela · retrato · accesorio macro
                    tratamiento unificado: desaturación + tinte cálido; el color
                    se restaura al interactuar (hover)
🎯 ICONOGRAFÍA      línea · trazo 1.5 · currentColor · una sola librería (SVG sprite)
🖱️ MOVIMIENTO       lento y pausado · cubic-bezier(.16,1,.3,1) · fade + slide,
                    sin rebote · 0.3–1.4 s según jerarquía
```

## 2 · Mood Board (inspiración, no imitación)

| Referencia | Qué tomar | Por qué |
|---|---|---|
| **Aesop** | Composición asimétrica, espacio negativo, texto editorial | Ritmo pausado y tono de marca |
| **The Row / Celine** | Silencio tipográfico, serif, producto sin estridencia | Autoridad del lujo sobrio |
| **SSENSE** | Grid dinámico, números de índice, mayúsculas espaciadas | Vanguardia editorial |
| **Mercedes-Benz** | Iluminación dramática, serif, fondo oscuro | Escultura de producto |
| **Linear** | Glow sutil, micro-interacciones precisas, dark mode | Detalle invisible premium |

## 3 · Design Tokens (resumen)

```css
--obsidian: #0b0b0b;  --coal: #111110;  --ink: #151513;
--ivory:    #f4f0e8;  --muted: #9c968b; --faint: #6d6961;
--gold:     #c8a96f;  --gold-light: #e8d7b5; --gold-deep: #8a7343;
--line:     rgba(255,255,255,.09);  --line-gold: rgba(200,169,111,.35);
--ease:     cubic-bezier(.16,1,.3,1);   /* firma del movimiento */
--ease-soft:cubic-bezier(.22,1,.36,1);
--text-3xl: clamp(2.7rem, 1.4rem + 5.6vw, 6.6rem);  /* escala fluida */
```

Ver la definición completa en `css/style.css` (§00 Tokens de diseño).

## 4 · Storytelling visual

```
1. Hero → "El lujo no se lleva: se habita" (3 segundos para capturar)
2. Colección → 12 piezas, filtros, series numeradas (deseo)
3. Lookbook/Manifiesto → 6 planos + 4 reglas no negociables (autoridad)
4. Savoir-faire → 3 servicios, cita en atelier (confianza)
5. Contacto & VIP → conversación privada + Cercle Privé (conversión)
```

La fotografía se muestra desaturada y se **colorea al interactuar**: la marca no entrega
su color de golpe, igual que no reimprime una serie.

## 5 · Detalles premium implementados

- [x] Noise texture (SVG `feTurbulence`, <3 % de opacidad, `mix-blend-mode`)
- [x] Halo de cursor dorado (solo puntero fino, respeta reduced-motion)
- [x] Selection color y scrollbar personalizados en champán
- [x] Focus ring dorado + `focus-visible`
- [x] Backdrop-blur solo en escritorio (evita bugs de render en móvil)
- [x] Números con `tabular-nums`
- [x] Scrollspy con subrayado animado
- [x] `text-wrap: balance` en titulares
- [x] `prefers-reduced-motion` y `prefers-contrast`
- [x] Barra de progreso de lectura + volver-arriba

# GEOBUILDING — rediseño

Mockup estático (HTML + CSS + JS, sin build ni dependencias). Se abre con doble clic
en `index.html`.

## Concepto: "El corte"

El sitio está construido como una **sección vertical del terreno**. Se lee desde la
superficie (0.00 m) hacia abajo:

- **Rail de cota** fijo a la izquierda (≥1180 px): marca la profundidad de lectura y
  avanza con el scroll.
- **Separadores de sección** dibujados como contactos estratigráficos, con su estrato
  y su cota (`Estrato 02 · −8.40 m`).
- **Portada**: el corte tipo de un muro anclado, dibujado en SVG y animado al cargar
  (tramo libre, bulbo, nivel freático, cadena de cotas y N.F.C.). No es una imagen,
  es código: se puede editar cualquier valor.
- **Zona profunda** (fondo oscuro): el perfil real de las 16 obras a escala.

## Páginas

| Archivo | Contenido |
|---|---|
| `index.html` | Portada, clientes, nosotros, servicios, perfil de obras, cómo trabajamos, formulario |
| `nosotros.html` | Quiénes somos, misión, visión, 5 valores, equipo, logros |
| `servicios.html` | Los 4 servicios + metodología en 4 etapas |
| `servicio-taludes.html` | Estabilización de taludes |
| `servicio-cimentaciones.html` | Cimentaciones profundas |
| `servicio-perforacion.html` | Perforación diamantina |
| `servicio-consultoria.html` | Consultoría geotécnica |
| `proyectos.html` | Perfil de excavaciones + 16 fichas + tabla de datos |
| `contacto.html` | Formulario completo, datos de oficina, mapa |

## Datos de obra

Las 16 obras salen de las fichas técnicas publicadas por la empresa (metros lineales,
N.F.C., sótanos, plazo, anclaje máximo y factores de seguridad). Están en un solo
lugar:

- `js/site.js` → constante `OBRAS` (alimenta el gráfico y los tooltips).
- Las fichas y la tabla de `proyectos.html` están escritas en el HTML.

Si cambia un dato hay que tocar los dos sitios.

Totales usados en la portada: **25,255 ml** perforados, obra más profunda **−31.40 m**
(Camino Real, nueve sótanos), **FS 1.50** estático mínimo.

## Imágenes pendientes

Todo lo que falta está marcado con un placeholder rayado que dice qué va ahí. Para
conectarlas: crear la carpeta `assets/img/` y reemplazar cada bloque

```html
<div class="slot slot--ancho"><span class="slot__n">…</span><span class="slot__m">…</span></div>
```

por

```html
<img src="assets/img/nombre.webp" alt="Descripción de la foto">
```

Lista de lo que necesito:

| Dónde | Qué | Medida sugerida |
|---|---|---|
| `index.html` — franja de clientes | 5 logotipos de constructoras (PNG con fondo transparente) | alto 200 px |
| `nosotros.html` — equipo | 3 fotos verticales (dirección, operaciones, cuadrilla) | 1200 × 1500 |
| 4 páginas de servicio | 1 foto de obra por servicio | 1600 × 900 |
| `contacto.html` | mapa (o embed de Google Maps) | 1600 × 900 |
| Marca | logotipo en SVG o PNG a alta resolución | — |

El logotipo hoy está puesto como texto (`.wordmark`, Archivo + azul/oro de marca).
Cuando llegue el archivo se reemplaza por `<img>` dentro de `.marca`.

En `assets/referencia/` quedaron los archivos descargados del sitio actual
(logotipos y fichas técnicas de obra) — solo como referencia, no se usan en el mockup.

## Falta conectar

- Los formularios no envían: hoy solo muestran confirmación en pantalla. Hay que
  apuntarlos al correo o CRM de la empresa.
- Enlaces de Facebook e Instagram apuntan a `#`.
- Las tipografías se cargan desde Google Fonts (Archivo, Newsreader, IBM Plex Mono).
  Para que el sitio funcione sin internet hay que descargarlas y servirlas local.

## Accesibilidad y responsive

Probado hasta 500 px de ancho. Foco visible, salto al contenido, `prefers-reduced-motion`
respetado (se desactivan animación del corte y revelados), gráfico navegable con teclado
y con tabla de datos equivalente en `proyectos.html`.

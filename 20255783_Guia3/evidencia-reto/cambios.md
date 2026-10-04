# Reto IA – Guía 3: Lista de cambios

**Herramienta utilizada:** ChatGPT
**Página:** nueva versión de la página de inicio de La Fonda de Alegría con CSS Grid

## Cambios efectuados sobre el resultado original

1. **Encabezado fijo:** se movió `position: sticky`, `top: 0` y `z-index: 100` de `.navbar` a `.site-header`, porque el encabezado no se quedaba fijo al hacer scroll. El sticky no funcionaba en `.navbar` porque su padre (`.site-header`) medía lo mismo que ella; en `.site-header` sí funciona porque su padre (`.page-grid`) ocupa toda la página.

2. **Eliminación de las bandas marquee:** se eliminaron las dos bandas decorativas del HTML junto con sus estilos y su animación (`@keyframes marquee-scroll`). Como eran grid items de `.main-grid`, se ajustó `grid-template-rows` de 6 a 4 filas, tanto en escritorio como en el media query de teléfonos.

3. **Corrección de comentarios del HTML:**
   - Se agregó el área `strip` (franja dorada final) al comentario del contenedor principal `.page-grid`.
   - Se aclaró que el encabezado de "Lo que nos hace únicos" no es un grid item, porque su contenedor `.content-wrap` no usa Grid.
   - Se corrigió el comentario del título "Reserva tu evento": ocupa las dos columnas con `grid-column: 1 / -1`, no con `span`.
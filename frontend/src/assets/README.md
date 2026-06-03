# Assets

Recursos estáticos (imágenes, logos, iconos) que se importan desde JS/JSX.

## Logo

El archivo [`op.png`](./op.png) es el logo corporativo de OP Latam.
Se importa en [`components/ui/BrandBadge.jsx`](../components/ui/BrandBadge.jsx)
y aparece automáticamente en:

- TitleBar
- SplashScreen
- IntroName (paso 1)
- IntroTour (header)
- RolePicker (eyebrow)
- Dashboard (eyebrow)

### Reemplazar el logo

1. Sustituye `op.png` por tu archivo manteniendo el mismo nombre.
2. Formatos recomendados: **PNG transparente** ≥ 256×256 px, o **SVG**.
3. Si cambias el nombre o el formato, actualiza el import en
   [`BrandBadge.jsx`](../components/ui/BrandBadge.jsx).
4. El logo se renderiza dentro de un cuadrado con bordes redondeados,
   border azul y glow. El cuadrado tiene fondo negro (`#000`) para
   armonizar con logos que vienen sobre fondo oscuro.

### Vite

Vite resuelve los imports de imágenes a URLs públicas (o data-URLs para
archivos pequeños) en build. No necesitas configurar nada — solo
`import logo from "../assets/op.png"`.

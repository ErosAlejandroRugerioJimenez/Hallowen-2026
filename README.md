# La Calle de las Brujas · 2026

Día de Muertos en Calle Allende. Cita: 2 de noviembre de 2026, 5:30 p. m. (México).
React, TypeScript, Vite, Tailwind CSS, Motion y Lucide. Fuentes alojadas localmente.

## Desarrollo
Requiere Node.js 22.6 o superior.
- npm install
- npm run dev
- npm test
- npm run build
- npm run preview

## Organización
- src/components: secciones, navegación, decoraciones y audio.
- src/data/event.ts: fecha, hora, ubicación, navegación, retratos y comité.
- src/hooks: aparición progresiva de secciones.
- src/lib: cuenta regresiva y motor de audio.
- src/styles: estilos base, legibilidad, efectos y ajustes móviles.
- public: únicamente los recursos que se publican.
- assets/generated: originales de diseño y registro de generación; no se publican.
- scripts/optimize-images.cjs: genera las cinco imágenes fijas vigentes con Sharp.

## Contenido y recursos
El cartel vigente es cartel-concursos-2026. La vista previa usa WebP y la descarga JPG.
Para regenerar los recursos desde los originales: npm run assets:optimize.
Los diseños anteriores se conservan como originales, fuera de public.

El mapa usa las coordenadas proporcionadas por el organizador; los dos enlaces comparten ese destino.
El comité está confirmado en event.ts. El cronograma se retiró.
La invitación a vecinos y negocios no requiere formulario.

## Audio, accesibilidad y comprobaciones
El ambiente intenta reproducirse al entrar; cuando el navegador bloquea el inicio automático, reintenta con el primer toque. El botón permite apagarlo. Se pausa al ocultar la pestaña y respeta el apagado del visitante.
Las animaciones respetan movimiento reducido. La página permite desplazamiento vertical y zoom.
Las pruebas cubren cuenta regresiva, estados del audio y existencia de imágenes y fuentes.

## Publicación
Firebase Hosting sirve dist según firebase.json. Ejecuta npm run build antes de publicar.
Cambiar los archivos locales no publica automáticamente el sitio.

## Carrusel de recuerdos
Coloca fotos en fotos-recuerdos/ (JPG, JPEG, PNG, WebP, AVIF o TIFF).
Puedes usar subcarpetas por año, por ejemplo 2024/01-desfile.jpg.
Ejecuta npm run gallery:import para actualizar un servidor que ya está abierto.
npm run dev y npm run build también importan las fotos automáticamente.
Se generan WebP de hasta 1600 y 640 píxeles, con orientación corregida y sin ampliar fotos pequeñas.
Los originales se conservan. El carrusel no inventa fechas cuando el archivo no indica un año.
El cambio automático se pausa al interactuar, ocultar la pestaña o salir de la sección, y respeta movimiento reducido.


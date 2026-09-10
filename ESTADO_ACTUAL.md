# Estado Actual del Proyecto: Mancam Global Supply / MikaZone USA

## 1. Visión General del Proyecto
- **Cliente:** Mancam Global Supply LLC / MikaZone USA.
- **Evento Objetivo:** BuildExpo South Florida 2026 (Broward County Convention Center).
- **Propósito:** Web App interactiva mobile-first accesible mediante escaneo de código QR en el stand comercial para captación de leads calificados, consulta del catálogo técnico de aditivos y descarga inmediata del dossier corporativo en PDF.
- **Panel Administrativo:** Dashboard comercial protegido por PIN para seguimiento en tiempo real de prospectos y exportación a formato Excel (.xlsx).

## 2. Stack Tecnológico & Infraestructura
- **Framework:** Next.js 15+ (App Router, Server Actions).
- **Lenguaje & Tipado:** TypeScript con tipado estricto.
- **Estilos & UI:** Tailwind CSS (diseño industrial de alto contraste, fondo blanco corporativo y acentos esmeralda MikaZone).
- **Base de Datos & Backend:** Supabase PostgreSQL con RLS (Row Level Security) y Realtime habilitado.
- **Control de Versiones:** GitHub (`cremediat-ship-it/mancam-mikazone`).
- **Despliegue & Hosting:** Vercel en producción (`mancam-mikazone.vercel.app`).
- **Librerías Clave:** `@supabase/supabase-js`, `zod`, `xlsx`, `lucide-react`.

## 3. Variables de Entorno (.env.local y Vercel)
- `NEXT_PUBLIC_SUPABASE_URL`: `https://rbctsleplxtqypqngvvn.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Configurado (clave JWT anónima de Supabase).
- `NEXT_PUBLIC_EVENT_PIN`: `2026`

## 4. Arquitectura de Módulos Implementados
- `src/data/products.ts`: Catálogo técnico tipado con los 10 productos MikaZone (Cellulose Ethers HPMC/MHEC, HEC, VAE RPP, Starch Ether HPS, PCE Superplasticizer, Silicone SHP, Gypsum Retarder, Rheology Modifier S400 / Powder Defoamer, Calcium Formate y Fibras Sintéticas).
- `src/app/actions/leads.ts`: Server Action para validación de formularios con Zod e inserción segura en Supabase.
- `src/components/LeadCaptureModal.tsx`: Modal de captura comercial con soporte de persistencia local (localStorage) ante fallos de red en la expo y trigger de descarga del PDF técnico.
- `src/components/ProductCatalog.tsx`: Catálogo interactivo con filtrado estricto por industria (Morteros, Recubrimientos, Concreto, Especialidades).
- `src/app/page.tsx`: Landing page principal con Hero industrial, CTA primario de alta conversión ("DOWNLOAD TECHNICAL DOSSIER & PRICING") y acceso seguro al panel comercial.
- `src/app/admin/leads/page.tsx`: Panel comercial con autenticación por PIN (`2026`), tabla reactiva de prospectos, calificación por estrellas (1 a 5) y exportador nativo `.xlsx`.

## 5. Próximos Pasos & Roadmap
1. **Animación Cinemática 3D de Entrada:** Implementar componente Three.js / Framer Motion que simule la caída cinemática del saco de aditivo MikaZone y onda de choque al escanear el código QR.
2. **Ajuste Fino de Catálogo:** Asegurar que los 10 productos coincidan al 100% con el dossier físico oficial (incluyendo Powder Defoamer DE401/DE402).
3. **Activo PDF Real:** Confirmar la ruta final del archivo PDF en `public/docs/` para la descarga automática tras el submit.

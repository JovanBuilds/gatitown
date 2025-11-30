# 🐱 GatiTown

Plataforma web para facilitar la adopción de gatos rescatados en Tijuana, Baja California.

## 🌟 Características

- **Galería Pública**: Visualiza gatos disponibles para adopción
- **Formulario de Publicación**: Los rescatistas pueden publicar gatos para adopción
- **Carga de Imágenes**: Sistema de upload de fotos integrado
- **Panel de Administración**: Gestión completa del flujo de adopciones
- **Sistema de Aprobación**: Revisión de publicaciones antes de hacerlas públicas
- **Estados de Adopción**: Seguimiento del estado (Disponible, Reservado, Adoptado)
- **Autenticación Segura**: Sistema de login para administradores

## 🛠️ Tecnologías

- **Frontend**: Astro + React + Tailwind CSS
- **Backend**: Astro API Routes
- **Base de Datos**: Prisma ORM (SQLite para desarrollo, compatible con PostgreSQL)
- **Autenticación**: Lucia Auth
- **Validación**: Zod
- **TypeScript**: Type safety en todo el proyecto

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o pnpm

## 🚀 Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/gatitown.git
cd gatitown
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Edita `.env` con tus configuraciones.

4. **Configurar la base de datos**
```bash
# Generar cliente de Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# Poblar base de datos con datos iniciales
npx tsx prisma/seed.ts
```

5. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:4321`

## 👤 Credenciales de Prueba

Después de ejecutar el seed, puedes iniciar sesión con:

- **Email**: `admin@gatitown.com`
- **Password**: `adminpassword`

⚠️ **IMPORTANTE**: Cambia estas credenciales en producción.

## 📁 Estructura del Proyecto

```
gatitown/
├── prisma/
│   ├── schema.prisma          # Esquema de base de datos
│   ├── seed.ts                # Datos iniciales
│   └── migrations/            # Migraciones de BD
├── public/
│   ├── uploads/               # Imágenes subidas (no en git)
│   └── images/                # Imágenes estáticas
├── src/
│   ├── components/
│   │   ├── admin/            # Componentes de admin
│   │   ├── auth/             # Componentes de autenticación
│   │   └── cats/             # Componentes de gatos
│   ├── layouts/
│   │   └── Layout.astro      # Layout principal
│   ├── lib/
│   │   ├── auth.ts           # Configuración de Lucia
│   │   ├── prisma.ts         # Cliente de Prisma
│   │   └── validation.ts     # Esquemas de Zod
│   ├── pages/
│   │   ├── api/              # API endpoints
│   │   ├── admin/            # Páginas de admin
│   │   ├── auth/             # Páginas de autenticación
│   │   └── index.astro       # Página principal
│   └── middleware.ts         # Middleware de autenticación
└── package.json
```

## 🔐 Seguridad

- Las rutas de administración están protegidas con autenticación
- Las contraseñas se hashean con Argon2id
- Validación de datos en frontend y backend
- Protección CSRF en formularios
- Variables de entorno para información sensible

## 🎨 Personalización

### Colores del Tema

Los colores principales están definidos en `tailwind.config.mjs`:

- `#FFF4EA` - Cream (fondo)
- `#9A7B6A` - Primary (marrón)
- `#A8D8E8` - Accent Blue (azul pastel)
- `#F7C8B6` - Accent Peach (durazno)

### Modificar Textos

Los textos están en español en los componentes. Busca en:
- `src/components/` - Componentes React
- `src/pages/` - Páginas Astro

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview de producción
npm run preview

# Base de datos
npm run db:push      # Sincronizar schema sin migración
npm run db:migrate   # Crear y aplicar migración
npm run db:studio    # Abrir Prisma Studio
```

## 🌐 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Instala el adaptador de Vercel:
```bash
npx astro add vercel
```

### Netlify

1. Conecta tu repositorio a Netlify
2. Configura las variables de entorno
3. Instala el adaptador de Netlify:
```bash
npx astro add netlify
```

### Variables de Entorno en Producción

Asegúrate de configurar:
- `DATABASE_URL` - URL de tu base de datos PostgreSQL
- Cambia las contraseñas por defecto del seed

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Autores

- **Jovan Solis** - [JovanBuilds](https://github.com/JovanBuilds)

## 🙏 Agradecimientos

- A todos los rescatistas de gatos en Tijuana
- A la comunidad de Astro y React
- A todos los que contribuyen a este proyecto

## 📞 Contacto

Para preguntas o sugerencias:
- Email: jovansolis.dev@gmail.com
- GitHub: [@JovanBuilds](https://github.com/JovanBuilds)

---

Hecho con ❤️ para los gatitos de Tijuana 🐱

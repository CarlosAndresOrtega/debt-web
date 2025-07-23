
# 📚 Book Scraper – Frontend

Este es el frontend de la aplicación Book Scraper, desarrollada con Angular 17, TailwindCSS y PrimeNG. Su objetivo es consumir el backend para visualizar libros extraídos de páginas externas, con opciones de búsqueda y filtrado por autor o género.

## 🚀 Stack Tecnológico

- Angular 19
- TailwindCSS
- PrimeNG
- RxJS
- TypeScript
- Responsive (Mobile First)

## ⚙️ Instalación y ejecución

Clona el repositorio:

```bash
git clone https://github.com/CarlosAndresOrtega/FrontendLibros.git
cd FrontendLibros
```

Instala las dependencias:

```bash
npm install
```

Levanta el servidor de desarrollo:

```bash
# 🏗️ Build para desarrollo
npm run build

# 🧪 Build para beta
npm run build:beta

# 🔄 Build para release candidate
npm run build:rc

# 🚀 Build para producción
npm run build:prod
```

### ⚙️ Configuración de Environments:

```
src/environments/
├── environment.ts        # 🏠 Desarrollo
├── environment.beta.ts   # 🧪 Beta/Staging
├── environment.rc.ts     # 🔄 Release Candidate
└── environment.prod.ts   # 🚀 Producción
```

---

## 🧩 Componentes Reutilizables

### 🎯 Componentes Centrales para Reutilización

Estos componentes están diseñados para ser utilizados consistentemente en todas las pantallas:

#### 🔍 **FilterGroup Component**

- **Ubicación**: `src/app/common/components/filter-group.ts`
- **Propósito**: Sistema de filtros unificado para todas las vistas
- **Características**:
    - ✅ Filtros dinámicos por dropdown
    - ✅ Filtros de rango de fechas
    - ✅ Sincronización con query parameters
    - ✅ Botón "Limpiar filtros"
    - ✅ Diseño responsive

```typescript
// 💡 Ejemplo de uso
<filter-group
  [filters]="availableFilters"
  [useDateFilters]="true"
  [queryParams]="currentParams"
  (selectedFilters)="onFilterChange($event)"
  (clearFilters)="onClearFilters()">
</filter-group>
```

#### 📊 **CustomerList Component (Tabla Universal)**

- **Ubicación**: `src/app/common/components/list.ts`
- **Propósito**: Tabla reutilizable para mostrar cualquier tipo de datos
- **Características**:
    - ✅ Vista de tabla para desktop
    - ✅ Vista de cards para móvil
    - ✅ Ordenamiento multcolumna
    - ✅ Selección múltiple con checkboxes
    - ✅ Menú contextual por fila
    - ✅ Componentes personalizables (tags, imágenes)

```typescript
// 💡 Ejemplo de uso
<customer-list
  [customers]="dataList"
  [cols]="tableColumns"
  [showCheckbox]="true"
  [hasContextualMenu]="true"
  (onSort)="handleSort($event)"
  (selectedItems)="handleSelection($event)"
  (openItem)="openDetail($event)">
</customer-list>
```

#### 🔍 **Search Input (Integrado en FilterGroup)**

- **Características**:
    - ✅ Búsqueda en tiempo real
    - ✅ Debounce para optimización
    - ✅ Sincronización con URL
    - ✅ Placeholder personalizable
    - ✅ Íconos integrados

#### 🎛️ **Otros Componentes Reutilizables:**

| Componente               | Archivo                 | Propósito                      |
| ------------------------ | ----------------------- | ------------------------------ |
| 🛒 **CartSummary**       | `cart-summary.ts`       | Resumen de carrito de compras  |
| ✅ **ConfirmationModal** | `confirmation-modal.ts` | Modal de confirmación estándar |
| 🧭 **Header**            | `header.ts`             | Cabecera de páginas            |
| 🍔 **ButtonWithMenu**    | `button-with-menu.ts`   | Botón con menú desplegable     |

---

## 📱 Funcionalidades Principales

### 🏢 **Módulos de Negocio:**

- 👥 **Clientes**: Gestión completa de clientes y prospectos
- 💰 **Ventas**: Catálogo de productos y gestión de ventas
- 💳 **Cobranzas**: Seguimiento de pagos y gestión de cobranzas
- 📈 **Actualizaciones**: Módulo de actualizaciones de artículos

### ⚙️ **Funcionalidades Técnicas:**

- 🔐 Autenticación y autorización
- 📱 Diseño responsive para mobile y desktop
- 🌙 Modo oscuro/claro
- 🔄 Lazy loading de módulos
- 📊 Tablas con paginación y filtros
- 🗺️ Integración con Google Maps
- 📄 Exportación de datos

---

## 🎨 Tecnologías

### 🚀 **Core Technologies:**

- **Angular 19** - Framework principal
- **TypeScript** - Lenguaje de programación
- **PrimeNG 19** - Librería de componentes UI
- **Tailwind CSS** - Framework de estilos
- **PrimeFlex** - Utilidades CSS

### 📦 **Dependencias Principales:**

```json
{
    "@angular/core": "^19.0.0",
    "primeng": "^19.0.8",
    "@primeng/themes": "^19.0.6",
    "primeicons": "^7.0.0",
    "tailwindcss": "^3.4.17",
    "chart.js": "4.4.2",
    "@angular/google-maps": "^19.2.11"
}
```

---

## 📱 Características

### ⭐ **Características de Atlantis NG:**

- 🎨 **17 Temas de Componentes** - Variedad de estilos predefinidos
- 📐 **7 Orientaciones de Menú** - Static, Overlay, Slim, Drawer, etc.
- 🌓 **Modo Claro/Oscuro** - Cambio dinámico de tema
- 📱 **Completamente Responsive** - Optimizado para todos los dispositivos
- 🎯 **Touch Optimized** - Experiencia táctil mejorada para móviles
- 🧩 **Compatibilidad con PrimeBlocks** - Bloques de UI modulares
- 🎭 **Archivo Figma** - Diseños disponibles para diseñadores

### 🔧 **Scripts de Desarrollo:**

```bash
# 🎨 Formateo de código
npm run format              # Formatear archivos
npm run format:check       # Verificar formato

# 🔍 Linting
npm run lint               # Ejecutar ESLint

# 🧪 Testing
npm run test               # Ejecutar pruebas unitarias

# 👀 Desarrollo con watch
npm run watch              # Build con observador de cambios
```

---

<div align="center">

**🚀 Desarrollado con Atlantis NG y Angular 19**

_Para más información sobre Atlantis NG, visita: [primeng.org/templates/atlantis](https://primeng.org/templates/atlantis)_

</div> -->

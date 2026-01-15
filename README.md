# 💰 Sistema de Gestión de Deudas - Frontend

Aplicación web moderna para el control y seguimiento de obligaciones financieras, diseñada con Angular y optimizada para una experiencia de usuario fluida tanto en escritorio como en dispositivos móviles.



## 🚀 Tecnologías Principales

* **Angular 19+**: Framework para una SPA (Single Page Application) robusta.
* **PrimeNG**: Biblioteca de componentes UI para tablas, menús y formularios.
* **Tailwind CSS**: Framework de utilidades CSS para un diseño responsivo y moderno.
* **TypeScript**: Tipado estricto para garantizar la integridad de los datos financieros.
* **NestJS API**: Backend de soporte para la persistencia de datos.

---

## 🛠️ Requisitos Previos

* **Node.js**: v18.0.0 o superior.
* **npm**: v9.0.0 o superior.
* **Angular CLI**: Instalado globalmente (`npm install -g @angular/cli`).

---

## 💻 Instalación y Despliegue Local

Sigue estos pasos para ejecutar el proyecto en tu máquina:

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/CarlosAndresOrtega/debt-web.git
    cd debt-web
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar el entorno:**
    Asegúrate de que el archivo `src/environments/environment.ts` apunte a la dirección de tu servidor backend:
    ```typescript
    export const environment = {
        production: false,
        baseUrl: 'http://localhost:3000/api'
    };
    ```

4.  **Levantar la aplicación:**
    ```bash
    ng serve -o
    ```
    La aplicación estará disponible en `http://localhost:4200/`.

---

## 📱 Características Destacadas

* **Dashboard Financiero**: Resumen visual del monto total acumulado, total pagado y balance pendiente.
* **Vista Híbrida Responsiva**: El sistema detecta automáticamente si el usuario está en móvil o escritorio:
    * **Escritorio**: Tabla interactiva con columnas ordenables y menú contextual.
    * **Móvil**: Vista de tarjetas (DataView) con scroll táctil optimizado y acceso rápido a acciones.
* **Gestión de Estados**: Posibilidad de marcar deudas como pagadas, editar detalles o eliminar registros.
* **Exportación de Datos**: Generación y descarga de reportes en formato CSV.

---

## 🔧 Soluciones Técnicas Implementadas

* **Scroll Táctil**: Se configuró `touch-action: pan-y` y `-webkit-overflow-scrolling: touch` para solucionar bloqueos de scroll en navegadores móviles.
* **Tipado Estricto**: Uso de interfaces `Debt` y `DebtsResponse` para asegurar que el frontend siempre maneje datos validados del backend.
* **Validación de Formularios**: Registro e ingreso con validación reactiva y botones de acción condicionales al estado del formulario.

---

## 🏗️ Estructura del Proyecto

* `src/app/debt`: Componentes principales de la gestión de deudas.
* `src/app/auth`: Módulo de autenticación (Login/Registro).
* `src/common`: Componentes reutilizables, interfaces y servicios compartidos.
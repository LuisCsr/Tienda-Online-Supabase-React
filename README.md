<<<<<<< HEAD
# React + Vitegin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plu
=======
Este proyecto implementa una tienda electrónica completa (e-commerce) con una arquitectura Full-Stack basada en seguridad a nivel de fila (RLS), autenticación robusta y diseño interactivo.
🏗️ 1. Arquitectura y Stack Tecnológico Componente TecnologíaJustificación y NotasFrontend/UIReact (Vite)Entorno de desarrollo rápido y ligero.Estilos/DiseñoCSS ModulesSolución final adoptada para evitar conflictos de compilación de PostCSS/Tailwind.
Diseño responsive y con enfoque visible.
Backend/DBSupabaseBackend como Servicio (BaaS) que proporciona PostgreSQL, autenticación y almacenamiento (Storage).SeguridadRLS (Row Level Security)Control de acceso estricto implementado directamente en la base de datos (Postgres).BonificacionesOAuth (Google) y Storage de ImágenesImplementados para la gestión de usuarios y archivos de productos
.💾 2. Modelo de Base de Datos (ERD/Esquema)El modelo es relacional y se basa en la tabla principal perfiles (extensión de auth.users).
El Diagrama Entidad-Relación (ERD) es el siguiente:
2.1 Tablas y Relaciones Claveperfiles: Contiene el role (user/admin) y datos extendidos, con FK a auth.users(id).productos: Catálogo principal. La columna categoria_id permite NULL para evitar conflictos de inserción, pero se relaciona con categorias.carritos & items_carrito: Relación uno-a-muchos (1:N) donde carritos.user_id es el propietario.pedidos & items_pedido: 
Almacena el historial de compras del usuario.🔒 
3. Políticas de Seguridad (RLS)El acceso se controla mediante la función auth.uid() (para propietario) y el reclamo de rol en el JWT (auth.jwt() ->> 'role' = 'admin').TablaOperaciónPolítica AplicadaObjetivo de SeguridadproductosSELECTis_active = TRUEPúblico solo ve productos disponibles.productosINSERT/UPDATEauth.jwt() ->> 'role' = 'admin'Solo administradores pueden modificar el catálogo.perfilesSELECT/UPDATEauth.uid() = idLos usuarios solo pueden ver y editar su propio perfil.carritosALL (CRUD)auth.uid() = user_idCarrito privado y persistente por usuario logueado.pedidosINSERT / SELECTauth.uid() = user_id o TRUEPermite a cualquier usuario autenticado crear (insertar) su pedido (solución al conflicto RLS), y ver solo sus pedidos.storage.objectsINSERT/UPDATE(auth.jwt() ->> 'role') = 'admin'Solo el administrador puede subir archivos.🛠️ 4. Configuración e Inicio del Proyecto
4.1 RequisitosNode.js (v16+)Cuenta de Supabase configurada.Credenciales de Google OAuth (para bonificación).
4.2 Instalación LocalClonar el repositorio y navegar a la carpeta:Bashgit clone [URL_DEL_REPOSITORIO]
cd mi-tienda-react
Instalar dependencias:Bashnpm install
Configurar Credenciales: Crear el archivo .env.local en la raíz del proyecto:# .env.local
VITE_SUPABASE_URL="[TU URL DE PROYECTO]"
VITE_SUPABASE_ANON_KEY="[TU CLAVE ANON PÚBLICA]"
Iniciar Desarrollo:Bashnpm run dev
4.3 Scripts SQL para la Configuración del ServidorEl esquema fue reconstruido completamente y es funcional. Las políticas de RLS y los triggers deben ejecutarse en la secuencia que se encuentra en el archivo adjunto ([NOMBRE_DEL_ARCHIVO].sql).
🚀 5. Cuentas de Prueba y EscenariosUtilice estas cuentas para la demostración y verificación de las políticas RLS.RolCorreo ElectrónicoContraseñaEscenario a ProbarADMINadmin.prueba@tienda.com[CONTRASEÑA_DE_PRUEBA]Panel de Admin (CRUD), Subida de Imágenes, RLS: Ver todos los productos.USERusuario.demo@tienda.com[CONTRASEÑA_DE_PRUEBA]Carrito (INSERT/UPDATE/DELETE), Checkout, Historial de Pedidos. RLS: Solo ve productos activos.PÚBLICO(Ninguno)N/ACatálogo, Búsqueda, RLS: 
Solo ve productos activos.Para la demostración, primero debe iniciar sesión como ADMIN para crear categorías y productos.
>>>>>>> 49955c21bcc79ef8d1fccc2fcb659779ceab4106

<!--toc:start-->
- [Proyecto2_MIA_SS2026_Gestion_documentos](#proyecto2_mia_ss2026_gestion_documentos)
- [Activar autenticación en MongoDB](#activar-autenticación-en-mongodb)
  - [Requisitos previos](#requisitos-previos)
  - [Paso 1: Crear el usuario administrador](#paso-1-crear-el-usuario-administrador)
  - [Paso 2: Salir de mongosh](#paso-2-salir-de-mongosh)
  - [Paso 3: Activar la autorización en la configuración](#paso-3-activar-la-autorización-en-la-configuración)
  - [Paso 4: Reiniciar el servicio](#paso-4-reiniciar-el-servicio)
  - [Paso 5: Conectarse con autenticación](#paso-5-conectarse-con-autenticación)
  - [Cadena de conexión para la aplicación](#cadena-de-conexión-para-la-aplicación)
<!--toc:end-->

# Proyecto2_MIA_SS2026_Gestion_documentos

## Activar autenticación en MongoDB

> **Nota:** Este procedimiento es **opcional**. Solo debes realizarlo si la autenticación **no está activada** en tu instalación de MongoDB. Si ya puedes conectarte con usuario y contraseña, no necesitas repetir estos pasos.

### Requisitos previos

- MongoDB Community Server instalado y en ejecución.
- Acceso a `mongosh`.
- Permisos de `sudo` para editar la configuración y reiniciar el servicio.

### Paso 1: Crear el usuario administrador

Conéctate a MongoDB **sin autenticación** (aún no está activada):

```bash
mongosh
```

Dentro de `mongosh`, cambia a la base de datos `admin` y crea el usuario:

```javascript
use admin

db.createUser({
  user: "Rafael",
  pwd: passwordPrompt(),
  roles: [ { role: "root", db: "admin" } ]
})
```

Cuando aparezca el prompt `Enter password:`, escribe la contraseña:

```text
GestionArchivos2026
```

> **Nota:** La contraseña no se mostrará mientras la escribes (es normal, por seguridad).

### Paso 2: Salir de mongosh

```bash
exit
```

### Paso 3: Activar la autorización en la configuración

Edita el archivo de configuración de MongoDB usando nano o nvim:

```bash
sudo nano /etc/mongod.conf
```

Busca la sección `security` (o añádela si no existe) y asegúrate de que quede así:

```yaml
security:
    authorization: enabled
```

> **Importante:** Respeta la **indentación** (4 espacios). YAML es estricto con esto. No uses tabulaciones.

Guarda y cierra el archivo (`Ctrl + O`, `Enter`, `Ctrl + X` en nano; `Esc`, `:wq` en nvim).

### Paso 4: Reiniciar el servicio

```bash
sudo systemctl restart mongod
```

### Paso 5: Conectarse con autenticación

Ahora ya puedes conectarte usando el usuario y la contraseña:

```bash
mongosh -u Rafael -p --authenticationDatabase admin
```

Te pedirá la contraseña (`GestionArchivos2026`) y, si todo está correcto, entrarás a la shell ya autenticado.

> El flag `--authenticationDatabase admin` indica que el usuario fue creado en la base de datos `admin`. Es fundamental incluirlo, o la autenticación fallará.

### Cadena de conexión para la aplicación

Para conectarte a MongoDB desde NestJS, usa esta URI:

```text
mongodb://Rafael:GestionArchivos2026@localhost:27017/gestion_documentos?authSource=admin



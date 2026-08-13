# Página de transparencia de Caye

## Publicarla gratis con GitHub Pages

1. Entrá a GitHub y creá una cuenta si todavía no tenés.
2. Creá un repositorio público, por ejemplo: `caye-transparencia`.
3. Subí el archivo `index.html` de esta carpeta.
4. En el repositorio: **Settings → Pages**.
5. En "Build and deployment", elegí **Deploy from a branch**, rama `main`, carpeta `/root`, y guardá.
6. GitHub te dará una dirección similar a:
   `https://TUUSUARIO.github.io/caye-transparencia/`

GitHub confirma que Pages permite publicar sitios estáticos desde un repositorio y está disponible con GitHub Free para repositorios públicos.

## Cómo actualizar la recaudación

Abrí `index.html` y buscá:

const data = {
  goal: 1000000,
  collected: 0,
  supporters: 0,
  updated: "Pendiente"
};

Cambiá solamente esos cuatro valores y volvé a subir/guardar el archivo.

IMPORTANTE: no publiques CBU, números de cuenta, tarjetas, comprobantes con datos personales ni contraseñas. La página debe mostrar totales y fechas, no información bancaria sensible.

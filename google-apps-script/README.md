# Activación gratuita de la rifa
1. Abrí https://script.google.com/home/projects/create con tu cuenta propietaria de la planilla.
2. Reemplazá Code.gs por el contenido de [Code.gs](./Code.gs).
3. Guardá, elegí la función `inicializar`, presioná Ejecutar y autorizá Google.
4. Implementar > Nueva implementación > Aplicación web > Ejecutar como: Yo > Quién tiene acceso: Cualquier persona. Copiá la URL terminada en /exec.
5. No hagas pública la planilla. El código usa LockService para evitar reservas simultáneas.
6. Antes de abrir ventas: verificá cada número previo. Solo marcá Disponible aquellos realmente libres. Pagado únicamente tras verificar el banco.
7. Compartí la URL /exec para conectar la página y realizar una prueba real de dos reservas simultáneas.
8. El vencimiento se procesa al consultar o intentar reservar; no borra el historial.
9. El nombre y teléfono se guardan en la planilla privada, no se envían al público.
**Pendiente:** conectar la URL del despliegue a GitHub Pages, probar escritura, verificar los números previos y completar las bases legales antes de activar cobros.

/**
 * RIFA CAYE · Respaldo diario en Google Drive, sin costo.
 * Archivo adicional Backup.gs del mismo proyecto de Apps Script.
 *
 * Instalación única: guardar este archivo y ejecutar activarRespaldoRifa()
 * desde el editor (autorizar permisos de Drive y triggers).
 * NO hace falta desplegar de nuevo la aplicación web para usar este respaldo.
 * No modificar ni eliminar el proyecto de la rifa ni su planilla maestra.
 */
function respaldoRifaDiario() {
  var zona = 'America/Argentina/Buenos_Aires';
  var fecha = Utilities.formatDate(new Date(), zona, 'yyyy-MM-dd');
  var nombre = 'RESPALDO RIFA CAYE · ' + fecha + ' · Control + Historial';
  var existentes = DriveApp.getFilesByName(nombre);

  // Solo una copia por día para no llenar Drive de duplicados.
  if (existentes.hasNext()) {
    Logger.log('Respaldo del día ya existente: ' + existentes.next().getUrl());
    return;
  }

  // ID está definido en el archivo Código.gs del proyecto.
  var origen = DriveApp.getFileById(ID);
  var copia = origen.makeCopy(nombre, DriveApp.getRootFolder());
  var planillaCopia = SpreadsheetApp.openById(copia.getId());
  var pestanas = planillaCopia.getSheets().map(function(s) { return s.getName(); });
  ['NUMEROS', 'HISTORIAL_RIFA', 'CONTROL', 'GUIA'].forEach(function(n) {
    if (pestanas.indexOf(n) === -1) {
      throw new Error('El respaldo quedó incompleto; falta la pestaña ' + n + '. Copia: ' + copia.getUrl());
    }
  });
  Logger.log('Respaldo completo y verificado: ' + copia.getUrl());
}

function activarRespaldoRifa() {
  var funcion = 'respaldoRifaDiario';
  var existe = ScriptApp.getProjectTriggers().some(function(t) {
    return t.getHandlerFunction() === funcion;
  });
  if (!existe) {
    ScriptApp.newTrigger(funcion)
      .timeBased()
      .atHour(21)
      .everyDays(1)
      .inTimezone('America/Argentina/Buenos_Aires')
      .create();
  }
  respaldoRifaDiario();
  Logger.log('Respaldo diario configurado, aproximadamente a las 21 h de Argentina.');
}

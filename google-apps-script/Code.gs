/** RIFA CAYE — Google Apps Script gratuito.
 * Pegá este archivo en script.google.com, ejecutá inicializar() una sola vez,
 * y desplegá como aplicación web: ejecutar como YO, acceso CUALQUIERA.
 * No publiques el ID ni el contenido privado de las pestañas de participantes.
 */
const ID='1LtPuRytE6Be4C3aGYvIjX4ekx16jVjpVOpgF075zVwY';
const HOJA='NUMEROS', HIST='HISTORIAL_RIFA';
const MINUTOS=30;
function ss(){return SpreadsheetApp.openById(ID)}
function sh(){return ss().getSheetByName(HOJA)}
function inicializar(){
 const s=ss();let h=s.getSheetByName(HIST)||s.insertSheet(HIST);
 if(h.getLastRow()===0)h.appendRow(['FECHA','NUMERO','ACCION','NOMBRE','TELEFONO','REFERENCIA']);
 let a=sh();a.getRange(1,5,1,5).setValues([['NOMBRE PRIVADO','TELEFONO PRIVADO','RESERVADO HASTA','REFERENCIA','ACTUALIZADO']]);
}
function reply(data,cb){
 let json=JSON.stringify(data);
 if(cb && /^[a-zA-Z_$][\w$]{0,50}$/.test(cb))return ContentService.createTextOutput(cb+'('+json+');').setMimeType(ContentService.MimeType.JAVASCRIPT);
 return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}
function state(v){let s=String(v||'').trim().toLowerCase();if(s==='pagado')return 'Pagado';if(s==='reservado')return 'Reservado';if(s==='disponible')return 'Disponible';return 'Por verificar'}
function rowNum(n){n=Number(n);if(!Number.isInteger(n)||n<1||n>500)throw Error('Número inválido');return n+1}
function expire(a,h){
 let now=Date.now(),last=a.getLastRow(),vals=a.getRange(2,1,Math.min(500,last-1),9).getValues(),changed=[];
 vals.forEach((v,i)=>{if(state(v[1])==='Reservado' && v[6] instanceof Date && v[6].getTime()<now){let r=i+2;a.getRange(r,2).setValue('Disponible');a.getRange(r,5,1,5).clearContent();changed.push([new Date(),v[0],'VENCIDA','','',''])}});
 if(changed.length)h.getRange(h.getLastRow()+1,1,changed.length,6).setValues(changed);
}
function doGet(e){
 const p=e.parameter||{},a=sh(),h=ss().getSheetByName(HIST);let lock=LockService.getScriptLock();
 if(!lock.tryLock(15000))return reply({ok:false,error:'Ocupado, intentá de nuevo'},p.callback);
 try{
  expire(a,h);
  const v=a.getRange(2,1,500,2).getDisplayValues();
  return reply({ok:true,numeros:v.map(x=>({numero:String(x[0]).padStart(3,'0'),estado:state(x[1])})),updated:new Date().toISOString()},p.callback);
 }catch(err){return reply({ok:false,error:'Error de lectura'},p.callback)}finally{lock.releaseLock()}
}
function doPost(e){
 const p=e.parameter||{},lock=LockService.getScriptLock();
 if(!lock.tryLock(20000))return reply({ok:false,error:'Ocupado; reintentá'});
 try{
  const a=sh(),h=ss().getSheetByName(HIST);expire(a,h);
  if(p.action!=='reservar')return reply({ok:false,error:'Acción no permitida'});
  const n=Number(p.numero),r=rowNum(n),nombre=String(p.nombre||'').trim().slice(0,100),tel=String(p.telefono||'').trim().slice(0,35);
  if(nombre.length<3||tel.length<6)return reply({ok:false,error:'Ingresá nombre y teléfono'});
  const current=state(a.getRange(r,2).getDisplayValue());
  if(current!=='Disponible')return reply({ok:false,error:'Número no disponible. Consultá por WhatsApp'});
  const until=new Date(Date.now()+MINUTOS*60000),ref=Utilities.getUuid();
  a.getRange(r,2).setValue('Reservado');a.getRange(r,5,1,5).setValues([[nombre,tel,until,ref,new Date()]]);
  h.appendRow([new Date(),n,'RESERVADO',nombre,tel,ref]);
  return reply({ok:true,numero:String(n).padStart(3,'0'),referencia:ref,vence:until.toISOString()});
 }catch(err){return reply({ok:false,error:'No se pudo reservar'})}finally{lock.releaseLock()}
}
/** Para marcar Pagado, cambiar manualmente B de la fila del número,
 * luego anotar el pago en HISTORIAL_RIFA. No marcar pagado sin verificar banco.
 * IMPORTANTE: por seguridad no hay API pública para confirmar pagos.
 */

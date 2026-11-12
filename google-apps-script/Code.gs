const RECIPIENT = 'cc@varonmagazine.com';
function doPost(e) {
  try {
    if (!e || !e.parameter || !e.parameter.payload) throw new Error('Missing application payload.');
    const data = JSON.parse(e.parameter.payload);
    const kind = String(data.kind || 'Application').slice(0, 80);
    const fields = data.fields || {};
    const uploads = Array.isArray(data.uploads) ? data.uploads : [];
    const attachments = uploads.map(function(file) {
      const bytes = Utilities.base64Decode(file.base64 || '');
      return Utilities.newBlob(bytes, file.mimeType || 'application/octet-stream', file.name || 'portfolio-image');
    });
    const lines = Object.keys(fields).map(function(key) {
      return key.replace(/_/g, ' ').replace(/\b\w/g, function(c){return c.toUpperCase();}) + ': ' + fields[key];
    });
    lines.push('', 'Source: varonmagazine.com', 'Received: ' + new Date().toISOString());
    if (uploads.length) lines.push('', 'Portfolio images attached: ' + uploads.map(function(f){return f.name;}).join(', '));
    const subject = 'VÄRON — ' + kind + ' Application' + (fields.name ? ' — ' + fields.name : '');
    const htmlBody = '<h2>VÄRON — ' + escapeHtml(kind) + ' Application</h2><table cellpadding="6" cellspacing="0" border="0">' +
      Object.keys(fields).map(function(key){return '<tr><td><b>'+escapeHtml(key.replace(/_/g,' '))+'</b></td><td>'+escapeHtml(fields[key])+'</td></tr>';}).join('') +
      '</table><p>Received via varonmagazine.com on ' + escapeHtml(new Date().toLocaleString()) + '</p>' +
      (uploads.length ? '<p>Portfolio images attached: ' + uploads.map(function(f){return escapeHtml(f.name);}).join(', ') + '</p>' : '');
    MailApp.sendEmail({to: RECIPIENT, subject: subject, body: lines.join('\n'), htmlBody: htmlBody, attachments: attachments});
    return resultPage(true);
  } catch (err) {
    console.error(err);
    return resultPage(false);
  }
}
function doGet() {
  return HtmlService.createHtmlOutput('VÄRON application endpoint is active.');
}
function resultPage(ok) {
  return HtmlService.createHtmlOutput('<!doctype html><html><body><script>window.parent.postMessage({type:"VARON_APPLICATION_RESULT",ok:' + (ok ? 'true' : 'false') + '}, "*");</script><p>' + (ok ? 'Application received.' : 'Submission failed.') + '</p></body></html>').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
function escapeHtml(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});
}
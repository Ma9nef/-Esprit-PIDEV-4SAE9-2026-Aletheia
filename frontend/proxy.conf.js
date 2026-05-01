/**
 * Dev-server proxy vers la gateway (8089).
 * Relais explicite des en-têtes d’auth (certains setups les perdent sur POST).
 */

/**
 * @param {import('http').IncomingMessage} req
 * @param {string} nameLower ex: 'authorization'
 */
function pickHeader(req, nameLower) {
  const v = req.headers[nameLower];
  if (v !== undefined && v !== '') {
    return Array.isArray(v) ? v[0] : v;
  }
  const raw = req.rawHeaders || [];
  for (let i = 0; i < raw.length; i += 2) {
    if (String(raw[i]).toLowerCase() === nameLower && raw[i + 1] != null) {
      return raw[i + 1];
    }
  }
  return undefined;
}

/**
 * @param {import('http').ClientRequest} proxyReq
 * @param {import('http').IncomingMessage} req
 */
function forwardAuthHeaders(proxyReq, req) {
  const authorization = pickHeader(req, 'authorization');
  if (authorization) {
    proxyReq.setHeader('Authorization', authorization);
  }
  const xAuth = pickHeader(req, 'x-auth-token');
  if (xAuth) {
    proxyReq.setHeader('X-Auth-Token', xAuth);
  }

  const url = req.url || '';
  if (url.includes('checkout-session') && !authorization && !xAuth) {
    console.warn(
      '[proxy] checkout-session: aucun Authorization ni X-Auth-Token reçu du navigateur — le POST part sans JWT (vérifiez AuthInterceptor / localStorage).'
    );
  }
}

module.exports = {
  '/api/files': {
    target: 'http://localhost:8082',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    ws: false
  },
  '/api': {
    target: 'http://localhost:8089',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    ws: false,
    xfwd: true,
    onProxyReq(proxyReq, req) {
      forwardAuthHeaders(proxyReq, req);
    }
  }
};

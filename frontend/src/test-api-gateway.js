const WebSocket = require('ws');

const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJyb2xlIjoiQURNSU4iLCJpZCI6MSwibmFtZSI6IkFkbWluIFN5c3RlbSIsImlhdCI6MTc3MjY1MDU5NiwiZXhwIjoxNzcyNzM2OTk2fQ.B9gandSlo3RyGvt4C7ZsGGTfjgUKGSuGkamaUAMea3k';
const roomId = 5;
const userName = process.argv[2] || 'Test User';

console.log('🔌 Test WebSocket - Utilisateur:', userName);
console.log('URL:', `ws://localhost:8089/room/${roomId}`);

const ws = new WebSocket(`ws://localhost:8090/room/${roomId}`, {
    headers: {
        'Authorization': `Bearer ${token}`
    }
});

let isAuthenticated = false;

ws.on('open', function open() {
    console.log('✅ Connecté à l\'API Gateway!');
    
    // Envoyer l'authentification immédiatement
    console.log('📤 Envoi authentification...');
    ws.send(JSON.stringify({
        type: 'auth',
        token: token
    }));
});

ws.on('message', function incoming(data) {
    console.log('📩 Reçu:', data.toString());
    
    try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'your-id') {
            console.log('🆔 Mon ID reçu:', message.id);
            isAuthenticated = true;
            
            // Une fois authentifié, on peut rejoindre la salle
            setTimeout(() => {
                console.log('📤 Rejoindre la salle...');
                ws.send(JSON.stringify({
                    type: 'join',
                    name: userName
                }));
            }, 500);
        }
        
        if (message.type === 'existing-user') {
            console.log('👥 Utilisateur existant:', message.name, 'ID:', message.id);
        }
        
        if (message.type === 'new-user') {
            console.log('🆕 Nouvel utilisateur:', message.name, 'ID:', message.id);
            
            // Envoyer un message quand un nouvel utilisateur arrive
            setTimeout(() => {
                console.log('📤 Envoi message de bienvenue...');
                ws.send(JSON.stringify({
                    type: 'chat',
                    message: `Bienvenue ${message.name}! 👋`,
                    name: userName
                }));
            }, 1000);
        }
        
        if (message.type === 'chat') {
            console.log(`💬 ${message.name}: ${message.message}`);
        }
        
    } catch (e) {
        console.log('📄 Message non-JSON:', data.toString());
    }
});

ws.on('error', function error(err) {
    console.error('❌ Erreur:', err.message);
});

ws.on('close', function close(code, reason) {
    console.log(`🔌 Déconnecté: ${code} - ${reason || 'Pas de raison'}`);
    console.log(`📊 Code 1006 = Connexion anormale (timeout ou refus)`);
});

// Envoyer un message périodique seulement si connecté
const interval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN && isAuthenticated) {
        console.log('📤 Envoi message périodique...');
        ws.send(JSON.stringify({
            type: 'chat',
            message: `Message auto ${new Date().toLocaleTimeString()}`,
            name: userName
        }));
    }
}, 5000);

// Arrêt propre
process.on('SIGINT', () => {
    console.log('\n👋 Arrêt demandé...');
    clearInterval(interval);
    ws.close();
    process.exit();
});

console.log('⏱️  Test en cours... Appuyez sur Ctrl+C pour arrêter');
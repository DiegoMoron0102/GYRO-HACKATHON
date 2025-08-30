const fs = require('fs');
const path = require('path');

// Temporalmente renombrar la carpeta API para excluirla del build
const apiPath = path.join(__dirname, '../src/app/api');
const apiBackupPath = path.join(__dirname, '../src/app/api.backup');

if (fs.existsSync(apiPath)) {
    fs.renameSync(apiPath, apiBackupPath);
    console.log('API folder temporarily renamed for mobile build');
}

// Función para restaurar la API después del build
process.on('exit', () => {
    if (fs.existsSync(apiBackupPath)) {
        fs.renameSync(apiBackupPath, apiPath);
        console.log('API folder restored');
    }
});

process.on('SIGINT', () => {
    if (fs.existsSync(apiBackupPath)) {
        fs.renameSync(apiBackupPath, apiPath);
        console.log('API folder restored');
    }
    process.exit();
});

const fs = require('fs');
const path = require('path');

// Restaurar la carpeta API
const apiPath = path.join(__dirname, '../src/app/api');
const apiBackupPath = path.join(__dirname, '../src/app/api.backup');

if (fs.existsSync(apiBackupPath)) {
    fs.renameSync(apiBackupPath, apiPath);
    console.log('API folder restored after mobile build');
} else {
    console.log('No backup API folder found');
}

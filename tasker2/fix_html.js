const fs = require('fs');

// Leer el archivo original
const filePath = 'index.html';
const backupPath = 'index.html.bak';
let content = fs.readFileSync(filePath, 'utf8');

// Crear una copia de seguridad si no existe ya
if (!fs.existsSync(backupPath)) {
    fs.writeFileSync(backupPath, content);
    console.log('Backup created at index.html.bak');
}

// Corregir el código suelto y asegurar la estructura
function fixHtmlFile(htmlContent) {
    // Eliminar código duplicado y fuera de lugar
    const fixedContent = htmlContent
        // Eliminar el código suelto después de la función showTaskModal
        .replace(/\/\/ Tags\s*if \(task\.tags && task\.tags\.length > 0\)[\s\S]*?meta\.appendChild\(progressContainer\);[\s\S]*?}[\s\S]*?toggleTaskExpansion\(task\.id\);[\s\S]*?};[\s\S]*?showTaskModal\(task\);[\s\S]*?};[\s\S]*?deleteTask\(task\.id\);[\s\S]*?};[\s\S]*?actions\.appendChild\(expandButton\);[\s\S]*?return taskElement;[\s\S]*?}[\s\S]*?elements\.taskImage\.value = '';[\s\S]*?}[\s\S]*?}/, '')
        // Asegurar que la función handleTaskSubmit llama a ensureStateStructure
        .replace(/(function handleTaskSubmit\(e\) {\s*e\.preventDefault\(\);\s*)(\s*const id)/,
                 '$1\n    // Asegurar que el estado tiene las estructuras necesarias\n    ensureStateStructure();\n    $2')
        // Asegurar que la función loadFromLocalStorage llame a ensureStateStructure
        .replace(/(function loadFromLocalStorage\(\) {[\s\S]*?if \(tags\) {\s*state\.tags = JSON\.parse\(tags\);\s*}\s*)(\s*})/,
                 '$1\n    // Asegurarse que el estado tiene las estructuras necesarias\n    ensureStateStructure();\n$2')
        // Asegurar un valor predeterminado para list en handleTaskSubmit
        .replace(/const list = elements\.taskList\.value;/,
                 'const list = elements.taskList.value || \'inbox\';')
        // Eliminar cualquier código duplicado de las funciones deleteTask, toggleTaskCompletion y toggleTaskExpansion
        .replace(/function toggleTaskCompletion\(id\)[\s\S]*?function toggleTaskCompletion\(id\)/, 'function toggleTaskCompletion(id)')
        .replace(/function toggleTaskExpansion\(id\)[\s\S]*?function toggleTaskExpansion\(id\)/, 'function toggleTaskExpansion(id)')
        .replace(/function deleteTask\(id\)[\s\S]*?function deleteTask\(id\)/, 'function deleteTask(id)');

    return fixedContent;
}

// Aplicar las correcciones
const fixedContent = fixHtmlFile(content);

// Guardar el archivo corregido
fs.writeFileSync(filePath, fixedContent);
console.log('HTML file has been fixed and saved.');

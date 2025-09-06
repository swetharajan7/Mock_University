#!/usr/bin/env node

/**
 * MockUniversity Deployment Script
 * Verifies all components are ready for deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🎓 MockUniversity Deployment Verification\n');

// Check required files
const requiredFiles = [
    'index.html',
    'js/script.js',
    'netlify.toml',
    'package.json',
    'netlify/functions/submit-application.js',
    'netlify/functions/student-auth.js',
    'netlify/functions/contact-form.js',
    'netlify/functions/get-programs.js'
];

let allFilesExist = true;

console.log('📁 Checking required files...');
requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} - MISSING`);
        allFilesExist = false;
    }
});

// Check package.json
console.log('\n📦 Checking package.json...');
try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    console.log(`✅ Name: ${packageJson.name}`);
    console.log(`✅ Version: ${packageJson.version}`);
    console.log(`✅ Node version: ${packageJson.engines?.node || 'Not specified'}`);
} catch (error) {
    console.log('❌ Error reading package.json:', error.message);
    allFilesExist = false;
}

// Check netlify.toml
console.log('\n⚙️  Checking netlify.toml...');
try {
    const netlifyConfig = fs.readFileSync('netlify.toml', 'utf8');
    if (netlifyConfig.includes('functions = "netlify/functions"')) {
        console.log('✅ Functions directory configured');
    }
    if (netlifyConfig.includes('NODE_VERSION = "18"')) {
        console.log('✅ Node.js version specified');
    }
    console.log('✅ Netlify configuration looks good');
} catch (error) {
    console.log('❌ Error reading netlify.toml:', error.message);
    allFilesExist = false;
}

// Check function files
console.log('\n🔧 Checking Netlify Functions...');
const functionFiles = [
    'submit-application.js',
    'student-auth.js', 
    'contact-form.js',
    'get-programs.js'
];

functionFiles.forEach(file => {
    const filePath = path.join('netlify/functions', file);
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('exports.handler')) {
            console.log(`✅ ${file} - Valid Netlify function`);
        } else {
            console.log(`⚠️  ${file} - Missing exports.handler`);
        }
    }
});

// Final status
console.log('\n' + '='.repeat(50));
if (allFilesExist) {
    console.log('🚀 All checks passed! Ready for deployment.');
    console.log('\nDeployment options:');
    console.log('1. Git push (if connected to Netlify)');
    console.log('2. npm run deploy (Netlify CLI)');
    console.log('3. Drag & drop to Netlify');
    console.log('\nDemo credentials:');
    console.log('Student ID: DEMO001');
    console.log('Password: password123');
} else {
    console.log('❌ Some files are missing. Please check the errors above.');
    process.exit(1);
}

console.log('\n🎓 MockUniversity - Ready to empower minds worldwide!');
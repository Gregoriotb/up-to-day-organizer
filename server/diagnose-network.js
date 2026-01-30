import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import { promisify } from 'util';

dotenv.config();

const resolveSrv = promisify(dns.resolveSrv);

console.log('🔍 Diagnóstico de Conectividad MongoDB Atlas\n');
console.log('='.repeat(50));

// 1. Verificar variables de entorno
console.log('\n1️⃣ Verificando configuración...');
if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI no está definido en .env');
  process.exit(1);
}
console.log('✅ MONGODB_URI está configurado');

// 2. Verificar formato del URI
const uriPattern = /^mongodb(\+srv)?:\/\//;
if (!uriPattern.test(process.env.MONGODB_URI)) {
  console.error('❌ Formato de URI inválido');
  process.exit(1);
}
console.log('✅ Formato de URI válido');

// 3. Extraer hostname
const uri = process.env.MONGODB_URI;
const hostnameMatch = uri.match(/@([^/]+)/);
const hostname = hostnameMatch ? hostnameMatch[1].split('?')[0] : null;
console.log(`📡 Hostname: ${hostname}`);

// 4. Resolver DNS SRV
if (uri.includes('mongodb+srv://')) {
  console.log('\n2️⃣ Resolviendo registros DNS SRV...');
  try {
    const srvRecords = await resolveSrv(`_mongodb._tcp.${hostname}`);
    console.log(`✅ Encontrados ${srvRecords.length} servidores:`);
    srvRecords.forEach((record, i) => {
      console.log(`   ${i + 1}. ${record.name}:${record.port} (priority: ${record.priority})`);
    });
  } catch (error) {
    console.error('❌ Error resolviendo SRV:', error.message);
  }
}

// 5. Intentar conexión con más detalles
console.log('\n3️⃣ Intentando conexión a MongoDB...');
console.log('⏱️  Timeout: 30 segundos\n');

const startTime = Date.now();

try {
  mongoose.connection.on('connecting', () => {
    console.log('🔄 Iniciando conexión...');
  });

  mongoose.connection.on('connected', () => {
    console.log('🔗 Socket conectado');
  });

  mongoose.connection.on('error', (err) => {
    console.error('⚠️  Error de conexión:', err.message);
  });

  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
  });

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\n✅ ¡Conexión exitosa en ${elapsed}s!`);
  console.log(`📊 Base de datos: ${mongoose.connection.name}`);
  console.log(`🌐 Host: ${mongoose.connection.host}`);

  await mongoose.connection.close();
  console.log('\n🔌 Conexión cerrada correctamente');
  process.exit(0);

} catch (error) {
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.error(`\n❌ Error después de ${elapsed}s\n`);
  console.error('Tipo de error:', error.name);
  console.error('Mensaje:', error.message);

  console.log('\n💡 Posibles causas:');
  console.log('   • Firewall de Windows bloqueando Node.js');
  console.log('   • Antivirus bloqueando conexiones salientes');
  console.log('   • Red corporativa con restricciones');
  console.log('   • ISP bloqueando puerto 27017');
  console.log('   • Proxy o VPN interfiriendo');

  console.log('\n🔧 Soluciones sugeridas:');
  console.log('   1. Desactivar temporalmente Windows Defender Firewall');
  console.log('   2. Agregar excepción para Node.js en el firewall');
  console.log('   3. Probar desde otra red (ej: hotspot móvil)');
  console.log('   4. Contactar al administrador de red si estás en empresa/escuela');

  process.exit(1);
}

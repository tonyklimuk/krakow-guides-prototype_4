const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🗄️  Setting up database...\n');

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.log('⚠️  DATABASE_URL not found in environment variables');
  console.log('📝 Creating .env file with default SQLite database...\n');
  
  const envContent = `# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="development-secret-key"

# Stripe (Test Mode)
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
APPLE_CLIENT_ID=""
APPLE_CLIENT_SECRET=""
FACEBOOK_CLIENT_ID=""
FACEBOOK_CLIENT_SECRET=""
`;

  if (!fs.existsSync('.env')) {
    fs.writeFileSync('.env', envContent);
    console.log('✅ Created .env file with default configuration');
  } else {
    console.log('📄 .env file already exists');
  }
  
  // Update Prisma schema for SQLite
  console.log('🔄 Updating Prisma schema for SQLite...');
  const schemaContent = fs.readFileSync('prisma/schema.prisma', 'utf8');
  const updatedSchema = schemaContent.replace('provider = "postgresql"', 'provider = "sqlite"');
  fs.writeFileSync('prisma/schema.prisma', updatedSchema);
  
  console.log('✅ Updated Prisma schema for SQLite');
}

try {
  console.log('🔧 Pushing database schema...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  
  console.log('🌱 Seeding database...');
  execSync('npx tsx prisma/seed.ts', { stdio: 'inherit' });
  
  console.log('\n✅ Database setup completed successfully!');
  console.log('🚀 You can now run: npm run dev');
  
} catch (error) {
  console.error('❌ Database setup failed:', error.message);
  process.exit(1);
}

import bcrypt from 'bcryptjs';
import prisma from '../prisma/client.js';

async function createUsers() {
    try {
        console.log('🚀 Starting user creation...');

        const adminEmail = 'ii@gmail.com';
        const adminPassword = '12345';
        const adminName = 'Admin';

        const existingAdmin = await prisma.user.findUnique({
            where: { email: adminEmail }
        });

        if (existingAdmin) {
            console.log('✅ Admin user already exists:', adminEmail);
        } else {
            const hashedPassword = await bcrypt.hash(adminPassword, 10);

            const admin = await prisma.user.create({
                data: {
                    email: adminEmail,
                    password: hashedPassword,
                    name: adminName,
                    provider: 'email'
                }
            });

            console.log('✅ Admin user created successfully!');
            console.log('📧 Email:', admin.email);
            console.log('👤 Name:', admin.name);
            console.log('🆔 ID:', admin.id);
        }

        const testEmail = 'test@gmail.com';
        const testPassword = 'test123';
        const testName = 'Test User';

        const existingTest = await prisma.user.findUnique({
            where: { email: testEmail }
        });

        if (existingTest) {
            console.log('✅ Test user already exists:', testEmail);
        } else {
            const hashedPassword = await bcrypt.hash(testPassword, 10);

            const testUser = await prisma.user.create({
                data: {
                    email: testEmail,
                    password: hashedPassword,
                    name: testName,
                    provider: 'email'
                }
            });

            console.log('✅ Test user created successfully!');
            console.log('📧 Email:', testUser.email);
            console.log('👤 Name:', testUser.name);
            console.log('🆔 ID:', testUser.id);
        }

        console.log('\n🎉 User creation completed!');
        console.log('\n📝 Login credentials:');
        console.log('Admin: ii@gmail.com / 12345');
        console.log('Test: test@gmail.com / test123');

    } catch (error) {
        console.error('❌ Error creating users:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

createUsers();

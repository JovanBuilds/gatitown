import { PrismaClient } from '@prisma/client';
import { Argon2id } from 'oslo/password';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Generic admin user (existing)
    const genericAdminEmail = 'admin@gatitown.com';
    const genericAdminPassword = 'adminpassword';
    const genericAdminHashedPassword = await new Argon2id().hash(genericAdminPassword);

    const genericAdmin = await prisma.user.upsert({
        where: { email: genericAdminEmail },
        update: {
            role: 'ADMIN',
        },
        create: {
            email: genericAdminEmail,
            name: 'Admin User',
            hashed_password: genericAdminHashedPassword,
            role: 'ADMIN',
        },
    });

    console.log('✅ Generic admin user:', { email: genericAdmin.email, name: genericAdmin.name });

    // Main admin user: JovanS
    // Phone: 6646703603 (stored in comment as per instructions - no phone field in User model)
    const jovanEmail = 'jovansolis.dev@gmail.com';
    const jovanPassword = 'ChangeMe_Jovan_Admin_2025';
    const jovanHashedPassword = await new Argon2id().hash(jovanPassword);

    const jovanAdmin = await prisma.user.upsert({
        where: { email: jovanEmail },
        update: {
            role: 'ADMIN',
            name: 'Jovan Solis',
            avatarUrl: '/images/admin/jovan-avatar.jpg',
        },
        create: {
            email: jovanEmail,
            name: 'Jovan Solis',
            hashed_password: jovanHashedPassword,
            role: 'ADMIN',
            avatarUrl: '/images/admin/jovan-avatar.jpg',
        },
    });

    console.log('✅ Main admin user (JovanS):', {
        email: jovanAdmin.email,
        name: jovanAdmin.name,
        phone: '6646703603' // Reference only - not stored in DB
    });

    console.log('\n🎉 Seeding completed successfully!');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error('❌ Seeding failed:', e);
        await prisma.$disconnect();
        process.exit(1);
    });

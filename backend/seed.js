const User = require('./models/User');

const seedAdmin = async () => {
    try {
        const adminEmail = 'admin.facultyreview@gmail.com';
        const adminExists = await User.findOne({ email: adminEmail });

        if (!adminExists) {
            await User.create({
                name: 'System Admin',
                email: adminEmail,
                password: 'Admin@Review@1234',
                university: 'FacultyReview HQ',
                role: 'admin'
            });
            console.log('✅ Admin user seeded successfully');
        } else {
            // Ensure permissions are correct if it exists
            if (adminExists.role !== 'admin') {
                adminExists.role = 'admin';
                await adminExists.save();
                console.log('✅ Admin role updated for existing user');
            }
        }
    } catch (error) {
        console.error('❌ Error seeding admin:', error.message);
    }
};

module.exports = seedAdmin;

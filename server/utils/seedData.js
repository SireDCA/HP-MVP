const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('../models/User');
const Hospital = require('../models/Hospital');
const Department = require('../models/Department');
const Availability = require('../models/Availability');
const Image = require('../models/Image');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Hospital.deleteMany({});
    await Department.deleteMany({});
    await Availability.deleteMany({});
    await Image.deleteMany({});
    console.log('Cleared existing data');

    // 1. Create Departments
    const departments = await Department.insertMany([
      { name: 'General Medicine', description: 'Primary care and general health services' },
      { name: 'Cardiology', description: 'Heart and cardiovascular system specialists' },
      { name: 'Neurology', description: 'Brain and nervous system disorders' },
      { name: 'Pediatrics', description: 'Healthcare for infants, children, and adolescents' },
      { name: 'Orthopedics', description: 'Musculoskeletal system treatment' },
      { name: 'Dermatology', description: 'Skin, hair, and nail conditions' },
      { name: 'Ophthalmology', description: 'Eye care and vision specialists' },
      { name: 'Obstetrics & Gynecology', description: 'Women\'s reproductive health' },
    ]);
    console.log(`Created ${departments.length} departments`);

    // 2. Create Hospitals
    const hospitals = await Hospital.insertMany([
      {
        name: 'Lagos University Teaching Hospital',
        address: '12 Ishaga Road, Idi-Araba, Lagos, Nigeria',
        location: { lat: 6.5158, lng: 3.3571 },
        departments: [departments[0]._id, departments[1]._id, departments[2]._id, departments[3]._id, departments[7]._id],
        description: 'One of Nigeria\'s foremost teaching hospitals, offering comprehensive healthcare services with modern facilities and experienced specialists.',
        phone: '+234-1-7600780',
        email: 'info@luth.gov.ng',
        tags: ['Modern', 'ICU-equipped', 'Teaching Hospital', 'Emergency Services'],
      },
      {
        name: 'Korle Bu Teaching Hospital',
        address: 'Guggisberg Avenue, Accra, Ghana',
        location: { lat: 5.5364, lng: -0.2275 },
        departments: [departments[0]._id, departments[3]._id, departments[4]._id, departments[5]._id],
        description: 'Ghana\'s premier teaching hospital and the third largest hospital in Africa, providing quality healthcare and medical training.',
        phone: '+233-30-2665401',
        email: 'info@kbth.gov.gh',
        tags: ['Child-friendly', 'Modern', 'Wheelchair accessible', 'Teaching Hospital'],
      },
      {
        name: 'Kenyatta National Hospital',
        address: 'Hospital Road, Upper Hill, Nairobi, Kenya',
        location: { lat: -1.3015, lng: 36.8068 },
        departments: [departments[0]._id, departments[1]._id, departments[4]._id, departments[6]._id, departments[7]._id],
        description: 'East Africa\'s largest referral and teaching hospital, equipped with state-of-the-art medical and surgical facilities.',
        phone: '+254-20-2726300',
        email: 'info@knh.or.ke',
        tags: ['ICU-equipped', 'Modern', 'Emergency Services', 'Specialist Care'],
      },
    ]);
    console.log(`Created ${hospitals.length} hospitals`);

    // 3. Create placeholder images for hospitals
    const imageCategories = ['reception', 'consulting_room', 'ward', 'lab', 'icu'];
    const allImages = [];
    for (const hospital of hospitals) {
      for (const category of imageCategories) {
        allImages.push({
          hospitalId: hospital._id,
          url: `https://images.unsplash.com/photo-${category === 'reception' ? '1519494026892-80bbd2d6fd0d' : category === 'consulting_room' ? '1631815588090-d4bfec5b1ccb' : category === 'ward' ? '1586773860418-d37222d8fce3' : category === 'lab' ? '1579154204601-01588f351e67' : '1516549655169-df83a0774514'}?w=800&h=600&fit=crop`,
          publicId: '',
          category,
          tags: ['Clean', 'Modern', 'Well-equipped'],
        });
      }
    }
    const images = await Image.insertMany(allImages);
    console.log(`Created ${images.length} images`);

    // Update hospitals with image references
    for (const hospital of hospitals) {
      const hospitalImages = images.filter((img) => img.hospitalId.toString() === hospital._id.toString());
      await Hospital.findByIdAndUpdate(hospital._id, {
        images: hospitalImages.map((img) => img._id),
      });
    }

    // 4. Create Admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@healthprovida.com',
      password: 'admin123',
      role: 'admin',
      phone: '+234-800-0000',
    });
    console.log('Created admin user: admin@healthprovida.com / admin123');

    // 5. Create Doctor users
    const doctors = await User.create([
      {
        name: 'Dr. Amara Okafor',
        email: 'amara@healthprovida.com',
        password: 'doctor123',
        role: 'doctor',
        phone: '+234-801-1111',
        hospitalId: hospitals[0]._id,
        specialtyId: departments[1]._id, // Cardiology
      },
      {
        name: 'Dr. Kwame Mensah',
        email: 'kwame@healthprovida.com',
        password: 'doctor123',
        role: 'doctor',
        phone: '+233-201-2222',
        hospitalId: hospitals[1]._id,
        specialtyId: departments[3]._id, // Pediatrics
      },
      {
        name: 'Dr. Wanjiku Kamau',
        email: 'wanjiku@healthprovida.com',
        password: 'doctor123',
        role: 'doctor',
        phone: '+254-700-3333',
        hospitalId: hospitals[2]._id,
        specialtyId: departments[0]._id, // General Medicine
      },
      {
        name: 'Dr. Chinwe Eze',
        email: 'chinwe@healthprovida.com',
        password: 'doctor123',
        role: 'doctor',
        phone: '+234-802-4444',
        hospitalId: hospitals[0]._id,
        specialtyId: departments[2]._id, // Neurology
      },
    ]);
    console.log(`Created ${doctors.length} doctors`);

    // 6. Create Patient user
    const patient = await User.create({
      name: 'John Adebayo',
      email: 'patient@healthprovida.com',
      password: 'patient123',
      role: 'patient',
      phone: '+234-803-5555',
    });
    console.log('Created patient user: patient@healthprovida.com / patient123');

    // 7. Create Availability schedules for doctors (Mon-Fri)
    const availabilities = [];
    for (const doctor of doctors) {
      for (let day = 1; day <= 5; day++) {
        // Monday to Friday
        availabilities.push({
          doctorId: doctor._id,
          hospitalId: doctor.hospitalId,
          dayOfWeek: day,
          slots: [
            {
              startTime: '09:00',
              endTime: '12:00',
              slotDuration: 30,
              bufferTime: 5,
            },
            {
              startTime: '14:00',
              endTime: '17:00',
              slotDuration: 30,
              bufferTime: 5,
            },
          ],
        });
      }
    }
    await Availability.insertMany(availabilities);
    console.log(`Created ${availabilities.length} availability schedules`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\nDemo Credentials:');
    console.log('  Admin:   admin@healthprovida.com / admin123');
    console.log('  Doctor:  amara@healthprovida.com / doctor123');
    console.log('  Patient: patient@healthprovida.com / patient123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();

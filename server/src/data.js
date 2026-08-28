import bcrypt from 'bcryptjs';

export const users = [
  { id: 1, name: 'Amina Patel', email: 'patient@labseek.co.za', password: bcrypt.hashSync('Patient123!', 10), role: 'user' },
  { id: 2, name: 'Dr. Liam Dube', email: 'lab@labseek.co.za', password: bcrypt.hashSync('Laboratory123!', 10), role: 'laboratory', laboratoryId: 1 },
  { id: 3, name: 'System Admin', email: 'admin@labseek.co.za', password: bcrypt.hashSync('Admin123!', 10), role: 'admin' }
];

export const laboratories = [
  { id: 1, name: 'NovaPath Sandton', location: 'Sandton, Johannesburg', address: '18 Rivonia Road, Sandton', rating: 4.9, reviews: 184, verified: true, open: '07:00 - 18:00', phone: '+27 11 555 0198', distance: 2.4, accent: '#10b981', initials: 'NP', description: 'Fast, trusted diagnostics with same-day appointments and secure digital results.' },
  { id: 2, name: 'Ubuntu Diagnostics', location: 'Rosebank, Johannesburg', address: '42 Oxford Road, Rosebank', rating: 4.7, reviews: 129, verified: true, open: '06:30 - 17:30', phone: '+27 11 555 0124', distance: 4.1, accent: '#0ea5e9', initials: 'UD', description: 'Community-focused pathology services with experienced phlebotomy teams.' },
  { id: 3, name: 'ClearView Labs', location: 'Midrand, Johannesburg', address: '7 New Road, Midrand', rating: 4.6, reviews: 96, verified: true, open: '08:00 - 17:00', phone: '+27 10 555 0137', distance: 11.8, accent: '#8b5cf6', initials: 'CV', description: 'Modern diagnostic testing and health screening in a calm, accessible setting.' },
  { id: 4, name: 'MedCore Pretoria', location: 'Hatfield, Pretoria', address: '1105 Burnett Street, Hatfield', rating: 4.5, reviews: 72, verified: false, open: '07:30 - 16:30', phone: '+27 12 555 0171', distance: 44.2, accent: '#f59e0b', initials: 'MC', description: 'Reliable routine testing and wellness panels for individuals and families.' }
];

export const tests = [
  { id: 1, laboratoryId: 1, name: 'Full Blood Count', category: 'Haematology', price: 280, turnaround: 'Same day', preparation: 'No fasting required' },
  { id: 2, laboratoryId: 1, name: 'Thyroid Function Panel', category: 'Endocrinology', price: 620, turnaround: '1-2 days', preparation: 'Morning sample preferred' },
  { id: 3, laboratoryId: 1, name: 'Comprehensive Wellness', category: 'Health screening', price: 1250, turnaround: '2 days', preparation: 'Fast for 8-10 hours' },
  { id: 4, laboratoryId: 2, name: 'Full Blood Count', category: 'Haematology', price: 245, turnaround: 'Same day', preparation: 'No fasting required' },
  { id: 5, laboratoryId: 2, name: 'HbA1c Diabetes Test', category: 'Diabetes', price: 390, turnaround: '1 day', preparation: 'No fasting required' },
  { id: 6, laboratoryId: 3, name: 'Vitamin D Test', category: 'Nutrition', price: 510, turnaround: '1-2 days', preparation: 'No preparation needed' },
  { id: 7, laboratoryId: 3, name: 'Lipid Profile', category: 'Heart health', price: 430, turnaround: 'Same day', preparation: 'Fast for 8-10 hours' },
  { id: 8, laboratoryId: 4, name: 'Kidney Function Panel', category: 'Renal health', price: 560, turnaround: '1 day', preparation: 'Drink water normally' }
];

export const appointments = [
  { id: 1, userId: 1, laboratoryId: 1, testId: 1, date: '2026-09-02', time: '09:30', status: 'confirmed', reference: 'LS-20481', notes: '' },
  { id: 2, userId: 1, laboratoryId: 2, testId: 5, date: '2026-07-14', time: '11:00', status: 'completed', reference: 'LS-19842', notes: '' }
];

export const results = [
  { id: 1, userId: 1, appointmentId: 2, testName: 'HbA1c Diabetes Test', laboratoryName: 'Ubuntu Diagnostics', date: '2026-07-15', status: 'Ready', summary: 'Result reviewed and released by the laboratory.', documentId: 'RESULT-LS-19842' }
];

export const notifications = [
  { id: 1, userId: 1, title: 'Appointment confirmed', message: 'NovaPath Sandton confirmed your booking for 2 Sep at 09:30.', read: false },
  { id: 2, userId: 1, title: 'Result available', message: 'Your HbA1c result is ready to view securely.', read: true }
];

export const publicUser = ({ password, ...user }) => user;
export const nextId = (collection) => Math.max(0, ...collection.map((item) => item.id)) + 1;


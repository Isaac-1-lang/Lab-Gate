import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { allowRoles, requireAuth, signToken } from './auth.js';
import { appointments, laboratories, nextId, notifications, publicUser, results, tests, users } from './data.js';

export const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '100kb' }));

const asyncRoute = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
const findLab = (id) => laboratories.find((lab) => lab.id === Number(id));
const findTest = (id) => tests.find((test) => test.id === Number(id));
const appointmentView = (item) => ({ ...item, laboratory: findLab(item.laboratoryId), test: findTest(item.testId) });

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'LabSeek API' }));

app.post('/api/auth/register', asyncRoute(async (req, res) => {
  const input = z.object({ name: z.string().trim().min(2), email: z.email(), password: z.string().min(8) }).parse(req.body);
  if (users.some((user) => user.email.toLowerCase() === input.email.toLowerCase())) return res.status(409).json({ message: 'An account with this email already exists.' });
  const user = { id: nextId(users), name: input.name, email: input.email.toLowerCase(), password: await bcrypt.hash(input.password, 10), role: 'user' };
  users.push(user);
  res.status(201).json({ token: signToken(user), user: publicUser(user) });
}));

app.post('/api/auth/login', asyncRoute(async (req, res) => {
  const input = z.object({ email: z.email(), password: z.string().min(1) }).parse(req.body);
  const user = users.find((item) => item.email.toLowerCase() === input.email.toLowerCase());
  if (!user || !(await bcrypt.compare(input.password, user.password))) return res.status(401).json({ message: 'Email or password is incorrect.' });
  res.json({ token: signToken(user), user: publicUser(user) });
}));

app.get('/api/laboratories', (req, res) => {
  const query = String(req.query.q || '').toLowerCase();
  const verified = req.query.verified === 'true';
  const items = laboratories
    .filter((lab) => !query || `${lab.name} ${lab.location}`.toLowerCase().includes(query))
    .filter((lab) => !verified || lab.verified)
    .map((lab) => ({ ...lab, tests: tests.filter((test) => test.laboratoryId === lab.id) }));
  res.json(items);
});

app.get('/api/laboratories/:id', (req, res) => {
  const lab = findLab(req.params.id);
  if (!lab) return res.status(404).json({ message: 'Laboratory not found.' });
  res.json({ ...lab, tests: tests.filter((test) => test.laboratoryId === lab.id) });
});

app.get('/api/tests', (req, res) => {
  const query = String(req.query.q || '').toLowerCase();
  const category = String(req.query.category || '').toLowerCase();
  const items = tests
    .filter((test) => !query || `${test.name} ${test.category}`.toLowerCase().includes(query))
    .filter((test) => !category || test.category.toLowerCase() === category)
    .map((test) => ({ ...test, laboratory: findLab(test.laboratoryId) }));
  res.json(items);
});

app.get('/api/me', requireAuth, (req, res) => {
  const user = users.find((item) => item.id === Number(req.auth.sub));
  res.json(publicUser(user));
});

app.get('/api/appointments', requireAuth, (req, res) => {
  const user = users.find((item) => item.id === Number(req.auth.sub));
  const items = user.role === 'admin' ? appointments : user.role === 'laboratory' ? appointments.filter((item) => item.laboratoryId === user.laboratoryId) : appointments.filter((item) => item.userId === user.id);
  res.json(items.map(appointmentView));
});

app.post('/api/appointments', requireAuth, allowRoles('user'), (req, res) => {
  const input = z.object({ laboratoryId: z.coerce.number().int().positive(), testId: z.coerce.number().int().positive(), date: z.iso.date(), time: z.string().regex(/^\d{2}:\d{2}$/), notes: z.string().max(500).optional().default('') }).parse(req.body);
  const lab = findLab(input.laboratoryId);
  const test = findTest(input.testId);
  if (!lab || !test || test.laboratoryId !== lab.id) return res.status(400).json({ message: 'Please choose a valid test and laboratory.' });
  if (new Date(`${input.date}T${input.time}:00`) <= new Date()) return res.status(400).json({ message: 'Appointment time must be in the future.' });
  const item = { id: nextId(appointments), userId: Number(req.auth.sub), ...input, status: 'pending', reference: `LS-${String(Date.now()).slice(-5)}` };
  appointments.push(item);
  notifications.push({ id: nextId(notifications), userId: item.userId, title: 'Booking received', message: `${lab.name} received your appointment request.`, read: false });
  res.status(201).json(appointmentView(item));
});

app.patch('/api/appointments/:id/status', requireAuth, allowRoles('laboratory', 'admin'), (req, res) => {
  const { status } = z.object({ status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']) }).parse(req.body);
  const item = appointments.find((appointment) => appointment.id === Number(req.params.id));
  if (!item) return res.status(404).json({ message: 'Appointment not found.' });
  const user = users.find((candidate) => candidate.id === Number(req.auth.sub));
  if (user.role === 'laboratory' && item.laboratoryId !== user.laboratoryId) return res.status(403).json({ message: 'This appointment belongs to another laboratory.' });
  item.status = status;
  res.json(appointmentView(item));
});

app.get('/api/results', requireAuth, allowRoles('user'), (req, res) => {
  res.json(results.filter((item) => item.userId === Number(req.auth.sub)));
});

app.get('/api/results/:id/secure-view', requireAuth, allowRoles('user'), (req, res) => {
  const item = results.find((result) => result.id === Number(req.params.id) && result.userId === Number(req.auth.sub));
  if (!item) return res.status(404).json({ message: 'Result not found.' });
  res.json({ ...item, values: [{ name: 'HbA1c', value: '5.4', unit: '%', range: '4.0 - 5.6', flag: 'Normal' }], reviewedBy: 'Dr. N. Mokoena', notice: 'Discuss laboratory results with a qualified healthcare professional.' });
});

app.get('/api/notifications', requireAuth, (req, res) => res.json(notifications.filter((item) => item.userId === Number(req.auth.sub))));

app.get('/api/admin/summary', requireAuth, allowRoles('admin'), (_req, res) => res.json({ users: users.length, laboratories: laboratories.length, pendingVerification: laboratories.filter((lab) => !lab.verified).length, appointments: appointments.length, completed: appointments.filter((item) => item.status === 'completed').length }));

app.patch('/api/admin/laboratories/:id/verify', requireAuth, allowRoles('admin'), (req, res) => {
  const lab = findLab(req.params.id);
  if (!lab) return res.status(404).json({ message: 'Laboratory not found.' });
  lab.verified = true;
  res.json(lab);
});

app.use((error, _req, res, _next) => {
  if (error instanceof z.ZodError) return res.status(400).json({ message: 'Please check the information provided.', errors: error.issues });
  console.error(error);
  res.status(500).json({ message: 'Something went wrong. Please try again.' });
});


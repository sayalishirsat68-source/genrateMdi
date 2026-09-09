import { PrismaClient } from '@prisma/client';
import { INITIAL_PRESCRIPTIONS, PATIENT_DATA, DOCTORS, VITALS_DATA, DOCUMENTS } from '../src/data/mockData';

const prisma = new PrismaClient();

async function main() {
  await prisma.patient.upsert({
    where: { id: 'patient-robert-c' },
    update: { name: PATIENT_DATA.name, abhaId: PATIENT_DATA.abhaId },
    create: { id: 'patient-robert-c', name: PATIENT_DATA.name, abhaId: PATIENT_DATA.abhaId },
  });
  for (const doctor of DOCTORS) {
    await prisma.doctor.upsert({
      where: { id: doctor.id },
      update: { name: doctor.name, specialty: doctor.specialty, licenseNumber: doctor.licenseNumber },
      create: { id: doctor.id, name: doctor.name, specialty: doctor.specialty, licenseNumber: doctor.licenseNumber },
    });
  }
  for (const rx of INITIAL_PRESCRIPTIONS) {
    const doctor = DOCTORS.find((entry) => entry.name === rx.doctor);
    await prisma.prescription.upsert({
      where: { id: rx.id },
      update: {},
      create: { id: rx.id, patientId: 'patient-robert-c', doctorId: doctor?.id, name: rx.name, dosage: rx.dosage, manufacturer: rx.manufacturer, brandEquivalent: rx.brandEquivalent, status: rx.status, statusLabel: rx.statusLabel, remainingInfo: rx.remainingInfo, daysLeft: rx.daysLeft, instructions: rx.instructions, directGenericPrice: rx.directGenericPrice, innovatorPrice: rx.innovatorPrice },
    });
  }
  for (const vital of VITALS_DATA) {
    await prisma.vitalMetric.create({ data: { patientId: 'patient-robert-c', title: vital.title, value: vital.currentValue, unit: vital.unit } });
  }
  for (const document of DOCUMENTS) {
    await prisma.clinicalDocument.upsert({ where: { id: document.id }, update: {}, create: { id: document.id, patientId: 'patient-robert-c', title: document.title, type: document.type, hash: document.hash, verified: document.verified } });
  }
}

main().finally(() => prisma.$disconnect());

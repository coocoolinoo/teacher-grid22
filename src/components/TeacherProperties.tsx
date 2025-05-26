import { Teacher } from '../types';

interface TeacherPropertiesProps {
  guessedTeacher: Teacher | null;
  targetTeacher: Teacher | null;
}

export function TeacherProperties({ guessedTeacher, targetTeacher }: TeacherPropertiesProps) {
  if (!guessedTeacher || !targetTeacher) return null;

  const properties = [
    { key: 'glatze', label: 'Glatze' },
    { key: 'halbglatze', label: 'Halbglatze' },
    { key: 'brille', label: 'Brille' },
    { key: 'kuerzel_enthaelt_a', label: 'Kürzel enthält A' },
    { key: 'kuerzel_enthaelt_e', label: 'Kürzel enthält E' },
    { key: 'Mag. oder Ing.', label: 'Mag. oder Ing.' },
    { key: 'geschlecht', label: 'Geschlecht' },
    { key: 'hauptfach', label: 'Hauptfach' },
    { key: 'technisches_fach', label: 'Technisches Fach' },
    { key: 'abteilung', label: 'Abteilung' }
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {properties.map(({ key, label }) => {
        const guessedValue = guessedTeacher.eigenschaften[key];
        const targetValue = targetTeacher.eigenschaften[key];
        const isMatch = guessedValue === targetValue;

        return (
          <div
            key={key}
            className={`p-2 rounded ${
              isMatch ? 'bg-green-100' : 'bg-red-100'
            }`}
          >
            <div className="font-bold">{label}</div>
            <div className="mt-1">
              {typeof guessedValue === 'boolean'
                ? guessedValue
                  ? '✓'
                  : '✗'
                : guessedValue || '-'}
            </div>
          </div>
        );
      })}
    </div>
  );
} 
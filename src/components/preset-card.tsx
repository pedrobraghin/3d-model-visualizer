import type { Preset } from '../@types';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';

interface Props {
  onSelect: (preset: Preset) => void;
  preset: Preset;
  isActive?: boolean;
}

export function PresetCard({ onSelect, preset, isActive }: Readonly<Props>) {
  return (
    <Card
      key={preset.id}
      onClick={() => onSelect(preset)}
      className={`
        w-full
        min-h-max
        rounded-lg
        p-2
        py-3
        text-left
        transition
        border
        cursor-pointer
        ${
          isActive
            ? 'bg-white text-blackshadow border-2 border-blue-800'
            : 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700 text-white'
        }
      `}
    >
      <CardHeader>
        <CardTitle>{preset.name}</CardTitle>
        <CardDescription
          className={`
              text-sm mt-1 leading-relaxed
              ${isActive ? 'text-neutral-700' : 'text-neutral-400'}
          `}
        >
          {preset.description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

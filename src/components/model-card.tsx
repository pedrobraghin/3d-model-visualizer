import type { Model } from '../@types';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';

interface Props {
  onSelect: (model: Model) => void;
  model: Model;
  isActive?: boolean;
}

export function ModelCard({ onSelect, model, isActive }: Readonly<Props>) {
  return (
    <Card
      key={model.id}
      onClick={() => onSelect(model)}
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
        <CardTitle>{model.name}</CardTitle>
        <CardDescription
          className={`
              text-sm mt-1 leading-relaxed
              ${isActive ? 'text-neutral-700' : 'text-neutral-400'}
          `}
        >
          {model.description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

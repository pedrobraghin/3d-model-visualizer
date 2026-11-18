interface Props {
  preview?: string;
  area: string;
  color: string;
  handleUpload: (area: string, file?: File) => void;
  handleColorChange: (area: string, color: string) => void;
}

export function ModelArea({
  preview,
  area,
  color,
  handleUpload,
  handleColorChange,
}: Readonly<Props>) {
  return (
    <div className="border border-neutral-700 rounded-lg p-4 bg-neutral-900 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-medium text-sm text-white">{area}</span>

        {preview && (
          <button
            type="button"
            onClick={() => handleUpload(area)}
            className="text-xs px-2 py-1 rounded bg-red-500 hover:bg-red-600 text-white transition"
          >
            Limpar arte
          </button>
        )}
      </div>

      {/* SELETOR DE COR */}
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={`color-${area}`} className="text-sm text-neutral-200">
          Cor da área
        </label>

        <div className="flex items-center gap-2">
          <input
            id={`color-${area}`}
            type="color"
            value={color}
            onChange={(event) => handleColorChange(area, event.target.value)}
            className="w-9 h-9 rounded cursor-pointer bg-transparent border-0"
            title={`Escolher cor para ${area}`}
          />

          <span className="text-xs text-neutral-300 uppercase">{color}</span>
        </div>
      </div>

      {/* UPLOAD DE TEXTURA */}
      <label
        className={`block w-full transition rounded-xl p-2 cursor-pointer text-center border text-white text-sm ${
          preview
            ? 'bg-green-400 border-green-500 hover:bg-green-500'
            : 'bg-neutral-800 border-neutral-700 hover:bg-neutral-700'
        }`}
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];

            if (file) handleUpload(area, file);

            // Permite selecionar novamente o mesmo arquivo.
            event.target.value = '';
          }}
        />

        {preview ? 'Substituir arte' : 'Enviar arte'}
      </label>

      {preview && (
        <div className="mt-1 rounded-xl overflow-hidden border border-neutral-700 bg-white">
          <img
            src={preview}
            alt={`Textura de ${area}`}
            className="w-full h-24 object-contain"
          />
        </div>
      )}
    </div>
  );
}

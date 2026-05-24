interface Props {
  preview: string;
  area: string;
  handleUpload: (area: string, file?: File) => void;
}

export function ModelArea({ preview, area, handleUpload }: Readonly<Props>) {
  return (
    <div
      key={area}
      className="border border-neutral-700 rounded-lg p-4 bg-neutral-900 flex flex-col gap-2 "
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-medium text-sm text-white">{area}</span>
        {preview && (
          <button
            type="button"
            onClick={() => handleUpload(area)}
            className="text-xs px-2 py-1 rounded bg-red-500 hover:bg-red-600 text-white transition"
          >
            Limpar
          </button>
        )}
      </div>

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
          onChange={(e) => handleUpload(area, e.target.files?.[0])}
        />
        {preview ? 'Substituir arte' : 'Enviar arte'}
      </label>

      {preview && (
        <div className="mt-3 rounded-xl overflow-hidden border border-neutral-700 bg-white">
          <img
            src={preview}
            alt={area}
            className="w-full h-24 object-contain"
          />
        </div>
      )}
    </div>
  );
}

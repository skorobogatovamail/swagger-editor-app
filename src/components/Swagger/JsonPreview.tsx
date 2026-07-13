type JsonPreviewProps = {
  value: unknown;
};

export const JsonPreview = ({ value }: JsonPreviewProps) => {
  if (value === undefined) {
    return null;
  }

  return (
    <pre className="mt-2 max-h-56 overflow-auto rounded-lg bg-zinc-950 p-3 text-xs leading-5 text-zinc-100">
      {typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
    </pre>
  );
};

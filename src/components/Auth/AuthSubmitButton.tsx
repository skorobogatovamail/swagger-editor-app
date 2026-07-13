type AuthSubmitButtonProps = {
  isSubmitting: boolean;
  idleText: string;
  loadingText: string;
};

export const AuthSubmitButton = ({
  isSubmitting,
  idleText,
  loadingText,
}: AuthSubmitButtonProps) => {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="rounded-md bg-blue-500 p-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isSubmitting ? loadingText : idleText}
    </button>
  );
};

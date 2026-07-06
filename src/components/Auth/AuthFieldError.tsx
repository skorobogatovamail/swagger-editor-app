type AuthFieldErrorProps = {
  message?: string;
};

export const AuthFieldError = ({ message }: AuthFieldErrorProps) => {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-red-500">{message}</p>;
};

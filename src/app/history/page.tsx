import { redirect } from 'next/navigation';

export default function History() {
  const isAuthenticated = false;
  if (!isAuthenticated) {
    return redirect('/');
  }
  return <div>History</div>;
}

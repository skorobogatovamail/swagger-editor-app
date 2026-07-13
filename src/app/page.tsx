import { cookies } from 'next/headers';
import { SwaggerEditor } from '@/components/Swagger/SwaggerEditor';
import { createClient } from '@/utils/supabase/server';
import { getUserSchema } from '@/utils/supabase/schemas';

export default async function Home() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const savedSchema = user ? await getUserSchema(supabase, user.id) : null;

  return (
    <main className="flex flex-1 bg-zinc-50">
      <SwaggerEditor
        isAuthenticated={Boolean(user)}
        initialSchema={
          savedSchema
            ? { content: savedSchema.content, format: savedSchema.format }
            : null
        }
      />
    </main>
  );
}

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { getUserSchema, saveUserSchema } from '@/utils/supabase/schemas';
import type { SchemaFormat } from '@/utils/openapi/detectFormat';

const isSchemaFormat = (value: unknown): value is SchemaFormat => {
  return value === 'json' || value === 'yaml';
};

const getAuthenticatedClient = async () => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, user };
};

export const GET = async () => {
  const { supabase, user } = await getAuthenticatedClient();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const schema = await getUserSchema(supabase, user.id);

  if (!schema) {
    return NextResponse.json({ schema: null });
  }

  return NextResponse.json({ schema });
};

export const POST = async (request: NextRequest) => {
  const { supabase, user } = await getAuthenticatedClient();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (
    typeof body !== 'object' ||
    body === null ||
    typeof (body as { content?: unknown }).content !== 'string' ||
    !isSchemaFormat((body as { format?: unknown }).format)
  ) {
    return NextResponse.json(
      { error: 'content and format are required' },
      { status: 400 }
    );
  }

  const { content, format } = body as { content: string; format: SchemaFormat };
  const result = await saveUserSchema(supabase, user.id, content, format);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
};

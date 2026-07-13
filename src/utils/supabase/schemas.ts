import type { SupabaseClient } from '@supabase/supabase-js';
import type { SchemaFormat } from '@/utils/openapi/detectFormat';

export type UserSchemaRecord = {
  content: string;
  format: SchemaFormat;
  updatedAt: string;
};

export const getUserSchema = async (
  supabase: SupabaseClient,
  userId: string
): Promise<UserSchemaRecord | null> => {
  const { data, error } = await supabase
    .from('user_schemas')
    .select('content, format, updated_at')
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    content: data.content,
    format: data.format as SchemaFormat,
    updatedAt: data.updated_at,
  };
};

export const saveUserSchema = async (
  supabase: SupabaseClient,
  userId: string,
  content: string,
  format: SchemaFormat
): Promise<{ ok: true } | { ok: false; error: string }> => {
  const { error } = await supabase.from('user_schemas').upsert(
    {
      user_id: userId,
      content,
      format,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  );

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
};

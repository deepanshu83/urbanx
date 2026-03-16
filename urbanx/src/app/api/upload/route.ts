import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only image files are allowed (jpg, png, webp, gif)' }, { status: 400 });
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max 5MB allowed.' }, { status: 400 });
    }

    // Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Same sanitization as admin
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const safeName = file.name.replace(/[^a-z0-9._-]/gi, '_').toLowerCase();
    const path = `products/${Date.now()}_${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(path, buffer, { 
        upsert: true, 
        contentType: file.type 
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json({ error: `Upload failed: ${uploadError.message}` }, { status: 500 });
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(path);

    return NextResponse.json({
      success: true,
      publicUrl,
      path,
      filename: safeName,
      size: file.size,
    });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 });
  }
}

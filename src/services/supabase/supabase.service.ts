import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService {
    private supabase: SupabaseClient;
    constructor(private configService: ConfigService) {
        this.supabase = createClient(
            this.configService.get('SUPABASE_URL') as string,
            this.configService.get('SUPABASE_ANON_KEY') as string,
        )
    }

    get supabaseClient(){
        return this.supabase;
    }
}

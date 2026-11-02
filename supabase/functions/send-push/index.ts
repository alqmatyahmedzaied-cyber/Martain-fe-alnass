import {createClient} from 'npm:@supabase/supabase-js@2';
import webpush from 'npm:web-push';
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type'};
Deno.serve(async r=>{
if(r.method=='OPTIONS')return new Response('ok',{headers:cors});
webpush.setVapidDetails('mailto:admin@shilla.app',Deno.env.get('VAPID_PUBLIC')!,Deno.env.get('VAPID_PRIVATE')!);
const a=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
const{title,body,from}=await r.json();
const{data}=await a.from('push_subs').select('*').neq('uid',from);
await Promise.all((data||[]).map(x=>webpush.sendNotification(x.sub,JSON.stringify({title,body})).catch(()=>a.from('push_subs').delete().eq('uid',x.uid))));
return new Response('ok',{headers:cors})});

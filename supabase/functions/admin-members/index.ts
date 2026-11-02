import {createClient} from 'npm:@supabase/supabase-js@2';
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type'};
const J=(o:any,s=200)=>new Response(JSON.stringify(o),{status:s,headers:{...cors,'Content-Type':'application/json'}});
Deno.serve(async r=>{
if(r.method=='OPTIONS')return new Response('ok',{headers:cors});
const a=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
const{data:{user}}=await a.auth.getUser((r.headers.get('Authorization')||'').replace('Bearer ',''));
const{data:s}=await a.from('app_state').select('data').eq('id','main').single();
if(!user||!s?.data.members.some((m:any)=>m.uid==user.id&&m.admin&&!m.del))return J({error:'forbidden'},403);
const b=await r.json();
if(b.a=='add'){const{data,error}=await a.auth.admin.createUser({email:b.code+'@shilla.app',password:b.code,email_confirm:true});return J(error?{error:error.message}:{uid:data.user.id})}
if(b.a=='code'){const{error}=await a.auth.admin.updateUserById(b.uid,{email:b.code+'@shilla.app',password:b.code});return J(error?{error:error.message}:{})}
if(b.a=='del'){await a.auth.admin.deleteUser(b.uid);return J({})}
return J({error:'bad'},400)});

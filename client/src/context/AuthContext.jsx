import { createContext,useContext,useEffect,useMemo,useState } from 'react';
import { api,authToken,bootstrapSession } from '../lib/api';
const AuthContext=createContext(null);
const THEME_STORAGE_KEY='lexsahayak-theme';
const validThemes=new Set(['light','dark','system']);
const storedTheme=()=>{const value=localStorage.getItem(THEME_STORAGE_KEY);return validThemes.has(value)?value:'system';};
const resolvedTheme=theme=>theme==='system'&&matchMedia('(prefers-color-scheme: dark)').matches?'dark':theme;
function applyTheme(theme){const resolved=resolvedTheme(theme);document.documentElement.dataset.theme=resolved;document.documentElement.style.colorScheme=resolved;}
export function AuthProvider({children}){
  const [user,setUser]=useState(null),[loading,setLoading]=useState(true);
  useEffect(()=>{bootstrapSession().then(data=>{if(data){authToken.set(data.accessToken);setUser(data.user);}}).finally(()=>setLoading(false));},[]);
  const theme=user?.preferences?.theme||storedTheme();
  useEffect(()=>{
    applyTheme(theme);
    if(theme!=='system') return undefined;
    const media=matchMedia('(prefers-color-scheme: dark)');
    const sync=()=>applyTheme('system');
    media.addEventListener('change',sync);
    return()=>media.removeEventListener('change',sync);
  },[theme]);
  const value=useMemo(()=>({user,loading,theme,async login(email,password){const d=await api('/auth/login',{method:'POST',body:{email,password},auth:false});authToken.set(d.accessToken);setUser(d.user);return d;},async register(payload){const d=await api('/auth/register',{method:'POST',body:payload,auth:false});if(d.accessToken){authToken.set(d.accessToken);setUser(d.user);}return d;},async logout(){try{await api('/auth/logout',{method:'POST'});}finally{authToken.set('');setUser(null);}},setTheme(nextTheme){if(!validThemes.has(nextTheme))return;localStorage.setItem(THEME_STORAGE_KEY,nextTheme);applyTheme(nextTheme);setUser(current=>current?{...current,preferences:{...current.preferences,theme:nextTheme}}:current);},async updatePreferences(prefs){if(prefs.theme) localStorage.setItem(THEME_STORAGE_KEY,prefs.theme);const d=await api('/auth/preferences',{method:'PATCH',body:prefs});setUser(d.user);return d.user;},setUser}),[user,loading,theme]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth=()=>useContext(AuthContext);

import { createContext,useContext,useEffect,useMemo,useState } from 'react';
import { api,authToken,bootstrapSession } from '../lib/api';
const AuthContext=createContext(null);
const THEME_STORAGE_KEY='lexsahayak-theme';
const validThemes=new Set(['light','dark','system']);
const storedTheme=()=>{const value=localStorage.getItem(THEME_STORAGE_KEY);return validThemes.has(value)?value:'system';};
const resolvedTheme=theme=>theme==='system'&&matchMedia('(prefers-color-scheme: dark)').matches?'dark':theme;
function applyTheme(theme){const resolved=resolvedTheme(theme);document.documentElement.dataset.theme=resolved;document.documentElement.style.colorScheme=resolved;}
const USER_STORAGE_KEY='lexsahayak-user';

export function AuthProvider({children}){
  const [user,setUser]=useState(()=>{try{const cached=sessionStorage.getItem(USER_STORAGE_KEY);return cached?JSON.parse(cached):null;}catch{return null;}});
  const [loading,setLoading]=useState(true);

  const setCachedUser=newUser=>{
    setUser(newUser);
    try{if(newUser) sessionStorage.setItem(USER_STORAGE_KEY,JSON.stringify(newUser)); else sessionStorage.removeItem(USER_STORAGE_KEY);}catch{/* fallback */}
  };

  useEffect(()=>{
    bootstrapSession().then(data=>{
      if(data?.user){
        authToken.set(data.accessToken);
        setCachedUser(data.user);
      } else {
        authToken.set('');
        setCachedUser(null);
      }
    }).catch(()=>{
      authToken.set('');
      setCachedUser(null);
    }).finally(()=>setLoading(false));
  },[]);

  const theme=user?.preferences?.theme||(user ? storedTheme() : 'light');
  useEffect(()=>{
    applyTheme(theme);
    if(theme!=='system') return undefined;
    const media=matchMedia('(prefers-color-scheme: dark)');
    const sync=()=>applyTheme('system');
    media.addEventListener('change',sync);
    return()=>media.removeEventListener('change',sync);
  },[theme]);

  const value=useMemo(()=>({
    user,
    loading,
    theme,
    async login(email,password){
      const d=await api('/auth/login',{method:'POST',body:{email,password},auth:false});
      authToken.set(d.accessToken);
      setCachedUser(d.user);
      return d;
    },
    async register(payload){
      const d=await api('/auth/register',{method:'POST',body:payload,auth:false});
      if(d.accessToken){
        authToken.set(d.accessToken);
        setCachedUser(d.user);
      }
      return d;
    },
    async logout(){
      try{await api('/auth/logout',{method:'POST'});}
      finally{
        authToken.set('');
        setCachedUser(null);
      }
    },
    setTheme(nextTheme){
      if(!validThemes.has(nextTheme))return;
      localStorage.setItem(THEME_STORAGE_KEY,nextTheme);
      applyTheme(nextTheme);
      setCachedUser(user?{...user,preferences:{...user.preferences,theme:nextTheme}}:user);
    },
    async updatePreferences(prefs){
      if(prefs.theme) localStorage.setItem(THEME_STORAGE_KEY,prefs.theme);
      const d=await api('/auth/preferences',{method:'PATCH',body:prefs});
      setCachedUser(d.user);
      return d.user;
    },
    setUser: setCachedUser
  }),[user,loading,theme]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth=()=>useContext(AuthContext);

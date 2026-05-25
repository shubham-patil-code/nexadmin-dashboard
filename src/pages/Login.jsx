  import React, { useState } from "react";
  import { User, Lock, Eye, ShieldCheck, ChevronDown, Fingerprint, Activity } from "lucide-react";
  import { useNavigate } from "react-router-dom";
  import { useAuth } from "../context/AuthContext";

  const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [role, setRole] = useState("superadmin");

    const handleLogin = (e) => {
      e.preventDefault();
      login({ role });
      navigate("/dashboard");
    };

    return (
      <div className="min-h-screen bg-slate-50 flex font-sans">
        {/* Left Side - Branding & Illustration */}
        <div className="hidden lg:flex w-1/2 bg-blue-50/50 relative flex-col p-12 overflow-hidden justify-center border-r border-blue-100">
          <div className="absolute top-8 left-12 flex items-center gap-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <Activity size={24} />
            </div>
            <div>
              <h1 className="text-blue-900 font-bold text-base leading-tight">MediCare</h1>
              <p className="text-xs text-blue-600 font-semibold tracking-wider uppercase">Hospital System</p>
            </div>
          </div>

          <div className="max-w-md mt-16 z-10">
            <h2 className="text-base font-bold text-slate-800 mb-4 leading-tight">
              Smart Hospital<br/>
              <span className="text-blue-600">Management System</span>
            </h2>
            <p className="text-slate-500 mb-8">
              A unified platform to manage all hospital operations, monitor real-time activities and improve patient care.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4 bg-white/60 p-4 rounded-xl border border-white/80 shadow-sm backdrop-blur-sm">
                <div className="bg-emerald-100 text-emerald-600 p-2.5 rounded-lg shrink-0">
                  <Activity size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Real-time Monitoring</h3>
                  <p className="text-xs text-slate-500">Live tracking of all departments</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 bg-white/60 p-4 rounded-xl border border-white/80 shadow-sm backdrop-blur-sm">
                <div className="bg-blue-100 text-blue-600 p-2.5 rounded-lg shrink-0">
                  <BrainCircuit size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">AI Powered Insights</h3>
                  <p className="text-xs text-slate-500">Smart analytics for better decisions</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white/60 p-4 rounded-xl border border-white/80 shadow-sm backdrop-blur-sm">
                <div className="bg-purple-100 text-purple-600 p-2.5 rounded-lg shrink-0">
                  <Layers size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Multi-Department Control</h3>
                  <p className="text-xs text-slate-500">Unified system for all hospital modules</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="absolute bottom-12 left-12 flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 z-10">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <div>
              <p className="text-xs font-semibold text-slate-800 leading-tight">System Online</p>
              <p className="text-xs text-slate-500">All systems operational</p>
            </div>
          </div>

          {/* Abstract Background Elements (Placeholder for large image) */}
          <div className="absolute right-0 bottom-0 w-[120%] h-[80%] bg-gradient-to-tl from-blue-100/50 to-transparent -z-0 pointer-events-none rounded-tl-full"></div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-10 relative z-10">
            <div className="flex flex-col items-center mb-8">
              <div className="text-blue-600 mb-4 bg-blue-50 p-3 rounded-2xl">
                <Activity size={32} />
              </div>
              <h2 className="text-base font-bold text-slate-800 mb-1">Admin Login</h2>
              <p className="text-xs text-slate-500">Access Hospital Control Dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Email / Username" 
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  defaultValue="admin@medicare.com"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  placeholder="Password" 
                  className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  defaultValue="password123"
                />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <Eye size={18} />
                </button>
              </div>

              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white appearance-none transition-all text-slate-700"
                >
                  <option value="">Select Role</option>
                  <option value="superadmin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-slate-600">Remember me</span>
                </label>
                <a href="#" className="text-blue-600 font-medium hover:underline">Forgot Password?</a>
              </div>

              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
              >
                Login
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>

            <div className="mt-6 flex items-center gap-4">
              <div className="h-px bg-slate-100 flex-1"></div>
              <span className="text-xs text-slate-400 uppercase font-medium tracking-wider">or continue with</span>
              <div className="h-px bg-slate-100 flex-1"></div>
            </div>

            <button className="w-full mt-6 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-3">
              <Fingerprint className="text-blue-600" size={20} />
              Login with Biometric
            </button>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-start gap-3">
              <div className="bg-emerald-50 text-emerald-600 p-2 rounded-full shrink-0">
                <ShieldCheck size={16} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800">Secure Hospital System</p>
                <p className="text-xs text-slate-500 mt-0.5">Your data is protected with enterprise-grade security</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Dummy icons for missing ones to prevent errors
  const BrainCircuit = ({size, className}) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08 2.5 2.5 0 0 0 4.91.05L12 20V4.5Z"/><path d="M16 8V5c0-1.1.9-2 2-2"/><path d="M12 13h4"/><path d="M12 17h6"/><path d="M19 13v8"/></svg>;
  const Layers = ({size, className}) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 12 12 17 22 12"/><polyline points="2 17 12 22 22 17"/></svg>;

  export default Login;

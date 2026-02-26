import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { UserPlus, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (err: any) {
            setError('이메일 또는 비밀번호가 올바르지 않습니다.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAdmin = async () => {
        if (!confirm("관리자 초기 계정을 생성하시겠습니까?\n(admin@cafemonster.com / 123456)")) return;
        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, "admin@cafemonster.com", "123456");
            alert("계정이 생성되었습니다! 이제 로그인해 주세요.");
            setEmail("admin@cafemonster.com");
            setPassword("123456");
        } catch (err: any) {
            alert("생성 실패: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateChiuAdmin = async () => {
        if (!confirm("관리자 계정(chiu3@naver.com)을 생성하시겠습니까?")) return;
        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, "chiu3@naver.com", "lichi8989)");
            alert("계정이 생성되었습니다! 이제 로그인해 주세요.");
            setEmail("chiu3@naver.com");
            setPassword("lichi8989)");
        } catch (err: any) {
            if (err.code === 'auth/email-already-in-use') {
                alert("이미 생성된 계정입니다. 해당 정보로 로그인해 주세요.");
                setEmail("chiu3@naver.com");
                setPassword("lichi8989)");
            } else {
                alert("생성 실패: " + err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#F4F6FB] px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[480px]"
            >
                <Card className="p-12 shadow-premium border-none bg-white rounded-[2.5rem]">
                    <div className="flex flex-col items-center text-center mb-10">
                        <div className="h-20 w-auto flex items-center justify-center mb-6">
                            <img src="/logo.png" alt="CafeMonster Logo" className="h-full object-contain" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">CafeMonster Admin</h1>
                        <p className="text-slate-400 font-bold">카페몬스터 관리자 시스템에 오신 것을 환영합니다.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">이메일 주소</label>
                            <Input
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-14 bg-slate-50 border-none focus-visible:bg-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">비밀번호</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="h-14 bg-slate-50 border-none focus-visible:bg-white"
                            />
                        </div>

                        {error && (
                            <p className="text-xs text-red-500 font-bold text-center bg-red-50 py-3 rounded-2xl">
                                {error}
                            </p>
                        )}

                        <Button type="submit" className="w-full h-14 text-base font-black shadow-premium" isLoading={loading}>
                            보안 로그인 <ChevronRight className="ml-2 w-4 h-4" />
                        </Button>

                        <div className="pt-8 border-t border-slate-50 mt-4">
                            <Button
                                type="button"
                                variant="ghost"
                                className="w-full text-xs font-bold text-slate-400 hover:text-primary transition-colors hover:bg-transparent h-auto p-0 mb-3"
                                onClick={handleCreateAdmin}
                                disabled={loading}
                            >
                                <UserPlus className="mr-2 h-4 w-4" />
                                관리자 초기 계정 생성 (admin / 123456)
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                className="w-full text-xs font-bold text-slate-400 hover:text-primary transition-colors hover:bg-transparent h-auto p-0"
                                onClick={handleCreateChiuAdmin}
                                disabled={loading}
                            >
                                <UserPlus className="mr-2 h-4 w-4" />
                                메인 관리자 계정 생성 (chiu3@naver.com / lichi8989))
                            </Button>
                        </div>
                    </form>
                </Card>
                <p className="text-center mt-10 text-[10px] text-slate-300 font-black tracking-widest uppercase">
                    © 2024 CafeMonster Series. Secured by Cloud Shield.
                </p>
            </motion.div>
        </div>
    );
};

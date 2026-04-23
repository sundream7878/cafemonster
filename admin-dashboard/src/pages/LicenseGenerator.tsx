import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Copy, Key, CheckCircle2, ChevronRight, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const generateSerial = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segment = () => Array(4).fill(0).map(() => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    return `CM-${segment()}-${segment()}-${segment()}`;
};

export const LicenseGenerator = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [generatedKey, setGeneratedKey] = useState('');
    const [formData, setFormData] = useState({
        product_id: 'NPlace-DB',
        license_type: '1M',
        constraint_type: 'HWID',
        buyer_name: '',
        contact: '',
        channel: '',
        price_sold: '',
        memo: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const isTest = formData.license_type === 'TEST';
        const serial = isTest
            ? `TEST-${generateSerial().split('-').slice(1).join('-')}`
            : generateSerial();

        setGeneratedKey(serial);

        try {
            const now = new Date();
            const expireDate = new Date();
            let collectionLimit = null;

            if (formData.license_type === 'TEST') {
                expireDate.setDate(now.getDate() + 1);
                collectionLimit = 100;
            } else if (formData.license_type === '1M') expireDate.setMonth(now.getMonth() + 1);
            else if (formData.license_type === '3M') expireDate.setMonth(now.getMonth() + 3);
            else if (formData.license_type === '6M') expireDate.setMonth(now.getMonth() + 6);
            else if (formData.license_type === '1Y') expireDate.setFullYear(now.getFullYear() + 1);
            else if (formData.license_type === 'LIFETIME') expireDate.setFullYear(now.getFullYear() + 99);

            const { error } = await supabase
                .from('licenses')
                .insert([{
                    ...formData,
                    buyer_name: isTest ? `${formData.buyer_name} (TEST)` : formData.buyer_name,
                    serial_key: serial,
                    expire_date: expireDate.toISOString(),
                    collection_limit: collectionLimit,
                    status: 'unused',
                    bound_value: null,
                    price_sold: Number(formData.price_sold) || 0
                }]);

            if (error) throw error;

        } catch (error: any) {
            console.error("Error creating license:", error);
            alert(`발행 중 오류가 발생했습니다: ${error.message}\n(UID: ${user?.id || 'Not Logged In'})\n관리자에게 문의하거나 Supabase 설정을 확인해주세요.`);
            setGeneratedKey('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">신규 라이선스 생성</h1>
                <p className="text-slate-400 font-medium">구매자 정보를 입력하고 제품 인증키를 즉시 발행합니다.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-12">
                <Card className="lg:col-span-8 p-0 overflow-hidden shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] border-2 border-slate-800 rounded-3xl bg-white">
                    <CardHeader className="p-12 border-b-2 border-slate-200 bg-slate-50">
                        <CardTitle className="text-3xl font-black text-slate-900 tracking-tighter">라이선스 정보 입력</CardTitle>
                        <p className="text-slate-600 font-bold mt-3 text-base">각 항목을 빠짐없이 입력해 주세요. (경계선이 뚜렷한 고대비 모드)</p>
                    </CardHeader>
                    <CardContent className="p-12">
                        <form onSubmit={handleSubmit} className="space-y-12">
                            <div className="grid grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-sm font-black text-slate-900 uppercase tracking-widest ml-1">대상 제품 선택</label>
                                    <div className="relative">
                                        <select
                                            className="w-full h-16 rounded-2xl bg-white px-6 text-lg font-black border-2 border-slate-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition-all appearance-none cursor-pointer text-slate-900"
                                            value={formData.product_id}
                                            onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                                        >
                                            <option value="NPlace-DB">🏢 NPlace-DB (네이버 플레이스)</option>
                                            <option value="CafeCrawler">☕ CafeCrawler (카페 크롤러)</option>
                                        </select>
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <ChevronRight className="w-5 h-5 text-slate-400 rotate-90" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-sm font-black text-slate-900 uppercase tracking-widest ml-1">이용 기간 선택</label>
                                    <select
                                        className="w-full h-16 rounded-2xl bg-white px-6 text-lg font-black border-2 border-slate-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none transition-all appearance-none cursor-pointer text-indigo-700"
                                        value={formData.license_type}
                                        onChange={(e) => setFormData({ ...formData, license_type: e.target.value })}
                                    >
                                        <option value="3M">3개월권 (Standard)</option>
                                        <option value="6M">6개월권 (Premium)</option>
                                        <option value="1Y">1년권 (VIP)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm font-black text-slate-900 uppercase tracking-widest ml-1">구매자 상세 정보 (성함/업체명)</label>
                                <Input
                                    required
                                    placeholder="구매자 정보를 입력하세요"
                                    className="h-16 bg-white border-2 border-slate-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 text-xl font-black px-6 rounded-2xl text-slate-900 placeholder:text-slate-300"
                                    value={formData.buyer_name}
                                    onChange={e => setFormData({ ...formData, buyer_name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-sm font-black text-slate-900 uppercase tracking-widest ml-1">연락처</label>
                                    <Input placeholder="010-0000-0000" className="h-16 bg-white border-2 border-slate-400 text-xl font-black px-6 text-slate-900" value={formData.contact} onChange={e => setFormData({ ...formData, contact: e.target.value })} />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-sm font-black text-slate-900 uppercase tracking-widest ml-1">판매 가격 (KRW)</label>
                                    <Input placeholder="금액 입력" className="h-16 bg-white border-2 border-slate-400 text-xl font-black px-6 text-slate-900" value={formData.price_sold} onChange={e => setFormData({ ...formData, price_sold: e.target.value })} />
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-24 text-white font-black text-2xl shadow-2xl hover:bg-indigo-700 active:scale-[0.98] transition-all bg-indigo-600 rounded-3xl border-b-8 border-indigo-900" isLoading={loading}>
                                라이선스 즉시 발행하기 <ChevronRight className="ml-3 w-8 h-8" />
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="lg:col-span-4 space-y-6">
                    <AnimatePresence>
                        {generatedKey && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                <Card className={`${generatedKey.startsWith('TEST-') ? 'bg-emerald-600' : 'bg-indigo-600'} text-white p-8 space-y-6 shadow-premium`}>
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                                            {generatedKey.startsWith('TEST-') ? <Clock className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                                        </div>
                                        <h4 className="font-black text-lg">
                                            {generatedKey.startsWith('TEST-') ? '테스트 키 발급 완료' : '정식 라이선스 발급 완료'}
                                        </h4>
                                    </div>
                                    <div className="rounded-2xl bg-white/10 p-5 text-center">
                                        <p className="font-mono text-xl font-black tracking-widest">{generatedKey}</p>
                                    </div>
                                    <Button
                                        onClick={() => { navigator.clipboard.writeText(generatedKey); alert('Copy Success!'); }}
                                        fullWidth
                                        className="bg-white text-slate-900 hover:bg-slate-50 h-14 font-bold"
                                    >
                                        <Copy className="mr-2 h-4 w-4" /> 키 복사하기
                                    </Button>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {!generatedKey && (
                        <Card className="h-full bg-slate-100/50 border-dashed border-2 border-slate-200 shadow-none flex flex-col items-center justify-center p-10 text-center gap-4 min-h-[400px]">
                            <Key className="w-10 h-10 text-slate-300" />
                            <p className="text-slate-400 font-bold text-sm">정보를 입력하고<br />이용 기간을 선택하면<br />인증키가 생성됩니다.</p>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

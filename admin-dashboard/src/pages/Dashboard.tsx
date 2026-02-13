import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Search, Calendar, Bell, Settings, ChevronRight, Key, Activity, Layers, Smartphone, Monitor } from 'lucide-react';

const categories = [
    { label: "PlaceDB 수집", count: 5, icon: Layers, color: "bg-blue-100 text-blue-600" },
    { label: "카페 크롤러", count: 10, icon: Smartphone, color: "bg-orange-100 text-orange-600" },
    { label: "스텔스 댓글", count: 3, icon: Activity, color: "bg-pink-100 text-pink-600" },
    { label: "페이퍼 크롤러", count: 12, icon: Monitor, color: "bg-emerald-100 text-emerald-600" },
    { label: "기타 도구", count: 8, icon: Key, color: "bg-purple-100 text-purple-600" },
];

const recruitmentProgress = [
    { name: "김태희", type: "PlaceDB", status: "사용 중", statusColor: "bg-blue-500" },
    { name: "박서준", type: "카페 크롤러", status: "만료 예정", statusColor: "bg-orange-400" },
    { name: "이지은", type: "스텔스 댓글", status: "정지", statusColor: "bg-gray-400" },
    { name: "최우식", type: "PlaceDB", status: "사용 중", statusColor: "bg-blue-500" },
    { name: "강동원", type: "페이퍼 크롤러", status: "사용 중", statusColor: "bg-blue-500" },
];

export const Dashboard = () => {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
            {/* Middle Content Column (8 Units) */}
            <div className="xl:col-span-8 space-y-10">
                {/* Welcome Banner */}
                <Card className="banner-gradient p-0 overflow-hidden text-white relative h-64 shadow-premium">
                    <div className="p-10 flex flex-col justify-center h-full max-w-md relative z-10">
                        <h2 className="text-3xl font-black mb-3">좋은 아침입니다, 관리자님!</h2>
                        <p className="text-white/80 font-medium mb-6 leading-relaxed">오늘은 75개의 새로운 라이선스 발행 요청이 대기 중입니다. 지금 바로 확인해 보세요.</p>
                        <Button variant="secondary" className="w-fit px-8 h-12 bg-white text-indigo-600">요청 내역 보기</Button>
                    </div>
                    <img
                        src="/dashboard_banner_illustration.webp"
                        alt="Welcome"
                        className="absolute right-0 bottom-0 h-[110%] object-contain pointer-events-none opacity-90"
                    />
                </Card>

                {/* Categories Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black text-slate-800">제품군별 현황</h3>
                        <Button variant="ghost" className="text-indigo-600 font-bold p-0">모두 보기</Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {categories.map((cat) => (
                            <Card key={cat.label} className="p-6 flex flex-col items-center text-center gap-3 group hover:scale-105 transition-transform cursor-pointer">
                                <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center", cat.color)}>
                                    <cat.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-black text-slate-800 leading-tight mb-1">{cat.label}</p>
                                    <p className="text-[10px] text-slate-400 font-bold">({cat.count} Candidates)</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Recruitment Progress Table */}
                <div className="space-y-6 pb-10">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black text-slate-800">최근 발행 현황</h3>
                        <Button variant="ghost" className="text-indigo-600 font-bold p-0">전체 보기</Button>
                    </div>
                    <Card className="overflow-hidden p-0 border-none">
                        <table className="w-full">
                            <thead className="bg-slate-50/50">
                                <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest text-left">
                                    <th className="px-8 py-5">구매자 성함</th>
                                    <th className="px-8 py-5">제품군</th>
                                    <th className="px-8 py-5">진행 상태</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {recruitmentProgress.map((row, idx) => (
                                    <tr key={idx} className={cn("group transition-colors", idx === 2 ? "bg-indigo-50/50" : "hover:bg-slate-50/30")}>
                                        <td className="px-8 py-5 font-bold text-slate-700 text-sm">{row.name}</td>
                                        <td className="px-8 py-5 font-bold text-slate-500 text-sm">{row.type}</td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className={cn("h-2 w-2 rounded-full", row.statusColor)} />
                                                <span className="text-sm font-bold text-slate-600">{row.status}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card>
                </div>
            </div>

            {/* Right Sidebar Column (4 Units) */}
            <div className="xl:col-span-4 space-y-8">
                {/* New Licenses Area */}
                <div className="space-y-6 pt-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-lg font-black text-slate-800">신규 구매자</h4>
                        <Button variant="ghost" className="text-indigo-600 font-bold p-0 h-auto">모두 보기</Button>
                    </div>
                    <div className="space-y-4">
                        {[
                            { name: "Mike Tyson", for: "iOS Developer", img: "M" },
                            { name: "Zara Thomas", for: "Content Designer", img: "Z" },
                            { name: "Neelu Abraham", for: "iOS Developer", img: "N" },
                        ].map((user, i) => (
                            <div key={i} className="flex items-center gap-4 group cursor-pointer p-2 rounded-2xl hover:bg-white transition-colors">
                                <img src={`https://ui-avatars.com/api/?name=${user.name}&background=EEF2FF&color=6366F1`} className="h-12 w-12 rounded-2xl" alt={user.name} />
                                <div className="flex-1">
                                    <p className="text-sm font-black text-slate-800 leading-tight">{user.name}</p>
                                    <p className="text-[11px] text-slate-400 font-bold mt-0.5">Applied for {user.for}</p>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-600 bg-indigo-50"><Settings className="h-3 w-3" /></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-600 bg-indigo-50"><ChevronRight className="h-3 w-3" /></Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

import { cn } from '../lib/utils';

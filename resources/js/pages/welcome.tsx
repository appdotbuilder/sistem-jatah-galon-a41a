import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { router } from '@inertiajs/react';

export default function Welcome() {
    const [employeeId, setEmployeeId] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleQuotaCheck = (e: React.FormEvent) => {
        e.preventDefault();
        if (!employeeId.trim()) return;
        
        setIsLoading(true);
        router.post(route('public.check-quota'), { employee_id: employeeId.trim() }, {
            preserveState: false,
            onFinish: () => setIsLoading(false),
        });
    };

    const handleRequestGallon = (e: React.FormEvent) => {
        e.preventDefault();
        if (!employeeId.trim()) return;
        
        setIsLoading(true);
        router.post(route('public.request-gallon'), { employee_id: employeeId.trim() }, {
            preserveState: false,
            onFinish: () => setIsLoading(false),
        });
    };

    const handleCheckOutput = (e: React.FormEvent) => {
        e.preventDefault();
        if (!employeeId.trim()) return;
        
        setIsLoading(true);
        router.post(route('public.check-output'), { employee_id: employeeId.trim() }, {
            preserveState: false,
            onFinish: () => setIsLoading(false),
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">💧</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Sistem Jatah Galon</h1>
                                <p className="text-sm text-gray-600">Water Gallon Quota Management System</p>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <Button
                                onClick={() => router.visit(route('login'))}
                                variant="outline"
                                className="hidden sm:inline-flex"
                            >
                                🔑 Admin Login
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        💧 Kelola Jatah Galon Karyawan
                    </h2>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        Sistem terintegrasi untuk mengelola permintaan, persetujuan, dan distribusi galon air
                        dengan tracking kuota bulanan berdasarkan grade karyawan
                    </p>
                    
                    {/* Employee ID Input */}
                    <div className="max-w-md mx-auto mb-8">
                        <div className="flex space-x-2">
                            <Input
                                type="text"
                                placeholder="Masukkan Employee ID (misal: EMP001)"
                                value={employeeId}
                                onChange={(e) => setEmployeeId(e.target.value)}
                                className="flex-1"
                                disabled={isLoading}
                            />
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            💡 Coba: EMP001, EMP002, atau EMP003
                        </p>
                    </div>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleQuotaCheck}>
                        <CardHeader className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">📊</span>
                            </div>
                            <CardTitle className="text-xl text-blue-700">Cek Kuota</CardTitle>
                            <CardDescription>
                                Scan Employee ID untuk melihat detail karyawan dan sisa kuota galon
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button 
                                onClick={handleQuotaCheck}
                                className="w-full bg-blue-600 hover:bg-blue-700"
                                disabled={!employeeId.trim() || isLoading}
                                size="lg"
                            >
                                {isLoading ? '⏳ Memproses...' : '🔍 Cek Kuota Sekarang'}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleRequestGallon}>
                        <CardHeader className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">📝</span>
                            </div>
                            <CardTitle className="text-xl text-green-700">Input (Request)</CardTitle>
                            <CardDescription>
                                Buat permintaan galon baru yang akan masuk ke sistem approval
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button 
                                onClick={handleRequestGallon}
                                className="w-full bg-green-600 hover:bg-green-700"
                                disabled={!employeeId.trim() || isLoading}
                                size="lg"
                            >
                                {isLoading ? '⏳ Memproses...' : '📦 Request Galon'}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleCheckOutput}>
                        <CardHeader className="text-center">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">✅</span>
                            </div>
                            <CardTitle className="text-xl text-purple-700">Output (Verify)</CardTitle>
                            <CardDescription>
                                Verifikasi pengambilan galon dan update kuota karyawan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button 
                                onClick={handleCheckOutput}
                                className="w-full bg-purple-600 hover:bg-purple-700"
                                disabled={!employeeId.trim() || isLoading}
                                size="lg"
                            >
                                {isLoading ? '⏳ Memproses...' : '✔️ Verify Collection'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Features Overview */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
                    <h3 className="text-2xl font-bold text-center mb-8">🎯 Fitur Utama Sistem</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <span className="text-2xl">👥</span>
                            </div>
                            <h4 className="font-semibold mb-2">Manajemen Karyawan</h4>
                            <p className="text-sm text-gray-600">CRUD lengkap untuk data karyawan</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <span className="text-2xl">⚡</span>
                            </div>
                            <h4 className="font-semibold mb-2">Auto Quota</h4>
                            <p className="text-sm text-gray-600">Kuota otomatis per grade (G7-G13)</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <span className="text-2xl">🔐</span>
                            </div>
                            <h4 className="font-semibold mb-2">Role-based Access</h4>
                            <p className="text-sm text-gray-600">HR, Administrator, Gudang roles</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <span className="text-2xl">📈</span>
                            </div>
                            <h4 className="font-semibold mb-2">Activity Logs</h4>
                            <p className="text-sm text-gray-600">Tracking lengkap semua aktivitas</p>
                        </div>
                    </div>
                </div>

                {/* Admin Panel CTA */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-8 text-center text-white">
                    <h3 className="text-2xl font-bold mb-4">🛡️ Admin Panel</h3>
                    <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                        Akses panel admin untuk mengelola karyawan, approve permintaan, dan melihat laporan aktivitas sistem
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            onClick={() => router.visit(route('login'))}
                            variant="secondary"
                            size="lg"
                            className="bg-white text-blue-700 hover:bg-gray-100"
                        >
                            🔑 Login Admin
                        </Button>
                        <Button
                            onClick={() => router.visit(route('register'))}
                            variant="outline"
                            size="lg"
                            className="border-white text-white hover:bg-white hover:text-blue-700"
                        >
                            📝 Register
                        </Button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-white border-t">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center text-gray-600">
                        <p>&copy; 2024 Sistem Jatah Galon - Water Gallon Quota Management System</p>
                        <p className="text-sm mt-2">Built with Laravel, React, and TypeScript</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
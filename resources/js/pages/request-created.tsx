import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { router } from '@inertiajs/react';

interface Employee {
    id: number;
    employee_id: string;
    nama_lengkap: string;
    nik: string;
    grade: string;
    department: string;
    jabatan: string;
    current_quota: number;
    monthly_quota: number;
}

interface GallonRequest {
    id: number;
    status: string;
    type: string;
    requested_at: string;
}

interface Props {
    employee: Employee;
    request: GallonRequest;
    [key: string]: unknown;
}

export default function RequestCreated({ employee, request }: Props) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('id-ID', {
            timeZone: 'Asia/Makassar',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Button
                                onClick={() => router.visit(route('public.index'))}
                                variant="outline"
                                size="sm"
                            >
                                ← Kembali
                            </Button>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">✅ Request Berhasil Dibuat</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Success Message */}
                <div className="text-center mb-8">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">✅</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Request Galon Berhasil Dibuat!
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Permintaan galon untuk <strong>{employee.nama_lengkap}</strong> telah berhasil diajukan 
                        dan masuk ke sistem untuk proses approval.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Request Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <span>📝</span>
                                <span>Detail Permintaan</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Request ID</label>
                                <p className="font-medium text-lg"># {request.id.toString().padStart(6, '0')}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Status</label>
                                <div className="flex items-center space-x-2 mt-1">
                                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                                    <span className="font-medium text-yellow-700">⏳ Pending Approval</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Tanggal Request</label>
                                <p className="font-medium">{formatDate(request.requested_at)}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Tipe</label>
                                <p className="font-medium">📦 Input (Request Galon)</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Employee Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <span>👤</span>
                                <span>Informasi Karyawan</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Nama Lengkap</label>
                                <p className="font-medium">{employee.nama_lengkap}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Employee ID</label>
                                <p className="font-medium">{employee.employee_id}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Grade</label>
                                <p className="font-medium">{employee.grade}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Department</label>
                                <p className="font-medium">{employee.department}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Sisa Kuota</label>
                                <p className="font-medium text-lg">
                                    <span className="text-green-600">{employee.current_quota}</span> / {employee.monthly_quota}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Process Flow */}
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <span>🔄</span>
                            <span>Proses Selanjutnya</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                                    <span className="text-xl">✅</span>
                                </div>
                                <div className="text-sm font-medium">Request Created</div>
                                <div className="text-xs text-gray-500">Selesai</div>
                            </div>
                            
                            <div className="hidden md:block w-16 h-1 bg-gray-300 rounded"></div>
                            
                            <div className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-2 animate-pulse">
                                    <span className="text-xl">⏳</span>
                                </div>
                                <div className="text-sm font-medium">Admin Approval</div>
                                <div className="text-xs text-gray-500">Menunggu</div>
                            </div>
                            
                            <div className="hidden md:block w-16 h-1 bg-gray-300 rounded"></div>
                            
                            <div className="flex flex-col items-center text-center opacity-50">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                                    <span className="text-xl">📦</span>
                                </div>
                                <div className="text-sm font-medium">Gudang Provide</div>
                                <div className="text-xs text-gray-500">Belum</div>
                            </div>
                            
                            <div className="hidden md:block w-16 h-1 bg-gray-300 rounded"></div>
                            
                            <div className="flex flex-col items-center text-center opacity-50">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                                    <span className="text-xl">✅</span>
                                </div>
                                <div className="text-sm font-medium">Collection Verify</div>
                                <div className="text-xs text-gray-500">Belum</div>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-start space-x-3">
                                <span className="text-blue-600 mt-0.5">ℹ️</span>
                                <div>
                                    <h4 className="font-medium text-blue-900">Langkah Selanjutnya:</h4>
                                    <ul className="text-sm text-blue-700 mt-2 space-y-1">
                                        <li>• Administrator akan mereview dan approve/reject request ini</li>
                                        <li>• Setelah approved, Gudang akan menyiapkan galon</li>
                                        <li>• Gunakan fitur "Output (Verify)" untuk konfirmasi pengambilan</li>
                                        <li>• Kuota akan otomatis berkurang setelah verifikasi</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        onClick={() => router.visit(route('public.index'))}
                        variant="outline"
                        size="lg"
                    >
                        🏠 Kembali ke Beranda
                    </Button>
                    <Button
                        onClick={() => router.post(route('public.check-quota'), { employee_id: employee.employee_id })}
                        size="lg"
                    >
                        📊 Cek Status Kuota
                    </Button>
                    <Button
                        onClick={() => window.print()}
                        variant="secondary"
                        size="lg"
                    >
                        🖨️ Print Bukti
                    </Button>
                </div>
            </div>
        </div>
    );
}
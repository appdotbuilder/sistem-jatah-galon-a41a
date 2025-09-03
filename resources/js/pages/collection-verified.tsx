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
    total_taken_current_month: number;
}

interface GallonRequest {
    id: number;
    status: string;
    type: string;
    requested_at: string;
    verified_at: string;
}

interface Props {
    employee: Employee;
    request: GallonRequest;
    [key: string]: unknown;
}

export default function CollectionVerified({ employee, request }: Props) {
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
                                <h1 className="text-xl font-bold text-gray-900">✅ Verifikasi Berhasil</h1>
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
                        Pengambilan Galon Berhasil Diverifikasi!
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        <strong>{employee.nama_lengkap}</strong> telah berhasil mengambil galon. 
                        Kuota bulanan telah diperbarui secara otomatis.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Verification Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <span>✅</span>
                                <span>Detail Verifikasi</span>
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
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span className="font-medium text-green-700">✅ Provided</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Tanggal Request</label>
                                <p className="font-medium">{formatDate(request.requested_at)}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Tanggal Verifikasi</label>
                                <p className="font-medium">{formatDate(request.verified_at)}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Tipe</label>
                                <p className="font-medium">📦 Input → Output (Selesai)</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Updated Quota Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <span>💧</span>
                                <span>Kuota Terbaru</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Nama Karyawan</label>
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
                            
                            {/* Updated Quota Display */}
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                <div className="text-center p-3 bg-green-50 rounded-lg">
                                    <div className="text-2xl font-bold text-green-700">{employee.current_quota}</div>
                                    <div className="text-sm text-gray-600">Sisa Kuota</div>
                                </div>
                                <div className="text-center p-3 bg-blue-50 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-700">{employee.total_taken_current_month}</div>
                                    <div className="text-sm text-gray-600">Total Terambil</div>
                                </div>
                            </div>

                            {/* Quota Progress */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Progress Kuota</span>
                                    <span>{employee.total_taken_current_month} / {employee.monthly_quota}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                                        style={{
                                            width: `${(employee.total_taken_current_month / employee.monthly_quota) * 100}%`
                                        }}
                                    ></div>
                                </div>
                                <div className="text-xs text-gray-500">
                                    {((employee.total_taken_current_month / employee.monthly_quota) * 100).toFixed(1)}% dari kuota bulanan terpakai
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Completion Summary */}
                <Card className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2 text-green-700">
                            <span>📋</span>
                            <span>Ringkasan Transaksi</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-white rounded-lg">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <span className="text-xl">✅</span>
                                </div>
                                <div className="text-sm font-medium">Request Created</div>
                                <div className="text-xs text-gray-500">Selesai</div>
                            </div>
                            <div className="text-center p-4 bg-white rounded-lg">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <span className="text-xl">👍</span>
                                </div>
                                <div className="text-sm font-medium">Admin Approved</div>
                                <div className="text-xs text-gray-500">Selesai</div>
                            </div>
                            <div className="text-center p-4 bg-white rounded-lg">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <span className="text-xl">📦</span>
                                </div>
                                <div className="text-sm font-medium">Gallon Provided</div>
                                <div className="text-xs text-gray-500">Selesai</div>
                            </div>
                            <div className="text-center p-4 bg-white rounded-lg">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <span className="text-xl">✅</span>
                                </div>
                                <div className="text-sm font-medium">Collection Verified</div>
                                <div className="text-xs text-gray-500">Selesai</div>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-white border rounded-lg">
                            <div className="flex items-start space-x-3">
                                <span className="text-green-600 mt-0.5">🎉</span>
                                <div>
                                    <h4 className="font-medium text-green-900">Transaksi Selesai!</h4>
                                    <ul className="text-sm text-green-700 mt-2 space-y-1">
                                        <li>• Galon telah berhasil diserahkan kepada karyawan</li>
                                        <li>• Kuota bulanan telah diperbarui secara real-time</li>
                                        <li>• Sistem telah mencatat aktivitas ini dalam log</li>
                                        <li>• Proses request-to-delivery berhasil diselesaikan</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quota Alert */}
                {employee.current_quota <= 2 && (
                    <Card className="mt-6 border-yellow-200 bg-yellow-50">
                        <CardContent className="pt-6">
                            <div className="flex items-start space-x-3">
                                <span className="text-yellow-600 mt-0.5">⚠️</span>
                                <div>
                                    <h4 className="font-medium text-yellow-900">
                                        {employee.current_quota === 0 ? 'Kuota Habis!' : 'Kuota Hampir Habis!'}
                                    </h4>
                                    <p className="text-sm text-yellow-700 mt-1">
                                        {employee.current_quota === 0 
                                            ? 'Karyawan telah menggunakan seluruh kuota bulan ini.'
                                            : `Karyawan hanya memiliki ${employee.current_quota} kuota tersisa.`
                                        }
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

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
                        📊 Lihat Detail Lengkap
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
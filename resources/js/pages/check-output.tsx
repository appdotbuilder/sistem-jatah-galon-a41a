import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
    approved_at: string | null;
    provided_at: string | null;
    verified_at: string | null;
}

interface Props {
    employee: Employee;
    pendingRequests: GallonRequest[];
    [key: string]: unknown;
}

export default function CheckOutput({ employee, pendingRequests }: Props) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('id-ID', {
            timeZone: 'Asia/Makassar',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleVerifyCollection = (requestId: number) => {
        if (confirm('Apakah Anda yakin ingin memverifikasi pengambilan galon ini? Kuota karyawan akan berkurang.')) {
            router.post(route('public.verify-collection'), { request_id: requestId }, {
                preserveState: false,
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
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
                                <h1 className="text-xl font-bold text-gray-900">📤 Output - Verifikasi Pengambilan</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Employee Info */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <span>👤</span>
                                <span>Karyawan</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="text-2xl">👤</span>
                                </div>
                                <h3 className="font-semibold text-lg">{employee.nama_lengkap}</h3>
                                <p className="text-gray-600">{employee.employee_id}</p>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Grade:</span>
                                    <Badge variant="outline">{employee.grade}</Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Department:</span>
                                    <span className="text-sm font-medium">{employee.department}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Sisa Kuota:</span>
                                    <span className="text-sm font-medium">
                                        <span className="text-green-600">{employee.current_quota}</span> / {employee.monthly_quota}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pending Requests */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <span>⏳</span>
                                <span>Permintaan Menunggu Verifikasi</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {pendingRequests.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-4xl">📭</span>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Tidak Ada Permintaan Pending
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        Karyawan ini tidak memiliki permintaan galon yang menunggu verifikasi.
                                    </p>
                                    <div className="space-y-3 text-sm text-gray-500">
                                        <p>💡 <strong>Tips:</strong></p>
                                        <ul className="text-left max-w-md mx-auto space-y-1">
                                            <li>• Pastikan permintaan sudah dibuat melalui fitur "Input"</li>
                                            <li>• Permintaan harus sudah di-approve oleh Administrator</li>
                                            <li>• Gudang harus sudah menyiapkan galon</li>
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between border-b pb-2">
                                        <span className="font-medium">
                                            {pendingRequests.length} permintaan menunggu verifikasi
                                        </span>
                                        <Badge variant="secondary">
                                            ⏳ Pending
                                        </Badge>
                                    </div>

                                    {pendingRequests.map((request) => (
                                        <Card key={request.id} className="border-l-4 border-l-yellow-400">
                                            <CardContent className="pt-6">
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="font-medium">Request #{request.id.toString().padStart(6, '0')}</span>
                                                            <Badge variant="secondary">
                                                                📦 Input Request
                                                            </Badge>
                                                        </div>
                                                        <div className="text-sm text-gray-600 space-y-1">
                                                            <div>📅 Request: {formatDate(request.requested_at)}</div>
                                                            {request.approved_at && (
                                                                <div>✅ Approved: {formatDate(request.approved_at)}</div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col space-y-2">
                                                        <Button
                                                            onClick={() => handleVerifyCollection(request.id)}
                                                            className="bg-green-600 hover:bg-green-700"
                                                        >
                                                            ✅ Verifikasi Ambil
                                                        </Button>
                                                        <p className="text-xs text-gray-500 text-center">
                                                            Kuota -1
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}

                                    {/* Warning */}
                                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <div className="flex items-start space-x-3">
                                            <span className="text-yellow-600 mt-0.5">⚠️</span>
                                            <div>
                                                <h4 className="font-medium text-yellow-900">Perhatian:</h4>
                                                <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                                                    <li>• Verifikasi pengambilan akan mengurangi kuota karyawan</li>
                                                    <li>• Pastikan karyawan benar-benar mengambil galon</li>
                                                    <li>• Aksi ini tidak dapat dibatalkan</li>
                                                    <li>• Status request akan berubah menjadi "Provided"</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Summary Card */}
                {pendingRequests.length > 0 && (
                    <Card className="mt-8 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2 text-purple-700">
                                <span>📊</span>
                                <span>Ringkasan Verifikasi</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-white rounded-lg">
                                    <div className="text-2xl font-bold text-purple-700">{pendingRequests.length}</div>
                                    <div className="text-sm text-gray-600">Request Pending</div>
                                </div>
                                <div className="text-center p-4 bg-white rounded-lg">
                                    <div className="text-2xl font-bold text-green-700">{employee.current_quota}</div>
                                    <div className="text-sm text-gray-600">Sisa Kuota Saat Ini</div>
                                </div>
                                <div className="text-center p-4 bg-white rounded-lg">
                                    <div className="text-2xl font-bold text-blue-700">
                                        {employee.current_quota - pendingRequests.length}
                                    </div>
                                    <div className="text-sm text-gray-600">Sisa Setelah Verifikasi</div>
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
                        variant="secondary"
                        size="lg"
                    >
                        📊 Cek Detail Kuota
                    </Button>
                </div>
            </div>
        </div>
    );
}
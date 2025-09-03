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
    foto: string | null;
    email: string | null;
    hp: string | null;
    hire_date: string;
    monthly_quota: number;
    current_quota: number;
    total_taken_current_month: number;
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
    history: GallonRequest[];
    [key: string]: unknown;
}

export default function CheckQuota({ employee, history }: Props) {


    const getStatusBadge = (status: string) => {
        const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline" | "success"; text: string; emoji: string }> = {
            pending: { variant: 'secondary', text: 'Pending', emoji: '⏳' },
            approved: { variant: 'default', text: 'Approved', emoji: '✅' },
            provided: { variant: 'success', text: 'Provided', emoji: '📦' },
            rejected: { variant: 'destructive', text: 'Rejected', emoji: '❌' },
        };
        
        const config = variants[status] || variants.pending;
        return (
            <Badge variant={config.variant}>
                {config.emoji} {config.text}
            </Badge>
        );
    };

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

    const quotaPercentage = (employee.current_quota / employee.monthly_quota) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
                                <h1 className="text-xl font-bold text-gray-900">📊 Detail Kuota Karyawan</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Employee Information */}
                    <Card className="h-fit">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <span>👤</span>
                                <span>Informasi Karyawan</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-4">
                                {employee.foto ? (
                                    <img
                                        src={`/storage/${employee.foto}`}
                                        alt={employee.nama_lengkap}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                                        <span className="text-2xl">👤</span>
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-lg font-semibold">{employee.nama_lengkap}</h3>
                                    <p className="text-gray-600">{employee.employee_id}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">NIK</label>
                                    <p className="font-medium">{employee.nik}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Grade</label>
                                    <p className="font-medium">
                                        <Badge variant="outline">{employee.grade}</Badge>
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Department</label>
                                    <p className="font-medium">{employee.department}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Jabatan</label>
                                    <p className="font-medium">{employee.jabatan}</p>
                                </div>
                                {employee.email && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Email</label>
                                        <p className="font-medium">{employee.email}</p>
                                    </div>
                                )}
                                {employee.hp && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">HP</label>
                                        <p className="font-medium">{employee.hp}</p>
                                    </div>
                                )}
                                <div className="sm:col-span-2">
                                    <label className="text-sm font-medium text-gray-500">Tanggal Bergabung</label>
                                    <p className="font-medium">
                                        {new Date(employee.hire_date).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quota Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <span>💧</span>
                                <span>Informasi Kuota Galon</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-700">{employee.monthly_quota}</div>
                                    <div className="text-sm text-gray-600">Jatah per Bulan</div>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <div className="text-2xl font-bold text-green-700">{employee.current_quota}</div>
                                    <div className="text-sm text-gray-600">Sisa Kuota</div>
                                </div>
                                <div className="text-center p-4 bg-orange-50 rounded-lg">
                                    <div className="text-2xl font-bold text-orange-700">{employee.total_taken_current_month}</div>
                                    <div className="text-sm text-gray-600">Total Terambil</div>
                                </div>
                                <div className="text-center p-4 bg-purple-50 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-700">{quotaPercentage.toFixed(0)}%</div>
                                    <div className="text-sm text-gray-600">Persentase Sisa</div>
                                </div>
                            </div>

                            {/* Quota Progress Bar */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Progress Kuota</span>
                                    <span>{employee.total_taken_current_month} / {employee.monthly_quota}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                                        style={{
                                            width: `${(employee.total_taken_current_month / employee.monthly_quota) * 100}%`
                                        }}
                                    ></div>
                                </div>
                            </div>

                            {/* Status Alert */}
                            {employee.current_quota === 0 && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <div className="flex items-center space-x-2 text-red-700">
                                        <span>⚠️</span>
                                        <span className="font-medium">Kuota Habis</span>
                                    </div>
                                    <p className="text-red-600 text-sm mt-1">
                                        Karyawan telah menggunakan seluruh kuota bulan ini
                                    </p>
                                </div>
                            )}

                            {employee.current_quota <= 2 && employee.current_quota > 0 && (
                                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <div className="flex items-center space-x-2 text-yellow-700">
                                        <span>⚠️</span>
                                        <span className="font-medium">Kuota Menipis</span>
                                    </div>
                                    <p className="text-yellow-600 text-sm mt-1">
                                        Sisa kuota tinggal {employee.current_quota} galon
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* History */}
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <span>📋</span>
                            <span>Riwayat Transaksi (10 Terakhir)</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {history.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <span className="text-4xl mb-2 block">📋</span>
                                <p>Belum ada riwayat transaksi</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2">Tanggal & Jam</th>
                                            <th className="text-left py-2">Tipe</th>
                                            <th className="text-left py-2">Status</th>
                                            <th className="text-left py-2">Approved</th>
                                            <th className="text-left py-2">Provided</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.map((request) => (
                                            <tr key={request.id} className="border-b">
                                                <td className="py-2">
                                                    {formatDate(request.requested_at)}
                                                </td>
                                                <td className="py-2">
                                                    <Badge variant="outline">
                                                        {request.type === 'input' ? '📦 Input' : '📤 Output'}
                                                    </Badge>
                                                </td>
                                                <td className="py-2">
                                                    {getStatusBadge(request.status)}
                                                </td>
                                                <td className="py-2">
                                                    {request.approved_at ? formatDate(request.approved_at) : '-'}
                                                </td>
                                                <td className="py-2">
                                                    {request.provided_at ? formatDate(request.provided_at) : '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
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
                        onClick={() => window.print()}
                        variant="secondary"
                        size="lg"
                    >
                        🖨️ Print Detail
                    </Button>
                </div>
            </div>
        </div>
    );
}
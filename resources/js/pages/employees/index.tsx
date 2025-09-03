import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import AppLayout from '@/components/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface Employee {
    id: number;
    employee_id: string;
    nama_lengkap: string;
    nik: string;
    grade: string;
    department: string;
    jabatan: string;
    hire_date: string;
    monthly_quota: number;
    current_quota: number;
    total_taken_current_month: number;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    employees: {
        data: Employee[];
        links: PaginationLink[];
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
    filters: {
        search?: string;
        grade?: string;
        department?: string;
    };
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Employees', href: '/employees' },
];

export default function EmployeesIndex({ employees, filters }: Props) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const user = auth.user;

    const getGradeColor = (grade: string) => {
        const colors: Record<string, string> = {
            'G7': 'bg-purple-100 text-purple-800',
            'G8': 'bg-blue-100 text-blue-800',
            'G9': 'bg-green-100 text-green-800',
            'G10': 'bg-yellow-100 text-yellow-800',
            'G11': 'bg-orange-100 text-orange-800',
            'G12': 'bg-red-100 text-red-800',
            'G13': 'bg-gray-100 text-gray-800',
        };
        return colors[grade] || 'bg-gray-100 text-gray-800';
    };

    const getQuotaStatus = (current: number, total: number) => {
        const percentage = (current / total) * 100;
        if (percentage === 0) return { color: 'text-red-600', status: '⚠️ Empty' };
        if (percentage <= 20) return { color: 'text-orange-600', status: '⚠️ Low' };
        if (percentage <= 50) return { color: 'text-yellow-600', status: '⚡ Medium' };
        return { color: 'text-green-600', status: '✅ Good' };
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const search = formData.get('search') as string;
        router.get('/employees', { search }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Employee Management" />
            
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                    <div>
                        <h1 className="text-2xl font-bold">👥 Employee Management</h1>
                        <p className="text-gray-600">Manage employee records and gallon quotas</p>
                    </div>
                    {user.role === 'hr' && (
                        <div className="flex space-x-3">
                            <Button
                                onClick={() => router.visit('/employees/create')}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                ➕ Add Employee
                            </Button>
                            <Button
                                onClick={() => router.post('/quota/reset')}
                                variant="outline"
                            >
                                🔄 Reset Quotas
                            </Button>
                        </div>
                    )}
                </div>

                {/* Search and Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                            <Input
                                name="search"
                                placeholder="Search by name, ID, NIK, or department..."
                                defaultValue={filters.search || ''}
                                className="flex-1"
                            />
                            <Button type="submit" variant="outline">
                                🔍 Search
                            </Button>
                            {(filters.search || filters.grade || filters.department) && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => router.visit('/employees')}
                                >
                                    ✕ Clear
                                </Button>
                            )}
                        </form>
                    </CardContent>
                </Card>

                {/* Employees Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {employees.data.map((employee) => {
                        const quotaStatus = getQuotaStatus(employee.current_quota, employee.monthly_quota);
                        
                        return (
                            <Card key={employee.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg mb-1">{employee.nama_lengkap}</CardTitle>
                                            <p className="text-sm text-gray-600">{employee.employee_id}</p>
                                        </div>
                                        <Badge className={getGradeColor(employee.grade)}>
                                            {employee.grade}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Department:</span>
                                            <span className="font-medium">{employee.department}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Position:</span>
                                            <span className="font-medium">{employee.jabatan}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">NIK:</span>
                                            <span className="font-medium">{employee.nik}</span>
                                        </div>
                                    </div>

                                    {/* Quota Information */}
                                    <div className="pt-3 border-t">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium">Monthly Quota</span>
                                            <span className={`text-sm font-medium ${quotaStatus.color}`}>
                                                {quotaStatus.status}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span>Remaining: <span className="font-medium">{employee.current_quota}</span></span>
                                            <span>Used: <span className="font-medium">{employee.total_taken_current_month}</span></span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                style={{
                                                    width: `${(employee.total_taken_current_month / employee.monthly_quota) * 100}%`
                                                }}
                                            ></div>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {employee.total_taken_current_month} / {employee.monthly_quota} gallons
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex space-x-2 pt-2">
                                        <Button
                                            onClick={() => router.visit(`/employees/${employee.id}`)}
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                        >
                                            👁️ View
                                        </Button>
                                        {user.role === 'hr' && (
                                            <Button
                                                onClick={() => router.visit(`/employees/${employee.id}/edit`)}
                                                variant="outline"
                                                size="sm"
                                                className="flex-1"
                                            >
                                                ✏️ Edit
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Empty State */}
                {employees.data.length === 0 && (
                    <Card>
                        <CardContent className="pt-12 pb-12 text-center">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-4xl">👥</span>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
                            <p className="text-gray-600 mb-6">
                                {filters.search ? 
                                    'Try adjusting your search terms or filters.' :
                                    'Get started by adding your first employee.'
                                }
                            </p>
                            {user.role === 'hr' && !filters.search && (
                                <Button
                                    onClick={() => router.visit('/employees/create')}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    ➕ Add First Employee
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Pagination */}
                {employees.data.length > 0 && employees.links && (
                    <div className="flex justify-center space-x-2">
                        {employees.links.map((link, index) => (
                            <Button
                                key={index}
                                variant={link.active ? "default" : "outline"}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => link.url && router.visit(link.url)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}

                {/* Summary Stats */}
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{employees.data.length}</div>
                                <div className="text-sm text-gray-600">Showing</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {employees.data.reduce((sum, emp) => sum + emp.current_quota, 0)}
                                </div>
                                <div className="text-sm text-gray-600">Total Quota Remaining</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-orange-600">
                                    {employees.data.reduce((sum, emp) => sum + emp.total_taken_current_month, 0)}
                                </div>
                                <div className="text-sm text-gray-600">Total Used This Month</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">
                                    {employees.data.reduce((sum, emp) => sum + emp.monthly_quota, 0)}
                                </div>
                                <div className="text-sm text-gray-600">Total Monthly Allocation</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
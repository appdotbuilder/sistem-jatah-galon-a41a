import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/components/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, router } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface DashboardStats {
    totalEmployees: number;
    pendingRequests: number;
    approvedRequests: number;
    totalQuotaUsed: number;
    recentActivities: Array<{
        id: number;
        action: string;
        description: string;
        created_at: string;
        user?: { name: string };
        employee?: { nama_lengkap: string };
    }>;
}

interface Props {
    stats: DashboardStats;
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ stats }: Props) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const user = auth.user;

    const getRoleDisplay = (role: string) => {
        const roles = {
            hr: { label: 'HR Manager', color: 'bg-blue-100 text-blue-800', emoji: '👥' },
            administrator: { label: 'Administrator', color: 'bg-purple-100 text-purple-800', emoji: '🛡️' },
            gudang: { label: 'Warehouse Staff', color: 'bg-green-100 text-green-800', emoji: '📦' }
        };
        return roles[role as keyof typeof roles] || { label: role, color: 'bg-gray-100 text-gray-800', emoji: '👤' };
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

    const roleInfo = getRoleDisplay(user.role);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - Sistem Jatah Galon" />
            
            <div className="p-6 space-y-6">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold mb-2">
                                {roleInfo.emoji} Welcome back, {user.name}!
                            </h1>
                            <p className="text-blue-100">
                                Sistem Jatah Galon - Water Gallon Quota Management
                            </p>
                            <div className="mt-2">
                                <Badge className={`${roleInfo.color} border-0`}>
                                    {roleInfo.label}
                                </Badge>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-blue-200">
                                {new Date().toLocaleDateString('id-ID', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </div>
                            <div className="text-xs text-blue-300">
                                Asia/Makassar Time
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                            <span className="text-2xl">👥</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalEmployees}</div>
                            <p className="text-xs text-muted-foreground">Active employees</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                            <span className="text-2xl">⏳</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{stats.pendingRequests}</div>
                            <p className="text-xs text-muted-foreground">Awaiting approval</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Approved Requests</CardTitle>
                            <span className="text-2xl">✅</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.approvedRequests}</div>
                            <p className="text-xs text-muted-foreground">Ready for pickup</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Quota Used</CardTitle>
                            <span className="text-2xl">💧</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{stats.totalQuotaUsed}</div>
                            <p className="text-xs text-muted-foreground">This month</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Role-based Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <span>⚡</span>
                                <span>Quick Actions</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {user.role === 'hr' && (
                                <>
                                    <Button 
                                        onClick={() => router.visit('/employees')}
                                        className="w-full justify-start"
                                        variant="outline"
                                    >
                                        👥 Manage Employees
                                    </Button>
                                    <Button 
                                        onClick={() => router.visit('/employees/create')}
                                        className="w-full justify-start"
                                        variant="outline"
                                    >
                                        ➕ Add New Employee
                                    </Button>
                                    <Button 
                                        onClick={() => router.post('/quota/reset')}
                                        className="w-full justify-start"
                                        variant="outline"
                                    >
                                        🔄 Reset Monthly Quotas
                                    </Button>
                                </>
                            )}

                            {user.role === 'administrator' && (
                                <>
                                    <Button 
                                        onClick={() => router.visit('/gallon-requests')}
                                        className="w-full justify-start"
                                        variant="outline"
                                    >
                                        📋 Review Requests
                                    </Button>
                                    <Button 
                                        onClick={() => router.visit('/activity-logs')}
                                        className="w-full justify-start"
                                        variant="outline"
                                    >
                                        📊 View Activity Logs
                                    </Button>
                                    <Button 
                                        onClick={() => router.visit('/employees')}
                                        className="w-full justify-start"
                                        variant="outline"
                                    >
                                        👥 View All Employees
                                    </Button>
                                </>
                            )}

                            {user.role === 'gudang' && (
                                <>
                                    <Button 
                                        onClick={() => router.visit('/gallon-requests?status=approved')}
                                        className="w-full justify-start"
                                        variant="outline"
                                    >
                                        📦 Approved Requests
                                    </Button>
                                    <Button 
                                        onClick={() => router.visit('/employees')}
                                        className="w-full justify-start"
                                        variant="outline"
                                    >
                                        👥 View Employees
                                    </Button>
                                </>
                            )}

                            <Button 
                                onClick={() => router.visit('/')}
                                className="w-full justify-start"
                                variant="secondary"
                            >
                                🏠 Public Interface
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Recent Activities */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <span>📋</span>
                                <span>Recent Activities</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {stats.recentActivities.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <span className="text-4xl mb-2 block">📋</span>
                                    <p>No recent activities</p>
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-64 overflow-y-auto">
                                    {stats.recentActivities.map((activity) => (
                                        <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {activity.description}
                                                </p>
                                                <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                                                    <span>{formatDate(activity.created_at)}</span>
                                                    {activity.user && (
                                                        <>
                                                            <span>•</span>
                                                            <span>{activity.user.name}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Role-specific Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <span>{roleInfo.emoji}</span>
                            <span>Your Role & Permissions</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {user.role === 'hr' && (
                                <div className="space-y-3">
                                    <h4 className="font-medium text-blue-700">HR Manager Permissions</h4>
                                    <ul className="text-sm space-y-1">
                                        <li>✅ Full CRUD employee records</li>
                                        <li>✅ Import/Export employee data</li>
                                        <li>✅ Set grade-based quotas</li>
                                        <li>✅ Reset monthly quotas</li>
                                        <li>✅ View all system data</li>
                                    </ul>
                                </div>
                            )}

                            {user.role === 'administrator' && (
                                <div className="space-y-3">
                                    <h4 className="font-medium text-purple-700">Administrator Permissions</h4>
                                    <ul className="text-sm space-y-1">
                                        <li>✅ Approve/Reject gallon requests</li>
                                        <li>✅ Export daily/monthly reports</li>
                                        <li>✅ View audit logs</li>
                                        <li>✅ Manage all requests</li>
                                        <li>✅ System monitoring</li>
                                    </ul>
                                </div>
                            )}

                            {user.role === 'gudang' && (
                                <div className="space-y-3">
                                    <h4 className="font-medium text-green-700">Warehouse Staff Permissions</h4>
                                    <ul className="text-sm space-y-1">
                                        <li>✅ View approved requests</li>
                                        <li>✅ Mark gallons as provided</li>
                                        <li>✅ Update delivery status</li>
                                        <li>✅ View employee quotas</li>
                                        <li>✅ Stock management</li>
                                    </ul>
                                </div>
                            )}

                            {/* System Status */}
                            <div className="space-y-3">
                                <h4 className="font-medium text-gray-700">System Status</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span>Database</span>
                                        <span className="flex items-center space-x-1">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <span>Online</span>
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span>Public Interface</span>
                                        <span className="flex items-center space-x-1">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <span>Active</span>
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span>Timezone</span>
                                        <span>Asia/Makassar</span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="space-y-3">
                                <h4 className="font-medium text-gray-700">This Month</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                                        <div className="text-lg font-bold text-blue-600">{stats.pendingRequests}</div>
                                        <div className="text-xs text-gray-600">Pending</div>
                                    </div>
                                    <div className="text-center p-3 bg-green-50 rounded-lg">
                                        <div className="text-lg font-bold text-green-600">{stats.approvedRequests}</div>
                                        <div className="text-xs text-gray-600">Approved</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
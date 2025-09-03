import React from 'react';
import { AppShell } from '@/components/app-shell';

interface Props {
    children: React.ReactNode;
    breadcrumbs?: Array<{
        title: string;
        href: string;
    }>;
}

export default function AppLayout({ children, breadcrumbs }: Props) {
    return (
        <AppShell>
            <div className="min-h-screen bg-gray-50">
                {breadcrumbs && breadcrumbs.length > 0 && (
                    <div className="bg-white border-b">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                            <nav className="flex" aria-label="Breadcrumb">
                                <ol className="flex items-center space-x-2">
                                    {breadcrumbs.map((item, index) => (
                                        <li key={item.href} className="flex items-center">
                                            {index > 0 && (
                                                <span className="text-gray-400 mx-2">/</span>
                                            )}
                                            <a
                                                href={item.href}
                                                className={`text-sm font-medium ${
                                                    index === breadcrumbs.length - 1
                                                        ? 'text-gray-900'
                                                        : 'text-gray-500 hover:text-gray-700'
                                                }`}
                                            >
                                                {item.title}
                                            </a>
                                        </li>
                                    ))}
                                </ol>
                            </nav>
                        </div>
                    </div>
                )}
                <main>
                    {children}
                </main>
            </div>
        </AppShell>
    );
}
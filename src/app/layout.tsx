import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { ClientProviders } from './ClientProviders';

import './globals.css';

const inter = Inter({ subsets: [ 'latin' ] });

export const metadata: Metadata = {
    title: 'pccontrol',
    description: 'pccontrol',

    viewport: {
        minimumScale: 1,
        initialScale: 1,
        width: 'device-width',
        userScalable: false,
        viewportFit: 'cover'
    },

    applicationName: 'pccontrol',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: 'pccontrol'
    },

    formatDetection: {
        telephone: false
    },

    themeColor: '#000000',
    manifest: '/manifest.json',

    icons: {
        icon: [
            { type: 'image/png', sizes: '32x32', url: '/icons/favicon-32x32.png' },
            { type: 'image/png', sizes: '16x16', url: '/icons/favicon-16x16.png' }
        ],
        shortcut: [],
        apple: [
            { url: '/icons/touch-icon-iphone.png' },
            { url: '/icons/touch-icon-ipad.png', sizes: '152x152' },
            { url: '/icons/touch-icon-iphone-retina.png', sizes: '180x180' },
            { url: '/icons/touch-icon-ipad-retina.png', sizes: '167x167' }
        ]
        // other: [
        //     { rel: 'mask-icon', url: '/icons/safari-pinned-tab.svg', color: '#5bbad5' }
        // ]
    }
};

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <ClientProviders>
            <html lang="en">
                <body className={ inter.className }>
                    { children }
                </body>
            </html>
        </ClientProviders>
    );
}

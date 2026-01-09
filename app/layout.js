import './globals.css';

export const metadata = {
    title: 'Elite Fitness Coach - Transform Your Body & Mind',
    description: 'Premium fitness coaching for high-performers. Personalized workout plans, nutrition guidance, and accountability coaching.',
    keywords: 'fitness coach, personal training, workout plans, nutrition coaching, body transformation',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link
                href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
                rel="stylesheet"
            />
        </head>
        <body>{children}</body>
        </html>
    );
}
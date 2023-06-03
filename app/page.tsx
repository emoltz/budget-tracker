import Image from 'next/image'
import styles from './page.module.css'
import RootLayout from "@/app/layout";

export default function Home() {
    return (
        <>
            <RootLayout>
                <div className={styles.container}>
                    Hello world!
                </div>
            </RootLayout>
        </>
    )
}

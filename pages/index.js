import Head from "next/head"
import Image from "next/image"
import { Inter } from "@next/font/google"
import styles from "../styles/Home.module.css"
// import ManualHeader from "../components/ManualHeader"

import Header from "../components/Header"
import LotteryEntrance from "../components/LotteryEntrance"

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Lottery Smart Contract </title>
                <meta name="description" content="Our Smart Contract Lottery" />

                <link rel="icon" href="/favicon.ico" />
            </Head>
            {/*header connect button / nav bar lagbe */}
            <Header />
            <LotteryEntrance />
            Hello!
        </div>
    )
}
//yarn run dev for starting live server or yarn dev

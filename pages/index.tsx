import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
// import ManualHeader from "../components/ManualHeader";
import Header from "../components/Header";
import LotteryEntrace from '../components/LotteryEntrace';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Smart Contract Lottery</title>
        <meta name="description" content="Our Smart Contract Lottery" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <LotteryEntrace />
    </div>
  )
}

export default Home

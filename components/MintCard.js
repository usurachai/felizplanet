import React, { useEffect, useState } from 'react'
import styles from './MintCard.module.scss'
import Image from 'next/image'
import { FELIZ_CITIZENS, FELIZ_STARDRUST } from '../utils/enum/token'
import { MINT, MINT_COMMING, MINT_PRESALE } from '../utils/enum/mint'
import { ethers } from 'ethers'

// import { getContractAddress } from 'ethers/lib/utils'
import contractAddress from '../contractAddress.json'
import citizenAbi from '../contracts/artifacts/FelizCitizen.json'
import stardrustAbi from '../contracts/artifacts/StardustCask.json'

// import Img from './Img'
import Web3 from 'web3'


export default function MintCard({src, className, alt, account, type, countdown}) {
  // const [type, setType] = useState('')
  const [title, setTitle] = useState('')
  const [maxSupply, setMaxSupply] = useState(0)
  const [totalSupply, setTotalSupply] = useState(0)
  const [cost, setCost] = useState(0)
  const [amount, setAmount] = useState(0)
  const [mintType, setMintType] = useState('')
  const [contract, setContract] = useState(undefined)

  useEffect(() => {
    switch(type) {
      case FELIZ_CITIZENS:
        setTitle("Feliz Citizens")
        break
      case FELIZ_STARDRUST:
        setTitle("Feliz Stardrust")
        break
    }
  }, [type])

  useEffect(() => {
    if (countdown === "00:00:00:00") {
      setMintType(MINT)
    } else {
      setMintType(MINT_COMMING)
    }
  }, [countdown])

  const loadCitizenInfos = async () => {
    try {
      const { ethereum } = window
      if (ethereum) {
        // const contract = new Web3
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress.FelizCitizen, citizenAbi.abi, signer)

        // total number
        const maxSupply = await nftContract.maxSupply()
        console.log("maxSupply: ", maxSupply.toNumber())
        setMaxSupply(maxSupply.toNumber())

        // totalSupply
        const totalSupply = await nftContract.totalSupply()
        console.log("totalSupply: ", totalSupply.toNumber())
        setTotalSupply(totalSupply.toNumber())

        // cost
        const cost = await nftContract.cost()
        console.log("cost: ", ethers.utils.formatUnits(cost, 'ether'))
        setCost(ethers.utils.formatUnits(cost, 'ether'))
      }
    } catch (err) {
      console.log(err)
    }
  }

  const mintCitizens = async (amount) => {
    try {
      const { ethereum } = window
      if (ethereum) {
        // const contract = new Web3
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner();
        // console.log("signer: ", await signer.getAddress())
        const nftContract = new ethers.Contract(contractAddress.FelizCitizen, citizenAbi.abi, signer)

        console.log('initializing payment')
        let nftTxn = await nftContract.mint(amount)

        console.log('Mining... please wait')
        await nftTxn.wait()

        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const mint = () => {
    switch(type) {
      case FELIZ_CITIZENS:
        mintCitizens(amount)
        break
      case FELIZ_STARDRUST:
        // setTitle("Feliz Stardrust")
        break
    }
  }

  useEffect(() => {
    switch (type) {
      case FELIZ_CITIZENS:
        loadCitizenInfos()
        break;

      case FELIZ_STARDRUST:
        // loadCitizenInfos()
        break;

      default:
        break;
    }
    // loadCitizenInfos()
  }, [])

  useEffect(() => {
    switch (type) {
      case FELIZ_CITIZENS:
        loadCitizenInfos()
        break;

      case FELIZ_STARDRUST:
        // loadCitizenInfos()
        break;

      default:
        break;
    }
  }, [account, type])

  const increase = () => {
    setAmount((amount) => {
      const newAmount = amount + 1
      if (maxSupply < newAmount + totalSupply) return amount
      return amount + 1
    })
  }

  const decrease = () => {
    setAmount((amount) => {
      const newAmount = amount - 1
      if (0 > newAmount) return amount
      return amount - 1
    })
  }

  const mintImage = (mintType) => {
    // console.log("mintType", mintType)
    switch(mintType) {
      case MINT:
        return (
          <div className={styles.buy} onClick={mint}>
            <Image src='/images/mint.png' alt='buy' layout='fill'/>
          </div>
        )
      case MINT_COMMING:
        return (
          <div className={styles.buy}>
            <Image src='/images/mint_coming.png' alt='buy' layout='fill'/>
          </div>
        )
      case MINT_PRESALE:
        break
      default: break
    }
  }

  return (
    <div className={styles.MintCard + " " + className}>
      <Image src='/images/mintcard.png' alt={alt} layout='fill' className={styles.background}/>
      <p className={styles.title}>{title}</p>
      <p className={styles.contents}>mint : {totalSupply}/{maxSupply}<br/>price : {cost} eth</p>
      <p className={styles.amount}>{amount}</p>
      <div className={styles.img}>
        <Image src={src} alt={alt} layout='fill'/>
      </div>
      <button className={styles.prev} onClick={decrease}/>
      <button className={styles.next} onClick={increase}/>
      {mintImage(mintType)}
      
    </div>
  )
}
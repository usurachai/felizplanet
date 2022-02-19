import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from './ImageLink.module.scss'

export default function ImageLink({className, src, alt, href, text}) {
  const [ssrc, setSrc] = useState('')
  // const[ ]

  return (
    <Link href={href}>
      <a className={styles.ImageLink + " " + className}>
        <Image
          src={src}
          alt={alt}
          layout='fill'
        />
        <h3>{text}</h3>
      </a>
    </Link>
  )
}
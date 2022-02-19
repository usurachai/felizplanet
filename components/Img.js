import Image from "next/image"

export default function Img({src, alt, className}) {
  return (
    <div className={className}>
      <Image src={src} alt={alt} layout='fill'/>
    </div>
  )
}
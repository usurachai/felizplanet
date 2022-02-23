import Image from "next/image";

export default function Img({ src, alt, className, style, onClick }) {
    return (
        <div className={className} style={style} onClick={onClick}>
            <Image src={src} alt={alt} layout="fill" />
        </div>
    );
}

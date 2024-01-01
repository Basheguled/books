import Image from "next/image";
import logo from "../../public/logo.svg";

const Logo = () => (
  <Image
    className="object-contain w-full relative h-auto"
    fill
    priority={true}
    src={logo}
    alt="logo"
  />
);

export default Logo;

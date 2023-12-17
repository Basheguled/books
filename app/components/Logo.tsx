import Image from "next/image";
import logo from "../../public/logo.svg";

const Logo = ({ height, width }: { height: number; width: number }) => (
  <Image width={width} height={height} priority={true} src={logo} alt="logo" />
);

export default Logo;

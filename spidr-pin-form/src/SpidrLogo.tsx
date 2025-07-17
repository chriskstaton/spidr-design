import React from "react";
import spidrLogo from "../src/images/spidr-logo.png";

interface SpidrLogoProps {
	className?: string;
	style?: React.CSSProperties;
}

const SpidrLogo: React.FC<SpidrLogoProps> = ({ className, style }) => (
	<div className={`logo-drop ${className || ""}`} style={style}>
		<div className="logo-line" />
		<img src={spidrLogo} alt="Spidr Logo" style={{ width: "100px" }} />
	</div>
);

export default SpidrLogo;

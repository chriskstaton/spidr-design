import React from "react";
import spidrTitle from "../src/images/spidr-title.png";

interface SpidrTitleProps {
	className?: string;
	style?: React.CSSProperties;
}

const SpidrTitle: React.FC<SpidrTitleProps> = ({ className, style }) => (
	<div style={{ display: "flex", position: "relative", paddingBottom: "20px" }}>
		<img
			src={spidrTitle}
			alt="Spidr Title"
			style={{
				width: "125px",
				margin: "auto",
				zIndex: "997",
				left: ".5px", // bisect 'i' in spidr
				position: "relative",
			}}
		/>
	</div>
);

export default SpidrTitle;

import React, { useState } from "react";
import airFryer from "../src/images/air-fryer.png";
import brickWall from "../src/images/brick-wall.jpg";

interface AirFryerProps {
	className?: string;
	style?: React.CSSProperties;
}

const AirFryer: React.FC<AirFryerProps> = ({ className, style }) => {
	const [hidden, setHidden] = useState(false);
	return (
		<div
			style={{
				display: "flex",
				position: "relative",
				height: "0px",
				width: "0px",
				top: "-140px",
				left: "-300px",
			}}
		>
			<div
				onClick={() => setHidden(true)}
				className="shake-on-hover"
				style={{
					display: "flex",
					position: "absolute",
					rotate: "-20deg",
					zIndex: "1000",
					backgroundImage: `url(${brickWall})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
					borderRadius: "100%",
					border: "8px solid rgba(71, 157, 175, 0.9)",
					opacity: hidden ? 0 : 1,
					transition: "opacity 0.3s ease",
				}}
			>
				<img
					src={airFryer}
					alt="air fryer"
					style={{
						position: "relative",
						width: "180px",
						margin: "auto",
						zIndex: "997",
					}}
				/>
			</div>
		</div>
	);
};

export default AirFryer;

import React, { useState, useEffect } from "react";
import ParticleGround from "particleground.ts";
import Form from "./Form";
import SpidrLogo from "./SpidrLogo";
import SpidrTitle from "./SpidrTitle";

import "./App.css";
import AirFryer from "./airFryer";

// Color constants
const PARTICLE_BG_COLOR = "rgba(40,40,40)";
const OVERLAY_BG_COLOR = "rgba(40,40,40)";
const PARTICLE_DOT_COLOR = "rgba(175,190,220,0.5)";
const PARTICLE_LINE_COLOR = "rgba(175,190,220,0.5)";

const App: React.FC = () => {
	const [showLogo, setShowLogo] = useState(false);
	// Track mouse position for the reveal circle
	const [mousePos, setMousePos] = useState<{ x: number; y: number }>({
		x: 0,
		y: 0,
	});
	// Determine mask position: center on success, otherwise follow cursor
	const maskPosition = showLogo ? "50% 50%" : `${mousePos.x}px ${mousePos.y}px`;

	// Update mousePos state on mouse move
	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			setMousePos({ x: e.clientX, y: e.clientY });
		};
		window.addEventListener("mousemove", handleMouseMove);
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, []);

	// The top‐level App just renders our Form inside a full‐height dark container.
	return (
		<div
			className="app-container"
			style={{ position: "relative", flexDirection: "column" }}
		>
			<SpidrTitle />
			<AirFryer />
			<Form onSuccess={() => setShowLogo(true)} submitted={showLogo} />
			{showLogo && <SpidrLogo className="logo-drop" />}

			{showLogo && (
				<footer className="thank-you-footer" style={{ zIndex: "1000" }}>
					Thank you for your interest.
				</footer>
			)}
			<div
				style={{
					position: "absolute",
					width: "100vw",
					height: "100vh",
					overflow: "hidden",
					backgroundColor: PARTICLE_BG_COLOR,
					filter: "blur(.5px)",
				}}
			>
				<ParticleGround
					lineColor={PARTICLE_LINE_COLOR}
					dotColor={PARTICLE_DOT_COLOR}
					parallax={false}
					minSpeedX={0.1}
					minSpeedY={0.1}
					maxSpeedX={0.4}
					maxSpeedY={0.4}
					density={2500}
				/>
			</div>
			{/* Gray overlay with transparent circular mask following cursor */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100vw",
					height: "100vh",
					backgroundColor: OVERLAY_BG_COLOR,
					pointerEvents: "none",
					// Create a circular transparent cutout of radius 200px centered or at mouse
					WebkitMaskImage: `radial-gradient(circle 200px at ${maskPosition}, transparent 0%, black 100%)`,
					maskImage: `radial-gradient(circle 200px at ${maskPosition}, transparent 0%, black 100%)`,
				}}
			/>
		</div>
	);
};

export default App;

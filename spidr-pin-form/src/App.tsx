import React from "react";
import Form from "./Form";
import "./App.css";

const App: React.FC = () => {
	// The top‐level App just renders our Form inside a full‐height dark container.
	return (
		<div className="app-container">
			<Form />
		</div>
	);
};

export default App;

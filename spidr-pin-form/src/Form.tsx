import React, { useState, ChangeEvent, FormEvent } from "react";
import clsx from "clsx";

interface FormData {
	firstName: string;
	lastName: string;
	phone: string;
	email: string;
	guessCost: string;
	pin: string;
}

const INITIAL: FormData = {
	firstName: "",
	lastName: "",
	phone: "",
	email: "",
	guessCost: "",
	pin: "",
};

const Form: React.FC = () => {
	// Keep each field in local state
	const [data, setData] = useState<FormData>(INITIAL);

	// Handler for generic text inputs
	const handleChange =
		(key: keyof FormData) => (e: ChangeEvent<HTMLInputElement>) => {
			setData({ ...data, [key]: e.target.value });
		};

	// Specialized handler for PIN formatting
	const handlePinChange = (e: ChangeEvent<HTMLInputElement>) => {
		// Strip non‐digits
		const digits = e.target.value.replace(/\D/g, "");

		// Group into chunks of 4
		const chunks: string[] = [];
		for (let i = 0; i < digits.length && i < 16; i += 4) {
			chunks.push(digits.substr(i, 4));
		}
		// Re‑join with dashes
		const formatted = chunks.join("-");

		setData({ ...data, pin: formatted });
	};

	// On submit, prevent full page reload and log data to console
	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		console.log("📋 Form submitted:", data);
	};

	return (
		<form className="spidr-form" onSubmit={handleSubmit}>
			{/* Iterate over each field to reduce repetition */}
			{(
				[
					{ label: "First Name", key: "firstName", type: "text" },
					{ label: "Last Name", key: "lastName", type: "text" },
					{ label: "Phone Number", key: "phone", type: "tel" },
					{ label: "Email Address", key: "email", type: "email" },
					{
						label: "Guess the Air Fryer Cost ($)",
						key: "guessCost",
						type: "number",
					},
				] as const
			).map(({ label, key, type }) => (
				<div className="field" key={key}>
					<label className="label" htmlFor={key}>
						{label}
					</label>
					<input
						id={key}
						type={type}
						value={data[key]}
						onChange={handleChange(key)}
						className="input"
						required
					/>
				</div>
			))}

			{/* PIN field with custom formatting */}
			<div className="field">
				<label className="label" htmlFor="pin">
					Very Secret 16‑digit PIN
				</label>
				<input
					id="pin"
					type="text"
					inputMode="numeric"
					placeholder="1234-5678-9012-3456"
					value={data.pin}
					onChange={handlePinChange}
					className={clsx("input", {
						// Highlight in red if incomplete
						"input-error": data.pin.replace(/-/g, "").length < 16,
					})}
					maxLength={19} // 16 digits + 3 dashes
					required
				/>
				{/* Show warning if PIN too short */}
				{data.pin.replace(/-/g, "").length < 16 && (
					<small className="error-text">PIN must be exactly 16 digits.</small>
				)}
			</div>

			{/* Submit button */}
			<button type="submit" className="submit-button">
				Submit
			</button>
		</form>
	);
};

export default Form;

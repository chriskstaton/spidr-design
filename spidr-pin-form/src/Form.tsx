import { useState, useRef, ChangeEvent, FormEvent } from "react";
import clsx from "clsx";

interface FormProps {
	onSuccess?: () => void;
	submitted?: boolean;
}

interface FormData {
	firstName: string;
	lastName: string;
	phone: string;
	email: string;
	guessCost: string;
	pin: string;
	currency: string;
}

const INITIAL: FormData = {
	firstName: "",
	lastName: "",
	phone: "",
	email: "",
	guessCost: "",
	pin: "",
	currency: "USD",
};

const Form = ({ onSuccess, submitted }: FormProps) => {
	// Keep each field in local state
	const [data, setData] = useState<FormData>(INITIAL);

	// State to show PIN error only after user stops typing
	const [pinErrorVisible, setPinErrorVisible] = useState(false);
	// Ref to hold debounce timer
	const pinErrorTimer = useRef<NodeJS.Timeout | null>(null);

	// Track validation errors on submit
	const [submitErrors, setSubmitErrors] = useState<
		Record<keyof FormData, boolean>
	>(
		Object.keys(INITIAL).reduce((acc, key) => {
			acc[key as keyof FormData] = false;
			return acc;
		}, {} as Record<keyof FormData, boolean>)
	);

	// Available currency codes for cost input
	const CURRENCIES = [
		"USD",
		"EUR",
		"GBP",
		"JPY",
		"CAD",
		"AUD",
		"CHF",
		"CNY",
		"SEK",
		"NZD",
	];

	// Mapping from currency codes to their symbols for display
	const CURRENCY_SYMBOLS: Record<string, string> = {
		USD: "$",
		EUR: "€",
		GBP: "£",
		JPY: "¥",
		CAD: "C$",
		AUD: "A$",
		CHF: "CHF",
		CNY: "¥",
		SEK: "kr",
		NZD: "NZ$",
	};
	// Handler for currency dropdown
	const handleCurrencyChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setData({ ...data, currency: e.target.value });
	};

	// Handler for cost input: limit to two decimal places
	const handleCostChange = (e: ChangeEvent<HTMLInputElement>) => {
		// Strip out any characters except digits and decimal point
		let val = e.target.value.replace(/[^0-9.]/g, "");
		// Split on decimal point to separate integer and fractional parts
		const parts = val.split(".");
		// If there is more than one decimal point, recombine extras into the fractional part
		if (parts.length > 2) {
			val = parts[0] + "." + parts.slice(1).join("");
		}
		// Restrict fractional part to maximum two digits
		const [intPart, decPart] = val.split(".");
		if (decPart !== undefined) {
			val = `${intPart}.${decPart.substr(0, 2)}`;
		}
		// Update form state
		setData({ ...data, guessCost: val });
	};

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
		// Reset and hide error on each keystroke
		if (pinErrorTimer.current) clearTimeout(pinErrorTimer.current);
		setPinErrorVisible(false);

		setData({ ...data, pin: formatted });
		// Show error if PIN invalid after user stops typing for 500ms
		pinErrorTimer.current = setTimeout(() => {
			if (formatted.replace(/-/g, "").length < 16) {
				setPinErrorVisible(true);
			}
		}, 500);
	};

	// Specialized handler for phone number formatting: (123) 456-7890
	const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
		// Strip all non-digit characters
		const digits = e.target.value.replace(/\D/g, "");
		// Limit to first 10 digits
		const trimmed = digits.substr(0, 10);
		let formatted = trimmed;
		if (trimmed.length >= 1) {
			// Add opening parenthesis and area code
			formatted = `(${trimmed.substr(0, 3)}`;
		}
		if (trimmed.length >= 4) {
			// Close parenthesis, add space, and next three digits
			formatted += `) ${trimmed.substr(3, 3)}`;
		}
		if (trimmed.length >= 7) {
			// Add dash and final four digits
			formatted += `-${trimmed.substr(6, 4)}`;
		}
		// Update form state
		setData({ ...data, phone: formatted });
	};

	// On submit, prevent full page reload and log data to console
	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// Validate all fields and mark errors
		const newErrors: Record<keyof FormData, boolean> = { ...submitErrors };
		let hasError = false;
		(Object.keys(INITIAL) as (keyof FormData)[]).forEach((key) => {
			let valid = false;
			switch (key) {
				case "pin":
					valid = data.pin.replace(/-/g, "").length === 16;
					break;
				case "phone":
					valid = data.phone.replace(/\D/g, "").length === 10;
					break;
				case "guessCost":
					// Allow integer or decimal with one or two places
					valid = /^(\d+(\.\d{1,2})?|\.\d{1,2})$/.test(data.guessCost);
					break;
				default:
					valid = data[key].toString().trim().length > 0;
			}
			newErrors[key] = !valid;
			if (!valid) hasError = true;
		});
		setSubmitErrors(newErrors);
		if (hasError) {
			// Stop submission if there are errors
			return;
		}
		// Create a FormData object from the submitted form
		const formElement = e.currentTarget as HTMLFormElement;
		const formDataObj = new FormData(formElement);
		// Log FormData entries to console
		console.log("📋 FormData entries:");
		// Convert entries iterator to array for downlevel iteration support
		for (const [key, value] of Array.from(formDataObj.entries())) {
			console.log(`${key}: ${value}`);
		}
		console.log("📋 Form submitted:", data);
		// Notify parent of successful submission
		onSuccess?.();
	};

	return (
		<form
			className={clsx("spidr-form", { submitted })}
			onSubmit={handleSubmit}
			noValidate
		>
			{/* Iterate over each field to reduce repetition */}
			{(
				[
					{ label: "First Name", key: "firstName", type: "text" },
					{ label: "Last Name", key: "lastName", type: "text" },
					{ label: "Phone Number", key: "phone", type: "tel" },
					{ label: "Email Address", key: "email", type: "email" },
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
						onChange={key === "phone" ? handlePhoneChange : handleChange(key)}
						className={clsx("input", { "input-error": submitErrors[key] })}
						required
						{...(key === "phone"
							? { placeholder: "(123) 456-7890", maxLength: 14 }
							: {})}
					/>
				</div>
			))}
			{/* Cost input with currency selector */}
			<div className="field" key="guessCost">
				<label className="label" htmlFor="guessCost">
					Guess the Air Fryer Cost
				</label>
				<div
					className="currency-input"
					style={{ position: "relative", width: "100%" }}
				>
					<select
						id="currency"
						value={data.currency}
						onChange={handleCurrencyChange}
						className="currency-select"
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							height: "100%",
							width: "3rem",
							backgroundColor: "transparent",
							color: "white",
							border: "none",
							outline: "none",
							textAlign: "center",
						}}
					>
						{CURRENCIES.map((code) => (
							<option key={code} value={code}>
								{CURRENCY_SYMBOLS[code] || code}
							</option>
						))}
					</select>
					<input
						id="guessCost"
						type="text"
						inputMode="decimal"
						value={data.guessCost}
						onChange={handleCostChange}
						className={clsx("input", {
							"input-error": submitErrors.guessCost,
						})}
						required
						style={{
							width: "102%", //compensate for currency menu
							boxSizing: "border-box",
						}}
					/>
				</div>
			</div>

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
						"input-error": pinErrorVisible || submitErrors.pin,
					})}
					maxLength={19} // 16 digits + 3 dashes
					required
				/>
				{pinErrorVisible && (
					<small className="error-text">PIN must be exactly 16 digits.</small>
				)}
			</div>
			{/* Submit button */}
			<button type="submit" className="submit-button">
				submit
			</button>
		</form>
	);
};

export default Form;
